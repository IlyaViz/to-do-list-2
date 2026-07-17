def test_register_creates_user_and_sets_refresh_cookie(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "dana@example.com", "password": "Password123!"},
    )

    assert response.status_code == 201

    payload = response.json()

    assert payload["token_type"] == "bearer"
    assert payload["access_token"]

    set_cookie_header = response.headers["set-cookie"]

    assert "refresh_token=" in set_cookie_header
    assert "HttpOnly" in set_cookie_header


def test_login_returns_access_token_and_sets_refresh_cookie(client, seed_user):
    seed_user("alice@example.com", "Password123!")

    response = client.post(
        "/api/auth/login",
        json={"email": "alice@example.com", "password": "Password123!"},
    )

    assert response.status_code == 200

    payload = response.json()

    assert payload["token_type"] == "bearer"
    assert payload["access_token"]

    set_cookie_header = response.headers["set-cookie"]

    assert "refresh_token=" in set_cookie_header
    assert "HttpOnly" in set_cookie_header


def test_refresh_uses_refresh_cookie_to_issue_new_access_token(client, seed_user):
    seed_user("bob@example.com", "Password123!")

    login_response = client.post(
        "/api/auth/login",
        json={"email": "bob@example.com", "password": "Password123!"},
    )

    first_access_token = login_response.json()["access_token"]

    refresh_token = login_response.cookies.get("refresh_token")

    assert refresh_token

    client.cookies.set("refresh_token", refresh_token, path="/api/auth")

    refresh_response = client.post("/api/auth/refresh")

    assert refresh_response.status_code == 200

    second_access_token = refresh_response.json()["access_token"]

    assert second_access_token
    assert second_access_token != first_access_token


def test_logout_clears_refresh_cookie(client, seed_user):
    seed_user("carol@example.com", "Password123!")

    client.post(
        "/api/auth/login",
        json={"email": "carol@example.com", "password": "Password123!"},
    )

    response = client.post("/api/auth/logout")

    assert response.status_code == 200
    assert response.json() == {"message": "Logged out"}
    assert (
        'refresh_token=""' in response.headers["set-cookie"]
        or "refresh_token=;" in response.headers["set-cookie"]
    )


def test_register_rejects_duplicate_email(client, seed_user):
    seed_user("erin@example.com", "Password123!")

    response = client.post(
        "/api/auth/register",
        json={"email": "erin@example.com", "password": "Password123!"},
    )

    assert response.status_code == 409
    assert "detail" in response.json()


def test_register_rejects_invalid_email_format(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "invalid-email-format", "password": "Password123!"},
    )

    assert response.status_code == 422


def test_login_rejects_wrong_password(client, seed_user):
    seed_user("wrongpass@example.com", "Password123!")

    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpass@example.com", "password": "WrongPassword123!"},
    )

    assert response.status_code == 401
    assert "detail" in response.json()


def test_login_rejects_nonexistent_user(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "Password123!"},
    )

    assert response.status_code == 401
    assert "detail" in response.json()


def test_refresh_fails_without_cookie(client):
    response = client.post("/api/auth/refresh")

    assert response.status_code == 401
    assert "detail" in response.json()


def test_refresh_fails_with_invalid_cookie(client):
    client.cookies.set("refresh_token", "invalid.token.here", path="/api/auth")

    response = client.post("/api/auth/refresh")

    assert response.status_code == 401
    assert "detail" in response.json()
