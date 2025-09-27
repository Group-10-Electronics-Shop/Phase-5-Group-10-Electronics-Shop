import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables FIRST, before creating the app
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY') or os.getenv('ENV_JWT_SECRET_KEY')
jwt = JWTManager(app)

# Configure CORS
CORS(app)

# Start time for health check
START_TIME = datetime.utcnow().isoformat() + "Z"


def create_app():
    """Application factory pattern."""
from flask_migrate import Migrate
from server.config import config
from server.models.database import db  # Ensure db instance is here
from server.models import *  # Import all models so Alembic detects them
from server.routes.auth import auth_bp
from server.routes.products import products_bp
from server.routes.categories import categories_bp
from server.routes.cart import cart_bp
from server.routes.orders import orders_bp
from server.routes.addresses import addresses_bp
from server.routes.admin import admin_bp


def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY') or os.getenv('ENV_JWT_SECRET_KEY')
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app)
    
    # Import db here to avoid circular imports
    from models import db  # Adjust this import based on your project structure
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') or os.getenv('ENV_DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Register routes
    _register_public_routes(app, jwt, db)
    
    return app


def _register_public_routes(app, jwt, db):
    """Register simple public/demo routes (health + sample products)."""
    
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "started_at": START_TIME}), 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(addresses_bp)
    app.register_blueprint(admin_bp)
    
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'success': True,
            'message': 'Welcome to the Electronics Shop API',
            'version': '1.0.0',
            'routes': {
                'health': '/api/health',
                'api_info': '/api',
                'auth': '/api/auth/*',
                'products': '/api/products/*',
                'categories': '/api/categories/*',
                'cart': '/api/cart/*',
                'orders': '/api/orders/*',
                'addresses': '/api/addresses/*',
                'admin': '/api/admin/*'
            }
        })

    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'success': True,
            'message': 'Welcome to the Electronics Shop API',
            'version': '1.0.0',
            'routes': {
                'health': '/api/health',
                'api_info': '/api',
                'auth': '/api/auth/*',
                'products': '/api/products/*',
                'categories': '/api/categories/*',
                'cart': '/api/cart/*',
                'orders': '/api/orders/*',
                'addresses': '/api/addresses/*',
                'admin': '/api/admin/*'
            }
        })

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify(success=False, message="Resource not found", error="Not Found"), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify(success=False, message="Internal server error", error="Internal Server Error"), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify(success=False, message="Bad request", error="Bad Request"), 400

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify(success=False, message="Token has expired", error="Token Expired"), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify(success=False, message="Invalid token", error="Invalid Token"), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify(success=False, message="Authorization token is required", error="Missing Token"), 401

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify(success=True, message="Electronics Shop API is running", version="1.0.0")

    # API info endpoint
    @app.route("/api", methods=["GET"])
    def api_info():
        return jsonify(success=True, data={
            "message": "Electronics Shop API",
            "version": "1.0.0",
            "endpoints": {
                "auth": "/api/auth/*",
                "products": "/api/products/*",
                "categories": "/api/categories/*",
                "cart": "/api/cart/*",
                "orders": "/api/orders/*",
                "addresses": "/api/addresses/*",
                "admin": "/api/admin/*",
            },
        })


# Entry point
if __name__ == "__main__":
    app = create_app()
    
    # Get configuration from environment
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5000))
    
    app.run(debug=debug, host=host, port=port)
