from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
from app import store
from app.info import make_info

router = APIRouter(prefix="/api/users", tags=["users"])

COLLECTION = "users"


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    name:  str = Field(..., min_length=1,  max_length=100, examples=["Alice"])
    email: str = Field(..., min_length=5,  max_length=200, examples=["alice@example.com"])
    age:   int = Field(..., ge=1,          le=120,         examples=[28])
    role:  str = Field("user", pattern="^(admin|moderator|user)$", examples=["user"])


class UserPatch(BaseModel):
    name:  Optional[str] = Field(None, min_length=1,  max_length=100)
    email: Optional[str] = Field(None, min_length=5,  max_length=200)
    age:   Optional[int] = Field(None, ge=1,          le=120)
    role:  Optional[str] = Field(None, pattern="^(admin|moderator|user)$")


# ---------------------------------------------------------------------------
# Response helper
# ---------------------------------------------------------------------------

LANG_PARAM = Query(default="en", pattern="^(en|uk|ru)$")


def resp(request: Request, status: int, data, operation: str, lang: str = "en", **kw) -> JSONResponse:
    info_all = make_info(operation, COLLECTION, **kw)
    return JSONResponse(
        status_code=status,
        content={
            "http_status": status,
            "method":      request.method,
            "endpoint":    request.url.path,
            "data":        data,
            "info":        info_all.get(lang, info_all["en"]),
        },
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("")
def list_users(request: Request, lang: str = LANG_PARAM):
    items = store.get_all(COLLECTION)
    return resp(request, 200, items, "get_list", lang=lang, count=len(items))


@router.get("/{item_id}")
def get_user(item_id: int, request: Request, lang: str = LANG_PARAM):
    item = store.get_one(COLLECTION, item_id)
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "get_one", lang=lang, item_id=item_id)


@router.post("", status_code=201)
def create_user(body: UserCreate, request: Request, lang: str = LANG_PARAM):
    item = store.create(COLLECTION, body.model_dump())
    return resp(request, 201, item, "create", lang=lang, item_id=item["id"])


@router.put("/{item_id}")
def update_user(item_id: int, body: UserCreate, request: Request, lang: str = LANG_PARAM):
    item = store.update(COLLECTION, item_id, body.model_dump())
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "update", lang=lang, item_id=item_id)


@router.patch("/{item_id}")
def patch_user(item_id: int, body: UserPatch, request: Request, lang: str = LANG_PARAM):
    data = body.model_dump(exclude_unset=True)
    if not data:
        return resp(request, 400, None, "empty_patch", lang=lang)
    item = store.patch(COLLECTION, item_id, data)
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "patch", lang=lang, item_id=item_id, fields=list(data.keys()))


@router.delete("/{item_id}")
def delete_user(item_id: int, request: Request, lang: str = LANG_PARAM):
    found = store.delete(COLLECTION, item_id)
    if not found:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, {"id": item_id, "deleted": True}, "delete", lang=lang, item_id=item_id)
