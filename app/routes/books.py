from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
from app import store
from app.info import make_info

router = APIRouter(prefix="/api/books", tags=["books"])

COLLECTION = "books"


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class BookCreate(BaseModel):
    title:  str = Field(..., min_length=1,  max_length=200, examples=["Clean Code"])
    author: str = Field(..., min_length=1,  max_length=150, examples=["Robert C. Martin"])
    year:   int = Field(..., ge=1000,       le=2030,        examples=[2008])
    genre:  str = Field(..., min_length=1,  max_length=100, examples=["Programming"])


class BookPatch(BaseModel):
    title:  Optional[str] = Field(None, min_length=1, max_length=200)
    author: Optional[str] = Field(None, min_length=1, max_length=150)
    year:   Optional[int] = Field(None, ge=1000,      le=2030)
    genre:  Optional[str] = Field(None, min_length=1, max_length=100)


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
def list_books(request: Request, lang: str = LANG_PARAM):
    items = store.get_all(COLLECTION)
    return resp(request, 200, items, "get_list", lang=lang, count=len(items))


@router.get("/{item_id}")
def get_book(item_id: int, request: Request, lang: str = LANG_PARAM):
    item = store.get_one(COLLECTION, item_id)
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "get_one", lang=lang, item_id=item_id)


@router.post("", status_code=201)
def create_book(body: BookCreate, request: Request, lang: str = LANG_PARAM):
    item = store.create(COLLECTION, body.model_dump())
    return resp(request, 201, item, "create", lang=lang, item_id=item["id"])


@router.put("/{item_id}")
def update_book(item_id: int, body: BookCreate, request: Request, lang: str = LANG_PARAM):
    item = store.update(COLLECTION, item_id, body.model_dump())
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "update", lang=lang, item_id=item_id)


@router.patch("/{item_id}")
def patch_book(item_id: int, body: BookPatch, request: Request, lang: str = LANG_PARAM):
    data = body.model_dump(exclude_unset=True)
    if not data:
        return resp(request, 400, None, "empty_patch", lang=lang)
    item = store.patch(COLLECTION, item_id, data)
    if item is None:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, item, "patch", lang=lang, item_id=item_id, fields=list(data.keys()))


@router.delete("/{item_id}")
def delete_book(item_id: int, request: Request, lang: str = LANG_PARAM):
    found = store.delete(COLLECTION, item_id)
    if not found:
        return resp(request, 404, None, "not_found", lang=lang, item_id=item_id)
    return resp(request, 200, {"id": item_id, "deleted": True}, "delete", lang=lang, item_id=item_id)
