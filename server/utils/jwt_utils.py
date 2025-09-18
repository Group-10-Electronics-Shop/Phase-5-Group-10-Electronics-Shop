import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app

def get_jwt_secret():
    """Get JWT secret from environment"""
    return os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')

def sign_jwt(user_id, role='customer', expires_in_hours=24):
    """Sign JWT token with user information"""
    try:
        payload = {
            'user_id': user_id,
            'role': role,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=expires_in_hours)
        }
        
        token = jwt.encode(
            payload,
            get_jwt_secret(),
            algorithm='HS256'
        )
        
        return token
    except Exception as e:
        raise Exception(f"Error signing JWT: {str(e)}")

def verify_jwt(token):
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=['HS256']
        )
        
        # Check if token is expired
        exp = datetime.fromtimestamp(payload['exp'])
        if datetime.utcnow() > exp:
            raise jwt.ExpiredSignatureError('Token has expired')
        
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')
    except Exception as e:
        raise Exception(f"Error verifying JWT: {str(e)}")

def jwt_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                # Expected format: "Bearer <token>"
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': 'Invalid authorization header format'}), 401
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Verify token
            payload = verify_jwt(token)
            
            # Add user info to request context
            request.current_user = {
                'id': payload['user_id'],
                'role': payload['role']
            }
            
        except Exception as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated_function

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required
    def decorated_function(*args, **kwargs):
        if request.current_user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated_function

def get_current_user():
    """Get current user from request context"""
    return getattr(request, 'current_user', None)