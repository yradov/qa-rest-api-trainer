import copy
from threading import Lock

INITIAL_USERS = [
    {"id": 1, "name": "John Doe",       "email": "john@example.com",    "age": 30, "role": "admin"},
    {"id": 2, "name": "Jane Smith",     "email": "jane@example.com",    "age": 25, "role": "user"},
    {"id": 3, "name": "Bob Johnson",    "email": "bob@example.com",     "age": 35, "role": "user"},
    {"id": 4, "name": "Alice Brown",    "email": "alice@example.com",   "age": 28, "role": "moderator"},
    {"id": 5, "name": "Charlie Wilson", "email": "charlie@example.com", "age": 22, "role": "user"},
]

INITIAL_BOOKS = [
    {"id": 1, "title": "Clean Code",              "author": "Robert C. Martin",      "year": 2008, "genre": "Programming"},
    {"id": 2, "title": "The Pragmatic Programmer", "author": "David Thomas",          "year": 1999, "genre": "Programming"},
    {"id": 3, "title": "Design Patterns",          "author": "Gang of Four",          "year": 1994, "genre": "Programming"},
    {"id": 4, "title": "1984",                     "author": "George Orwell",         "year": 1949, "genre": "Fiction"},
    {"id": 5, "title": "The Great Gatsby",         "author": "F. Scott Fitzgerald",   "year": 1925, "genre": "Fiction"},
]

_lock = Lock()

db: dict = {
    "users":    copy.deepcopy(INITIAL_USERS),
    "books":    copy.deepcopy(INITIAL_BOOKS),
    "next_id":  {"users": 6, "books": 6},
}


def reset_db() -> None:
    with _lock:
        db["users"]   = copy.deepcopy(INITIAL_USERS)
        db["books"]   = copy.deepcopy(INITIAL_BOOKS)
        db["next_id"] = {"users": 6, "books": 6}


def get_all(collection: str) -> list:
    return list(db[collection])


def get_one(collection: str, item_id: int) -> dict | None:
    return next((item for item in db[collection] if item["id"] == item_id), None)


def create(collection: str, data: dict) -> dict:
    with _lock:
        new_id = db["next_id"][collection]
        item = {"id": new_id, **data}
        db[collection].append(item)
        db["next_id"][collection] += 1
        return dict(item)


def update(collection: str, item_id: int, data: dict) -> dict | None:
    with _lock:
        for i, item in enumerate(db[collection]):
            if item["id"] == item_id:
                db[collection][i] = {"id": item_id, **data}
                return dict(db[collection][i])
        return None


def patch(collection: str, item_id: int, data: dict) -> dict | None:
    with _lock:
        for i, item in enumerate(db[collection]):
            if item["id"] == item_id:
                db[collection][i] = {**item, **data}
                return dict(db[collection][i])
        return None


def delete(collection: str, item_id: int) -> bool:
    with _lock:
        for i, item in enumerate(db[collection]):
            if item["id"] == item_id:
                db[collection].pop(i)
                return True
        return False
