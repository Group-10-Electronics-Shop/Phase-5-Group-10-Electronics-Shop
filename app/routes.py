from flask import Blueprint, jsonify, request

api_bp = Blueprint('api', __name__)

# In-memory "database"
products = [
    {"id": 1, "name": "Laptop"},
    {"id": 2, "name": "Mouse"}
]

@api_bp.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

@api_bp.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    new_product = {"id": len(products)+1, **data}
    products.append(new_product)
    return jsonify(new_product), 201
