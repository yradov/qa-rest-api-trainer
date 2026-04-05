# REST API Learning Tool for QA

An educational REST API server built for QA engineers to practice HTTP methods, understand status codes, and learn RESTful conventions — all with detailed in-response explanations in **English**, **Ukrainian**, and **Russian**.

---

## Features

| Feature | Details |
|---|---|
| **Collections** | `users` and `books`, 5 hardcoded items each |
| **Full CRUD** | GET, POST, PUT, PATCH, DELETE on every collection |
| **Educational `info` field** | Every response includes a trilingual explanation of the method, status code, and testing tips |
| **Web UI** | Live tables, inline CRUD forms, request log with expandable responses |
| **Reset endpoint** | `POST /api/reset` — restores all data to its initial state |
| **Swagger UI** | Auto-generated docs at `/docs` |
| **Docker** | One command to run everything |

---

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) and Docker Compose installed.

### Run

```bash
git clone <repo-url>
cd REST_API
docker-compose up --build
```

Open **http://localhost:8000** in your browser.

- Web UI:     http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc:      http://localhost:8000/redoc

To stop:
```bash
docker-compose down
```

---

## Project Structure

```
REST_API/
├── app/
│   ├── main.py              # FastAPI app, exception handlers, reset endpoint, web UI route
│   ├── store.py             # In-memory storage + reset logic (thread-safe)
│   ├── info.py              # Educational info texts (EN / UK / RU) for every operation
│   ├── routes/
│   │   ├── users.py         # CRUD routes + Pydantic schemas for users
│   │   └── books.py         # CRUD routes + Pydantic schemas for books
│   ├── templates/
│   │   └── index.html       # Web UI (Jinja2 + Vanilla JS)
│   └── static/
│       ├── style.css        # Dark-theme stylesheet
│       └── app.js           # Frontend logic (fetch, render, log)
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## API Reference

### Users

| Method | Endpoint | Body | Success |
|--------|----------|------|---------|
| GET | `/api/users` | — | 200 + array |
| GET | `/api/users/{id}` | — | 200 + object |
| POST | `/api/users` | `UserCreate` JSON | 201 + created object |
| PUT | `/api/users/{id}` | `UserCreate` JSON | 200 + updated object |
| PATCH | `/api/users/{id}` | `UserPatch` JSON (partial) | 200 + updated object |
| DELETE | `/api/users/{id}` | — | 200 + `{id, deleted: true}` |

**UserCreate schema:**
```json
{
  "name":  "Alice",
  "email": "alice@example.com",
  "age":   28,
  "role":  "user"
}
```
> `role` must be one of: `user`, `moderator`, `admin`. Default: `user`.

### Books

| Method | Endpoint | Body | Success |
|--------|----------|------|---------|
| GET | `/api/books` | — | 200 + array |
| GET | `/api/books/{id}` | — | 200 + object |
| POST | `/api/books` | `BookCreate` JSON | 201 + created object |
| PUT | `/api/books/{id}` | `BookCreate` JSON | 200 + updated object |
| PATCH | `/api/books/{id}` | `BookPatch` JSON (partial) | 200 + updated object |
| DELETE | `/api/books/{id}` | — | 200 + `{id, deleted: true}` |

**BookCreate schema:**
```json
{
  "title":  "Clean Code",
  "author": "Robert C. Martin",
  "year":   2008,
  "genre":  "Programming"
}
```

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reset` | Restore all collections to initial 5-item state |

---

## Response Format

Every response — success or error — follows the same envelope:

```json
{
  "http_status": 201,
  "method":      "POST",
  "endpoint":    "/api/users",
  "data":        { "id": 6, "name": "Alice", "email": "alice@example.com", "age": 28, "role": "user" },
  "info":        "**Method: POST  |  Status: 201 Created** ..."
}
```

The `info` field is the core learning feature — it explains:
- What the HTTP method does and its properties (safe, idempotent)
- What the status code means
- What the `data` field contains
- Testing tips for this specific scenario

The language of `info` is controlled by the `?lang=` query parameter (`en` / `uk` / `ru`, default `en`).
The Web UI sets this automatically based on the selected language button.

---

## Status Codes Used

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | PATCH with empty body |
| 404 | Not Found | Resource with given ID doesn't exist |
| 422 | Unprocessable Entity | Request body fails field validation |

---

## Example curl Commands

```bash
# Get all users
curl http://localhost:8000/api/users

# Get user by ID
curl http://localhost:8000/api/users/1

# Create a user
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","age":28,"role":"user"}'

# Full replace (PUT)
curl -X PUT http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated","email":"john@test.com","age":31,"role":"admin"}'

# Partial update (PATCH)
curl -X PATCH http://localhost:8000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"age":32}'

# Delete
curl -X DELETE http://localhost:8000/api/users/1

# Reset all data
curl -X POST http://localhost:8000/api/reset

# Trigger a 404
curl http://localhost:8000/api/users/999

# Trigger a 422 (missing required field)
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"NoEmail"}'
```

---

## Learning Exercises

1. **GET basics** — Fetch all users. Note the array structure and count in the `info` field.
2. **GET by ID** — Fetch user #3. Then try #999 — observe the 404 and its explanation.
3. **POST** — Create a new user. Note the assigned `id`. Verify with GET.
4. **PUT** — Fully replace user #2. Try omitting one field — see what happens.
5. **PATCH** — Change only the `age` of user #1. Confirm other fields are unchanged.
6. **DELETE** — Delete user #4. Then GET #4 — you should receive a 404.
7. **Idempotency** — Call the same PUT twice. Are the responses identical?
8. **422** — Send a POST with `"age": "thirty"`. Read the `errors` array in the response.
9. **Empty PATCH** — Send `PATCH /api/users/1` with body `{}`. Observe 400.
10. **Reset** — After modifying data, call `POST /api/reset` and verify initial state is restored.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| API server | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12) |
| Data validation | [Pydantic v2](https://docs.pydantic.dev/) |
| Web server | [Uvicorn](https://www.uvicorn.org/) |
| Templates | [Jinja2](https://jinja.palletsprojects.com/) |
| Frontend | Vanilla JS (no framework) |
| Storage | In-memory Python dict (resets on container restart) |
| Container | Docker + Docker Compose |

---

## Glossary

### Core Concepts

**API (Application Programming Interface)**
A contract that defines how two systems communicate. A REST API exposes a set of URLs (endpoints) that clients call to read or modify data on the server.

**REST (Representational State Transfer)**
An architectural style for APIs. Key rules: resources are identified by URLs, the HTTP method describes the action, the server is stateless (each request carries all necessary information), and responses represent the current state of the resource.

**Resource**
A named piece of data the API manages — e.g., a single user or a book. Identified by its URL: `/api/users/3` is the user with id=3.

**Collection**
A group of resources of the same type. `/api/users` is the collection of all users. A collection is represented as a JSON array in GET responses.

**Endpoint**
A specific URL + method combination that the API handles: `GET /api/users/1` and `DELETE /api/users/1` are two different endpoints on the same URL.

**CRUD**
The four fundamental data operations: **C**reate → POST, **R**ead → GET, **U**pdate → PUT / PATCH, **D**elete → DELETE.

---

### HTTP Methods

**GET**
Reads a resource or a collection. Does not modify anything. Safe and idempotent — calling it any number of times has no side effects and always returns the same result (assuming no concurrent writes).

**POST**
Creates a new resource. The server assigns the ID. **Not idempotent** — calling it twice creates two separate resources.

**PUT**
Fully replaces an existing resource. You must send all fields. **Idempotent** — sending the same body twice results in the same final state.

**PATCH**
Partially updates a resource — only the fields you include are changed. More efficient than PUT when only one field needs to change. Idempotency depends on the specific operation.

**DELETE**
Removes a resource. **Idempotent** — deleting an already-deleted resource returns 404, not a server error, which is expected and correct behaviour.

---

### Key Properties

**Safe**
A method is *safe* if it does not modify server state. Only GET is safe. Safe methods can be called freely without worrying about unintended side effects.

**Idempotent**
A method is *idempotent* if calling it N times produces the same result as calling it once. GET, PUT, DELETE are idempotent. POST is not.

| Method | Safe | Idempotent |
|--------|------|------------|
| GET    | ✓    | ✓          |
| POST   | ✗    | ✗          |
| PUT    | ✗    | ✓          |
| PATCH  | ✗    | maybe      |
| DELETE | ✗    | ✓          |

---

### HTTP Request Structure

**Request line** — `METHOD /path HTTP/1.1`

**Headers** — metadata about the request:
- `Content-Type: application/json` — tells the server the body is JSON (required for POST/PUT/PATCH)
- `Accept: application/json` — tells the server the client wants JSON back

**Body (payload)** — the data sent with POST / PUT / PATCH requests, formatted as JSON.

**Query parameters** — extra options appended to the URL after `?`:
- `GET /api/users?lang=uk` — the `lang=uk` part is a query parameter
- Multiple params are joined with `&`: `?lang=uk&page=2`

**Path parameters** — variable segments in the URL path:
- `/api/users/{id}` — `{id}` is a path parameter, e.g. `/api/users/3` means id=3

---

### HTTP Response Structure

**Status line** — `HTTP/1.1 200 OK` — the first thing the server sends back.

**Status code** — a 3-digit number indicating the outcome:
- `1xx` — Informational (rarely seen in REST)
- `2xx` — **Success** (200 OK, 201 Created, 204 No Content)
- `3xx` — Redirection (not used here)
- `4xx` — **Client error** — the request is wrong (400, 404, 422)
- `5xx` — **Server error** — the server failed on a valid request

**Response body** — the JSON data returned. In this API, always structured as:
```
{ http_status, method, endpoint, data, info }
```

**`data`** — the actual resource(s). An object for single-item responses, an array for collection responses, `null` for 404.

**`info`** — educational explanation of the response in the selected language.

---

### Validation

**Schema**
A definition of what a valid request body must look like — which fields are required, their types, and any constraints (min/max values, allowed patterns). This API uses Pydantic schemas.

**422 Unprocessable Entity**
The request was syntactically valid JSON, but the field values broke schema rules (wrong type, missing required field, value out of range). The `data.errors` array pinpoints exactly which field failed and why.

**400 Bad Request**
The request is structurally or semantically wrong (e.g., PATCH with an empty body — nothing to update).

---

### Testing Concepts

**Positive test**
Verifies that the system works correctly for valid inputs — e.g., `POST /api/users` with a complete, valid body should return 201.

**Negative test**
Verifies that the system handles invalid inputs correctly — e.g., `POST /api/users` without `email` should return 422, not 500.

**Boundary test**
Tests values at the edges of allowed ranges — e.g., `age=1` (minimum), `age=120` (maximum), `age=0` (just below minimum → 422), `age=121` (just above maximum → 422).

**Test isolation**
Each test should start from a known, predictable state so that tests don't interfere with each other. The `POST /api/reset` endpoint exists precisely for this: call it before each test run to guarantee a clean slate.

**Idempotency check**
A test pattern where you send the same request twice and assert both responses are identical (for idempotent methods like PUT). Confirms the server isn't accumulating unintended side effects.

**Contract testing**
Verifying that the API response matches its documented schema — correct field names, correct types, no missing fields. E.g., every user object must have `id`, `name`, `email`, `age`, `role`.

---

### JSON

**JSON (JavaScript Object Notation)**
The standard data format for REST APIs. Two structures:
- **Object** `{ "key": value }` — unordered key-value pairs. Values can be strings, numbers, booleans, null, arrays, or other objects.
- **Array** `[ value, value, ... ]` — ordered list of values.

In this API:
- `GET /api/users` → returns an **array** of user objects
- `GET /api/users/1` → returns a single user **object**
- `POST /api/users` → you send an **object**, get back the created **object**
