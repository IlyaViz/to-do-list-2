# Infrastructure & Testing

## 1. Local Development
- Use `docker-compose.dev.yml` to orchestrate PostgreSQL, the FastAPI backend (using `Dockerfile.dev` with auto-reload), and the Next.js frontend (using `Dockerfile.dev` with HMR).

## 2. Production & Hosting
- **Render IaC:** Use `render.yaml` at the repository root to define the production infrastructure (1 PostgreSQL database, 1 FastAPI Web Service, 1 Next.js Web Service).
- **Production Images:** Use `Dockerfile.prod` for both backend and frontend to build optimized images.

## 3. CI/CD Workflows (GitHub Actions)
- **CI (`ci.yml`):** Runs on push to `main` or manually. Runs backend and general end-to-end tests using pre-configured docker compose if possible, if not create another docker compose file.
- **CD (`cd.yml`):** Triggers Render deployment hooks upon successful CI or manually.

## 4. Testing Strategy
- **Backend (`pytest`):** Developed concurrently with API features. Must use `TestClient`. Focus on coverage for the business constraints (depth limits, data isolation).
- **End-to-End (`Playwright`):** Developed after UI completion. Covers the core journey: Register -> Login -> Create Task -> Mark Done -> Delete.