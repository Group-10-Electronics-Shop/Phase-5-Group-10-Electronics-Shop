from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Simple dummy data for electronics shop
CATEGORIES = [
    {"id": 1, "name": "Smartphones", "description": "Latest mobile devices"},
    {"id": 2, "name": "Laptops", "description": "Portable computers"},
    {"id": 3, "name": "Headphones", "description": "Audio devices"},
    {"id": 4, "name": "Tablets", "description": "Portable touchscreen devices"},
    {"id": 5, "name": "Smart Watches", "description": "Wearable technology"},
    {"id": 6, "name": "Gaming", "description": "Gaming consoles and accessories"}
]

PRODUCTS = [
    {
        "id": 1,
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone with titanium design and A17 Pro chip",
        "price": 999.99,
        "original_price": 1199.99,
        "category_id": 1,
        "category_name": "Smartphones",
        "brand": "Apple",
        "sku": "APL-IP15P-128",
        "stock_quantity": 45,
        "is_featured": True,
        "is_on_sale": True,
        "rating": 4.8,
        "review_count": 256,
        "images": [],
        "specifications": {
            "color": "Natural Titanium",
            "storage": "128GB",
            "warranty": "1 Year"
        }
    },
    {
        "id": 2,
        "name": "Samsung Galaxy S24",
        "description": "Premium Android smartphone with advanced AI features",
        "price": 899.99,
        "category_id": 1,
        "category_name": "Smartphones", 
        "brand": "Samsung",
        "sku": "SAM-GS24-256",
        "stock_quantity": 32,
        "is_featured": True,
        "is_on_sale": False,
        "rating": 4.7,
        "review_count": 189,
        "images": [],
        "specifications": {
            "color": "Phantom Black",
            "storage": "256GB",
            "warranty": "1 Year"
        }
    },
    {
        "id": 3,
        "name": "MacBook Air M2",
        "description": "Lightweight laptop with M2 chip and all-day battery",
        "price": 1299.99,
        "original_price": 1499.99,
        "category_id": 2,
        "category_name": "Laptops",
        "brand": "Apple",
        "sku": "APL-MBA-M2",
        "stock_quantity": 28,
        "is_featured": True,
        "is_on_sale": True,
        "rating": 4.9,
        "review_count": 342,
        "images": [],
        "specifications": {
            "color": "Space Gray",
            "memory": "8GB",
            "warranty": "1 Year"
        }
    },
    {
        "id": 4,
        "name": "Dell XPS 13",
        "description": "Premium ultrabook with Intel processors",
        "price": 1099.99,
        "category_id": 2,
        "category_name": "Laptops",
        "brand": "Dell",
        "sku": "DEL-XPS13",
        "stock_quantity": 15,
        "is_featured": False,
        "is_on_sale": False,
        "rating": 4.5,
        "review_count": 95,
        "images": [],
        "specifications": {
            "color": "Silver",
            "memory": "16GB",
            "warranty": "1 Year"
        }
    },
    {
        "id": 5,
        "name": "Sony WH-1000XM5",
        "description": "Industry-leading noise cancellation headphones",
        "price": 349.99,
        "category_id": 3,
        "category_name": "Headphones",
        "brand": "Sony",
        "sku": "SNY-WH1000XM5",
        "stock_quantity": 67,
        "is_featured": True,
        "is_on_sale": False,
        "rating": 4.6,
        "review_count": 128,
        "images": [],
        "specifications": {
            "color": "Black",
            "type": "Over-ear Wireless",
            "warranty": "1 Year"
        }
    },
    {
        "id": 6,
        "name": "AirPods Pro 2nd Gen",
        "description": "Advanced noise cancellation with spatial audio",
        "price": 249.99,
        "original_price": 279.99,
        "category_id": 3,
        "category_name": "Headphones",
        "brand": "Apple",
        "sku": "APL-APP2",
        "stock_quantity": 89,
        "is_featured": False,
        "is_on_sale": True,
        "rating": 4.7,
        "review_count": 445,
        "images": [],
        "specifications": {
            "color": "White",
            "type": "In-ear True Wireless",
            "warranty": "1 Year"
        }
    },
    {
        "id": 7,
        "name": "iPad Pro 12.9",
        "description": "Powerful tablet with M2 chip for creative work",
        "price": 1099.99,
        "category_id": 4,
        "category_name": "Tablets",
        "brand": "Apple",
        "sku": "APL-IPP129",
        "stock_quantity": 23,
        "is_featured": True,
        "is_on_sale": False,
        "rating": 4.8,
        "review_count": 167,
        "images": [],
        "specifications": {
            "color": "Space Gray",
            "storage": "256GB",
            "warranty": "1 Year"
        }
    },
    {
        "id": 8,
        "name": "Apple Watch Ultra",
        "description": "Most rugged Apple Watch for extreme sports",
        "price": 799.99,
        "category_id": 5,
        "category_name": "Smart Watches",
        "brand": "Apple",
        "sku": "APL-AWU",
        "stock_quantity": 41,
        "is_featured": True,
        "is_on_sale": False,
        "rating": 4.6,
        "review_count": 203,
        "images": [],
        "specifications": {
            "color": "Titanium",
            "size": "49mm",
            "warranty": "1 Year"
        }
    },
    {
        "id": 9,
        "name": "PlayStation 5",
        "description": "Next-gen gaming console with ray tracing",
        "price": 499.99,
        "category_id": 6,
        "category_name": "Gaming",
        "brand": "Sony",
        "sku": "SNY-PS5",
        "stock_quantity": 12,
        "is_featured": True,
        "is_on_sale": False,
        "rating": 4.8,
        "review_count": 892,
        "images": [],
        "specifications": {
            "color": "White",
            "storage": "825GB SSD",
            "warranty": "1 Year"
        }
    },
    {
        "id": 10,
        "name": "Xbox Series X",
        "description": "Powerful gaming console with 4K gaming",
        "price": 499.99,
        "category_id": 6,
        "category_name": "Gaming",
        "brand": "Microsoft",
        "sku": "MS-XSX",
        "stock_quantity": 8,
        "is_featured": False,
        "is_on_sale": False,
        "rating": 4.7,
        "review_count": 654,
        "images": [],
        "specifications": {
            "color": "Black",
            "storage": "1TB SSD",
            "warranty": "1 Year"
        }
    }
]

USERS = [
    {
        "id": 1,
        "email": "john.doe@email.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+1234567890",
        "address": {
            "street": "123 Main St",
            "city": "San Francisco",
            "state": "CA",
            "zip_code": "94105",
            "country": "USA"
        },
        "created_at": "2024-01-15T00:00:00"
    }
]

ORDERS = [
    {
        "id": 1,
        "user_id": 1,
        "order_number": "ORD000001",
        "status": "delivered",
        "items": [
            {
                "product_id": 1,
                "product_name": "iPhone 15 Pro",
                "quantity": 1,
                "price": 999.99,
                "total": 999.99
            }
        ],
        "subtotal": 999.99,
        "tax": 80.00,
        "shipping": 0.00,
        "total": 1079.99,
        "created_at": "2024-09-01T00:00:00"
    }
]

REVIEWS = [
    {
        "id": 1,
        "user_id": 1,
        "product_id": 1,
        "rating": 5,
        "title": "Excellent phone!",
        "comment": "Love the new titanium design and camera quality is amazing.",
        "verified_purchase": True,
        "helpful_count": 12,
        "created_at": "2024-09-05T00:00:00"
    },
    {
        "id": 2,
        "user_id": 1,
        "product_id": 3,
        "rating": 5,
        "title": "Perfect laptop for work",
        "comment": "Fast, quiet, and excellent battery life. Highly recommended!",
        "verified_purchase": True,
        "helpful_count": 8,
        "created_at": "2024-09-03T00:00:00"
    }
]

# Routes
@app.route('/')
def home():
    return jsonify({
        "message": "Electronics Shop API - Ready for Production!",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "GET /api/products - Get all products",
            "GET /api/products/<id> - Get single product",
            "GET /api/categories - Get all categories",
            "GET /api/orders - Get all orders",
            "GET /api/users - Get all users",
            "GET /api/reviews/<product_id> - Get product reviews",
            "GET /api/search?q=<query> - Search products",
            "POST /api/orders - Create new order",
            "POST /api/reviews - Create new review"
        ]
    })

@app.route('/api/products')
def get_products():
    # Get query parameters
    category = request.args.get('category')
    featured = request.args.get('featured')
    on_sale = request.args.get('on_sale')
    search = request.args.get('search')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 12))
    
    # Filter products
    filtered_products = PRODUCTS.copy()
    
    if category:
        filtered_products = [p for p in filtered_products if p['category_name'].lower() == category.lower()]
    
    if featured == 'true':
        filtered_products = [p for p in filtered_products if p['is_featured']]
    
    if on_sale == 'true':
        filtered_products = [p for p in filtered_products if p['is_on_sale']]
    
    if search:
        search_lower = search.lower()
        filtered_products = [
            p for p in filtered_products 
            if search_lower in p['name'].lower() 
            or search_lower in p['description'].lower()
            or search_lower in p['brand'].lower()
        ]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_products = filtered_products[start:end]
    
    return jsonify({
        "products": paginated_products,
        "total": len(filtered_products),
        "page": page,
        "limit": limit,
        "total_pages": (len(filtered_products) + limit - 1) // limit
    })

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    product = next((p for p in PRODUCTS if p['id'] == product_id), None)
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

@app.route('/api/categories')
def get_categories():
    return jsonify(CATEGORIES)

@app.route('/api/orders')
def get_orders():
    user_id = request.args.get('user_id')
    if user_id:
        user_orders = [o for o in ORDERS if o['user_id'] == int(user_id)]
        return jsonify(user_orders)
    return jsonify(ORDERS)

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        order_data = request.get_json()
        
        # Generate new order
        new_id = len(ORDERS) + 1
        new_order = {
            "id": new_id,
            "user_id": order_data.get('user_id', 1),
            "order_number": f"ORD{str(new_id).zfill(6)}",
            "status": "pending",
            "items": order_data.get('items', []),
            "subtotal": order_data.get('subtotal', 0),
            "tax": order_data.get('tax', 0),
            "shipping": order_data.get('shipping', 0),
            "total": order_data.get('total', 0),
            "shipping_address": order_data.get('shipping_address', {}),
            "payment_method": order_data.get('payment_method', 'credit_card'),
            "created_at": datetime.now().isoformat()
        }
        
        ORDERS.append(new_order)
        return jsonify(new_order), 201
    
    except Exception as e:
        return jsonify({'error': 'Failed to create order', 'message': str(e)}), 400

@app.route('/api/users')
def get_users():
    return jsonify(USERS)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = next((u for u in USERS if u['id'] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/reviews/<int:product_id>')
def get_product_reviews(product_id):
    product_reviews = [r for r in REVIEWS if r['product_id'] == product_id]
    return jsonify(product_reviews)

@app.route('/api/reviews', methods=['POST'])
def create_review():
    try:
        review_data = request.get_json()
        
        new_id = len(REVIEWS) + 1
        new_review = {
            "id": new_id,
            "user_id": review_data.get('user_id', 1),
            "product_id": review_data.get('product_id'),
            "rating": review_data.get('rating', 5),
            "title": review_data.get('title', ''),
            "comment": review_data.get('comment', ''),
            "verified_purchase": True,
            "helpful_count": 0,
            "created_at": datetime.now().isoformat()
        }
        
        REVIEWS.append(new_review)
        return jsonify(new_review), 201
    
    except Exception as e:
        return jsonify({'error': 'Failed to create review', 'message': str(e)}), 400

@app.route('/api/search')
def search_products():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    results = [
        p for p in PRODUCTS 
        if query in p['name'].lower() 
        or query in p['description'].lower()
        or query in p['brand'].lower()
    ]
    return jsonify(results)

@app.route('/api/featured')
def get_featured_products():
    featured_products = [p for p in PRODUCTS if p['is_featured']]
    return jsonify(featured_products)

@app.route('/api/deals')
def get_sale_products():
    sale_products = [p for p in PRODUCTS if p['is_on_sale']]
    return jsonify(sale_products)

@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "products_count": len(PRODUCTS),
        "categories_count": len(CATEGORIES)
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

if __name__ == '__main__':
    # Use PORT environment variable for deployment
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)