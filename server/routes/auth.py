from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from utils.jwt_utils import JWTManager, create_login_response, create_register_response

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Create user
        user = User.create(
            username=data['username'].strip(),
            email=data['email'].strip().lower(),
            password=data['password'],
            first_name=data['first_name'].strip(),
            last_name=data['last_name'].strip(),
            address=data.get('address', '').strip() if data.get('address') else None,
            phone=data.get('phone', '').strip() if data.get('phone') else None,
            role=data.get('role', 'customer')
        )
        
        response_data = create_register_response(user)
        return jsonify(response_data), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400
        
        username_or_email = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            return jsonify({'error': 'Username/email and password are required'}), 400
        
        # Authenticate user
        user = User.authenticate(username_or_email, password)
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        response_data = create_login_response(user)
        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed. Please try again.'}), 500

@auth_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        
        if not user_id:
            return jsonify({'error': 'Invalid refresh token'}), 401
        
        # Create new access token
        new_access_token = JWTManager.create_access_token_from_refresh(user_id)
        
        if not new_access_token:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed'}), 500

@auth_bp.route('/users/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user profile"""
    try:
        user = JWTManager.get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user profile'}), 500

@auth_bp.route('/users/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    """Update current user profile"""
    try:
        user = JWTManager.get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'address', 'phone']
        update_data = {}
        
        for field in allowed_fields:
            if field in data:
                value = data[field]
                if value is not None:
                    value = str(value).strip()
                    if value == '':
                        value = None
                update_data[field] = value
        
        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        # Update user profile
        user.update_profile(**update_data)
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Profile update failed'}), 500

@auth_bp.route('/users/me/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change current user password"""
    try:
        user = JWTManager.get_current_user()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            return jsonify({
                'error': 'Current password and new password are required'
            }), 400
        
        # Change password
        user.change_password(current_password, new_password)
        
        return jsonify({
            'message': 'Password changed successfully'
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Password change failed'}), 500

@auth_bp.route('/auth/validate', methods=['GET'])
@jwt_required()
def validate_token():
    """Validate JWT token"""
    try:
        user = JWTManager.get_current_user()
        
        if not user:
            return jsonify({'error': 'Invalid token'}), 401
        
        claims = JWTManager.get_token_claims()
        
        return jsonify({
            'valid': True,
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'claims': claims
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token validation failed'}), 500