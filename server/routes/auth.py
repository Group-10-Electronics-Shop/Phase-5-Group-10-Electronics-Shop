from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from marshmallow import ValidationError
from server.models.database import db, User, UserRole
from server.schemas import UserRegistrationSchema, UserLoginSchema, UserUpdateSchema
from server.utils import success_response, error_response
import os

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# ===========================
# 🔐 Fixed Admin Credentials
# ===========================
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@shop.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (Admin cannot register)"""
    try:
        schema = UserRegistrationSchema()
        data = schema.load(request.json)

        # Prevent registration using admin email
        if data['email'].lower() == ADMIN_EMAIL.lower():
            return error_response("Admin registration not allowed.", 403)

        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return error_response('User with this email already exists', 409)

        # Create new user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            role=UserRole.CUSTOMER
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return success_response(
            'User registered successfully',
            {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            },
            201
        )
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Registration failed: {str(e)}', 500)


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user or fixed admin"""
    try:
        schema = UserLoginSchema()
        data = schema.load(request.json)

        email = data.get('email')
        password = data.get('password')

        # ================================
        # 🔹 Check for fixed admin login
        # ================================
        if email.lower() == ADMIN_EMAIL.lower() and password == ADMIN_PASSWORD:
            admin_data = {
                "id": 0,  # Virtual ID (not from DB)
                "email": ADMIN_EMAIL,
                "first_name": "Admin",
                "last_name": "User",
                "role": "admin"
            }

            access_token = create_access_token(identity="admin")
            refresh_token = create_refresh_token(identity="admin")

            return success_response(
                "Admin login successful",
                {
                    "user": admin_data,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }
            )

        # ================================
        # 🔹 Regular user login
        # ================================
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return error_response('Invalid email or password', 401)

        if not user.is_active:
            return error_response('Account is deactivated', 403)

        # Create tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return success_response(
            'Login successful',
            {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        )
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        return error_response(f'Login failed: {str(e)}', 500)


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()

        # Skip DB check for admin
        if current_user_id == "admin":
            new_token = create_access_token(identity="admin")
            return success_response("Admin token refreshed", {"access_token": new_token})

        user = User.query.get(current_user_id)

        if not user or not user.is_active:
            return error_response('User not found or inactive', 404)

        access_token = create_access_token(identity=user.id)

        return success_response(
            'Token refreshed successfully',
            {'access_token': access_token}
        )
    except Exception as e:
        return error_response(f'Token refresh failed: {str(e)}', 500)


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()

        # If admin
        if current_user_id == "admin":
            return success_response("Admin profile retrieved successfully", {
                "id": 0,
                "email": ADMIN_EMAIL,
                "first_name": "Admin",
                "last_name": "User",
                "role": "admin"
            })

        user = User.query.get(current_user_id)
        if not user:
            return error_response('User not found', 404)

        return success_response('Profile retrieved successfully', user.to_dict())
    except Exception as e:
        return error_response(f'Failed to get profile: {str(e)}', 500)


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update current user profile"""
    try:
        current_user_id = get_jwt_identity()

        # Prevent admin profile update
        if current_user_id == "admin":
            return error_response("Admin profile cannot be modified", 403)

        user = User.query.get(current_user_id)

        if not user:
            return error_response('User not found', 404)

        schema = UserUpdateSchema()
        data = schema.load(request.json)

        for field, value in data.items():
            if hasattr(user, field):
                setattr(user, field, value)

        db.session.commit()

        return success_response('Profile updated successfully', user.to_dict())
    except ValidationError as e:
        return error_response('Validation failed', 400, e.messages)
    except Exception as e:
        db.session.rollback()
        return error_response(f'Failed to update profile: {str(e)}', 500)
