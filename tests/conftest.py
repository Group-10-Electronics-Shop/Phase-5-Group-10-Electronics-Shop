import os
import pytest
from server import create_app
from server.extensions import db as _db

TEST_DB_URI = os.environ.get("TEST_DATABASE_URL", "sqlite:///:memory:")


@pytest.fixture(scope="session")
def app():
    config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": TEST_DB_URI,
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "JWT_SECRET": os.environ.get("JWT_SECRET", "test-jwt-secret"),
    }
    app = create_app(config)
    return app


@pytest.fixture(scope="session")
def _db_app(app):
    
    # Create the database and the database tables
    with app.app_context():
        _db.create_all()
        yield _db
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app, _db_app):
    return app.test_client()