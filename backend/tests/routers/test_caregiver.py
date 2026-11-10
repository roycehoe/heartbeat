from fastapi.testclient import TestClient

from main import app


def test_caregiver_sign_up_route_does_not_exist() -> None:
    response = TestClient(app).post("/admin/sign-up", json={})

    assert response.status_code == 404
