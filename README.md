# Full-Stack To-Do Application

A production-ready To-Do list application built for the Automaze technical task. The project focuses on a clean UI, robust business logic, and secure authentication.

## 🛠 Tech Stack

*   **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui
*   **Backend:** Python, FastAPI, SQLAlchemy, Alembic
*   **Database:** PostgreSQL
*   **Infrastructure:** Docker, Docker Compose, Render (IaC via `render.yaml`)
*   **Testing:** Pytest (Backend), Playwright (E2E)

## ✨ Core Features

*   **Secure Authentication:** Hybrid JWT approach (access token in memory, refresh token in HTTP-only secure cookie).
*   **Task Management:** Full CRUD operations with categories, due dates, and priority levels (1-10).
*   **Subtasks:** Nested tasks support (strictly limited to 1 level deep by business logic).
*   **Filters & Sorting:** Client-side filtering by status/category and sorting by priority.

## 🚀 Local Development (Docker)

The easiest way to run the application locally is using Docker Compose.

**1. Clone the repository and navigate to the project root:**
```bash
git clone https://github.com/IlyaViz/to-do-list-2
cd to-do-list-2
```

**2. Setup environment variables:**
Copy the example environment file:
```bash
cp .env.example .env
```

**3. Start the application:**
```bash
docker compose -f docker-compose.dev.yml up --build --watch -V
```

Once the containers are running, you can access:
*   **Frontend:** http://localhost:3000
*   **Backend:** http://localhost:8000

## 🧪 Testing

The project includes both backend unit tests and frontend End-to-End tests.

To run the backend or e2e tests:
```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit <backend-tests/e2e-tests> <backend-tests/e2e-tests>
```

So, for example, to run the backend tests:
```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit backend-tests backend-tests
```