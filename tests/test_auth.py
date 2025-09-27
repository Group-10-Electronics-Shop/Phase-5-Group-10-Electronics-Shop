"""
Fixed Authentication tests for Electronics Shop API
"""

import pytest
import json

# Test URLs
REGISTER_URL = '/api/auth/register'
LOGIN_URL = '/api/auth/login'
ME_URL = '/api/auth/profile'  # Changed from /api/auth/me

def register_user(client, email="test@example.com", password="password123", first_name="Test", last_name="User"):
    """Helper function to register a user with correct field names"""
    return client.post(REGISTER_URL, json={
        'email': email,
        'password': password,
        'first_name': first_name,  # Fixed: was 'name'
        'last_name': last_name     # Added: required field
    })

def login_user(client, email="test@example.com", password="password123"):
    """Helper function to login a user"""
    return client.post(LOGIN_URL, json={
        'email': email,
        'password': password
    })

def get_auth_headers(client, email="test@example.com", password="password123"):
    """Helper function to get authentication headers"""
    # First register the user
    register_user(client, email=email, password=password)
    
    # Then login to get token
    response = login_user(client, email=email, password=password)
    if response.status_code == 200:
        data = response.get_json()
        token = data['data']['access_token']
        return {'Authorization': f'Bearer {token}'}
    return {}

def test_user_registration_success(client):
    """Test successful user registration"""
    response = register_user(client)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
    assert 'user' in data['data']
    assert data['data']['user']['email'] == 'test@example.com'

def test_user_registration_duplicate_email(client):
    """Test registration with duplicate email"""
    # Register first user
    register_user(client, email="duplicate@example.com")
    
    # Try to register same email again
    response = register_user(client, email="duplicate@example.com")
    assert response.status_code == 409
    
    data = response.get_json()
    assert data['success'] is False
    assert 'already exists' in data['message']

def test_user_registration_invalid_data(client):
    """Test registration with invalid data"""
    response = client.post(REGISTER_URL, json={
        'email': 'invalid-email',  # Invalid email format
        'password': '123',  # Too short
        'first_name': '',   # Empty
        'last_name': 'User'
    })
    
    assert response.status_code == 400
    data = response.get_json()
    assert data['success'] is False
    assert 'errors' in data

def test_register_login_and_get_me(client):
    """Test complete registration -> login -> profile flow"""
    # Register user
    r = register_user(client)
    assert r.status_code == 201, f"unexpected registration status {r.status_code} body={r.get_data(as_text=True)}"
    
    # Login user
    r = login_user(client)
    assert r.status_code == 200, f"unexpected login status {r.status_code} body={r.get_data(as_text=True)}"
    
    # Get access token
    data = r.get_json()
    token = data['data']['access_token']
    
    # Test profile endpoint
    headers = {'Authorization': f'Bearer {token}'}
    r = client.get(ME_URL, headers=headers)
    assert r.status_code == 200, f"unexpected profile status {r.status_code} body={r.get_data(as_text=True)}"
    
    profile_data = r.get_json()
    assert profile_data['success'] is True
    assert profile_data['data']['email'] == 'test@example.com'

def test_login_returns_token_and_invalid_credentials_are_rejected(client):
    """Test login with valid and invalid credentials"""
    # Register user first
    register_user(client, email="login-test@example.com")
    
    # Test valid login
    r = login_user(client, email="login-test@example.com")
    assert r.status_code == 200, f"login should succeed, got {r.status_code} body={r.get_data(as_text=True)}"
    
    data = r.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
    
    # Test invalid credentials
    r = login_user(client, email="login-test@example.com", password="wrongpassword")
    assert r.status_code == 401, f"login with wrong password should fail with 401, got {r.status_code}"
    
    data = r.get_json()
    assert data['success'] is False

def test_protected_route_requires_auth(client):
    """Test that protected routes require authentication"""
    # Test without token
    r = client.get(ME_URL)
    assert r.status_code == 401, f"expected 401 for unauthenticated request, got {r.status_code} body={r.get_data(as_text=True)}"
    
    # Test with invalid token
    headers = {'Authorization': 'Bearer invalid-token'}
    r = client.get(ME_URL, headers=headers)
    assert r.status_code == 401, f"expected 401 for invalid token, got {r.status_code}"

def test_user_login_success(client):
    """Test successful user login"""
    # Register user first
    register_user(client, email="login@test.com", password="testpass123")
    
    # Login
    response = login_user(client, email="login@test.com", password="testpass123")
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
    assert 'user' in data['data']

def test_get_profile_success(client):
    """Test getting user profile with valid token"""
    headers = get_auth_headers(client, email="profile@test.com", password="testpass123")
    
    response = client.get(ME_URL, headers=headers)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['email'] == 'profile@test.com'

def test_update_profile_success(client):
    """Test updating user profile"""
    headers = get_auth_headers(client, email="update@test.com", password="testpass123")
    
    update_data = {
        'first_name': 'Updated',
        'phone': '+1234567890'
    }
    
    response = client.put(ME_URL, json=update_data, headers=headers)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['first_name'] == 'Updated'
    assert data['data']['phone'] == '+1234567890'

def test_change_password_success(client):
    """Test changing password"""
    # Register and get headers
    email = "password@test.com"
    old_password = "oldpass123"
    new_password = "newpass123"
    
    headers = get_auth_headers(client, email=email, password=old_password)
    
    # Change password
    password_data = {
        'current_password': old_password,
        'new_password': new_password
    }
    
    response = client.post('/api/auth/change-password', json=password_data, headers=headers)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    # Test login with new password
    login_response = login_user(client, email=email, password=new_password)
    assert login_response.status_code == 200