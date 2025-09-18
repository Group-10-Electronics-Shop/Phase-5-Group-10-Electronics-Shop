import os
from typing import Optional, Dict, Any

# Prefer an existing create_app in server/app.py if present
try:
    from .app import create_app as _app_create
except Exception:
    _app_create = None

from .extensions import db, migrate


def create_app(config: Optional[Dict[str, Any]] = None):
    """
    App factory used by tests and scripts. If server/app.py defines create_app()
    delegate to it; otherwise create a minimal Flask app.
    """
    if _app_create:
        app = _app_create()
        if config:
            app.config.update(config)
        # ensure extensions are initialized (no-op if app did it)
        try:
            db.init_app(app)
            migrate.init_app(app, db)
        except Exception:
            pass
        return app

    # Minimal fallback factory
    from flask import Flask
    app = Flask(__name__, instance_relative_config=False)
    app.config.setdefault("SQLALCHEMY_DATABASE_URI", os.environ.get("DATABASE_URL", "sqlite:///:memory:"))
    app.config.setdefault("SQLALCHEMY_TRACK_MODIFICATIONS", False)

    if config:
        app.config.update(config)

    db.init_app(app)
    migrate.init_app(app, db)

    
    @app.route("/_health")
    def _health():
        return {"status": "ok"}

    return app