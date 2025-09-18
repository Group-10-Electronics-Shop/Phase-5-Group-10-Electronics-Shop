from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, create_access_token
from models.database import User, verify_password
from utils.jwt_utils import sign_jwt, jwt_required, get_current_user
import re

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        new_token = create_access_token(
            identity=user_id,
            additional_claims={'role': user['role']}
        )
        
        return jsonify({'access_token': new_token}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, username, email, first_name, last_name, role, address, phone, created_at
            FROM users WHERE id = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': dict(user)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        
        allowed_fields = ['first_name', 'last_name', 'address', 'phone']
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                update_values.append(data[field])
        
        if not update_fields:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        update_values.append(user_id)
        query = f"""
            UPDATE users SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, username, email, first_name, last_name, role, address, phone
        """
        
        cursor.execute(query, update_values)
        user = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': dict(user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Validate new password
        is_valid, message = validate_password(data['new_password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get current password hash
        cursor.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user or not verify_password(data['current_password'], user['password_hash']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        new_password_hash = hash_password(data['new_password'])
        cursor.execute("""
            UPDATE users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_password_hash, user_id))
        
        conn.commit()
        cursor.close()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, ""

@auth_bp.route('/register', methods=['POST'])
def register():
    """POST /api/auth/register - Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not validate_email(data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, message = validate_password(data['password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Create user
        user = User.create(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'customer')
        )
        
        # Sign JWT token
        token = sign_jwt(user['id'], user['role'])
        
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at'].isoformat() if user['created_at'] else None
            },
            'token': token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """POST /api/auth/login - Login user"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.find_by_email(data['email'])
        
        if not user or not verify_password(data['password'], user['password_hash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Sign JWT token
        token = sign_jwt(user['id'], user['role'])
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at'].isoformat() if user['created_at'] else None
            },
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        new_token = create_access_token(
            identity=user_id,
            additional_claims={'role': user['role']}
        )
        
        return jsonify({'access_token': new_token}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = get_jwt_identity()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, username, email, first_name, last_name, role, address, phone, created_at
            FROM users WHERE id = %s
        """, (user_id,))
        
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': dict(user)}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build update query dynamically
        update_fields = []
        update_values = []
        
        allowed_fields = ['first_name', 'last_name', 'address', 'phone']
        for field in allowed_fields:
            if field in data:
                update_fields.append(f"{field} = %s")
                update_values.append(data[field])
        
        if not update_fields:
            return jsonify({'error': 'No valid fields to update'}), 400
        
        update_values.append(user_id)
        query = f"""
            UPDATE users SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id, username, email, first_name, last_name, role, address, phone
        """
        
        cursor.execute(query, update_values)
        user = cursor.fetchone()
        conn.commit()
        cursor.close()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': dict(user)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Validate new password
        is_valid, message = validate_password(data['new_password'])
        if not is_valid:
            return jsonify({'error': message}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get current password hash
        cursor.execute("SELECT password_hash FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user or not verify_password(data['current_password'], user['password_hash']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        new_password_hash = hash_password(data['new_password'])
        cursor.execute("""
            UPDATE users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (new_password_hash, user_id))
        
        conn.commit()
        cursor.close()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500