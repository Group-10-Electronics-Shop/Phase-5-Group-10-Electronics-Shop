import uuid
from datetime import datetime
from functools import wraps
from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from server.models import User, UserRole, db

def generate_order_number():
    """Generate a unique order number"""
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    unique_id = str(uuid.uuid4())[:8].upper()
    return f"ORD-{timestamp}-{unique_id}"

def generate_sku():
    """Generate a unique SKU"""
    return f"SKU-{str(uuid.uuid4())[:8].upper()}"

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role not in [UserRole.ADMIN, UserRole.MANAGER]:
            return jsonify({'message': 'Admin access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

def manager_required(f):
    """Decorator to require manager or admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role == UserRole.CUSTOMER:
            return jsonify({'message': 'Manager access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

def paginate_query(query, page=1, per_page=20):
    """Helper function to paginate SQLAlchemy queries"""
    total = query.count()
    items = query.offset((page - 1) * per_page).limit(per_page).all()
    
    return {
        'items': items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'has_prev': page > 1,
            'has_next': page * per_page < total
        }
    }

def success_response(message, data=None, status_code=200):
    """Standard success response format"""
    response = {'success': True, 'message': message}
    if data is not None:
        response['data'] = data
    return jsonify(response), status_code

def error_response(message, status_code=400, errors=None):
    """Standard error response format"""
    response = {'success': False, 'message': message}
    if errors:
        response['errors'] = errors
    return jsonify(response), status_code

def calculate_tax(subtotal, tax_rate=0.08):
    """Calculate tax amount"""
    return subtotal * tax_rate

def calculate_shipping(subtotal, weight=None):
    """Calculate shipping cost"""
    if subtotal >= 100:  # Free shipping over $100
        return 0
    return 10.00  # Flat rate shipping

class ValidationError(Exception):
    """Custom validation error exception"""
    def __init__(self, message, field=None):
        self.message = message
        self.field = field
        super().__init__(self.message)

def validate_stock_quantity(product, requested_quantity):
    """Validate if requested quantity is available in stock"""
    if not product.is_active:
        raise ValidationError(f"Product {product.name} is not available")
    
    if product.stock_quantity < requested_quantity:
        raise ValidationError(
            f"Not enough stock for {product.name}. Available: {product.stock_quantity}, Requested: {requested_quantity}"
        )

def update_product_stock(product, quantity_sold):
    """Update product stock after sale"""
    product.stock_quantity -= quantity_sold
    product.sales_count += quantity_sold
    db.session.commit()

def restore_product_stock(product, quantity_restored):
    """Restore product stock (e.g., when order is cancelled)"""
    product.stock_quantity += quantity_restored
    product.sales_count = max(0, product.sales_count - quantity_restored)
    db.session.commit()