import json
import pytest

REGISTER_URL = "/api/auth/register"
LOGIN_URL = "/api/auth/login"
ME_URL = "/api/users/me"


def register_user(client, name="Test User", email="test@example.com", password="password123"):
    payload = {"name": name, "email": email, "password": password}
    r = client.post(REGISTER_URL, json=payload)
    return r


def login_user(client, email="test@example.com", password="password123"):
    payload = {"email": email, "password": password}
    r = client.post(LOGIN_URL, json=payload)
    return r


def get_auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def assert_user_shape(obj):
    assert isinstance(obj, dict)
    assert "id" in obj or "email" in obj
    assert "email" in obj or "name" in obj


def test_register_login_and_get_me(client):
    r = register_user(client)
    assert r.status_code in (200, 201), f"unexpected status {r.status_code} body={r.get_data(as_text=True)}"
    data = r.get_json()
    assert isinstance(data, dict)
    assert ("token" in data) or ("user" in data)
    token = data.get("token") or (data.get("user") or {}).get("token")
    if token is None and isinstance(data.get("user"), dict):
        token = data["user"].get("token")

    if not token:
        r2 = login_user(client)
        assert r2.status_code == 200, f"login failed after register: {r2.get_data(as_text=True)}"
        token = r2.get_json().get("token")

    assert token, "token not returned by register/login"

    headers = get_auth_headers(token)
    r_me = client.get(ME_URL, headers=headers)
    assert r_me.status_code == 200, f"/api/users/me failed: {r_me.status_code} {r_me.get_data(as_text=True)}"
    me = r_me.get_json()
    assert isinstance(me, dict)
    assert "email" in me or "name" in me
    assert_user_shape(me)


def test_login_returns_token_and_invalid_credentials_are_rejected(client):
    register_user(client, email="login-test@example.com")
    r = login_user(client, email="login-test@example.com")
    assert r.status_code == 200, f"login should succeed, got {r.status_code}"
    data = r.get_json()
    assert "token" in data or ("user" in data and data["user"].get("token"))

    r_bad = login_user(client, email="login-test@example.com", password="wrongpass")
    assert r_bad.status_code in (400, 401), f"expected auth failure, got {r_bad.status_code}"


def test_protected_route_requires_auth(client):
    r = client.get(ME_URL)
    assert r.status_code in (401, 403), f"expected 401/403 for unauthenticated, got {r.status_code}"