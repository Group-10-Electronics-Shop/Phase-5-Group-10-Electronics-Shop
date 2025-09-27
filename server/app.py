import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
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
    config_name = config_name or os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    Migrate(app, db)

    # CORS configuration
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(addresses_bp, url_prefix="/api/addresses")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

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

    return app


# Entry point
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
