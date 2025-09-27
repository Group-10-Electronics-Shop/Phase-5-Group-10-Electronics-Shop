"""
Pytest configuration and fixtures for Electronics Shop API tests
"""

import pytest
import tempfile
import os
from server import create_app
from server.models.database import db

class TestConfig:
    """Test configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'test-jwt-secret-key'
    SECRET_KEY = 'test-secret-key'
    WTF_CSRF_ENABLED = False

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app('testing')
    app.config.from_object(TestConfig)
    
    with app.app_context():
        # Create all database tables
        db.create_all()
        yield app
        # Clean up
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

@pytest.fixture
def auth_headers(client):
    """Get authentication headers for testing protected routes."""
    # Register a test user
    client.post('/api/auth/register', json={
        'email': 'testuser@example.com',
        'password': 'testpass123',
        'first_name': 'Test',
        'last_name': 'User'
    })
    
    # Login to get token
    response = client.post('/api/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'testpass123'
    })
    
    if response.status_code == 200:
        data = response.get_json()
        token = data['data']['access_token']
        return {'Authorization': f'Bearer {token}'}
    return {}

@pytest.fixture
def admin_headers(client):
    """Get admin authentication headers for testing admin routes."""
    from server.models.database import User, UserRole
    
    # Create admin user directly in database
    with client.application.app_context():
        admin = User(
            email='admin@test.com',
            first_name='Admin',
            last_name='User',
            role=UserRole.ADMIN
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
    
    # Login as admin
    response = client.post('/api/auth/login', json={
        'email': 'admin@test.com',
        'password': 'admin123'
    })
    
    if response.status_code == 200:
        data = response.get_json()
        token = data['data']['access_token']
        return {'Authorization': f'Bearer {token}'}
    return {}

@pytest.fixture
def sample_category(client):
    """Create a sample category for testing."""
    from server.models.database import Category
    
    with client.application.app_context():
        category = Category(
            name='Test Electronics',
            description='Test category for electronics'
        )
        db.session.add(category)
        db.session.commit()
        return category.id

@pytest.fixture
def sample_product(client, sample_category):
    """Create a sample product for testing."""
    from server.models.database import Product
    
    with client.application.app_context():
        product = Product(
            name='Test Smartphone',
            description='A test smartphone',
            price=599.99,
            sku='TEST-PHONE-001',
            stock_quantity=10,
            category_id=sample_category,
            brand='TestBrand',
            model='TestModel'
        )
        db.session.add(product)
        db.session.commit()
        return product.id