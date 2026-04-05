from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import RequestValidationError

from app.routes import users, books
from app import store
from app.info import make_info

app = FastAPI(
    title="REST API Learning Tool for QA",
    description="Educational REST API with in-memory storage, full CRUD, and detailed response explanations.",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(users.router)
app.include_router(books.router)


# ---------------------------------------------------------------------------
# Global exception handlers
# ---------------------------------------------------------------------------

def _get_lang(request: Request) -> str:
    lang = request.query_params.get("lang", "en")
    return lang if lang in ("en", "uk", "ru") else "en"


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    lang = _get_lang(request)
    path = request.url.path
    collection = "users" if "users" in path else "books" if "books" in path else "unknown"
    info_all = make_info("validation_error", collection)
    return JSONResponse(
        status_code=422,
        content={
            "http_status": 422,
            "method":      request.method,
            "endpoint":    str(request.url.path),
            "data":        {"errors": exc.errors()},
            "info":        info_all.get(lang, info_all["en"]),
        },
    )


# ---------------------------------------------------------------------------
# Reset endpoint
# ---------------------------------------------------------------------------

@app.post("/api/reset", tags=["utility"])
async def reset_all(request: Request):
    lang = _get_lang(request)
    store.reset_db()
    info_all = make_info("reset", "all")
    return JSONResponse(
        content={
            "http_status": 200,
            "method":      "POST",
            "endpoint":    "/api/reset",
            "data":        {
                "message":  "All collections restored to initial state.",
                "users":    store.get_all("users"),
                "books":    store.get_all("books"),
            },
            "info": info_all.get(lang, info_all["en"]),
        }
    )


# ---------------------------------------------------------------------------
# Web UI
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
