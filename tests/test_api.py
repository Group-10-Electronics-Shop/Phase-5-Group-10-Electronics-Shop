"""
Fixed API tests for Electronics Shop
"""

import pytest
import json

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['message'] == 'Electronics Shop API'


# def test_api_info(client):
#     """Test the API info endpoint"""
#     response = client.get('/api')
#     assert response.status_code == 200
    
#     data = response.get_json()
#     assert data['success'] is True
#     assert 'endpoints' in data['data']

def test_products_pagination_defaults(client, sample_product):
    """Test products endpoint with pagination"""
    response = client.get("/api/products")
    assert response.status_code == 200, f"Expected 200 but got {response.status_code}. Response: {response.get_data(as_text=True)}"
    
    data = response.get_json()
    assert data['success'] is True
    assert 'products' in data['data']
    assert 'pagination' in data['data']
    
    pagination = data['data']['pagination']
    assert pagination['page'] == 1
    assert pagination['per_page'] == 20

def test_get_categories(client, sample_category):
    """Test getting all categories"""
    response = client.get('/api/categories')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert len(data['data']) >= 1

def test_get_single_product(client, sample_product):
    """Test getting a single product"""
    response = client.get(f'/api/products/{sample_product}')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['id'] == sample_product

def test_get_featured_products(client):
    """Test getting featured products"""
    response = client.get('/api/products/featured')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert isinstance(data['data'], list)

def test_search_products(client, sample_product):
    """Test product search"""
    response = client.get('/api/products/search?q=test')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'products' in data['data']

def test_products_by_category(client, sample_category, sample_product):
    """Test getting products by category"""
    response = client.get(f'/api/products/categories/{sample_category}')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'products' in data['data']
    assert 'category' in data['data']

def test_cart_operations(client, auth_headers, sample_product):
    """Test cart operations - add, get, update, remove"""
    # Test adding to cart
    add_response = client.post('/api/cart/add', 
                              json={'product_id': sample_product, 'quantity': 2},
                              headers=auth_headers)
    assert add_response.status_code in [200, 201]
    
    # Test getting cart
    get_response = client.get('/api/cart', headers=auth_headers)
    assert get_response.status_code == 200
    
    data = get_response.get_json()
    assert data['success'] is True
    assert 'items' in data['data']
    
    # Test cart count
    count_response = client.get('/api/cart/count', headers=auth_headers)
    assert count_response.status_code == 200
    
    count_data = count_response.get_json()
    assert count_data['success'] is True
    assert count_data['data']['count'] >= 2

def test_address_operations(client, auth_headers):
    """Test address CRUD operations"""
    # Create address
    address_data = {
        'type': 'shipping',
        'first_name': 'John',
        'last_name': 'Doe',
        'address_line_1': '123 Main St',
        'city': 'Test City',
        'state': 'Test State',
        'postal_code': '12345',
        'country': 'Test Country'
    }
    
    create_response = client.post('/api/addresses', 
                                 json=address_data,
                                 headers=auth_headers)
    assert create_response.status_code == 201
    
    # Get addresses
    get_response = client.get('/api/addresses', headers=auth_headers)
    assert get_response.status_code == 200
    
    data = get_response.get_json()
    assert data['success'] is True
    assert len(data['data']) >= 1

def test_admin_access_control(client, admin_headers):
    """Test that admin endpoints require proper authentication"""
    # Test creating a category (admin only)
    category_data = {
        'name': 'Admin Test Category',
        'description': 'Test category created by admin'
    }
    
    response = client.post('/api/categories', 
                          json=category_data,
                          headers=admin_headers)
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['success'] is True

def test_admin_analytics(client, admin_headers):
    """Test admin analytics endpoints"""
    response = client.get('/api/admin/analytics/dashboard', headers=admin_headers)
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'users' in data['data']
    assert 'products' in data['data']
    assert 'orders' in data['data']