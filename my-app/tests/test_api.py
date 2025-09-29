import pytest
from server.app import app

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as c:
        yield c

def test_health(client):
    rv = client.get("/health")
    assert rv.status_code == 200
    assert rv.get_json().get("status") == "ok"

def test_products_pagination_defaults(client):
    rv = client.get("/products")
    assert rv.status_code == 200
    data = rv.get_json()
    assert "items" in data and "meta" in data
    assert data["meta"]["page"] == 1
    assert data["meta"]["per_page"] == 10