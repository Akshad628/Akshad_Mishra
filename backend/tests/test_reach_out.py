"""Backend tests for Wandel Reality API - root + reach-out endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://wandel-reality.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_online(self, client):
        r = client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert data == {"message": "Wandel Reality API online"}


# ---------- Reach Out ----------
class TestReachOut:
    def test_create_full_payload(self, client):
        token = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_User_{token}",
            "email": f"test_{token}@example.com",
            "phone": "+1234567890",
            "website": "https://example.com",
            "subject": "TEST_subject",
            "body": "This is a test body of a reach-out message.",
        }
        r = client.post(f"{API}/reach-out", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        # Validate echoed fields
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["phone"] == payload["phone"]
        assert data["website"] == payload["website"]
        assert data["subject"] == payload["subject"]
        assert data["body"] == payload["body"]
        # Validate generated fields
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "created_at" in data
        # Persistence check via list endpoint
        list_resp = client.get(f"{API}/reach-out")
        assert list_resp.status_code == 200
        ids = [it["id"] for it in list_resp.json()]
        assert data["id"] in ids

    def test_create_minimum_required(self, client):
        token = uuid.uuid4().hex[:8]
        payload = {
            "name": f"TEST_Min_{token}",
            "email": f"min_{token}@example.com",
            "subject": "Min subject",
            "body": "Min body content",
        }
        r = client.post(f"{API}/reach-out", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["phone"] is None
        assert data["website"] is None

    def test_missing_required_returns_422(self, client):
        # missing email, subject, body
        r = client.post(f"{API}/reach-out", json={"name": "OnlyName"})
        assert r.status_code == 422, r.text

    def test_invalid_email_returns_422(self, client):
        payload = {
            "name": "Test",
            "email": "not-an-email",
            "subject": "subj",
            "body": "body",
        }
        r = client.post(f"{API}/reach-out", json=payload)
        assert r.status_code == 422

    def test_list_returns_newest_first(self, client):
        # Create two entries quickly
        for i in range(2):
            token = uuid.uuid4().hex[:8]
            client.post(f"{API}/reach-out", json={
                "name": f"TEST_Order_{i}_{token}",
                "email": f"order_{i}_{token}@example.com",
                "subject": "order test",
                "body": "ordering check",
            })
        r = client.get(f"{API}/reach-out")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        if len(items) >= 2:
            # Ensure descending order by created_at
            ts = [it["created_at"] for it in items]
            assert ts == sorted(ts, reverse=True)
