# Product Requirements & Constraints

## 1. Goal
Build a functional, polished To-Do application using FastAPI and Next.js. The focus is on clean code, testing, and modern UI/UX to demonstrate a mature engineering approach.

## 2. Core Features
- **User Authentication:** Hybrid JWT approach.
- **Task Management:** CRUD for Tasks.
- **Bonus Product Features:**
  - `due_date`: Tasks can have deadlines. Visually highlight overdue tasks in red.
  - `category`: Custom string input for categories. Rendered as a UI Badge.
  - `parent_id` (Subtasks): Tasks can have nested child tasks.
- **Search & Filter:** Search by title, filter by status (All/Done/Undone), sort by priority.

## 3. Business Logic Constraints (CRITICAL)
The API and Frontend MUST enforce these rules:
- **Subtasks Depth:** Maximum depth is 1. A task with a `parent_id` CANNOT have its own child tasks. API must return 400 Bad Request.
- **Priority Bounds:** Must be strictly an integer between 1 and 10.
- **Data Isolation:** A user can ONLY fetch, edit, or delete their own tasks. API must return 404 or 403 for unauthorized access attempts to other users' tasks.
- **Title/Category/Eth Validation:** Task title/category/eth title cannot be empty and has a maximum length of 50 characters.

## 4. UI/UX Rules
- Strictly use `shadcn/ui` and Tailwind CSS for all interactive elements. Do not write custom CSS unless unavoidable.
- Use Toast notifications for all success/error API responses.
- Always provide Empty States for lists and search results.