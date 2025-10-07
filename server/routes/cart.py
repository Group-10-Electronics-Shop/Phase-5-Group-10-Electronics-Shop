from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from models.database import db, CartItem, Product
from schemas import CartItemSchema
from utils import success_response, error_response, validate_stock_quantity, ValidationError as CustomValidationError

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')

@cart_bp.route('', methods=['GET'])
@jwt_required()
def get_cart():
    """Get current user's cart items"""
    try:
        current_user_id = get_jwt_identity()
        cart_items = CartItem.query.filter_by(user_id=current_user_id).all()
        
        cart_data = [item.to_dict() for item in cart_items]
        
        # Calculate totals
        subtotal = sum(item.total_price for item in cart_items)
        total_items = sum(item.quantity for item in cart_items)
        
        return success_response(
            'Cart retrieved successfully',
            {
                'items': cart_data,
                'summary': {
                    'total_items': total_items,
                    'subtotal': float(subtotal)
                }
            }
        )
        
    except Exception as e:
        return error_response(f'Failed to get cart: {str(e)}', 500)

@cart_bp.route('/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    """Add item to cart"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = CartItemSchema()
        data = schema.load(request.json)
        
        # Check if product exists and is active
        product = Product.query.filter_by(id=data['product_id'], is_active=True).first()
        if not product:
            return error_response('Product not found or not available', 404)
        
        # Validate stock quantity
        try:
            validate_stock_quantity(product, data['quantity'])
        except CustomValidationError as e:
            return error_response(e.message, 400)
        
        # Check if item already exists in cart
        existing_item = CartItem.query.filter_by(
            user_id=current_user_id,
            product_id=data['product_id']
        ).first()
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item.quantity + data['quantity']
            
            # Validate new total quantity
            try:
                validate_stock_quantity(product, new_quantity)
            except CustomValidationError as e:
                return error_response(e.message, 400)
            
            existing_item.quantity = new_quantity
            db.session.commit()
            
            return success_response('Cart item updated successfully', existing_item.to_dict())
        else:
            # Create new cart item
            cart_item = CartItem(
                user_id=current_user_id,
                product_id=data['product_id'],
                quantity=data['quantity']
            )
            
            db.session.add(cart_item)
            db.session.commit()
            
            return success_response('Item added to cart successfully', cart_item.to_dict(), 201)
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to add item to cart: {str(e)}', 500)

@cart_bp.route('/update/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    """Update cart item quantity"""
    try:
        current_user_id = get_jwt_identity()
        
        cart_item = CartItem.query.filter_by(id=item_id, user_id=current_user_id).first()
        if not cart_item:
            return error_response('Cart item not found', 404)
        
        data = request.json
        new_quantity = data.get('quantity')
        
        if not new_quantity or new_quantity < 1:
            return error_response('Quantity must be at least 1', 400)
        
        # Validate stock quantity
        try:
            validate_stock_quantity(cart_item.product, new_quantity)
        except CustomValidationError as e:
            return error_response(e.message, 400)
        
        cart_item.quantity = new_quantity
        db.session.commit()
        
        return success_response('Cart item updated successfully', cart_item.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update cart item: {str(e)}', 500)

@cart_bp.route('/remove/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    """Remove item from cart"""
    try:
        current_user_id = get_jwt_identity()
        
        cart_item = CartItem.query.filter_by(id=item_id, user_id=current_user_id).first()
        if not cart_item:
            return error_response('Cart item not found', 404)
        
        db.session.delete(cart_item)
        db.session.commit()
        
        return success_response('Item removed from cart successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to remove item from cart: {str(e)}', 500)

@cart_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_cart():
    """Clear all items from cart"""
    try:
        current_user_id = get_jwt_identity()
        
        CartItem.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        
        return success_response('Cart cleared successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to clear cart: {str(e)}', 500)

@cart_bp.route('/count', methods=['GET'])
@jwt_required()
def get_cart_count():
    """Get total number of items in cart"""
    try:
        current_user_id = get_jwt_identity()
        
        total_items = db.session.query(
            db.func.sum(CartItem.quantity)
        ).filter_by(user_id=current_user_id).scalar() or 0
        
        return success_response('Cart count retrieved successfully', {'count': int(total_items)})
        
    except Exception as e:
        return error_response(f'Failed to get cart count: {str(e)}', 500)