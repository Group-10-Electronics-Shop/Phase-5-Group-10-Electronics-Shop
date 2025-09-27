"""
Complete Database Models for Electronics Shop - FIXED VERSION
Fixed the Coupon-Order relationship issue
"""

from datetime import datetime, timedelta
from decimal import Decimal
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import func, and_, or_
from sqlalchemy.ext.hybrid import hybrid_property
import enum

db = SQLAlchemy()

# Enums
class UserRole(enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"
    MANAGER = "manager"

class OrderStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class ReviewStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class DiscountType(enum.Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"

class CouponStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    EXPIRED = "expired"

# Core Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='user', lazy=True)
    cart_items = db.relationship('CartItem', backref='user', lazy=True)
    addresses = db.relationship('Address', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role.value,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'product_count': len(self.products),
            'created_at': self.created_at.isoformat()
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    sale_price = db.Column(db.Numeric(10, 2))
    sku = db.Column(db.String(50), unique=True, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    image_urls = db.Column(db.JSON)
    specifications = db.Column(db.JSON)
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))
    warranty_months = db.Column(db.Integer, default=12)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    views_count = db.Column(db.Integer, default=0)
    sales_count = db.Column(db.Integer, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    @property
    def current_price(self):
        return self.sale_price if self.sale_price else self.price
    
    @property
    def is_in_stock(self):
        return self.stock_quantity > 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'sale_price': float(self.sale_price) if self.sale_price else None,
            'current_price': float(self.current_price),
            'sku': self.sku,
            'stock_quantity': self.stock_quantity,
            'image_urls': self.image_urls or [],
            'specifications': self.specifications or {},
            'brand': self.brand,
            'model': self.model,
            'warranty_months': self.warranty_months,
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_in_stock': self.is_in_stock,
            'views_count': self.views_count,
            'sales_count': self.sales_count,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_cart'),)
    
    @property
    def total_price(self):
        return self.quantity * self.product.current_price
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product': self.product.to_dict(),
            'quantity': self.quantity,
            'total_price': float(self.total_price),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # shipping, billing
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    company = db.Column(db.String(100))
    address_line_1 = db.Column(db.String(200), nullable=False)
    address_line_2 = db.Column(db.String(200))
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'company': self.company,
            'address_line_1': self.address_line_1,
            'address_line_2': self.address_line_2,
            'city': self.city,
            'state': self.state,
            'postal_code': self.postal_code,
            'country': self.country,
            'phone': self.phone,
            'is_default': self.is_default,
            'created_at': self.created_at.isoformat()
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # FIXED: Added coupon_id foreign key to establish relationship
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.id'), nullable=True)
    coupon_discount = db.Column(db.Numeric(10, 2), default=0)  # Store applied discount amount
    status = db.Column(db.Enum(OrderStatus), nullable=False, default=OrderStatus.PENDING)
    payment_status = db.Column(db.Enum(PaymentStatus), nullable=False, default=PaymentStatus.PENDING)
    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    tax_amount = db.Column(db.Numeric(10, 2), default=0)
    shipping_amount = db.Column(db.Numeric(10, 2), default=0)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    shipping_address = db.Column(db.JSON)
    billing_address = db.Column(db.JSON)
    payment_method = db.Column(db.String(50))
    payment_reference = db.Column(db.String(100))
    notes = db.Column(db.Text)
    shipped_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')
    # Note: coupon relationship is defined in Coupon model
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'coupon_id': self.coupon_id,
            'coupon_discount': float(self.coupon_discount) if self.coupon_discount else 0,
            'status': self.status.value,
            'payment_status': self.payment_status.value,
            'subtotal': float(self.subtotal),
            'tax_amount': float(self.tax_amount),
            'shipping_amount': float(self.shipping_amount),
            'total_amount': float(self.total_amount),
            'currency': self.currency,
            'shipping_address': self.shipping_address,
            'billing_address': self.billing_address,
            'payment_method': self.payment_method,
            'payment_reference': self.payment_reference,
            'notes': self.notes,
            'items': [item.to_dict() for item in self.order_items],
            'coupon': self.coupon.to_dict() if self.coupon else None,
            'shipped_at': self.shipped_at.isoformat() if self.shipped_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    product_snapshot = db.Column(db.JSON)  # Store product details at time of order
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else self.product_snapshot,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price)
        }

# Extended Models (from the previous database extension)
class WishlistItem(db.Model):
    """Wishlist/Favorites functionality"""
    __tablename__ = 'wishlist_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('wishlist_items', lazy=True))
    product = db.relationship('Product', backref=db.backref('wishlist_items', lazy=True))
    
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_wishlist'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product': self.product.to_dict() if self.product else None,
            'created_at': self.created_at.isoformat()
        }

class ProductReview(db.Model):
    """Product reviews and ratings"""
    __tablename__ = 'product_reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    title = db.Column(db.String(200))
    comment = db.Column(db.Text)
    status = db.Column(db.Enum(ReviewStatus), default=ReviewStatus.PENDING)
    is_verified_purchase = db.Column(db.Boolean, default=False)
    helpful_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    product = db.relationship('Product', backref=db.backref('reviews', lazy=True))
    order = db.relationship('Order', backref=db.backref('reviews', lazy=True))
    
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_review'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': f"{self.user.first_name} {self.user.last_name}" if self.user else "Anonymous",
            'product_id': self.product_id,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'status': self.status.value,
            'is_verified_purchase': self.is_verified_purchase,
            'helpful_count': self.helpful_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Coupon(db.Model):
    """Discount coupons and promo codes"""
    __tablename__ = 'coupons'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    discount_type = db.Column(db.Enum(DiscountType), nullable=False)
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    minimum_order_amount = db.Column(db.Numeric(10, 2), default=0)
    maximum_discount_amount = db.Column(db.Numeric(10, 2))
    usage_limit = db.Column(db.Integer)
    usage_limit_per_user = db.Column(db.Integer, default=1)
    used_count = db.Column(db.Integer, default=0)
    status = db.Column(db.Enum(CouponStatus), default=CouponStatus.ACTIVE)
    valid_from = db.Column(db.DateTime, nullable=False)
    valid_until = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # FIXED: Now properly references the foreign key in orders table
    orders = db.relationship('Order', backref='coupon', lazy=True)
    
    @hybrid_property
    def is_valid(self):
        now = datetime.utcnow()
        return (
            self.status == CouponStatus.ACTIVE and
            self.valid_from <= now <= self.valid_until and
            (self.usage_limit is None or self.used_count < self.usage_limit)
        )
    
    def calculate_discount(self, order_amount):
        """Calculate discount amount for given order amount"""
        if not self.is_valid or order_amount < self.minimum_order_amount:
            return Decimal('0.00')
        
        if self.discount_type == DiscountType.PERCENTAGE:
            discount = order_amount * (self.discount_value / 100)
        else:
            discount = self.discount_value
        
        if self.maximum_discount_amount and discount > self.maximum_discount_amount:
            discount = self.maximum_discount_amount
        
        return min(discount, order_amount)
    
    def to_dict(self):
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'description': self.description,
            'discount_type': self.discount_type.value,
            'discount_value': float(self.discount_value),
            'minimum_order_amount': float(self.minimum_order_amount),
            'maximum_discount_amount': float(self.maximum_discount_amount) if self.maximum_discount_amount else None,
            'usage_limit': self.usage_limit,
            'usage_limit_per_user': self.usage_limit_per_user,
            'used_count': self.used_count,
            'status': self.status.value,
            'is_valid': self.is_valid,
            'valid_from': self.valid_from.isoformat(),
            'valid_until': self.valid_until.isoformat(),
            'created_at': self.created_at.isoformat()
        }

# Additional table to track coupon usage per user (optional but recommended)
class CouponUsage(db.Model):
    """Track coupon usage per user"""
    __tablename__ = 'coupon_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    discount_amount = db.Column(db.Numeric(10, 2), nullable=False)
    used_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('coupon_usage', lazy=True))
    coupon = db.relationship('Coupon', backref=db.backref('usage_records', lazy=True))
    order = db.relationship('Order', backref=db.backref('coupon_usage', lazy=True))
    
    __table_args__ = (db.UniqueConstraint('user_id', 'coupon_id', 'order_id', name='unique_user_coupon_order'),)

# Database utility functions
class DatabaseUtils:
    """Utility functions for database operations"""
    
    @staticmethod
    def get_popular_products(limit=10):
        """Get most popular products based on sales and views"""
        return Product.query.filter_by(is_active=True).order_by(
            (Product.sales_count * 0.7 + Product.views_count * 0.3).desc()
        ).limit(limit).all()
    
    @staticmethod
    def get_low_stock_products(threshold=10):
        """Get products with low stock"""
        return Product.query.filter(
            and_(Product.is_active == True, Product.stock_quantity <= threshold)
        ).order_by(Product.stock_quantity.asc()).all()
    
    @staticmethod
    def calculate_product_rating(product_id):
        """Calculate average rating for a product"""
        result = db.session.query(func.avg(ProductReview.rating)).filter(
            and_(
                ProductReview.product_id == product_id,
                ProductReview.status == ReviewStatus.APPROVED
            )
        ).scalar()
        return float(result) if result else 0.0
    
    @staticmethod
    def can_user_use_coupon(user_id, coupon_id):
        """Check if user can use a specific coupon"""
        coupon = Coupon.query.get(coupon_id)
        if not coupon or not coupon.is_valid:
            return False
        
        if coupon.usage_limit_per_user:
            usage_count = CouponUsage.query.filter_by(
                user_id=user_id, 
                coupon_id=coupon_id
            ).count()
            return usage_count < coupon.usage_limit_per_user
        
        return True