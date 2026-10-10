import pytest

from exceptions import ClerkAuthenticationFailedException
from utils import token


class FakeResponse:
    def __init__(self, kids):
        self._kids = kids

    def raise_for_status(self):
        pass

    def json(self):
        return {"keys": [{"kid": kid} for kid in self._kids]}


@pytest.fixture
def jwks_responses(monkeypatch):
    responses = []
    calls = []

    def fake_get(*args, **kwargs):
        calls.append(1)
        return responses.pop(0)

    monkeypatch.setattr(token, "_jwks_cache", None)
    monkeypatch.setattr(token.requests, "get", fake_get)
    return responses, calls


def test_find_jwk_refetches_when_kid_rotated(jwks_responses):
    responses, calls = jwks_responses
    responses += [FakeResponse(["old"]), FakeResponse(["new"])]

    assert token._find_jwk("old") == {"kid": "old"}
    assert token._find_jwk("new") == {"kid": "new"}
    assert len(calls) == 2


def test_find_jwk_raises_auth_failure_for_unknown_kid(jwks_responses):
    responses, calls = jwks_responses
    responses += [FakeResponse(["a"]), FakeResponse(["a"])]

    with pytest.raises(ClerkAuthenticationFailedException):
        token._find_jwk("missing")
    assert len(calls) == 2


def test_malformed_token_raises_auth_failure():
    with pytest.raises(ClerkAuthenticationFailedException):
        token.get_clerk_id_from_verified_clerk_token("not-a-jwt")
