from marshmallow import Schema, fields, validate, validates, ValidationError
from server.models.database import UserRole, OrderStatus, PaymentStatus

class UserRegistrationSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    phone = fields.Str(validate=validate.Length(max=20))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UserUpdateSchema(Schema):
    first_name = fields.Str(validate=validate.Length(min=1, max=50))
    last_name = fields.Str(validate=validate.Length(min=1, max=50))
    phone = fields.Str(validate=validate.Length(max=20))

class AdminUserCreateSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    phone = fields.Str(validate=validate.Length(max=20))
    role = fields.Str(validate=validate.OneOf([role.value for role in UserRole]))

class CategorySchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str()
    image_url = fields.Str()
    is_active = fields.Bool()

class ProductCreateSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str()
    price = fields.Decimal(required=True, validate=validate.Range(min=0))
    sale_price = fields.Decimal(validate=validate.Range(min=0))
    sku = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    stock_quantity = fields.Int(validate=validate.Range(min=0))
    image_urls = fields.List(fields.Str())
    specifications = fields.Dict()
    brand = fields.Str(validate=validate.Length(max=100))
    model = fields.Str(validate=validate.Length(max=100))
    warranty_months = fields.Int(validate=validate.Range(min=0))
    category_id = fields.Int(required=True)
    is_active = fields.Bool()
    is_featured = fields.Bool()

class ProductUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=200))
    description = fields.Str()
    price = fields.Decimal(validate=validate.Range(min=0))
    sale_price = fields.Decimal(validate=validate.Range(min=0))
    stock_quantity = fields.Int(validate=validate.Range(min=0))
    image_urls = fields.List(fields.Str())
    specifications = fields.Dict()
    brand = fields.Str(validate=validate.Length(max=100))
    model = fields.Str(validate=validate.Length(max=100))
    warranty_months = fields.Int(validate=validate.Range(min=0))
    category_id = fields.Int()
    is_active = fields.Bool()
    is_featured = fields.Bool()

class CartItemSchema(Schema):
    product_id = fields.Int(required=True)
    quantity = fields.Int(required=True, validate=validate.Range(min=1))

class AddressSchema(Schema):
    type = fields.Str(required=True, validate=validate.OneOf(['shipping', 'billing']))
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    company = fields.Str(validate=validate.Length(max=100))
    address_line_1 = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    address_line_2 = fields.Str(validate=validate.Length(max=200))
    city = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    state = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    postal_code = fields.Str(required=True, validate=validate.Length(min=1, max=20))
    country = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    phone = fields.Str(validate=validate.Length(max=20))
    is_default = fields.Bool()

class OrderCreateSchema(Schema):
    shipping_address_id = fields.Int()
    billing_address_id = fields.Int()
    shipping_address = fields.Nested(AddressSchema)
    billing_address = fields.Nested(AddressSchema)
    payment_method = fields.Str(required=True)
    notes = fields.Str()
    
    @validates('payment_method')
    def validate_payment_method(self, value):
        allowed_methods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
        if value not in allowed_methods:
            raise ValidationError(f'Payment method must be one of: {", ".join(allowed_methods)}')

class OrderUpdateSchema(Schema):
    status = fields.Str(validate=validate.OneOf([status.value for status in OrderStatus]))
    payment_status = fields.Str(validate=validate.OneOf([status.value for status in PaymentStatus]))
    notes = fields.Str()

class PaginationSchema(Schema):
    page = fields.Int(validate=validate.Range(min=1), load_default=1)
    per_page = fields.Int(validate=validate.Range(min=1, max=100), load_default=20)

class ProductFilterSchema(PaginationSchema):
    category_id = fields.Int()
    brand = fields.Str()
    min_price = fields.Decimal(validate=validate.Range(min=0))
    max_price = fields.Decimal(validate=validate.Range(min=0))
    in_stock = fields.Bool()
    featured = fields.Bool()
    search = fields.Str()
    sort_by = fields.Str(validate=validate.OneOf(['name', 'price', 'created_at', 'sales_count', 'views_count']))
    sort_order = fields.Str(validate=validate.OneOf(['asc', 'desc']), load_default='asc')