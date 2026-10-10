from fastapi.testclient import TestClient

from main import app
from settings import AppSettings

client = TestClient(app)


def _preflight(origin: str):
    return client.options(
        "/api/healthcheck",
        headers={"Origin": origin, "Access-Control-Request-Method": "GET"},
    )


def test_cors_allows_frontend_origin():
    origin = AppSettings.FRONTEND_BASE_URL
    response = _preflight(origin)
    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_rejects_unknown_origin():
    response = _preflight("https://evil.example.com")
    assert "access-control-allow-origin" not in response.headers
