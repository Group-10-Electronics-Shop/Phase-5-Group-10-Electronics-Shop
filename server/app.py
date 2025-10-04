import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from server.config import config
from server.models.database import db
from server.models import *  # keep this so Alembic sees models
from server.routes.auth import auth_bp
# from server.routes.auth_refresh import refresh_bp   # <-- uncomment if you add this file
from server.routes.products import products_bp
from server.routes.categories import categories_bp
from server.routes.cart import cart_bp
from server.routes.orders import orders_bp
from server.routes.addresses import addresses_bp
from server.routes.admin import admin_bp


def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)

    # Load configuration (from server/config.py)
    config_name = config_name or os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config[config_name])

    # JWT config from environment (ensure these are ints/seconds)
    # Defaults match your desired demo defaults (8 hours access, 30 days refresh)
    access_secs = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", str(8 * 3600)))
    refresh_secs = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", str(30 * 24 * 3600)))
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", app.config.get("JWT_SECRET_KEY", "change-me"))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=access_secs)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(seconds=refresh_secs)

    # Prevent 308 redirects for missing trailing slashes
    app.url_map.strict_slashes = False

    # Initialize extensions (DB, JWT, Migrate)
    db.init_app(app)
    jwt = JWTManager(app)   # NOTE: JWTManager after config
    migrate = Migrate(app, db)

    # CORS configuration (read origins from env for flexibility)
    origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]
    CORS(app, resources={
        r"/api/*": {
            "origins": origins,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Authorization", "Content-Type", "X-Requested-With"]
        }
    })

    # Register blueprints (url_prefix keeps routes organized)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    # If you create server/routes/auth_refresh.py, register it here:
    # app.register_blueprint(refresh_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(addresses_bp, url_prefix="/api/addresses")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Root endpoint
    @app.route("/", methods=["GET"])
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

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify(
            success=True,
            message="Electronics Shop API is running",
            version="1.0.0"
        )

    # API info
    @app.route("/api", methods=["GET"])
    def api_info():
        return jsonify(
            success=True,
            data={
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
            }
        )

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify(success=False, message="Resource not found", error="Not Found"), 404

    @app.errorhandler(500)
    def internal_error(error):
        # rollback & remove session
        try:
            db.session.rollback()
        except Exception:
            app.logger.exception("Error rolling back DB session during 500 handler")
        finally:
            db.session.remove()
        return jsonify(success=False, message="Internal server error", error="Internal Server Error"), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify(success=False, message="Bad request", error="Bad Request"), 400

    # JWT error handlers with logging
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        app.logger.warning("JWT expired: payload=%s", jwt_payload)
        return jsonify(success=False, message="Token has expired", error="Token Expired"), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        app.logger.warning("Invalid JWT: %s", error)
        return jsonify(success=False, message="Invalid token", error="Invalid Token"), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        app.logger.warning("Missing JWT: %s", error)
        return jsonify(success=False, message="Authorization token is required", error="Missing Token"), 401

    # Ensure DB sessions removed after each request/context
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        try:
            db.session.remove()
        except Exception:
            app.logger.exception("Exception removing DB session on teardown")

    return app


# Entry point for direct run (dev only)
app = create_app()

if __name__ == "__main__":
    # dev server; for production use gunicorn/uwsgi
    app.run(debug=True)