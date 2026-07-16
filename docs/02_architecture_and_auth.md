# Architecture & Auth Flow

## 1. Tech Stack
- **Backend:** Python FastAPI, PostgreSQL (mapped with SQLAlchemy using alembic).
- **Frontend:** Next.js (App Router). 
  - **Next.js Best Practices:** Demonstrate proper use of the App Router by strictly separating Server and Client components. Use Server Components for `layout.tsx` and static shell pages. Extract interactive UI elements (Task Lists, Forms, Filters) into Client Components (`"use client"`). 
  - Use React Query for data fetching and optimistic updates inside Client Components.

## 2. Authentication Flow (Hybrid JWT)
- **Backend (`/auth/login`):** Validates credentials, returns a short-lived `access_token` in the JSON response, and sets a long-lived `refresh_token` in an **HTTP-only, Secure cookie**.
- **Backend (`/auth/refresh`):** Reads the HTTP-only cookie and issues a new `access_token`.
- **Backend (`/auth/logout`):** Clears the HTTP-only cookie.
- **Frontend:** Stores the `access_token` in memory (or localStorage). Uses an Axios interceptor: on initial load or if a request fails with 401 Unauthorized, it silently calls `/auth/refresh`, updates the token, and retries the original request.

## 3. Database Schema
**Table `users`:**
- `id` (UUID, PK), `email` (String, Unique), `hashed_password` (String)

**Table `tasks`:**
- `id` (UUID, PK) 
- `user_id` (UUID, FK to users)
- `title` (String, max 255)
- `is_done` (Boolean, default False)
- `priority` (Integer, 1-10)
- `category` (String, nullable)
- `due_date` (DateTime, nullable)
- `parent_id` (UUID, FK to tasks.id, nullable)