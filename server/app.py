import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from config import config
from models.database import db
from models import *

from routes.auth import auth_bp
from routes.products import products_bp
from routes.categories import categories_bp
from routes.cart import cart_bp
from routes.orders import orders_bp
from routes.addresses import addresses_bp
from routes.admin import admin_bp


def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)

    # Load configuration
    config_name = config_name or os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config[config_name])

    # JWT configuration
    access_secs = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", str(8 * 3600)))
    refresh_secs = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES", str(30 * 24 * 3600)))

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY", app.config.get("JWT_SECRET_KEY", "change-me")
    )
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=access_secs)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(seconds=refresh_secs)

    # Prevent 308 redirects
    app.url_map.strict_slashes = False

    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)

    # ✅ FIXED CORS: Added 5174 origin and clarified defaults
    origins_env = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,https://shopatelec.netlify.app/,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:3000"
    )
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": origins,
                "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                "allow_headers": [
                    "Authorization",
                    "Content-Type",
                    "X-Requested-With",
                ],
                "expose_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
            }
        },
    )

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(categories_bp, url_prefix="/api/categories")
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(addresses_bp, url_prefix="/api/addresses")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    # Root endpoint
    @app.route("/", methods=["GET"])
    def index():
        return jsonify(
            {
                "success": True,
                "message": "Electronics Shop API",  
                "version": "1.0.0",
                "endpoints": {
                    "products": "/api/products",
                    "auth": "/api/auth/login",
                    "cart": "/api/cart"
                }
            }
        )

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify(success=True, message="API running", version="1.0.0")

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify(success=False, message="Resource not found"), 404

    @app.errorhandler(500)
    def internal_error(error):
        try:
            db.session.rollback()
        except Exception:
            pass
        finally:
            db.session.remove()
        return jsonify(success=False, message="Internal server error"), 500

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify(success=False, message="Token has expired"), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify(success=False, message="Invalid token"), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify(success=False, message="Authorization token required"), 401

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        try:
            db.session.remove()
        except Exception:
            pass

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
