import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from models.user import User, hash_password, verify_password
from utils.jwt_utils import sign_token, verify_token, JWTError, get_user_from_token
from routes.auth import auth_bp
from routes.users import users_bp
from flask import Flask
from datetime import datetime


class TestUserModel:
    """Test User model"""
    
    def test_user_creation(self):
        """Test User instance creation"""
        created_at = datetime.utcnow()
        user = User(
            id=1,
            name="John Doe",
            email="john@example.com",
            role="user",
            created_at=created_at
        )
        
        assert user.id == 1
        assert user.name == "John Doe"
        assert user.email == "john@example.com"
        assert user.role == "user"
        assert user.created_at == created_at
    
    def test_user_to_dict(self):
        """Test User to_dict method"""
        created_at = datetime.utcnow()
        user = User(
            id=1,
            name="John Doe",
            email="john@example.com",
            role="user",
            created_at=created_at
        )
        
        user_dict = user.to_dict()
        
        assert user_dict['id'] == 1
        assert user_dict['name'] == "John Doe"
        assert user_dict['email'] == "john@example.com"
        assert user_dict['role'] == "user"
        assert user_dict['created_at'] == created_at.isoformat()
        assert 'password_hash' not in user_dict
    
    def test_user_from_db_row(self):
        """Test User.from_db_row method"""
        created_at = datetime.utcnow()
        row = {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'role': 'user',
            'created_at': created_at,
            'password_hash': 'hashed_password'
        }
        
        user = User.from_db_row(row)
        
        assert user.id == 1
        assert user.name == "John Doe"
        assert user.email == "john@example.com"
        assert user.role == "user"
        assert user.created_at == created_at
        assert user._password_hash == 'hashed_password'
    
    def test_check_password(self):
        """Test User.check_password method"""
        password = "test123"
        password_hash = hash_password(password)
        
        user = User(
            id=1,
            name="John Doe",
            email="john@example.com",
            role="user",
            created_at=datetime.utcnow(),
            password_hash=password_hash
        )
        
        assert user.check_password(password) is True
        assert user.check_password("wrong_password") is False
    
    def test_is_admin(self):
        """Test User.is_admin method"""
        admin_user = User(1, "Admin", "admin@example.com", "admin", datetime.utcnow())
        regular_user = User(2, "User", "user@example.com", "user", datetime.utcnow())
        
        assert admin_user.is_admin() is True
        assert regular_user.is_admin() is False


class TestPasswordHelpers:
    """Test password helper functions"""
    
    def test_hash_password(self):
        """Test password hashing"""
        password = "test123"
        hashed = hash_password(password)
        
        assert hashed != password
        assert len(hashed) > 50  # bcrypt hashes are long
        assert hashed.startswith('$2b$')  # bcrypt format
    
    def test_hash_password_empty(self):
        """Test hashing empty password raises error"""
        with pytest.raises(ValueError, match="Password cannot be empty"):
            hash_password("")
    
    def test_verify_password(self):
        """Test password verification"""
        password = "test123"
        hashed = hash_password(password)
        
        assert verify_password(password, hashed) is True
        assert verify_password("wrong", hashed) is False
        assert verify_password("", hashed) is False
        assert verify_password(password, "") is False


class TestJWTUtils:
    """Test JWT utilities"""
    
    def test_sign_token_access(self):
        """Test signing access token"""
        token = sign_token(user_id=1, role="user", token_type="access")
        
        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are long
    
    def test_sign_token_refresh(self):
        """Test signing refresh token"""
        token = sign_token(user_id=1, role="user", token_type="refresh")
        
        assert isinstance(token, str)
        assert len(token) > 50
    
    def test_sign_token_invalid_type(self):
        """Test signing token with invalid type"""
        with pytest.raises(JWTError):
            sign_token(user_id=1, role="user", token_type="invalid")
    
    def test_verify_token_access(self):
        """Test verifying access token"""
        token = sign_token(user_id=1, role="user", token_type="access")
        payload = verify_token(token, "access")
        
        assert payload['user_id'] == 1
        assert payload['role'] == "user"
        assert payload['type'] == "access"
        assert 'exp' in payload
        assert 'iat' in payload
    
    def test_verify_token_refresh(self):
        """Test verifying refresh token"""
        token = sign_token(user_id=1, role="admin", token_type="refresh")
        payload = verify_token(token, "refresh")
        
        assert payload['user_id'] == 1
        assert payload['role'] == "admin"
        assert payload['type'] == "refresh"
    
    def test_verify_token_wrong_type(self):
        """Test verifying token with wrong type"""
        token = sign_token(user_id=1, role="user", token_type="access")
        
        with pytest.raises(JWTError, match="Invalid token type"):
            verify_token(token, "refresh")
    
    def test_verify_invalid_token(self):
        """Test verifying invalid token"""
        with pytest.raises(JWTError, match="Invalid token"):
            verify_token("invalid.token.here", "access")
    
    def test_get_user_from_token(self):
        """Test extracting user from token"""
        token = sign_token(user_id=123, role="admin", token_type="access")
        user_info = get_user_from_token(token)
        
        assert user_info['user_id'] == 123
        assert user_info['role'] == "admin"
    
    def test_get_user_from_invalid_token(self):
        """Test extracting user from invalid token"""
        user_info = get_user_from_token("invalid.token")
        assert user_info is None


@pytest.fixture
def app():
    """Create Flask app for testing"""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


class TestAuthRoutes:
    """Test authentication routes"""
    
    @patch('routes.auth.get_db_connection')
    def test_register_success(self, mock_get_db, client):
        """Test successful user registration"""
        # Mock database
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user doesn't exist
        mock_cursor.fetchone.return_value = None
        
        # Mock successful insert
        mock_user_row = {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'role': 'user',
            'created_at': datetime.utcnow()
        }
        mock_cursor.fetchone.side_effect = [None, mock_user_row]  # First call for check, second for insert
        
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        })
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert data['message'] == 'User registered successfully'
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user']['name'] == 'John Doe'
    
    def test_register_missing_fields(self, client):
        """Test registration with missing fields"""
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            # missing email and password
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'email is required' in data['error']
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email"""
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'invalid-email',
            'password': 'password123'
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Invalid email format' in data['error']
    
    def test_register_weak_password(self, client):
        """Test registration with weak password"""
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': '123'  # too short
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Password must be at least 6 characters' in data['error']
    
    @patch('routes.auth.get_db_connection')
    def test_register_user_exists(self, mock_get_db, client):
        """Test registration when user already exists"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user already exists
        mock_cursor.fetchone.return_value = {'id': 1}
        
        response = client.post('/api/auth/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        })
        
        assert response.status_code == 409
        data = json.loads(response.data)
        assert 'Email already registered' in data['error']
    
    @patch('routes.auth.get_db_connection')
    def test_login_success(self, mock_get_db, client):
        """Test successful login"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user exists with correct password
        password_hash = hash_password('password123')
        mock_user_row = {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'password_hash': password_hash,
            'role': 'user',
            'created_at': datetime.utcnow()
        }
        mock_cursor.fetchone.return_value = mock_user_row
        
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'password123'
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Login successful'
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user']['email'] == 'john@example.com'
    
    @patch('routes.auth.get_db_connection')
    def test_login_user_not_found(self, mock_get_db, client):
        """Test login with non-existent user"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user not found
        mock_cursor.fetchone.return_value = None
        
        response = client.post('/api/auth/login', json={
            'email': 'nonexistent@example.com',
            'password': 'password123'
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid email or password' in data['error']
    
    @patch('routes.auth.get_db_connection')
    def test_login_wrong_password(self, mock_get_db, client):
        """Test login with wrong password"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user exists but with different password
        password_hash = hash_password('correct_password')
        mock_user_row = {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'password_hash': password_hash,
            'role': 'user',
            'created_at': datetime.utcnow()
        }
        mock_cursor.fetchone.return_value = mock_user_row
        
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com',
            'password': 'wrong_password'
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid email or password' in data['error']
    
    def test_login_missing_fields(self, client):
        """Test login with missing fields"""
        response = client.post('/api/auth/login', json={
            'email': 'john@example.com'
            # missing password
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Email and password are required' in data['error']
    
    def test_login_invalid_email(self, client):
        """Test login with invalid email format"""
        response = client.post('/api/auth/login', json={
            'email': 'invalid-email',
            'password': 'password123'
        })
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Invalid email format' in data['error']
    
    def test_refresh_token_success(self, client):
        """Test successful token refresh"""
        # Create a valid refresh token
        refresh_token = sign_token(user_id=1, role="user", token_type="refresh")
        
        response = client.post('/api/auth/refresh', json={
            'refresh_token': refresh_token
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'access_token' in data
    
    def test_refresh_token_missing(self, client):
        """Test refresh with missing token"""
        response = client.post('/api/auth/refresh', json={})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Refresh token required' in data['error']
    
    def test_refresh_token_invalid(self, client):
        """Test refresh with invalid token"""
        response = client.post('/api/auth/refresh', json={
            'refresh_token': 'invalid.token.here'
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid token' in data['error']
    
    def test_refresh_with_access_token(self, client):
        """Test refresh with access token instead of refresh token"""
        # Create an access token instead of refresh token
        access_token = sign_token(user_id=1, role="user", token_type="access")
        
        response = client.post('/api/auth/refresh', json={
            'refresh_token': access_token
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid token type' in data['error']


class TestUserRoutes:
    """Test user routes"""
    
    @patch('routes.users.get_db_connection')
    def test_get_current_user_success(self, mock_get_db, client):
        """Test successful get current user"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user data
        mock_user_row = {
            'id': 1,
            'name': 'John Doe',
            'email': 'john@example.com',
            'role': 'user',
            'created_at': datetime.utcnow()
        }
        mock_cursor.fetchone.return_value = mock_user_row
        
        # Create valid access token
        access_token = sign_token(user_id=1, role="user", token_type="access")
        
        response = client.get('/api/users/me', headers={
            'Authorization': f'Bearer {access_token}'
        })
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['user']['id'] == 1
        assert data['user']['name'] == 'John Doe'
        assert data['user']['email'] == 'john@example.com'
    
    def test_get_current_user_no_token(self, client):
        """Test get current user without token"""
        response = client.get('/api/users/me')
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Authorization header required' in data['error']
    
    def test_get_current_user_invalid_token(self, client):
        """Test get current user with invalid token"""
        response = client.get('/api/users/me', headers={
            'Authorization': 'Bearer invalid.token.here'
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid or expired token' in data['error']
    
    def test_get_current_user_malformed_header(self, client):
        """Test get current user with malformed auth header"""
        response = client.get('/api/users/me', headers={
            'Authorization': 'InvalidFormat'
        })
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid authorization header format' in data['error']
    
    @patch('routes.users.get_db_connection')
    def test_get_current_user_not_found(self, mock_get_db, client):
        """Test get current user when user not found in database"""
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_get_db.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        # Mock user not found
        mock_cursor.fetchone.return_value = None
        
        # Create valid access token for non-existent user
        access_token = sign_token(user_id=999, role="user", token_type="access")
        
        response = client.get('/api/users/me', headers={
            'Authorization': f'Bearer {access_token}'
        })
        
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'User not found' in data['error']