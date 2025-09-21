import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager as FlaskJWTManager

load_dotenv()

START_TIME = datetime.utcnow().isoformat() + "Z"


def _register_public_routes(app):
    """Register simple public/demo routes (health + sample products)."""
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "started_at": START_TIME}), 200

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({"message": "Electronics Shop API (skeleton)"}), 200

    @app.route("/products", methods=["GET"])
    def products():
        # sample dataset (1..100)
        sample_products = [{"id": i, "name": f"Product {i}", "price": i * 10} for i in range(1, 101)]

        try:
            page = int(request.args.get("page", 1))
        except (TypeError, ValueError):
            page = 1
        try:
            per_page = int(request.args.get("per_page", 10))
        except (TypeError, ValueError):
            per_page = 10

        if page < 1:
            page = 1
        per_page = max(1, min(100, per_page))

        total = len(sample_products)
        start = (page - 1) * per_page
        end = start + per_page
        items = sample_products[start:end]
        total_pages = (total + per_page - 1) // per_page

        return jsonify({
            "items": items,
            "meta": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": total_pages
            }
        }), 200


def create_app(config=None):
    """
    Application factory. Tests should call `create_app(config)` to override settings.
    Example config keys: TESTING, DATABASE_URL, SKIP_DB_INIT, JWT_SECRET_KEY.
    """
    app = Flask(__name__)

    # defaults (can be overridden)
    app.config.setdefault('JWT_SECRET_KEY', os.getenv('JWT_SECRET_KEY', os.getenv('ENV_JWT_SECRET_KEY', 'change-me-in-prod')))
    app.config.setdefault('JWT_ACCESS_TOKEN_EXPIRES', timedelta(hours=24))
    app.config.setdefault('JWT_REFRESH_TOKEN_EXPIRES', timedelta(days=30))
    app.config.setdefault('DATABASE_URL', os.getenv('DATABASE_URL', os.getenv('ENV_DATABASE_URL', 'postgresql://username:password@localhost/electronics_shop')))
    app.config.setdefault('CORS_ORIGINS', ['http://localhost:3000', 'https://your-frontend-domain.com'])

    if config:
        app.config.update(config)

    # init extensions
    CORS(app, origins=app.config.get('CORS_ORIGINS'))
    FlaskJWTManager(app)

    # initialize DB unless tests ask to skip it
    try:
        if not app.config.get('SKIP_DB_INIT', False):
            # import here to avoid import-time DB side effects
            from server.models.database import init_db
            init_db(app.config['DATABASE_URL'])
    except Exception as e:
        # don't crash app creation if DB not reachable during tests or early dev
        app.logger.warning("Database init failed during create_app(): %s", e)

    # register auth blueprint (safe import)
    try:
        from server.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api')
    except Exception as e:
        app.logger.warning("Could not register auth blueprint: %s", e)

    # public routes for tests & demos
    _register_public_routes(app)

    @app.route('/api/health')
    def api_health():
        return {'status': 'healthy', 'message': 'Electronics Shop Auth API is running'}

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app


# module-level app so `from server.app import app` works for simple local runs.
try:
    app = create_app()
except Exception as exc:
    # fallback so imports succeed even if DB/init failed
    app = Flask(__name__)
    app.logger.warning("Fallback app created; create_app() failed: %s", exc)


if __name__ == '__main__':
    port = int(os.environ.get('ENV_PORT', os.environ.get('PORT', 5000)))
    debug = os.environ.get('ENV_DEBUG', 'False').lower() in ('1', 'true', 'yes')
    host = os.environ.get('ENV_HOST', '0.0.0.0')
    app.run(host=host, port=port, debug=debug)