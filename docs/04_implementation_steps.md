# AI Implementation Tasks (Step-by-Step)

*Important Context: The `frontend/` directory has already been initialized manually with Next.js (App Router), Tailwind, and shadcn/ui. The `backend/` directory is empty with only requirements.txt and one dependency inside.*

## Phase 1: Local Infrastructure Setup
- [ ] **Task 1.1:** Create `backend/Dockerfile.dev` and `frontend/Dockerfile.dev`.
- [ ] **Task 1.2:** Create `docker-compose.dev.yml` at the root (including PostgreSQL). 

## Phase 2: Backend Development & Testing
- [ ] **Task 2.1:** Inside `backend/`, setup FastAPI boilerplate (create `requirements.txt`, `main.py`, etc.), SQLAlchemy DB connection, and Pydantic schemas.
- [ ] **Task 2.2:** Implement Hybrid JWT Auth routes (`/login`, `/refresh`, `/logout`) and write `pytest` test cases for them.
- [ ] **Task 2.3:** Implement CRUD routes for Tasks. Ensure strict adherence to the business constraints in `01_product_and_constraints.md` and write tests verifying these constraints (e.g., max depth = 1).

## Phase 3: Frontend Base & UI
- [ ] **Task 3.1:** In `frontend/`, install `axios` and `@tanstack/react-query`. Setup the `axios` instance with the 401 interceptor logic for the refresh token. Setup the React Query provider in the root layout.
- [ ] **Task 3.2:** Build Login and Register pages.
- [ ] **Task 3.3:** Build Dashboard layout, TaskForm dialog, and TaskList. Implement subtask visual indenting, category badges, and overdue red text. Wire them with React Query.

## Phase 4: End-to-End Testing
- [ ] **Task 4.1:** Setup Playwright in the root directory and write the core happy-path E2E test (Auth + Task CRUD).

## Phase 5: Deployment & CI/CD
- [ ] **Task 5.1:** Create `Dockerfile.prod` for frontend and backend.
- [ ] **Task 5.2:** Create `render.yaml` defining the web services and database.
- [ ] **Task 5.3:** Create `.github/workflows/ci.yml` and `.github/workflows/cd.yml`.