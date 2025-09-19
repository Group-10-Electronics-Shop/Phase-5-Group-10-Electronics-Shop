import pytest
import json
from app import create_app
from models.database import reset_database
from models.user import User

@pytest.fixture
def app():
    """Create and configure test app"""
    app = create_app()
    app.config['TESTING'] = True
    app.config['DATABASE_URL'] = 'postgresql://username:password@localhost/electronics_shop_test'
    
    with app.app_context():
        reset_database()
        yield app

@pytest.fixture
def client(app):
    """Test client"""
    return app.test_client()

@pytest.fixture
def sample_user_data():
    """Sample user data for testing"""
    return {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'User',
        'address': '123 Test St',
        'phone': '+1234567890'
    }

@pytest.fixture
def admin_user_data():
    """Admin user data for testing"""
    return {
        'username': 'testadmin',
        'email': 'admin@test.com',
        'password': 'admin123',
        'first_name': 'Admin',
        'last_name': 'User',
        'role': 'admin'
    }

class TestUserRegistration:
    """Test user registration"""
    
    def test_register_success(self, client, sample_user_data):
        """Test successful user registration"""
        response = client.post('/api/auth/register', 
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        
        assert data['message'] == 'User created successfully'
        assert 'user' in data
        assert 'access_token' in data
        assert 'refresh_token' in data
        
        # Verify user data
        user = data['user']
        assert user['username'] == sample_user_data['username']
        assert user['email'] == sample_user_data['email']
        assert user['first_name'] == sample_user_data['first_name']
        assert user['last_name'] == sample_user_data['last_name']
        assert user['role'] == 'customer'
        assert 'password_hash' not in user  # Should not expose password hash
    
    def test_register_missing_fields(self, client):
        """Test registration with missing required fields"""
        incomplete_data = {
            'username': 'testuser',
            'email': 'test@example.com'
            # Missing password, first_name, last_name
        }
        
        response = client.post('/api/auth/register',
                             data=json.dumps(incomplete_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Missing required fields' in data['error']
    
    def test_register_invalid_email(self, client, sample_user_data):
        """Test registration with invalid email"""
        sample_user_data['email'] = 'invalid-email'
        
        response = client.post('/api/auth/register',
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Invalid email format' in data['error']
    
    def test_register_weak_password(self, client, sample_user_data):
        """Test registration with weak password"""
        sample_user_data['password'] = '123'  # Too short
        
        response = client.post('/api/auth/register',
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Password must be at least 6 characters long' in data['error']
    
    def test_register_duplicate_username(self, client, sample_user_data):
        """Test registration with duplicate username"""
        # First registration
        client.post('/api/auth/register',
                   data=json.dumps(sample_user_data),
                   content_type='application/json')
        
        # Second registration with same username
        sample_user_data['email'] = 'different@example.com'
        response = client.post('/api/auth/register',
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Username or email already exists' in data['error']
    
    def test_register_duplicate_email(self, client, sample_user_data):
        """Test registration with duplicate email"""
        # First registration
        client.post('/api/auth/register',
                   data=json.dumps(sample_user_data),
                   content_type='application/json')
        
        # Second registration with same email
        sample_user_data['username'] = 'differentuser'
        response = client.post('/api/auth/register',
                             data=json.dumps(sample_user_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Username or email already exists' in data['error']
    
    def test_register_admin_role(self, client, admin_user_data):
        """Test registration with admin role"""
        response = client.post('/api/auth/register',
                             data=json.dumps(admin_user_data),
                             content_type='application/json')
        
        assert response.status_code == 201
        data = json.loads(response.data)
        
        user = data['user']
        assert user['role'] == 'admin'
    
    def test_register_no_json_body(self, client):
        """Test registration with no JSON body"""
        response = client.post('/api/auth/register')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Request body must be JSON' in data['error']

class TestUserLogin:
    """Test user login"""
    
    def setup_method(self):
        """Set up test user before each test"""
        self.user_data = {
            'username': 'logintest',
            'email': 'login@example.com',
            'password': 'password123',
            'first_name': 'Login',
            'last_name': 'Test'
        }
    
    def test_login_success_username(self, client):
        """Test successful login with username"""
        # Register user first
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        # Login with username
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        
        response = client.post('/api/auth/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['message'] == 'Login successful'
        assert 'user' in data
        assert 'access_token' in data
        assert 'refresh_token' in data
        
        user = data['user']
        assert user['username'] == self.user_data['username']
        assert user['email'] == self.user_data['email']
    
    def test_login_success_email(self, client):
        """Test successful login with email"""
        # Register user first
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        # Login with email
        login_data = {
            'username': self.user_data['email'],  # Using email in username field
            'password': self.user_data['password']
        }
        
        response = client.post('/api/auth/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Login successful'
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        # Register user first
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        # Login with wrong password
        login_data = {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        }
        
        response = client.post('/api/auth/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid credentials' in data['error']
    
    def test_login_nonexistent_user(self, client):
        """Test login with nonexistent user"""
        login_data = {
            'username': 'nonexistent',
            'password': 'password123'
        }
        
        response = client.post('/api/auth/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'Invalid credentials' in data['error']
    
    def test_login_missing_fields(self, client):
        """Test login with missing fields"""
        login_data = {'username': 'testuser'}  # Missing password
        
        response = client.post('/api/auth/login',
                             data=json.dumps(login_data),
                             content_type='application/json')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Username/email and password are required' in data['error']
    
    def test_login_no_json_body(self, client):
        """Test login with no JSON body"""
        response = client.post('/api/auth/login')
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Request body must be JSON' in data['error']

class TestTokenRefresh:
    """Test token refresh"""
    
    def setup_method(self):
        """Set up test user and get tokens"""
        self.user_data = {
            'username': 'refreshtest',
            'email': 'refresh@example.com',
            'password': 'password123',
            'first_name': 'Refresh',
            'last_name': 'Test'
        }
    
    def test_refresh_token_success(self, client):
        """Test successful token refresh"""
        # Register and login to get refresh token
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': self.user_data['password']
                                   }),
                                   content_type='application/json')
        
        login_data = json.loads(login_response.data)
        refresh_token = login_data['refresh_token']
        
        # Use refresh token to get new access token
        response = client.post('/api/auth/refresh',
                             headers={'Authorization': f'Bearer {refresh_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['message'] == 'Token refreshed successfully'
        assert 'access_token' in data
    
    def test_refresh_token_invalid(self, client):
        """Test refresh with invalid token"""
        response = client.post('/api/auth/refresh',
                             headers={'Authorization': 'Bearer invalid_token'})
        
        assert response.status_code == 422  # JWT decode error
    
    def test_refresh_token_missing(self, client):
        """Test refresh without token"""
        response = client.post('/api/auth/refresh')
        
        assert response.status_code == 401  # Missing authorization header

class TestGetCurrentUser:
    """Test GET /api/users/me endpoint"""
    
    def setup_method(self):
        """Set up test user and get access token"""
        self.user_data = {
            'username': 'metest',
            'email': 'me@example.com',
            'password': 'password123',
            'first_name': 'Me',
            'last_name': 'Test',
            'address': '123 Me St',
            'phone': '+1234567890'
        }
    
    def get_access_token(self, client):
        """Helper method to get access token"""
        # Register user
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        # Login to get token
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': self.user_data['password']
                                   }),
                                   content_type='application/json')
        
        return json.loads(login_response.data)['access_token']
    
    def test_get_current_user_success(self, client):
        """Test successful get current user"""
        access_token = self.get_access_token(client)
        
        response = client.get('/api/users/me',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert 'user' in data
        user = data['user']
        
        assert user['username'] == self.user_data['username']
        assert user['email'] == self.user_data['email']
        assert user['first_name'] == self.user_data['first_name']
        assert user['last_name'] == self.user_data['last_name']
        assert user['address'] == self.user_data['address']
        assert user['phone'] == self.user_data['phone']
        assert user['role'] == 'customer'
        assert 'password_hash' not in user
    
    def test_get_current_user_no_token(self, client):
        """Test get current user without token"""
        response = client.get('/api/users/me')
        
        assert response.status_code == 401
    
    def test_get_current_user_invalid_token(self, client):
        """Test get current user with invalid token"""
        response = client.get('/api/users/me',
                            headers={'Authorization': 'Bearer invalid_token'})
        
        assert response.status_code == 422

class TestUpdateCurrentUser:
    """Test PUT /api/users/me endpoint"""
    
    def setup_method(self):
        """Set up test user and get access token"""
        self.user_data = {
            'username': 'updatetest',
            'email': 'update@example.com',
            'password': 'password123',
            'first_name': 'Update',
            'last_name': 'Test',
            'address': '123 Update St',
            'phone': '+1234567890'
        }
    
    def get_access_token(self, client):
        """Helper method to get access token"""
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': self.user_data['password']
                                   }),
                                   content_type='application/json')
        
        return json.loads(login_response.data)['access_token']
    
    def test_update_profile_success(self, client):
        """Test successful profile update"""
        access_token = self.get_access_token(client)
        
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'address': '456 New St',
            'phone': '+9876543210'
        }
        
        response = client.put('/api/users/me',
                            data=json.dumps(update_data),
                            content_type='application/json',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['message'] == 'Profile updated successfully'
        user = data['user']
        
        assert user['first_name'] == update_data['first_name']
        assert user['last_name'] == update_data['last_name']
        assert user['address'] == update_data['address']
        assert user['phone'] == update_data['phone']
        assert user['username'] == self.user_data['username']  # Unchanged
        assert user['email'] == self.user_data['email']  # Unchanged
    
    def test_update_profile_partial(self, client):
        """Test partial profile update"""
        access_token = self.get_access_token(client)
        
        update_data = {'first_name': 'PartialUpdate'}
        
        response = client.put('/api/users/me',
                            data=json.dumps(update_data),
                            content_type='application/json',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        user = data['user']
        assert user['first_name'] == 'PartialUpdate'
        assert user['last_name'] == self.user_data['last_name']  # Unchanged
    
    def test_update_profile_empty_strings(self, client):
        """Test profile update with empty strings (should convert to None)"""
        access_token = self.get_access_token(client)
        
        update_data = {
            'address': '',  # Empty string should become None
            'phone': ''
        }
        
        response = client.put('/api/users/me',
                            data=json.dumps(update_data),
                            content_type='application/json',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        user = data['user']
        assert user['address'] is None
        assert user['phone'] is None
    
    def test_update_profile_no_data(self, client):
        """Test profile update with no data"""
        access_token = self.get_access_token(client)
        
        response = client.put('/api/users/me',
                            data=json.dumps({}),
                            content_type='application/json',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'No valid fields to update' in data['error']
    
    def test_update_profile_no_token(self, client):
        """Test profile update without token"""
        update_data = {'first_name': 'NoToken'}
        
        response = client.put('/api/users/me',
                            data=json.dumps(update_data),
                            content_type='application/json')
        
        assert response.status_code == 401
    
    def test_update_profile_no_json_body(self, client):
        """Test profile update with no JSON body"""
        access_token = self.get_access_token(client)
        
        response = client.put('/api/users/me',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Request body must be JSON' in data['error']

class TestChangePassword:
    """Test change password endpoint"""
    
    def setup_method(self):
        """Set up test user"""
        self.user_data = {
            'username': 'passwordtest',
            'email': 'password@example.com',
            'password': 'oldpassword123',
            'first_name': 'Password',
            'last_name': 'Test'
        }
    
    def get_access_token(self, client):
        """Helper method to get access token"""
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': self.user_data['password']
                                   }),
                                   content_type='application/json')
        
        return json.loads(login_response.data)['access_token']
    
    def test_change_password_success(self, client):
        """Test successful password change"""
        access_token = self.get_access_token(client)
        
        password_data = {
            'current_password': 'oldpassword123',
            'new_password': 'newpassword456'
        }
        
        response = client.post('/api/users/me/change-password',
                             data=json.dumps(password_data),
                             content_type='application/json',
                             headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['message'] == 'Password changed successfully'
        
        # Test login with new password
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': 'newpassword456'
                                   }),
                                   content_type='application/json')
        
        assert login_response.status_code == 200
        
        # Test that old password no longer works
        old_login_response = client.post('/api/auth/login',
                                       data=json.dumps({
                                           'username': self.user_data['username'],
                                           'password': 'oldpassword123'
                                       }),
                                       content_type='application/json')
        
        assert old_login_response.status_code == 401
    
    def test_change_password_wrong_current(self, client):
        """Test password change with wrong current password"""
        access_token = self.get_access_token(client)
        
        password_data = {
            'current_password': 'wrongpassword',
            'new_password': 'newpassword456'
        }
        
        response = client.post('/api/users/me/change-password',
                             data=json.dumps(password_data),
                             content_type='application/json',
                             headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Current password is incorrect' in data['error']
    
    def test_change_password_weak_new(self, client):
        """Test password change with weak new password"""
        access_token = self.get_access_token(client)
        
        password_data = {
            'current_password': 'oldpassword123',
            'new_password': '123'  # Too short
        }
        
        response = client.post('/api/users/me/change-password',
                             data=json.dumps(password_data),
                             content_type='application/json',
                             headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Password must be at least 6 characters long' in data['error']
    
    def test_change_password_missing_fields(self, client):
        """Test password change with missing fields"""
        access_token = self.get_access_token(client)
        
        password_data = {'current_password': 'oldpassword123'}  # Missing new_password
        
        response = client.post('/api/users/me/change-password',
                             data=json.dumps(password_data),
                             content_type='application/json',
                             headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'Current password and new password are required' in data['error']
    
    def test_change_password_no_token(self, client):
        """Test password change without token"""
        password_data = {
            'current_password': 'oldpassword123',
            'new_password': 'newpassword456'
        }
        
        response = client.post('/api/users/me/change-password',
                             data=json.dumps(password_data),
                             content_type='application/json')
        
        assert response.status_code == 401

class TestTokenValidation:
    """Test token validation endpoint"""
    
    def setup_method(self):
        """Set up test user"""
        self.user_data = {
            'username': 'validatetest',
            'email': 'validate@example.com',
            'password': 'password123',
            'first_name': 'Validate',
            'last_name': 'Test'
        }
    
    def get_access_token(self, client):
        """Helper method to get access token"""
        client.post('/api/auth/register',
                   data=json.dumps(self.user_data),
                   content_type='application/json')
        
        login_response = client.post('/api/auth/login',
                                   data=json.dumps({
                                       'username': self.user_data['username'],
                                       'password': self.user_data['password']
                                   }),
                                   content_type='application/json')
        
        return json.loads(login_response.data)['access_token']
    
    def test_validate_token_success(self, client):
        """Test successful token validation"""
        access_token = self.get_access_token(client)
        
        response = client.get('/api/auth/validate',
                            headers={'Authorization': f'Bearer {access_token}'})
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        assert data['valid'] is True
        assert 'user_id' in data
        assert data['username'] == self.user_data['username']
        assert data['role'] == 'customer'
        assert 'claims' in data
    
    def test_validate_token_invalid(self, client):
        """Test token validation with invalid token"""
        response = client.get('/api/auth/validate',
                            headers={'Authorization': 'Bearer invalid_token'})
        
        assert response.status_code == 422
    
    def test_validate_token_missing(self, client):
        """Test token validation without token"""
        response = client.get('/api/auth/validate')
        
        assert response.status_code == 401