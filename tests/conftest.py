import os
import pytest
from server import create_app
from server.models.database import reset_database 


TEST_DB_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/test_db")

@pytest.fixture(scope="session")
def app():
    # ensure env is correct for create_app()
    os.environ["DATABASE_URL"] = TEST_DB_URI
    os.environ["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "test-secret")

    # create app (this will call init_db inside create_app)
    app = create_app()

    reset_database()

    yield app

@pytest.fixture
def client(app):
    app.testing = True
    return app.test_client()