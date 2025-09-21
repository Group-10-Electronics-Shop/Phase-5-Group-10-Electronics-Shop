from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.models.user import User
from server.utils.jwt_utils import JWTManager, create_login_response, create_register_response

auth_bp = Blueprint('auth', __name__)


def _split_name(name: str):
    """Split a full name into first and last (best-effort)."""
    parts = name.strip().split()
    if not parts:
        return None, None
    if len(parts) == 1:
        return parts[0], None
    return parts[0], " ".join(parts[1:])


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400

        # Accept either explicit fields or fall back to email/name
        email = (data.get('email') or '').strip().lower()
        username = (data.get('username') or '').strip() or (email.split('@')[0] if email else '')
        first_name = (data.get('first_name') or '').strip()
        last_name = (data.get('last_name') or '').strip()
        full_name = (data.get('name') or '').strip()  # optional single full name
        password = data.get('password', '')

        # If first/last missing but name provided, split it
        if not first_name and full_name:
            f, l = _split_name(full_name)
            first_name = first_name or (f or '')
            last_name = last_name or (l or '')

        # If still missing required fields, provide helpful message
        required_fields = []
        if not username:
            required_fields.append('username')
        if not email:
            required_fields.append('email')
        if not password:
            required_fields.append('password')
        if not first_name:
            required_fields.append('first_name')
        if not last_name:
            # allow last_name to be empty string in case user has single name,
            # but tests expect something — mark missing if totally empty
            required_fields.append('last_name')

        if required_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(required_fields)}'
            }), 400

        # Creating user
        user = User.create(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            address=data.get('address', None),
            phone=data.get('phone', None),
            role=data.get('role', 'customer')
        )

        if not user:
            return jsonify({'error': 'User creation failed'}), 500

        response_data = create_register_response(user)
        return jsonify(response_data), 201

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # keep error messages generic for security
        return jsonify({'error': 'Registration failed. Please try again.'}), 500


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body must be JSON'}), 400

        # Accept either username OR email in tests/clients
        username_or_email = (data.get('username') or data.get('email') or '').strip()
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
        return jsonify({'user': user.to_dict()}), 200
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

        user.update_profile(**update_data)
        return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict()}), 200

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
            return jsonify({'error': 'Current password and new password are required'}), 400

        user.change_password(current_password, new_password)
        return jsonify({'message': 'Password changed successfully'}), 200

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