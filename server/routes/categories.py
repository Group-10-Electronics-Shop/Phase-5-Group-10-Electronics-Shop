from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from server.models.database import db, Category
from server.schemas import CategorySchema
from server.utils import success_response, error_response, admin_required

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('', methods=['GET'])
def get_categories():
    """Get all active categories"""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.name).all()
        categories_data = [category.to_dict() for category in categories]
        
        return success_response('Categories retrieved successfully', categories_data)
        
    except Exception as e:
        return error_response(f'Failed to get categories: {str(e)}', 500)

@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    """Get single category by ID"""
    try:
        category = Category.query.filter_by(id=category_id, is_active=True).first()
        
        if not category:
            return error_response('Category not found', 404)
        
        return success_response('Category retrieved successfully', category.to_dict())
        
    except Exception as e:
        return error_response(f'Failed to get category: {str(e)}', 500)

# Admin routes
@categories_bp.route('', methods=['POST'])
@admin_required
def create_category():
    """Create a new category (Admin only)"""
    try:
        schema = CategorySchema()
        data = schema.load(request.json)
        
        # Check if category name already exists
        if Category.query.filter_by(name=data['name']).first():
            return error_response('Category with this name already exists', 409)
        
        # Create category
        category = Category(**data)
        db.session.add(category)
        db.session.commit()
        
        return success_response('Category created successfully', category.to_dict(), 201)
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create category: {str(e)}', 500)

@categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    """Update category (Admin only)"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return error_response('Category not found', 404)
        
        schema = CategorySchema()
        data = schema.load(request.json)
        
        # Check if new name conflicts with existing category (if name is being changed)
        if 'name' in data and data['name'] != category.name:
            existing_category = Category.query.filter_by(name=data['name']).first()
            if existing_category:
                return error_response('Category with this name already exists', 409)
        
        # Update category fields
        for field, value in data.items():
            if hasattr(category, field):
                setattr(category, field, value)
        
        db.session.commit()
        
        return success_response('Category updated successfully', category.to_dict())
        
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update category: {str(e)}', 500)

@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    """Delete category (Admin only) - Soft delete"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return error_response('Category not found', 404)
        
        # Check if category has products
        if category.products:
            active_products = [p for p in category.products if p.is_active]
            if active_products:
                return error_response(
                    f'Cannot delete category with {len(active_products)} active products. '
                    'Please move or deactivate products first.',
                    400
                )
        
        # Soft delete
        category.is_active = False
        db.session.commit()
        
        return success_response('Category deleted successfully')
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to delete category: {str(e)}', 500)

@categories_bp.route('/<int:category_id>/toggle', methods=['PUT'])
@admin_required
def toggle_category_status(category_id):
    """Toggle category active status (Admin only)"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return error_response('Category not found', 404)
        
        category.is_active = not category.is_active
        db.session.commit()
        
        status = "activated" if category.is_active else "deactivated"
        return success_response(f'Category {status} successfully', category.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to toggle category status: {str(e)}', 500)