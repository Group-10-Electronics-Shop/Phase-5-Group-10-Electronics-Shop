from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import or_, and_
from server.models.database import db, Product, Category
from server.schemas import ProductCreateSchema, ProductUpdateSchema, ProductFilterSchema
from server.utils import success_response, error_response, admin_required, paginate_query, generate_sku

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('', methods=['GET'])
def get_products():
    """Get all products with filtering and pagination"""
    try:
        schema = ProductFilterSchema()
        filters = schema.load(request.args)
        
        query = Product.query.filter_by(is_active=True)
        
        # Apply filters
        if filters.get('category_id'):
            query = query.filter_by(category_id=filters['category_id'])
        
        if filters.get('brand'):
            query = query.filter_by(brand=filters['brand'])
        
        if filters.get('min_price'):
            query = query.filter(Product.price >= filters['min_price'])
        
        if filters.get('max_price'):
            query = query.filter(Product.price <= filters['max_price'])
        
        if filters.get('in_stock'):
            query = query.filter(Product.stock_quantity > 0)
        
        if filters.get('featured'):
            query = query.filter_by(is_featured=True)
        
        if filters.get('search'):
            search_term = f"%{filters['search']}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.brand.ilike(search_term)
                )
            )
        
        # Apply sorting
        sort_by = filters.get('sort_by', 'created_at')
        sort_order = filters.get('sort_order', 'asc')
        
        if hasattr(Product, sort_by):
            order_column = getattr(Product, sort_by)
            if sort_order == 'desc':
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())
        
        # Paginate results
        result = paginate_query(
            query,
            filters.get('page', 1),
            filters.get('per_page', 20)
        )
        
        products_data = [product.to_dict() for product in result['items']]
        
        return success_response(
            'Products retrieved successfully',
            {
                'products': products_data,
                'pagination': result['pagination']
            }
        )
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Failed to get products: {str(e)}', 500)

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        
        if not product:
            return error_response('Product not found', 404)
        
        # Increment views count
        product.views_count += 1
        db.session.commit()
        
        return success_response('Product retrieved successfully', product.to_dict())
        
    except Exception as e:
        return error_response(f'Failed to get product: {str(e)}', 500)

@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products"""
    try:
        products = Product.query.filter_by(is_featured=True, is_active=True).limit(12).all()
        products_data = [product.to_dict() for product in products]
        
        return success_response('Featured products retrieved successfully', products_data)
        
    except Exception as e:
        return error_response(f'Failed to get featured products: {str(e)}', 500)

@products_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    """Get products by category"""
    try:
        category = Category.query.filter_by(id=category_id, is_active=True).first()
        if not category:
            return error_response('Category not found', 404)
        
        schema = ProductFilterSchema()
        filters = schema.load(request.args)
        
        query = Product.query.filter_by(category_id=category_id, is_active=True)
        
        # Apply additional filters
        if filters.get('brand'):
            query = query.filter_by(brand=filters['brand'])
        
        if filters.get('min_price'):
            query = query.filter(Product.price >= filters['min_price'])
        
        if filters.get('max_price'):
            query = query.filter(Product.price <= filters['max_price'])
        
        if filters.get('in_stock'):
            query = query.filter(Product.stock_quantity > 0)
        
        # Apply sorting
        sort_by = filters.get('sort_by', 'created_at')
        sort_order = filters.get('sort_order', 'asc')
        
        if hasattr(Product, sort_by):
            order_column = getattr(Product, sort_by)
            if sort_order == 'desc':
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())
        
        # Paginate results
        result = paginate_query(
            query,
            filters.get('page', 1),
            filters.get('per_page', 20)
        )
        
        products_data = [product.to_dict() for product in result['items']]
        
        return success_response(
            f'Products in {category.name} retrieved successfully',
            {
                'category': category.to_dict(),
                'products': products_data,
                'pagination': result['pagination']
            }
        )
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Failed to get products by category: {str(e)}', 500)

@products_bp.route('/search', methods=['GET'])
def search_products():
    """Search products"""
    try:
        search_term = request.args.get('q', '').strip()
        
        if not search_term:
            return error_response('Search term is required', 400)
        
        # Get pagination parameters directly instead of using schema
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        # Build search query
        search_pattern = f"%{search_term}%"
        query = Product.query.filter(
            and_(
                Product.is_active == True,
                or_(
                    Product.name.ilike(search_pattern),
                    Product.description.ilike(search_pattern),
                    Product.brand.ilike(search_pattern),
                    Product.model.ilike(search_pattern)
                )
            )
        )
        
        # Apply optional filters if provided
        category_id = request.args.get('category_id', type=int)
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        brand = request.args.get('brand')
        if brand:
            query = query.filter_by(brand=brand)
        
        min_price = request.args.get('min_price', type=float)
        if min_price:
            query = query.filter(Product.price >= min_price)
        
        max_price = request.args.get('max_price', type=float)
        if max_price:
            query = query.filter(Product.price <= max_price)
        
        # Apply sorting
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        if hasattr(Product, sort_by):
            order_column = getattr(Product, sort_by)
            if sort_order == 'desc':
                query = query.order_by(order_column.desc())
            else:
                query = query.order_by(order_column.asc())
        
        # Paginate results
        result = paginate_query(query, page, per_page)
        
        products_data = [product.to_dict() for product in result['items']]
        
        return success_response(
            f'Search results for "{search_term}"',
            {
                'search_term': search_term,
                'products': products_data,
                'pagination': result['pagination']
            }
        )
        
    except Exception as e:
        return error_response(f'Failed to search products: {str(e)}', 500)

# Admin routes
@products_bp.route('', methods=['POST'])
@admin_required
def create_product():
    """Create a new product (Admin only)"""
    try:
        schema = ProductCreateSchema()
        data = schema.load(request.json)
        
        # Check if category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return error_response('Category not found', 404)
        
        # Check if SKU already exists
        if Product.query.filter_by(sku=data['sku']).first():
            return error_response('SKU already exists', 409)
        
        # Create product
        product = Product(**data)
        
        # Generate SKU if not provided
        if not product.sku:
            product.sku = generate_sku()
        
        db.session.add(product)
        db.session.commit()
        
        return success_response('Product created successfully', product.to_dict(), 201)
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create product: {str(e)}', 500)

@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    """Update product (Admin only)"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return error_response('Product not found', 404)
        
        schema = ProductUpdateSchema()
        data = schema.load(request.json)
        
        # Check if category exists if category_id is being updated
        if 'category_id' in data:
            category = Category.query.get(data['category_id'])
            if not category:
                return error_response('Category not found', 404)
        
        # Update product fields
        for field, value in data.items():
            if hasattr(product, field):
                setattr(product, field, value)
        
        db.session.commit()
        
        return success_response('Product updated successfully', product.to_dict())
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update product: {str(e)}', 500)

@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    """Delete product (Admin only) - Soft delete"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return error_response('Product not found', 404)
        
        # Soft delete
        product.is_active = False
        db.session.commit()
        
        return success_response('Product deleted successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to delete product: {str(e)}', 500)