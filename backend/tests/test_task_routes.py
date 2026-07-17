def test_create_and_get_tasks(client, auth_headers):
    response = client.post(
        "/api/tasks",
        json={"title": "Buy groceries", "priority": 5, "category": "Home"},
        headers=auth_headers,
    )

    assert response.status_code == 201

    task_id = response.json()["id"]

    get_resp = client.get("/api/tasks", headers=auth_headers)

    assert len(get_resp.json()) == 1
    assert get_resp.json()[0]["id"] == task_id


def test_data_isolation_cannot_access_others_task(client, auth_headers, hacker_headers):
    response = client.post(
        "/api/tasks",
        json={"title": "Secret project", "priority": 10},
        headers=auth_headers,
    )

    task_id = response.json()["id"]

    patch_resp = client.patch(
        f"/api/tasks/{task_id}", json={"title": "Hacked"}, headers=hacker_headers
    )

    assert patch_resp.status_code == 404

    delete_resp = client.delete(f"/api/tasks/{task_id}", headers=hacker_headers)

    assert delete_resp.status_code == 404


def test_max_depth_constraint(client, auth_headers):
    parent = client.post(
        "/api/tasks", json={"title": "Parent", "priority": 5}, headers=auth_headers
    )

    parent_id = parent.json()["id"]

    child = client.post(
        "/api/tasks",
        json={"title": "Child", "priority": 5, "parent_id": parent_id},
        headers=auth_headers,
    )

    assert child.status_code == 201

    child_id = child.json()["id"]

    grandchild = client.post(
        "/api/tasks",
        json={"title": "Grandchild", "priority": 5, "parent_id": child_id},
        headers=auth_headers,
    )

    assert grandchild.status_code == 400
    assert "Maximum subtask depth is 1" in grandchild.json()["detail"]
