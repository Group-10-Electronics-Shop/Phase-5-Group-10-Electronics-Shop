from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from models.database import db, Address, UserRole
from schemas import AddressSchema
from utils import success_response, error_response

addresses_bp = Blueprint('addresses', __name__, url_prefix='/api/addresses')


# =====================================================
# 🏠 Helper: check if current user is virtual admin
# =====================================================
def is_virtual_admin():
    return get_jwt_identity() == "admin"


@addresses_bp.route('', methods=['GET'])
@jwt_required()
def get_addresses():
    """Get current user's addresses"""
    try:
        if is_virtual_admin():
            # Admin does not have personal addresses
            return success_response("Admin does not have personal addresses", [])

        current_user_id = get_jwt_identity()
        address_type = request.args.get('type')  # shipping, billing

        query = Address.query.filter_by(user_id=current_user_id)

        if address_type:
            query = query.filter_by(type=address_type)

        addresses = query.order_by(Address.is_default.desc(), Address.created_at.desc()).all()
        addresses_data = [address.to_dict() for address in addresses]

        return success_response('Addresses retrieved successfully', addresses_data)

    except Exception as e:
        return error_response(f'Failed to get addresses: {str(e)}', 500)


@addresses_bp.route('/<int:address_id>', methods=['GET'])
@jwt_required()
def get_address(address_id):
    """Get single address by ID"""
    try:
        if is_virtual_admin():
            return error_response("Admin does not have addresses", 403)

        current_user_id = get_jwt_identity()

        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return error_response('Address not found', 404)

        return success_response('Address retrieved successfully', address.to_dict())

    except Exception as e:
        return error_response(f'Failed to get address: {str(e)}', 500)


@addresses_bp.route('', methods=['POST'])
@jwt_required()
def create_address():
    """Create a new address"""
    try:
        if is_virtual_admin():
            return error_response("Admin cannot create addresses", 403)

        current_user_id = get_jwt_identity()
        schema = AddressSchema()
        data = schema.load(request.json)

        # If this is set as default, remove default from other addresses of same type
        if data.get('is_default', False):
            Address.query.filter_by(
                user_id=current_user_id,
                type=data['type']
            ).update({'is_default': False})

        # Create address
        address = Address(user_id=current_user_id, **data)
        db.session.add(address)
        db.session.commit()

        return success_response('Address created successfully', address.to_dict(), 201)

    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to create address: {str(e)}', 500)


@addresses_bp.route('/<int:address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id):
    """Update an address"""
    try:
        if is_virtual_admin():
            return error_response("Admin cannot update addresses", 403)

        current_user_id = get_jwt_identity()
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return error_response('Address not found', 404)

        schema = AddressSchema()
        data = schema.load(request.json)

        # If this is set as default, remove default from other addresses of same type
        if data.get('is_default', False) and not address.is_default:
            Address.query.filter_by(
                user_id=current_user_id,
                type=data.get('type', address.type)
            ).update({'is_default': False})

        # Update address fields
        for field, value in data.items():
            if hasattr(address, field):
                setattr(address, field, value)

        db.session.commit()

        return success_response('Address updated successfully', address.to_dict())

    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update address: {str(e)}', 500)


@addresses_bp.route('/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    """Delete an address"""
    try:
        if is_virtual_admin():
            return error_response("Admin cannot delete addresses", 403)

        current_user_id = get_jwt_identity()

        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return error_response('Address not found', 404)

        db.session.delete(address)
        db.session.commit()

        return success_response('Address deleted successfully')

    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to delete address: {str(e)}', 500)


@addresses_bp.route('/<int:address_id>/set-default', methods=['PUT'])
@jwt_required()
def set_default_address(address_id):
    """Set an address as default for its type"""
    try:
        if is_virtual_admin():
            return error_response("Admin cannot modify addresses", 403)

        current_user_id = get_jwt_identity()

        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return error_response('Address not found', 404)

        # Remove default from other addresses of same type
        Address.query.filter_by(
            user_id=current_user_id,
            type=address.type
        ).update({'is_default': False})

        # Set this address as default
        address.is_default = True
        db.session.commit()

        return success_response('Default address set successfully', address.to_dict())

    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to set default address: {str(e)}', 500)
