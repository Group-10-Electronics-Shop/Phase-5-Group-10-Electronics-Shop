# Group-10 — Electronics Shop (Phase 5)

### Quick guide to run and test the project locally.


## Links

- Figma design:  https://www.figma.com/design/Khl6IEmFTKUbFyvvOl7dDC/Group-10-Electronics-Shop?node-id=1-5190&t=eP6KcctTX9pCeFlZ-1

- Repo: https://github.com/Group-10-Electronics-Shop/Phase-5-Group-10-Electronics-Shop


## Backend (Flask) — quickstart

### 1. Enter the server folder and create a venv:

- cd server
- python -m venv .venv
- source .venv/bin/activate
- pip install -r requirements.txt

### 2. Start the API (development):

- python app.py

### 3. Health check:

- curl http://127.0.0.1:5000/health

### 4. Example paginated products:

- GET http://127.0.0.1:5000/products?page=1&per_page=10

## Smoke test (local)

From the repo root:

- export BACKEND_URL="http://127.0.0.1:5000"

- export FRONTEND_URL="http://example.com" 

- bash scripts/smoke_test.sh

Expect **Smoke tests passed** if backend is reachable.

## Tests

Run backend tests:

- cd server
- source .venv/bin/activate
- pytest -q

## CI / CD

- PR checks: **.github/workflows/ci.yml** runs frontend-check and backend-check. backend-check will run pytest if tests exist.

- Deploy workflow: **.github/workflows/deploy.yml** runs DB migrations (if DATABASE_URL) and runs smoke tests (requires BACKEND_URL & FRONTEND_URL secrets).

### Local troubleshooting

- If smoke tests fail: ensure backend is running and BACKEND_URL is exported in the same terminal.

- If you accidentally committed a virtualenv or logs, we have .gitignore to prevent that. If any tracked artifacts remain ask me and I’ll give removal commands.





