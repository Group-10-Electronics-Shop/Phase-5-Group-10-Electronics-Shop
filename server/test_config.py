"""
Test configuration and utilities for the Electronics Shop API
"""

import unittest
import tempfile
import os
from app import create_app
from server.models import db, User, Category, Product, UserRole

class TestConfig:
    """Test configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'test-jwt-secret-key'
    SECRET_KEY = 'test-secret-key'
    WTF_CSRF_ENABLED = False

class BaseTestCase(unittest.TestCase):
    """Base test case with common setup and teardown"""
    
    def setUp(self):
        """Set up test client and database"""
        self.app = create_app('testing')
        self.app.config.from_object(TestConfig)
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        # Create all tables
        db.create_all()
        
        # Create test data
        self.create_test_data()
    
    def tearDown(self):
        """Clean up after each test"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def create_test_data(self):
        """Create basic test data"""
        # Create test users
        self.admin_user = User(
            email='admin@test.com',
            first_name='Admin',
            last_name='Test',
            role=UserRole.ADMIN
        )
        self.admin_user.set_password('admin123')
        
        self.customer_user = User(
            email='customer@test.com',
            first_name='Customer',
            last_name='Test',
            role=UserRole.CUSTOMER
        )
        self.customer_user.set_password('customer123')
        
        # Create test category
        self.test_category = Category(
            name='Test Category',
            description='Test category description'
        )
        
        # Create test product
        self.test_product = Product(
            name='Test Product',
            description='Test product description',
            price=99.99,
            sku='TEST-PRODUCT-001',
            stock_quantity=10,
            category=self.test_category
        )
        
        # Add to database
        db.session.add(self.admin_user)
        db.session.add(self.customer_user)
        db.session.add(self.test_category)
        db.session.add(self.test_product)
        db.session.commit()
    
    def get_auth_headers(self, user_email, password):
        """Get authorization headers for a user"""
        response = self.client.post('/api/auth/login', json={
            'email': user_email,
            'password': password
        })
        
        if response.status_code == 200:
            data = response.get_json()
            token = data['data']['access_token']
            return {'Authorization': f'Bearer {token}'}
        return {}
    
    def get_admin_headers(self):
        """Get admin authorization headers"""
        return self.get_auth_headers('admin@test.com', 'admin123')
    
    def get_customer_headers(self):
        """Get customer authorization headers"""
        return self.get_auth_headers('customer@test.com', 'customer123')

if __name__ == '__main__':
    # Run basic connectivity test
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        print("Test database setup successful!")
        db.drop_all()
        print("Test database cleanup successful!")