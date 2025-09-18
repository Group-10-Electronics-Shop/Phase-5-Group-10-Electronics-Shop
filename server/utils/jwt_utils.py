from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, get_jwt
from typing import Dict, Any, Optional
from models.user import User

class JWTManager:
    """JWT utility class for token management"""
    
    @staticmethod
    def create_tokens(user: User) -> Dict[str, str]:
        """Create access and refresh tokens for a user"""
        additional_claims = {
            'role': user.role,
            'username': user.username,
            'email': user.email
        }
        
        access_token = create_access_token(
            identity=user.id,
            additional_claims=additional_claims
        )
        
        refresh_token = create_refresh_token(
            identity=user.id,
            additional_claims={'role': user.role}
        )
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }
    
    @staticmethod
    def create_access_token_from_refresh(user_id: int) -> Optional[str]:
        """Create new access token from refresh token"""
        user = User.find_by_id(user_id)
        if not user:
            return None
        
        additional_claims = {
            'role': user.role,
            'username': user.username,
            'email': user.email
        }
        
        return create_access_token(
            identity=user.id,
            additional_claims=additional_claims
        )
    
    @staticmethod
    def get_current_user() -> Optional[User]:
        """Get current user from JWT token"""
        try:
            user_id = get_jwt_identity()
            if user_id:
                return User.find_by_id(user_id)
        except Exception:
            return None
        return None
    
    @staticmethod
    def get_token_claims() -> Dict[str, Any]:
        """Get claims from current JWT token"""
        try:
            return get_jwt()
        except Exception:
            return {}
    
    @staticmethod
    def is_admin() -> bool:
        """Check if current user is admin"""
        claims = JWTManager.get_token_claims()
        return claims.get('role') == 'admin'
    
    @staticmethod
    def has_role(role: str) -> bool:
        """Check if current user has specific role"""
        claims = JWTManager.get_token_claims()
        return claims.get('role') == role
    
    @staticmethod
    def validate_token_user(user_id: int) -> bool:
        """Validate that token belongs to specific user"""
        token_user_id = get_jwt_identity()
        return token_user_id == user_id

def create_login_response(user: User) -> Dict[str, Any]:
    """Create standardized login response"""
    tokens = JWTManager.create_tokens(user)
    
    return {
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': tokens['access_token'],
        'refresh_token': tokens['refresh_token']
    }

def create_register_response(user: User) -> Dict[str, Any]:
    """Create standardized register response"""
    tokens = JWTManager.create_tokens(user)
    
    return {
        'message': 'User created successfully',
        'user': user.to_dict(),
        'access_token': tokens['access_token'],
        'refresh_token': tokens['refresh_token']
    }