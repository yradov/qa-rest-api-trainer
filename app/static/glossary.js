/* =========================================================
   Glossary data — EN / UK / RU
   Each section has a title and items: { term, full?, def, note? }
   `full`  — optional expansion of an abbreviation
   `note`  — optional extra block rendered after the definition
   ========================================================= */

const GLOSSARY = {

  // ── ENGLISH ──────────────────────────────────────────────
  en: {
    title:    "Glossary",
    subtitle: "Key concepts for understanding REST APIs",
    sections: [
      {
        title: "Core Concepts",
        items: [
          {
            term: "API",
            full: "Application Programming Interface",
            def:  "A contract that defines how two software systems communicate. A REST API exposes a set of URLs that clients call to read or modify data on a server. Think of it as a waiter: you (client) give the waiter (API) an order, and the waiter brings back the result from the kitchen (server).",
          },
          {
            term: "REST",
            full: "Representational State Transfer",
            def:  "An architectural style for designing APIs. Key rules: resources are identified by URLs, HTTP methods describe the action, the server is stateless (each request carries all needed context), and responses represent the current state of the resource.",
          },
          {
            term: "Resource",
            def:  "A named piece of data the API manages — e.g., a single user or a book. Identified by its URL: `/api/users/3` is the resource \"user with id=3\". A resource is always a noun, never a verb.",
          },
          {
            term: "Collection",
            def:  "A group of resources of the same type. `/api/users` is the collection of all users. In GET responses, a collection is represented as a JSON array `[…]`. An empty collection `[]` with status 200 is valid — it just means no items exist yet.",
          },
          {
            term: "Endpoint",
            def:  "A specific URL + HTTP method combination the API handles. `GET /api/users/1` and `DELETE /api/users/1` are two different endpoints sharing the same URL. Each endpoint has a defined input, output, and status codes.",
          },
          {
            term: "CRUD",
            def:  "The four fundamental data operations every API supports.",
            note: "<table class='g-table'><tr><th>Letter</th><th>Operation</th><th>HTTP Method</th><th>Status</th></tr><tr><td>C</td><td>Create</td><td>POST</td><td>201</td></tr><tr><td>R</td><td>Read</td><td>GET</td><td>200</td></tr><tr><td>U</td><td>Update</td><td>PUT / PATCH</td><td>200</td></tr><tr><td>D</td><td>Delete</td><td>DELETE</td><td>200 / 204</td></tr></table>",
          },
        ],
      },
      {
        title: "HTTP Methods",
        items: [
          {
            term: "GET",
            def:  "Reads a resource or collection. Never modifies data. **Safe** and **idempotent** — calling it any number of times has no side effects and always returns the same result (assuming no concurrent writes by others).",
          },
          {
            term: "POST",
            def:  "Creates a new resource. The server assigns the ID — the client does not choose it. **Not idempotent**: calling POST twice creates two separate resources with different IDs. Always returns **201 Created** on success.",
          },
          {
            term: "PUT",
            def:  "Fully replaces an existing resource. You must send **all** fields in the body — omitted fields are removed or reset to defaults. **Idempotent**: sending the same body twice results in the same final state.",
          },
          {
            term: "PATCH",
            def:  "Partially updates a resource — only the fields included in the body are changed, everything else stays the same. More efficient than PUT when only one or two fields need to change. Idempotency depends on the specific operation.",
          },
          {
            term: "DELETE",
            def:  "Removes a resource permanently. **Idempotent**: deleting an already-deleted resource returns 404 (not a server error) — this is correct and expected. After DELETE, a GET on the same ID must return 404.",
          },
          {
            term: "HEAD",
            def:  "Works exactly like GET but the server returns **only headers — no response body**. The server processes the request fully but omits the payload. Useful for checking whether a resource exists (by status code) or reading metadata (`Content-Length`, `Last-Modified`) without downloading the full data.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Not part of CRUD.</strong> HEAD is a meta/utility method — it inspects resources without reading their content. Mainly used by caches, crawlers, and monitoring tools, not by typical application clients.</div>",
          },
          {
            term: "OPTIONS",
            def:  "Returns the **list of HTTP methods allowed** for a given URL. Primarily used by browsers automatically as a **CORS preflight request** — before any cross-origin request, the browser silently asks the server \"what methods do you allow here?\". Developers rarely call OPTIONS explicitly.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Not part of CRUD.</strong> OPTIONS is handled automatically by the framework (FastAPI) and the browser. As a QA engineer you will almost never call it manually — but you may see it in browser DevTools network tab before cross-origin requests.</div>",
          },
        ],
      },
      {
        title: "Key Properties",
        items: [
          {
            term: "Safe",
            def:  "A method is *safe* if it does not modify server state. Only GET is safe. Safe methods can be called freely by browsers, crawlers, and caches without worrying about unintended side effects.",
          },
          {
            term: "Idempotent",
            def:  "A method is *idempotent* if calling it N times produces the same result as calling it once. Crucial for retries: if a network error occurs during a PUT or DELETE, you can safely retry — you won't accidentally create duplicates or delete twice.",
            note: "<table class='g-table'><tr><th>Method</th><th>Safe</th><th>Idempotent</th></tr><tr><td>GET</td><td class='yes'>✓ Yes</td><td class='yes'>✓ Yes</td></tr><tr><td>POST</td><td class='no'>✗ No</td><td class='no'>✗ No</td></tr><tr><td>PUT</td><td class='no'>✗ No</td><td class='yes'>✓ Yes</td></tr><tr><td>PATCH</td><td class='no'>✗ No</td><td class='maybe'>~ Maybe</td></tr><tr><td>DELETE</td><td class='no'>✗ No</td><td class='yes'>✓ Yes</td></tr></table>",
          },
        ],
      },
      {
        title: "HTTP Request Structure",
        items: [
          {
            term: "Request Line",
            def:  "The first line of every HTTP request: `METHOD /path HTTP/1.1`. Tells the server what action to perform and on which resource.",
          },
          {
            term: "Headers",
            def:  "Metadata sent with a request. The two most important for REST: `Content-Type: application/json` (tells the server the body is JSON — required for POST/PUT/PATCH) and `Accept: application/json` (tells the server the client wants JSON back).",
          },
          {
            term: "Request Body",
            def:  "The data payload sent with POST, PUT, and PATCH requests, formatted as JSON. GET and DELETE requests have no body.",
          },
          {
            term: "Query Parameter",
            def:  "An optional key=value pair appended to the URL after `?`. Used to filter, sort, or pass options without changing the resource path. Example: `/api/users?lang=uk`. Multiple params are joined with `&`: `?lang=uk&page=2`.",
          },
          {
            term: "Path Parameter",
            def:  "A variable segment embedded in the URL path, written as `{name}` in documentation. Example: `/api/users/{id}` — when you call `/api/users/3`, the path parameter `id` equals `3`. Used to target a specific resource.",
          },
        ],
      },
      {
        title: "HTTP Response Structure",
        items: [
          {
            term: "Status Code",
            def:  "A 3-digit number the server returns to summarise the outcome of the request.",
            note: "<table class='g-table'><tr><th>Range</th><th>Category</th><th>Examples</th></tr><tr><td>1xx</td><td>Informational</td><td>100 Continue</td></tr><tr><td>2xx</td><td class='yes'>Success</td><td>200 OK, 201 Created, 204 No Content</td></tr><tr><td>3xx</td><td>Redirect</td><td>301 Moved Permanently</td></tr><tr><td>4xx</td><td class='no'>Client Error</td><td>400 Bad Request, 404 Not Found, 422 Unprocessable</td></tr><tr><td>5xx</td><td class='no'>Server Error</td><td>500 Internal Server Error</td></tr></table>",
          },
          {
            term: "Response Body",
            def:  "The JSON data the server sends back. In this API, always structured as: `{ http_status, method, endpoint, data, info }`. The `data` field holds the actual resource(s); `info` holds the educational explanation.",
          },
          {
            term: "`data` field",
            def:  "The payload of the response. An **object** `{}` for single-resource responses (GET by ID, POST, PUT, PATCH), an **array** `[]` for collection responses (GET all), and `null` for 404.",
          },
          {
            term: "`info` field",
            def:  "An educational string that explains the HTTP method, status code, what the response contains, and testing tips — in the language you selected (EN / UK / RU). Controlled by the `?lang=` query parameter.",
          },
        ],
      },
      {
        title: "Validation & Errors",
        items: [
          {
            term: "Schema",
            def:  "A definition of what a valid request body must look like — which fields are required, their types, and constraints (min/max values, allowed patterns). This API uses Pydantic schemas. If the body does not match the schema, the server returns 422.",
          },
          {
            term: "400 Bad Request",
            def:  "The request is structurally or semantically wrong in a way that validation cannot catch. In this API: sending an empty body `{}` to a PATCH endpoint — there is nothing to update. The request format is valid, but the intent is meaningless.",
          },
          {
            term: "422 Unprocessable Entity",
            def:  "The request body is valid JSON but its **values** fail schema rules: wrong type, missing required field, value out of range, or invalid enum. The `data.errors` array in the response tells you exactly which field failed and why.",
          },
          {
            term: "404 Not Found",
            def:  "The server understood the request but could not find a resource with the given ID. This is a **client error** — the URL or ID is wrong. Different from a server error (5xx): the server is fine, just the requested thing doesn't exist.",
          },
        ],
      },
      {
        title: "Testing Concepts",
        items: [
          {
            term: "Positive Test",
            def:  "Verifies that the system works correctly for valid inputs. Example: `POST /api/users` with a complete, valid body → expect 201 and a resource with an assigned `id`.",
          },
          {
            term: "Negative Test",
            def:  "Verifies that the system handles invalid inputs correctly. Example: `POST /api/users` without `email` → expect 422, not 500. The system should fail gracefully with a helpful error, not crash.",
          },
          {
            term: "Boundary Test",
            def:  "Tests values at the edges of allowed ranges. For `age` (1–120): test `age=1` (min), `age=120` (max), `age=0` (below min → 422), `age=121` (above max → 422). Boundary bugs are the most common validation defects.",
          },
          {
            term: "Test Isolation",
            def:  "Each test must start from a known, predictable state so tests do not interfere with each other. The `POST /api/reset` endpoint exists for this: call it before each test run (or test suite) to guarantee a clean slate.",
          },
          {
            term: "Idempotency Check",
            def:  "A test pattern: send the same idempotent request (PUT, DELETE, GET) twice and assert both responses have the same status and body. Confirms the server is not accumulating unintended side effects on repeated calls.",
          },
          {
            term: "Contract Testing",
            def:  "Verifying that the API response matches its documented schema — correct field names, correct types, no missing fields. Example: every user object must have `id` (integer), `name` (string), `email` (string), `age` (integer), `role` (string).",
          },
        ],
      },
      {
        title: "JSON",
        items: [
          {
            term: "JSON",
            full: "JavaScript Object Notation",
            def:  "The standard text-based data format for REST APIs. Human-readable, language-independent. Two structures: **object** (key-value pairs) and **array** (ordered list). Values can be: string, number, boolean, null, object, or array.",
          },
          {
            term: "JSON Object",
            def:  "An unordered collection of key-value pairs wrapped in `{ }`. Keys must be strings. Example: `{ \"id\": 1, \"name\": \"Alice\", \"active\": true }`. Represents a single resource in REST APIs.",
          },
          {
            term: "JSON Array",
            def:  "An ordered list of values wrapped in `[ ]`. Example: `[ {\"id\":1}, {\"id\":2} ]`. Represents a collection of resources. An empty array `[]` is valid and means \"zero items found\".",
          },
        ],
      },
    ],
  },

  // ── UKRAINIAN ────────────────────────────────────────────
  uk: {
    title:    "Глосарій",
    subtitle: "Ключові поняття для розуміння REST API",
    sections: [
      {
        title: "Основні поняття",
        items: [
          {
            term: "API",
            full: "Application Programming Interface — Прикладний програмний інтерфейс",
            def:  "Контракт, що визначає, як дві програмні системи спілкуються між собою. REST API надає набір URL-адрес, які клієнти викликають, щоб читати або змінювати дані на сервері. Уявіть офіціанта: ви (клієнт) даєте офіціанту (API) замовлення, і він приносить результат з кухні (сервер).",
          },
          {
            term: "REST",
            full: "Representational State Transfer — Передача репрезентативного стану",
            def:  "Архітектурний стиль для проектування API. Основні правила: ресурси ідентифікуються URL-адресами, HTTP-методи описують дію, сервер не зберігає стан між запитами (кожен запит містить весь необхідний контекст), а відповіді представляють поточний стан ресурсу.",
          },
          {
            term: "Ресурс",
            def:  "Іменована одиниця даних, якою управляє API — наприклад, один користувач або книга. Ідентифікується своєю URL-адресою: `/api/users/3` — це ресурс «користувач з id=3». Ресурс завжди є іменником, а не дієсловом.",
          },
          {
            term: "Колекція",
            def:  "Набір ресурсів одного типу. `/api/users` — це колекція всіх користувачів. У GET-відповідях колекція представляється як JSON-масив `[…]`. Порожня колекція `[]` зі статусом 200 — коректна відповідь, яка означає, що елементів ще немає.",
          },
          {
            term: "Ендпоінт",
            def:  "Конкретна комбінація URL + HTTP-метод, яку обробляє API. `GET /api/users/1` і `DELETE /api/users/1` — два різні ендпоінти на одній URL-адресі. Кожен ендпоінт має визначені вхідні дані, вихідні дані і коди статусів.",
          },
          {
            term: "CRUD",
            def:  "Чотири фундаментальні операції з даними, які підтримує кожен API.",
            note: "<table class='g-table'><tr><th>Буква</th><th>Операція</th><th>HTTP метод</th><th>Статус</th></tr><tr><td>C</td><td>Create (Створити)</td><td>POST</td><td>201</td></tr><tr><td>R</td><td>Read (Читати)</td><td>GET</td><td>200</td></tr><tr><td>U</td><td>Update (Оновити)</td><td>PUT / PATCH</td><td>200</td></tr><tr><td>D</td><td>Delete (Видалити)</td><td>DELETE</td><td>200 / 204</td></tr></table>",
          },
        ],
      },
      {
        title: "HTTP методи",
        items: [
          {
            term: "GET",
            def:  "Читає ресурс або колекцію. Ніколи не змінює дані. **Безпечний** та **ідемпотентний** — виклик будь-яку кількість разів не має побічних ефектів і завжди повертає той самий результат (за умови відсутності паралельних змін).",
          },
          {
            term: "POST",
            def:  "Створює новий ресурс. ID призначає сервер — клієнт не обирає його. **Не ідемпотентний**: два виклики POST створюють два окремі ресурси з різними ID. При успіху завжди повертає **201 Created**.",
          },
          {
            term: "PUT",
            def:  "Повністю замінює існуючий ресурс. Необхідно надіслати **всі** поля в тілі запиту — пропущені поля видаляються або скидаються до дефолтних значень. **Ідемпотентний**: два однакові запити дають однаковий кінцевий стан.",
          },
          {
            term: "PATCH",
            def:  "Частково оновлює ресурс — змінюються лише поля, включені в тіло запиту, все інше залишається незмінним. Ефективніший за PUT, коли потрібно змінити одне-два поля. Ідемпотентність залежить від конкретної операції.",
          },
          {
            term: "DELETE",
            def:  "Видаляє ресурс назавжди. **Ідемпотентний**: видалення вже видаленого ресурсу повертає 404 (не помилку сервера) — це коректна очікувана поведінка. Після DELETE запит GET на той самий ID має повертати 404.",
          },
          {
            term: "HEAD",
            def:  "Працює точно як GET, але сервер повертає **лише заголовки — без тіла відповіді**. Сервер повністю обробляє запит, але не передає корисне навантаження. Зручно для перевірки існування ресурсу (за кодом статусу) або читання метаданих (`Content-Length`, `Last-Modified`) без завантаження повних даних.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Не є частиною CRUD.</strong> HEAD — це мета/утилітарний метод: він дозволяє інспектувати ресурси без читання їхнього вмісту. Використовується переважно кешами, краулерами та інструментами моніторингу, а не типовими клієнтськими застосунками.</div>",
          },
          {
            term: "OPTIONS",
            def:  "Повертає **список HTTP-методів, дозволених** для вказаного URL. Використовується браузерами автоматично як **CORS preflight запит** — перед будь-яким cross-origin запитом браузер мовчки запитує сервер «які методи ти тут дозволяєш?». Розробники рідко викликають OPTIONS явно.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Не є частиною CRUD.</strong> OPTIONS обробляється автоматично фреймворком (FastAPI) і браузером. Як QA-інженер ви майже ніколи не викликатимете його вручну — але можете побачити його у вкладці Network в DevTools браузера перед cross-origin запитами.</div>",
          },
        ],
      },
      {
        title: "Ключові властивості",
        items: [
          {
            term: "Безпечний (Safe)",
            def:  "Метод є *безпечним*, якщо він не змінює стан сервера. Лише GET є безпечним. Безпечні методи можуть вільно викликатися браузерами, пошуковими роботами та кешами без ризику ненавмисних побічних ефектів.",
          },
          {
            term: "Ідемпотентний (Idempotent)",
            def:  "Метод є *ідемпотентним*, якщо виклик N разів дає той самий результат, що і один виклик. Критично важливо для повторних спроб: при мережевій помилці PUT або DELETE можна безпечно повторити — нові дублікати не з'являться.",
            note: "<table class='g-table'><tr><th>Метод</th><th>Безпечний</th><th>Ідемпотентний</th></tr><tr><td>GET</td><td class='yes'>✓ Так</td><td class='yes'>✓ Так</td></tr><tr><td>POST</td><td class='no'>✗ Ні</td><td class='no'>✗ Ні</td></tr><tr><td>PUT</td><td class='no'>✗ Ні</td><td class='yes'>✓ Так</td></tr><tr><td>PATCH</td><td class='no'>✗ Ні</td><td class='maybe'>~ Можливо</td></tr><tr><td>DELETE</td><td class='no'>✗ Ні</td><td class='yes'>✓ Так</td></tr></table>",
          },
        ],
      },
      {
        title: "Структура HTTP запиту",
        items: [
          {
            term: "Рядок запиту",
            def:  "Перший рядок кожного HTTP-запиту: `МЕТОД /шлях HTTP/1.1`. Повідомляє серверу, яку дію виконати і з яким ресурсом.",
          },
          {
            term: "Заголовки (Headers)",
            def:  "Метадані, що надсилаються разом із запитом. Два найважливіших для REST: `Content-Type: application/json` (повідомляє серверу, що тіло — це JSON; обов'язково для POST/PUT/PATCH) і `Accept: application/json` (повідомляє серверу, що клієнт очікує JSON у відповідь).",
          },
          {
            term: "Тіло запиту (Request Body)",
            def:  "Корисне навантаження даних, що надсилається з POST, PUT та PATCH запитами у форматі JSON. Запити GET і DELETE не мають тіла.",
          },
          {
            term: "Query параметр",
            def:  "Необов'язкова пара ключ=значення, що додається до URL після `?`. Використовується для фільтрації, сортування або передачі опцій без зміни шляху до ресурсу. Приклад: `/api/users?lang=uk`. Кілька параметрів поєднуються через `&`: `?lang=uk&page=2`.",
          },
          {
            term: "Path параметр",
            def:  "Змінний сегмент, вбудований у шлях URL, який записується як `{назва}` в документації. Приклад: `/api/users/{id}` — при виклику `/api/users/3` path параметр `id` дорівнює `3`. Використовується для звернення до конкретного ресурсу.",
          },
        ],
      },
      {
        title: "Структура HTTP відповіді",
        items: [
          {
            term: "Код статусу",
            def:  "Тризначне число, яке сервер повертає для підсумку результату запиту.",
            note: "<table class='g-table'><tr><th>Діапазон</th><th>Категорія</th><th>Приклади</th></tr><tr><td>1xx</td><td>Інформаційний</td><td>100 Continue</td></tr><tr><td>2xx</td><td class='yes'>Успіх</td><td>200 OK, 201 Created, 204 No Content</td></tr><tr><td>3xx</td><td>Перенаправлення</td><td>301 Moved Permanently</td></tr><tr><td>4xx</td><td class='no'>Помилка клієнта</td><td>400 Bad Request, 404 Not Found, 422 Unprocessable</td></tr><tr><td>5xx</td><td class='no'>Помилка сервера</td><td>500 Internal Server Error</td></tr></table>",
          },
          {
            term: "Тіло відповіді",
            def:  "JSON-дані, які надсилає сервер у відповідь. У цьому API завжди структуровано як: `{ http_status, method, endpoint, data, info }`. Поле `data` містить власне ресурс(и); `info` містить навчальне пояснення.",
          },
          {
            term: "Поле `data`",
            def:  "Корисне навантаження відповіді. **Об'єкт** `{}` для відповідей з одним ресурсом (GET by ID, POST, PUT, PATCH), **масив** `[]` для колекцій (GET all), і `null` для 404.",
          },
          {
            term: "Поле `info`",
            def:  "Навчальний рядок, що пояснює HTTP-метод, код статусу, зміст відповіді та поради з тестування — мовою, яку ви обрали (EN / UK / RU). Керується query параметром `?lang=`.",
          },
        ],
      },
      {
        title: "Валідація та помилки",
        items: [
          {
            term: "Схема (Schema)",
            def:  "Визначення того, як має виглядати коректне тіло запиту: які поля обов'язкові, їхні типи та обмеження (мін/макс значення, допустимі шаблони). Цей API використовує схеми Pydantic. Якщо тіло не відповідає схемі, сервер повертає 422.",
          },
          {
            term: "400 Bad Request",
            def:  "Запит структурно або семантично некоректний у спосіб, який валідація не може перехопити. У цьому API: надсилання порожнього тіла `{}` до ендпоінту PATCH — нема що оновлювати. Формат запиту правильний, але намір безглуздий.",
          },
          {
            term: "422 Unprocessable Entity",
            def:  "Тіло запиту є валідним JSON, але його **значення** порушують правила схеми: неправильний тип, відсутнє обов'язкове поле, значення поза діапазоном або недопустиме значення enum. Масив `data.errors` у відповіді точно вказує, яке поле не пройшло і чому.",
          },
          {
            term: "404 Not Found",
            def:  "Сервер зрозумів запит, але не зміг знайти ресурс з вказаним ID. Це **помилка клієнта** — URL або ID невірний. Відрізняється від помилки сервера (5xx): сервер працює нормально, просто запитуваного ресурсу не існує.",
          },
        ],
      },
      {
        title: "Концепції тестування",
        items: [
          {
            term: "Позитивний тест",
            def:  "Перевіряє, що система правильно працює з валідними вхідними даними. Приклад: `POST /api/users` з повним коректним тілом → очікуємо 201 і ресурс з призначеним `id`.",
          },
          {
            term: "Негативний тест",
            def:  "Перевіряє, що система коректно обробляє невалідні вхідні дані. Приклад: `POST /api/users` без `email` → очікуємо 422, а не 500. Система має відмовляти коректно з корисним повідомленням про помилку, а не падати.",
          },
          {
            term: "Граничний тест",
            def:  "Перевіряє значення на межах допустимих діапазонів. Для `age` (1–120): тест `age=1` (мін), `age=120` (макс), `age=0` (нижче мінімуму → 422), `age=121` (вище максимуму → 422). Граничні помилки — найпоширеніший вид дефектів валідації.",
          },
          {
            term: "Ізоляція тестів",
            def:  "Кожен тест повинен починатися з відомого передбачуваного стану, щоб тести не заважали один одному. Ендпоінт `POST /api/reset` існує саме для цього: викликайте його перед кожним запуском тестів, щоб гарантувати чистий стан.",
          },
          {
            term: "Перевірка ідемпотентності",
            def:  "Патерн тестування: надіслати один і той самий ідемпотентний запит (PUT, DELETE, GET) двічі і перевірити, що обидві відповіді мають однаковий статус і тіло. Підтверджує, що сервер не накопичує ненавмисних побічних ефектів при повторних викликах.",
          },
          {
            term: "Контрактне тестування",
            def:  "Перевірка того, що відповідь API відповідає задокументованій схемі: правильні назви полів, правильні типи, відсутність пропущених полів. Приклад: кожен об'єкт користувача повинен мати `id` (ціле), `name` (рядок), `email` (рядок), `age` (ціле), `role` (рядок).",
          },
        ],
      },
      {
        title: "JSON",
        items: [
          {
            term: "JSON",
            full: "JavaScript Object Notation",
            def:  "Стандартний текстовий формат даних для REST API. Зрозумілий для людини, не залежить від мови програмування. Дві структури: **об'єкт** (пари ключ-значення) і **масив** (впорядкований список). Значення можуть бути: рядок, число, булеве, null, об'єкт або масив.",
          },
          {
            term: "JSON Об'єкт",
            def:  "Невпорядкована колекція пар ключ-значення, обгорнута в `{ }`. Ключі мають бути рядками. Приклад: `{ \"id\": 1, \"name\": \"Alice\", \"active\": true }`. Представляє один ресурс у REST API.",
          },
          {
            term: "JSON Масив",
            def:  "Впорядкований список значень, обгорнутий в `[ ]`. Приклад: `[ {\"id\":1}, {\"id\":2} ]`. Представляє колекцію ресурсів. Порожній масив `[]` є коректним і означає «знайдено нуль елементів».",
          },
        ],
      },
    ],
  },

  // ── RUSSIAN ──────────────────────────────────────────────
  ru: {
    title:    "Глоссарий",
    subtitle: "Ключевые понятия для понимания REST API",
    sections: [
      {
        title: "Основные понятия",
        items: [
          {
            term: "API",
            full: "Application Programming Interface — Прикладной программный интерфейс",
            def:  "Контракт, определяющий, как две программные системы общаются между собой. REST API предоставляет набор URL-адресов, которые клиенты вызывают для чтения или изменения данных на сервере. Представьте официанта: вы (клиент) даёте официанту (API) заказ, и он приносит результат с кухни (сервер).",
          },
          {
            term: "REST",
            full: "Representational State Transfer — Передача репрезентативного состояния",
            def:  "Архитектурный стиль для проектирования API. Основные правила: ресурсы идентифицируются URL-адресами, HTTP-методы описывают действие, сервер не хранит состояние между запросами (каждый запрос содержит весь необходимый контекст), а ответы представляют текущее состояние ресурса.",
          },
          {
            term: "Ресурс",
            def:  "Именованная единица данных, которой управляет API — например, один пользователь или книга. Идентифицируется своим URL: `/api/users/3` — это ресурс «пользователь с id=3». Ресурс всегда является существительным, а не глаголом.",
          },
          {
            term: "Коллекция",
            def:  "Набор ресурсов одного типа. `/api/users` — это коллекция всех пользователей. В GET-ответах коллекция представляется как JSON-массив `[…]`. Пустая коллекция `[]` со статусом 200 — корректный ответ, означающий, что элементов ещё нет.",
          },
          {
            term: "Эндпоинт",
            def:  "Конкретная комбинация URL + HTTP-метод, которую обрабатывает API. `GET /api/users/1` и `DELETE /api/users/1` — два разных эндпоинта на одном URL. Каждый эндпоинт имеет определённые входные данные, выходные данные и коды статусов.",
          },
          {
            term: "CRUD",
            def:  "Четыре фундаментальные операции с данными, которые поддерживает каждый API.",
            note: "<table class='g-table'><tr><th>Буква</th><th>Операция</th><th>HTTP метод</th><th>Статус</th></tr><tr><td>C</td><td>Create (Создать)</td><td>POST</td><td>201</td></tr><tr><td>R</td><td>Read (Читать)</td><td>GET</td><td>200</td></tr><tr><td>U</td><td>Update (Обновить)</td><td>PUT / PATCH</td><td>200</td></tr><tr><td>D</td><td>Delete (Удалить)</td><td>DELETE</td><td>200 / 204</td></tr></table>",
          },
        ],
      },
      {
        title: "HTTP методы",
        items: [
          {
            term: "GET",
            def:  "Читает ресурс или коллекцию. Никогда не изменяет данные. **Безопасный** и **идемпотентный** — вызов любое количество раз не имеет побочных эффектов и всегда возвращает одинаковый результат (при отсутствии параллельных изменений).",
          },
          {
            term: "POST",
            def:  "Создаёт новый ресурс. ID назначает сервер — клиент не выбирает его. **Не идемпотентный**: два вызова POST создают два отдельных ресурса с разными ID. При успехе всегда возвращает **201 Created**.",
          },
          {
            term: "PUT",
            def:  "Полностью заменяет существующий ресурс. Необходимо отправить **все** поля в теле запроса — пропущенные поля удаляются или сбрасываются к значениям по умолчанию. **Идемпотентный**: два одинаковых запроса дают одинаковое итоговое состояние.",
          },
          {
            term: "PATCH",
            def:  "Частично обновляет ресурс — изменяются только поля, включённые в тело запроса, всё остальное остаётся неизменным. Эффективнее PUT, когда нужно изменить одно-два поля. Идемпотентность зависит от конкретной операции.",
          },
          {
            term: "DELETE",
            def:  "Удаляет ресурс навсегда. **Идемпотентный**: удаление уже удалённого ресурса возвращает 404 (не ошибку сервера) — это корректное ожидаемое поведение. После DELETE запрос GET на тот же ID должен возвращать 404.",
          },
          {
            term: "HEAD",
            def:  "Работает точно как GET, но сервер возвращает **только заголовки — без тела ответа**. Сервер полностью обрабатывает запрос, но не передаёт полезную нагрузку. Удобно для проверки существования ресурса (по коду статуса) или чтения метаданных (`Content-Length`, `Last-Modified`) без загрузки полных данных.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Не является частью CRUD.</strong> HEAD — это мета/утилитарный метод: он позволяет инспектировать ресурсы без чтения их содержимого. Используется преимущественно кешами, краулерами и инструментами мониторинга, а не типичными клиентскими приложениями.</div>",
          },
          {
            term: "OPTIONS",
            def:  "Возвращает **список HTTP-методов, разрешённых** для указанного URL. Используется браузерами автоматически как **CORS preflight запрос** — перед любым cross-origin запросом браузер молча спрашивает сервер «какие методы ты здесь разрешаешь?». Разработчики редко вызывают OPTIONS явно.",
            note: "<div style='margin-top:8px;padding:8px 12px;border-left:3px solid var(--put);background:rgba(245,158,11,.07);border-radius:3px;font-size:12px'>⚠ <strong>Не является частью CRUD.</strong> OPTIONS обрабатывается автоматически фреймворком (FastAPI) и браузером. Как QA-инженер вы почти никогда не будете вызывать его вручную — но можете увидеть его во вкладке Network в DevTools браузера перед cross-origin запросами.</div>",
          },
        ],
      },
      {
        title: "Ключевые свойства",
        items: [
          {
            term: "Безопасный (Safe)",
            def:  "Метод является *безопасным*, если он не изменяет состояние сервера. Только GET является безопасным. Безопасные методы могут свободно вызываться браузерами, поисковыми роботами и кешами без риска непреднамеренных побочных эффектов.",
          },
          {
            term: "Идемпотентный (Idempotent)",
            def:  "Метод является *идемпотентным*, если вызов N раз даёт тот же результат, что и один вызов. Критически важно для повторных попыток: при сетевой ошибке PUT или DELETE можно безопасно повторить — новые дубликаты не появятся.",
            note: "<table class='g-table'><tr><th>Метод</th><th>Безопасный</th><th>Идемпотентный</th></tr><tr><td>GET</td><td class='yes'>✓ Да</td><td class='yes'>✓ Да</td></tr><tr><td>POST</td><td class='no'>✗ Нет</td><td class='no'>✗ Нет</td></tr><tr><td>PUT</td><td class='no'>✗ Нет</td><td class='yes'>✓ Да</td></tr><tr><td>PATCH</td><td class='no'>✗ Нет</td><td class='maybe'>~ Возможно</td></tr><tr><td>DELETE</td><td class='no'>✗ Нет</td><td class='yes'>✓ Да</td></tr></table>",
          },
        ],
      },
      {
        title: "Структура HTTP запроса",
        items: [
          {
            term: "Строка запроса",
            def:  "Первая строка каждого HTTP-запроса: `МЕТОД /путь HTTP/1.1`. Сообщает серверу, какое действие выполнить и с каким ресурсом.",
          },
          {
            term: "Заголовки (Headers)",
            def:  "Метаданные, отправляемые вместе с запросом. Два важнейших для REST: `Content-Type: application/json` (сообщает серверу, что тело — это JSON; обязательно для POST/PUT/PATCH) и `Accept: application/json` (сообщает серверу, что клиент ожидает JSON в ответ).",
          },
          {
            term: "Тело запроса (Request Body)",
            def:  "Полезная нагрузка данных, отправляемая с POST, PUT и PATCH запросами в формате JSON. Запросы GET и DELETE не имеют тела.",
          },
          {
            term: "Query параметр",
            def:  "Необязательная пара ключ=значение, добавляемая к URL после `?`. Используется для фильтрации, сортировки или передачи опций без изменения пути к ресурсу. Пример: `/api/users?lang=ru`. Несколько параметров соединяются через `&`: `?lang=ru&page=2`.",
          },
          {
            term: "Path параметр",
            def:  "Переменный сегмент, встроенный в путь URL, записывается как `{название}` в документации. Пример: `/api/users/{id}` — при вызове `/api/users/3` path параметр `id` равен `3`. Используется для обращения к конкретному ресурсу.",
          },
        ],
      },
      {
        title: "Структура HTTP ответа",
        items: [
          {
            term: "Код статуса",
            def:  "Трёхзначное число, которое сервер возвращает для обозначения результата запроса.",
            note: "<table class='g-table'><tr><th>Диапазон</th><th>Категория</th><th>Примеры</th></tr><tr><td>1xx</td><td>Информационный</td><td>100 Continue</td></tr><tr><td>2xx</td><td class='yes'>Успех</td><td>200 OK, 201 Created, 204 No Content</td></tr><tr><td>3xx</td><td>Перенаправление</td><td>301 Moved Permanently</td></tr><tr><td>4xx</td><td class='no'>Ошибка клиента</td><td>400 Bad Request, 404 Not Found, 422 Unprocessable</td></tr><tr><td>5xx</td><td class='no'>Ошибка сервера</td><td>500 Internal Server Error</td></tr></table>",
          },
          {
            term: "Тело ответа",
            def:  "JSON-данные, которые сервер отправляет в ответ. В этом API всегда структурировано как: `{ http_status, method, endpoint, data, info }`. Поле `data` содержит собственно ресурс(ы); `info` содержит учебное пояснение.",
          },
          {
            term: "Поле `data`",
            def:  "Полезная нагрузка ответа. **Объект** `{}` для ответов с одним ресурсом (GET by ID, POST, PUT, PATCH), **массив** `[]` для коллекций (GET all), и `null` для 404.",
          },
          {
            term: "Поле `info`",
            def:  "Учебная строка, объясняющая HTTP-метод, код статуса, содержимое ответа и советы по тестированию — на выбранном вами языке (EN / UK / RU). Управляется query параметром `?lang=`.",
          },
        ],
      },
      {
        title: "Валидация и ошибки",
        items: [
          {
            term: "Схема (Schema)",
            def:  "Определение того, как должно выглядеть корректное тело запроса: какие поля обязательны, их типы и ограничения (мин/макс значения, допустимые шаблоны). Этот API использует схемы Pydantic. Если тело не соответствует схеме, сервер возвращает 422.",
          },
          {
            term: "400 Bad Request",
            def:  "Запрос структурно или семантически некорректен способом, который валидация не может перехватить. В этом API: отправка пустого тела `{}` эндпоинту PATCH — нечего обновлять. Формат запроса правильный, но намерение бессмысленно.",
          },
          {
            term: "422 Unprocessable Entity",
            def:  "Тело запроса является валидным JSON, но его **значения** нарушают правила схемы: неверный тип, отсутствует обязательное поле, значение вне диапазона или недопустимое значение enum. Массив `data.errors` в ответе точно указывает, какое поле не прошло и почему.",
          },
          {
            term: "404 Not Found",
            def:  "Сервер понял запрос, но не смог найти ресурс с указанным ID. Это **ошибка клиента** — URL или ID неверный. Отличается от ошибки сервера (5xx): сервер работает нормально, просто запрашиваемый ресурс не существует.",
          },
        ],
      },
      {
        title: "Концепции тестирования",
        items: [
          {
            term: "Позитивный тест",
            def:  "Проверяет, что система правильно работает с валидными входными данными. Пример: `POST /api/users` с полным корректным телом → ожидаем 201 и ресурс с назначенным `id`.",
          },
          {
            term: "Негативный тест",
            def:  "Проверяет, что система корректно обрабатывает невалидные входные данные. Пример: `POST /api/users` без `email` → ожидаем 422, а не 500. Система должна отказывать корректно с полезным сообщением об ошибке, а не падать.",
          },
          {
            term: "Граничный тест",
            def:  "Проверяет значения на границах допустимых диапазонов. Для `age` (1–120): тест `age=1` (мин), `age=120` (макс), `age=0` (ниже минимума → 422), `age=121` (выше максимума → 422). Граничные ошибки — наиболее распространённый вид дефектов валидации.",
          },
          {
            term: "Изоляция тестов",
            def:  "Каждый тест должен начинаться из известного предсказуемого состояния, чтобы тесты не мешали друг другу. Эндпоинт `POST /api/reset` существует именно для этого: вызывайте его перед каждым запуском тестов для гарантии чистого состояния.",
          },
          {
            term: "Проверка идемпотентности",
            def:  "Паттерн тестирования: отправить один и тот же идемпотентный запрос (PUT, DELETE, GET) дважды и убедиться, что оба ответа имеют одинаковый статус и тело. Подтверждает, что сервер не накапливает непреднамеренных побочных эффектов при повторных вызовах.",
          },
          {
            term: "Контрактное тестирование",
            def:  "Проверка того, что ответ API соответствует задокументированной схеме: правильные имена полей, правильные типы, отсутствие пропущенных полей. Пример: каждый объект пользователя должен иметь `id` (целое), `name` (строка), `email` (строка), `age` (целое), `role` (строка).",
          },
        ],
      },
      {
        title: "JSON",
        items: [
          {
            term: "JSON",
            full: "JavaScript Object Notation",
            def:  "Стандартный текстовый формат данных для REST API. Понятен человеку, не зависит от языка программирования. Две структуры: **объект** (пары ключ-значение) и **массив** (упорядоченный список). Значения могут быть: строка, число, булево, null, объект или массив.",
          },
          {
            term: "JSON Объект",
            def:  "Неупорядоченная коллекция пар ключ-значение, обёрнутая в `{ }`. Ключи должны быть строками. Пример: `{ \"id\": 1, \"name\": \"Alice\", \"active\": true }`. Представляет один ресурс в REST API.",
          },
          {
            term: "JSON Массив",
            def:  "Упорядоченный список значений, обёрнутый в `[ ]`. Пример: `[ {\"id\":1}, {\"id\":2} ]`. Представляет коллекцию ресурсов. Пустой массив `[]` является корректным и означает «найдено ноль элементов».",
          },
        ],
      },
    ],
  },
};
