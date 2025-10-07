from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from datetime import datetime, timedelta
from sqlalchemy import func, desc
from server.models.database import db, User, Product, Order, Category, UserRole, OrderStatus, PaymentStatus, OrderItem, OrderItem
from server.schemas import AdminUserCreateSchema, PaginationSchema
from server.utils import success_response, error_response, admin_required, paginate_query

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# User Management
@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """Get all users (Admin only)"""
    try:
        schema = PaginationSchema()
        pagination_data = schema.load(request.args)
        
        # Optional filters
        role = request.args.get('role')
        is_active = request.args.get('is_active')
        search = request.args.get('search')
        
        query = User.query.order_by(User.created_at.desc())
        
        if role:
            try:
                role_enum = UserRole(role)
                query = query.filter_by(role=role_enum)
            except ValueError:
                return error_response('Invalid role value', 400)
        
        if is_active is not None:
            active_filter = is_active.lower() == 'true'
            query = query.filter_by(is_active=active_filter)
        
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                db.or_(
                    User.first_name.ilike(search_pattern),
                    User.last_name.ilike(search_pattern),
                    User.email.ilike(search_pattern)
                )
            )
        
        result = paginate_query(
            query,
            pagination_data.get('page', 1),
            pagination_data.get('per_page', 20)
        )
        
        users_data = [user.to_dict() for user in result['items']]
        
        return success_response(
            'Users retrieved successfully',
            {
                'users': users_data,
                'pagination': result['pagination']
            }
        )
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Failed to get users: {str(e)}', 500)

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    """Create a new user with role (Admin only)"""
    try:
        schema = AdminUserCreateSchema()
        data = schema.load(request.json)
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return error_response('User with this email already exists', 409)
        
        # Create user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            role=UserRole(data.get('role', 'customer'))
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return success_response('User created successfully', user.to_dict(), 201)
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create user: {str(e)}', 500)

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update user details (Admin only)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return error_response('User not found', 404)
        
        data = request.json
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone', 'is_active', 'role']
        
        for field in allowed_fields:
            if field in data:
                if field == 'role':
                    try:
                        user.role = UserRole(data[field])
                    except ValueError:
                        return error_response('Invalid role value', 400)
                else:
                    setattr(user, field, data[field])
        
        db.session.commit()
        
        return success_response('User updated successfully', user.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update user: {str(e)}', 500)

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['PUT'])
@admin_required
def toggle_user_status(user_id):
    """Toggle user active status (Admin only)"""
    try:
        user = User.query.get(user_id)
        if not user:
            return error_response('User not found', 404)
        
        user.is_active = not user.is_active
        db.session.commit()
        
        status = "activated" if user.is_active else "deactivated"
        return success_response(f'User {status} successfully', user.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to toggle user status: {str(e)}', 500)

# Analytics
@admin_bp.route('/analytics/dashboard', methods=['GET'])
@admin_required
def get_dashboard_analytics():
    """Get dashboard analytics (Admin only)"""
    try:
        # Date ranges
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        seven_days_ago = now - timedelta(days=7)
        yesterday = now - timedelta(days=1)
        
        # User stats
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()
        new_users_30d = User.query.filter(User.created_at >= thirty_days_ago).count()
        new_users_7d = User.query.filter(User.created_at >= seven_days_ago).count()
        
        # Product stats
        total_products = Product.query.count()
        active_products = Product.query.filter_by(is_active=True).count()
        featured_products = Product.query.filter_by(is_featured=True, is_active=True).count()
        out_of_stock = Product.query.filter_by(is_active=True).filter(Product.stock_quantity == 0).count()
        
        # Order stats
        total_orders = Order.query.count()
        orders_30d = Order.query.filter(Order.created_at >= thirty_days_ago).count()
        orders_7d = Order.query.filter(Order.created_at >= seven_days_ago).count()
        orders_today = Order.query.filter(Order.created_at >= yesterday).count()
        
        pending_orders = Order.query.filter_by(status=OrderStatus.PENDING).count()
        processing_orders = Order.query.filter_by(status=OrderStatus.PROCESSING).count()
        shipped_orders = Order.query.filter_by(status=OrderStatus.SHIPPED).count()
        
        # Revenue stats
        total_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        revenue_30d = db.session.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= thirty_days_ago,
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        revenue_7d = db.session.query(func.sum(Order.total_amount)).filter(
            Order.created_at >= seven_days_ago,
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        pending_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            Order.payment_status == PaymentStatus.PENDING
        ).scalar() or 0
        
        # Category stats
        total_categories = Category.query.count()
        active_categories = Category.query.filter_by(is_active=True).count()
        
        analytics = {
            'users': {
                'total': total_users,
                'active': active_users,
                'new_30d': new_users_30d,
                'new_7d': new_users_7d
            },
            'products': {
                'total': total_products,
                'active': active_products,
                'featured': featured_products,
                'out_of_stock': out_of_stock
            },
            'orders': {
                'total': total_orders,
                'orders_30d': orders_30d,
                'orders_7d': orders_7d,
                'orders_today': orders_today,
                'pending': pending_orders,
                'processing': processing_orders,
                'shipped': shipped_orders
            },
            'revenue': {
                'total': float(total_revenue),
                'revenue_30d': float(revenue_30d),
                'revenue_7d': float(revenue_7d),
                'pending': float(pending_revenue)
            },
            'categories': {
                'total': total_categories,
                'active': active_categories
            }
        }
        
        return success_response('Dashboard analytics retrieved successfully', analytics)
        
    except Exception as e:
        return error_response(f'Failed to get dashboard analytics: {str(e)}', 500)

@admin_bp.route('/analytics/products', methods=['GET'])
@admin_required
def get_product_analytics():
    """Get product analytics (Admin only)"""
    try:
        # Top selling products
        top_selling = db.session.query(
            Product.id,
            Product.name,
            Product.sales_count,
            Product.stock_quantity,
            Product.price
        ).filter_by(is_active=True).order_by(desc(Product.sales_count)).limit(10).all()
        
        # Most viewed products
        most_viewed = db.session.query(
            Product.id,
            Product.name,
            Product.views_count,
            Product.sales_count,
            Product.price
        ).filter_by(is_active=True).order_by(desc(Product.views_count)).limit(10).all()
        
        # Low stock products
        low_stock = db.session.query(
            Product.id,
            Product.name,
            Product.stock_quantity,
            Product.sales_count
        ).filter_by(is_active=True).filter(Product.stock_quantity <= 10).order_by(Product.stock_quantity).all()
        
        # Products by category
        products_by_category = db.session.query(
            Category.name,
            func.count(Product.id).label('product_count'),
            func.sum(Product.sales_count).label('total_sales')
        ).join(Product).filter(Product.is_active == True).group_by(Category.name).all()
        
        analytics = {
            'top_selling': [
                {
                    'id': p.id,
                    'name': p.name,
                    'sales_count': p.sales_count,
                    'stock_quantity': p.stock_quantity,
                    'price': float(p.price)
                } for p in top_selling
            ],
            'most_viewed': [
                {
                    'id': p.id,
                    'name': p.name,
                    'views_count': p.views_count,
                    'sales_count': p.sales_count,
                    'price': float(p.price)
                } for p in most_viewed
            ],
            'low_stock': [
                {
                    'id': p.id,
                    'name': p.name,
                    'stock_quantity': p.stock_quantity,
                    'sales_count': p.sales_count
                } for p in low_stock
            ],
            'by_category': [
                {
                    'category': cat.name,
                    'product_count': cat.product_count,
                    'total_sales': cat.total_sales or 0
                } for cat in products_by_category
            ]
        }
        
        return success_response('Product analytics retrieved successfully', analytics)
        
    except Exception as e:
        return error_response(f'Failed to get product analytics: {str(e)}', 500)

@admin_bp.route('/analytics/orders', methods=['GET'])
@admin_required
def get_order_analytics():
    """Get order analytics (Admin only)"""
    try:
        # Date ranges
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        
        # Order status breakdown
        order_status_counts = db.session.query(
            Order.status,
            func.count(Order.id).label('count')
        ).group_by(Order.status).all()
        
        # Payment status breakdown
        payment_status_counts = db.session.query(
            Order.payment_status,
            func.count(Order.id).label('count')
        ).group_by(Order.payment_status).all()
        
        # Daily orders for last 30 days
        daily_orders = db.session.query(
            func.date(Order.created_at).label('date'),
            func.count(Order.id).label('order_count'),
            func.sum(Order.total_amount).label('revenue')
        ).filter(
            Order.created_at >= thirty_days_ago
        ).group_by(func.date(Order.created_at)).order_by(func.date(Order.created_at)).all()
        
        # Average order value
        avg_order_value = db.session.query(func.avg(Order.total_amount)).scalar() or 0
        
        # Top customers by order count
        top_customers = db.session.query(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
            func.count(Order.id).label('order_count'),
            func.sum(Order.total_amount).label('total_spent')
        ).join(Order).group_by(User.id).order_by(desc(func.count(Order.id))).limit(10).all()
        
        analytics = {
            'order_status': [
                {
                    'status': status.status.value,
                    'count': status.count
                } for status in order_status_counts
            ],
            'payment_status': [
                {
                    'status': status.payment_status.value,
                    'count': status.count
                } for status in payment_status_counts
            ],
            'daily_orders': [
                {
                    'date': order.date.isoformat(),
                    'order_count': order.order_count,
                    'revenue': float(order.revenue or 0)
                } for order in daily_orders
            ],
            'avg_order_value': float(avg_order_value),
            'top_customers': [
                {
                    'id': customer.id,
                    'name': f"{customer.first_name} {customer.last_name}",
                    'email': customer.email,
                    'order_count': customer.order_count,
                    'total_spent': float(customer.total_spent or 0)
                } for customer in top_customers
            ]
        }
        
        return success_response('Order analytics retrieved successfully', analytics)
        
    except Exception as e:
        return error_response(f'Failed to get order analytics: {str(e)}', 500)

@admin_bp.route('/analytics/revenue', methods=['GET'])
@admin_required
def get_revenue_analytics():
    """Get revenue analytics (Admin only)"""
    try:
        # Date ranges
        now = datetime.utcnow()
        current_year = now.year
        current_month = now.month
        
        # Monthly revenue for current year
        monthly_revenue = db.session.query(
            func.extract('month', Order.created_at).label('month'),
            func.sum(Order.total_amount).label('revenue'),
            func.count(Order.id).label('order_count')
        ).filter(
            func.extract('year', Order.created_at) == current_year,
            Order.payment_status == PaymentStatus.COMPLETED
        ).group_by(func.extract('month', Order.created_at)).all()
        
        # Revenue by category
        revenue_by_category = db.session.query(
            Category.name,
            func.sum(OrderItem.total_price).label('revenue')
        ).join(Product).join(OrderItem).join(Order).filter(
            Order.payment_status == PaymentStatus.COMPLETED
        ).group_by(Category.name).all()
        
        # Revenue growth comparison
        last_month = current_month - 1 if current_month > 1 else 12
        last_month_year = current_year if current_month > 1 else current_year - 1
        
        current_month_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            func.extract('year', Order.created_at) == current_year,
            func.extract('month', Order.created_at) == current_month,
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        last_month_revenue = db.session.query(func.sum(Order.total_amount)).filter(
            func.extract('year', Order.created_at) == last_month_year,
            func.extract('month', Order.created_at) == last_month,
            Order.payment_status == PaymentStatus.COMPLETED
        ).scalar() or 0
        
        growth_rate = 0
        if last_month_revenue > 0:
            growth_rate = ((current_month_revenue - last_month_revenue) / last_month_revenue) * 100
        
        analytics = {
            'monthly_revenue': [
                {
                    'month': int(month.month),
                    'revenue': float(month.revenue or 0),
                    'order_count': month.order_count
                } for month in monthly_revenue
            ],
            'revenue_by_category': [
                {
                    'category': cat.name,
                    'revenue': float(cat.revenue or 0)
                } for cat in revenue_by_category
            ],
            'current_month_revenue': float(current_month_revenue),
            'last_month_revenue': float(last_month_revenue),
            'growth_rate': round(growth_rate, 2)
        }
        
        return success_response('Revenue analytics retrieved successfully', analytics)
        
    except Exception as e:
        return error_response(f'Failed to get revenue analytics: {str(e)}', 500)