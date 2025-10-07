from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from datetime import datetime
from server.models.database import db, Order, OrderItem, CartItem, Product, Address, OrderStatus, PaymentStatus
from schemas import OrderCreateSchema, OrderUpdateSchema, PaginationSchema
from utils import (success_response, error_response, admin_required, manager_required, 
                  paginate_query, generate_order_number, validate_stock_quantity, 
                  update_product_stock, calculate_tax, calculate_shipping, ValidationError as CustomValidationError)

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_orders():
    """Get current user's orders"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = PaginationSchema()
        pagination_data = schema.load(request.args)
        
        query = Order.query.filter_by(user_id=current_user_id).order_by(Order.created_at.desc())
        
        result = paginate_query(
            query,
            pagination_data.get('page', 1),
            pagination_data.get('per_page', 20)
        )
        
        orders_data = [order.to_dict() for order in result['items']]
        
        return success_response(
            'Orders retrieved successfully',
            {
                'orders': orders_data,
                'pagination': result['pagination']
            }
        )
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Failed to get orders: {str(e)}', 500)

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get single order by ID"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        if not order:
            return error_response('Order not found', 404)
        
        return success_response('Order retrieved successfully', order.to_dict())
        
    except Exception as e:
        return error_response(f'Failed to get order: {str(e)}', 500)

@orders_bp.route('/create', methods=['POST'])
@jwt_required()
def create_order():
    """Create a new order from cart items"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = OrderCreateSchema()
        data = schema.load(request.json)
        
        # Get cart items
        cart_items = CartItem.query.filter_by(user_id=current_user_id).all()
        if not cart_items:
            return error_response('Cart is empty', 400)
        
        # Validate all cart items and stock quantities
        for cart_item in cart_items:
            if not cart_item.product.is_active:
                return error_response(f'Product {cart_item.product.name} is no longer available', 400)
            
            try:
                validate_stock_quantity(cart_item.product, cart_item.quantity)
            except CustomValidationError as e:
                return error_response(e.message, 400)
        
        # Get addresses
        shipping_address = None
        billing_address = None
        
        if data.get('shipping_address_id'):
            shipping_address = Address.query.filter_by(
                id=data['shipping_address_id'],
                user_id=current_user_id,
                type='shipping'
            ).first()
            if not shipping_address:
                return error_response('Shipping address not found', 404)
            shipping_address = shipping_address.to_dict()
        elif data.get('shipping_address'):
            shipping_address = data['shipping_address']
        else:
            return error_response('Shipping address is required', 400)
        
        if data.get('billing_address_id'):
            billing_address = Address.query.filter_by(
                id=data['billing_address_id'],
                user_id=current_user_id,
                type='billing'
            ).first()
            if not billing_address:
                return error_response('Billing address not found', 404)
            billing_address = billing_address.to_dict()
        elif data.get('billing_address'):
            billing_address = data['billing_address']
        else:
            # Use shipping address as billing address if not provided
            billing_address = shipping_address
        
        # Calculate totals
        subtotal = sum(cart_item.total_price for cart_item in cart_items)
        tax_amount = calculate_tax(subtotal)
        shipping_amount = calculate_shipping(subtotal)
        total_amount = subtotal + tax_amount + shipping_amount
        
        # Create order
        order = Order(
            order_number=generate_order_number(),
            user_id=current_user_id,
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_amount=shipping_amount,
            total_amount=total_amount,
            shipping_address=shipping_address,
            billing_address=billing_address,
            payment_method=data['payment_method'],
            notes=data.get('notes')
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items and update stock
        for cart_item in cart_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                unit_price=cart_item.product.current_price,
                total_price=cart_item.total_price,
                product_snapshot=cart_item.product.to_dict()  # Store product details
            )
            db.session.add(order_item)
            
            # Update product stock
            update_product_stock(cart_item.product, cart_item.quantity)
        
        # Clear cart
        CartItem.query.filter_by(user_id=current_user_id).delete()
        
        db.session.commit()
        
        return success_response('Order created successfully', order.to_dict(), 201)
        
    except ValidationError as e:
        db.session.rollback()
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create order: {str(e)}', 500)

@orders_bp.route('/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    """Cancel an order"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        if not order:
            return error_response('Order not found', 404)
        
        # Check if order can be cancelled
        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            return error_response('Order cannot be cancelled at this stage', 400)
        
        # Update order status
        order.status = OrderStatus.CANCELLED
        order.payment_status = PaymentStatus.REFUNDED if order.payment_status == PaymentStatus.COMPLETED else order.payment_status
        
        # Restore product stock
        for order_item in order.order_items:
            if order_item.product:  # Product still exists
                order_item.product.stock_quantity += order_item.quantity
                order_item.product.sales_count = max(0, order_item.product.sales_count - order_item.quantity)
        
        db.session.commit()
        
        return success_response('Order cancelled successfully', order.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to cancel order: {str(e)}', 500)

# Admin/Manager routes
@orders_bp.route('/all', methods=['GET'])
@manager_required
def get_all_orders():
    """Get all orders (Admin/Manager only)"""
    try:
        schema = PaginationSchema()
        pagination_data = schema.load(request.args)
        
        # Optional filters
        status = request.args.get('status')
        payment_status = request.args.get('payment_status')
        user_id = request.args.get('user_id')
        
        query = Order.query.order_by(Order.created_at.desc())
        
        if status:
            try:
                status_enum = OrderStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                return error_response('Invalid status value', 400)
        
        if payment_status:
            try:
                payment_status_enum = PaymentStatus(payment_status)
                query = query.filter_by(payment_status=payment_status_enum)
            except ValueError:
                return error_response('Invalid payment status value', 400)
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        result = paginate_query(
            query,
            pagination_data.get('page', 1),
            pagination_data.get('per_page', 20)
        )
        
        orders_data = [order.to_dict() for order in result['items']]
        
        return success_response(
            'Orders retrieved successfully',
            {
                'orders': orders_data,
                'pagination': result['pagination']
            }
        )
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Failed to get orders: {str(e)}', 500)

@orders_bp.route('/<int:order_id>/update-status', methods=['PUT'])
@manager_required
def update_order_status(order_id):
    """Update order status (Admin/Manager only)"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return error_response('Order not found', 404)
        
        schema = OrderUpdateSchema()
        data = schema.load(request.json)
        
        # Update order fields
        if 'status' in data:
            try:
                order.status = OrderStatus(data['status'])
                
                # Update timestamps based on status
                if order.status == OrderStatus.SHIPPED:
                    order.shipped_at = datetime.utcnow()
                elif order.status == OrderStatus.DELIVERED:
                    order.delivered_at = datetime.utcnow()
                    
            except ValueError:
                return error_response('Invalid status value', 400)
        
        if 'payment_status' in data:
            try:
                order.payment_status = PaymentStatus(data['payment_status'])
            except ValueError:
                return error_response('Invalid payment status value', 400)
        
        if 'notes' in data:
            order.notes = data['notes']
        
        db.session.commit()
        
        return success_response('Order status updated successfully', order.to_dict())
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update order status: {str(e)}', 500)

@orders_bp.route('/stats', methods=['GET'])
@manager_required
def get_order_stats():
    """Get order statistics (Admin/Manager only)"""
    try:
        # Basic stats
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status=OrderStatus.PENDING).count()
        confirmed_orders = Order.query.filter_by(status=OrderStatus.CONFIRMED).count()
        shipped_orders = Order.query.filter_by(status=OrderStatus.SHIPPED).count()
        delivered_orders = Order.query.filter_by(status=OrderStatus.DELIVERED).count()
        cancelled_orders = Order.query.filter_by(status=OrderStatus.CANCELLED).count()
        
        # Revenue stats
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        pending_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.payment_status == PaymentStatus.PENDING
        ).scalar() or 0
        
        # Recent orders (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_orders = Order.query.filter(Order.created_at >= thirty_days_ago).count()
        
        recent_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(
            Order.created_at >= thirty_days_ago,
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        stats = {
            'orders': {
                'total': total_orders,
                'pending': pending_orders,
                'confirmed': confirmed_orders,
                'shipped': shipped_orders,
                'delivered': delivered_orders,
                'cancelled': cancelled_orders,
                'recent_30_days': recent_orders
            },
            'revenue': {
                'total': float(total_revenue),
                'pending': float(pending_revenue),
                'recent_30_days': float(recent_revenue)
            }
        }
        
        return success_response('Order statistics retrieved successfully', stats)
        
    except Exception as e:
        return error_response(f'Failed to get order statistics: {str(e)}', 500)