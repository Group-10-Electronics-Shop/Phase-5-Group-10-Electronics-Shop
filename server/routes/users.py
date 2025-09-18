from flask import Blueprint, jsonify
from models.database import User
from utils.jwt_utils import jwt_required, get_current_user

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required
def get_me():
    """Protected GET /api/users/me - Get current user profile"""
    try:
        current_user = get_current_user()
        
        if not current_user:
            return jsonify({'error': 'User not found in token'}), 401
        
        # Get user details from database
        user = User.find_by_id(current_user['id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
                'created_at': user['created_at'].isoformat() if user['created_at'] else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500