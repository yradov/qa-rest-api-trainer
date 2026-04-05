"""
Educational info texts for every API response.
Each function returns {"en": ..., "uk": ..., "ru": ...}.
"""


def make_info(operation: str, collection: str, **kwargs) -> dict:
    fn = _ops.get(operation, _unknown)
    return fn(collection, **kwargs)


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def _langs(en: str, uk: str, ru: str) -> dict:
    return {"en": en.strip(), "uk": uk.strip(), "ru": ru.strip()}


# ---------------------------------------------------------------------------
# GET list
# ---------------------------------------------------------------------------

def _get_list(collection: str, **kw) -> dict:
    count = kw.get("count", 0)
    return _langs(
        en=f"""
**Method: GET  |  Status: 200 OK**

• **GET** is a *safe* method — it never modifies data on the server.
• **GET** is *idempotent* — you can call it 100 times and the result is always the same.
• **200 OK** is the universal "everything went fine" status for successful reads.

**What you received:**
`data` contains an array of **{count}** {collection}. Each item has an `id` field — a unique integer key used to target a specific resource in GET /{collection}/{{id}}, PUT, PATCH, and DELETE requests.

**Testing tips:**
— After a POST/PUT/PATCH/DELETE, always follow up with GET to verify the change was persisted.
— An empty array `[]` with status 200 is valid — it means the collection exists but has no items.
— A missing collection would return 404, not an empty array.
""",
        uk=f"""
**Метод: GET  |  Статус: 200 OK**

• **GET** — *безпечний* метод: він ніколи не змінює дані на сервері.
• **GET** — *ідемпотентний*: можна викликати 100 разів — результат однаковий.
• **200 OK** — стандартний статус «все пройшло добре» для успішних читань.

**Що ви отримали:**
`data` містить масив з **{count}** {collection}. Кожен елемент має поле `id` — унікальний цілочисельний ключ, який використовується у GET /{collection}/{{id}}, PUT, PATCH і DELETE запитах.

**Поради для тестування:**
— Після POST/PUT/PATCH/DELETE завжди робіть GET, щоб перевірити, чи зміна збережена.
— Порожній масив `[]` зі статусом 200 — це коректна відповідь: колекція існує, але порожня.
— Якщо колекція не існує, сервер поверне 404, а не порожній масив.
""",
        ru=f"""
**Метод: GET  |  Статус: 200 OK**

• **GET** — *безопасный* метод: он никогда не изменяет данные на сервере.
• **GET** — *идемпотентный*: можно вызвать 100 раз — результат всегда одинаковый.
• **200 OK** — стандартный статус «всё прошло хорошо» для успешных чтений.

**Что вы получили:**
`data` содержит массив из **{count}** {collection}. Каждый элемент имеет поле `id` — уникальный целочисленный ключ, используемый в GET /{collection}/{{id}}, PUT, PATCH и DELETE запросах.

**Советы по тестированию:**
— После POST/PUT/PATCH/DELETE всегда делайте GET, чтобы убедиться, что изменение сохранилось.
— Пустой массив `[]` со статусом 200 — корректный ответ: коллекция существует, но пуста.
— Если коллекция не существует, сервер вернёт 404, а не пустой массив.
""",
    )


# ---------------------------------------------------------------------------
# GET one
# ---------------------------------------------------------------------------

def _get_one(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    return _langs(
        en=f"""
**Method: GET  |  Status: 200 OK**

• The `{{id}}` segment in the URL is a **path parameter** — it narrows the request to a single resource.
• **200 OK** means the item with id={item_id} was found and returned.

**What you received:**
`data` is a single object (not an array). Inspect every field — this is the exact current state stored on the server.

**Testing tips:**
— Test with a non-existent ID to verify the server returns 404 (not 200 with null data).
— Test with a non-integer ID (e.g. "abc") to verify the server returns 422.
— After a PATCH, GET the same ID to confirm only the patched fields changed.
""",
        uk=f"""
**Метод: GET  |  Статус: 200 OK**

• Сегмент `{{id}}` в URL — це **path parameter** (параметр шляху): він звужує запит до одного ресурсу.
• **200 OK** означає, що елемент з id={item_id} знайдено і повернуто.

**Що ви отримали:**
`data` — це один об'єкт (не масив). Перевірте кожне поле — це точний поточний стан на сервері.

**Поради для тестування:**
— Протестуйте з неіснуючим ID, щоб переконатися, що сервер повертає 404, а не 200 з null.
— Протестуйте з нецілочисельним ID (наприклад "abc") — сервер має повернути 422.
— Після PATCH зробіть GET того самого ID, щоб підтвердити, що змінились тільки потрібні поля.
""",
        ru=f"""
**Метод: GET  |  Статус: 200 OK**

• Сегмент `{{id}}` в URL — это **path parameter** (параметр пути): он сужает запрос до одного ресурса.
• **200 OK** означает, что элемент с id={item_id} найден и возвращён.

**Что вы получили:**
`data` — это один объект (не массив). Проверьте каждое поле — это точное текущее состояние на сервере.

**Советы по тестированию:**
— Протестируйте с несуществующим ID, чтобы убедиться, что сервер возвращает 404, а не 200 с null.
— Протестируйте с нецелочисленным ID (например "abc") — сервер должен вернуть 422.
— После PATCH сделайте GET того же ID, чтобы убедиться, что изменились только нужные поля.
""",
    )


# ---------------------------------------------------------------------------
# POST / create
# ---------------------------------------------------------------------------

def _create(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    return _langs(
        en=f"""
**Method: POST  |  Status: 201 Created**

• **POST** sends a request body (JSON) to create a new resource. The server assigns the ID — you don't pick it.
• **201 Created** is the correct success status for resource creation (not 200).
• The newly created resource is returned in `data`, including the server-assigned `id` = {item_id}.

**POST is NOT idempotent** — calling it twice creates two separate items with different IDs.

**Testing tips:**
— Check that the returned `id` is a new integer, not one that already existed.
— Try sending the request without required fields → expect 422.
— Try sending extra unknown fields → most APIs ignore them (verify this behaviour).
— After POST, do GET /api/{collection}/{item_id} to confirm the resource persists.
""",
        uk=f"""
**Метод: POST  |  Статус: 201 Created**

• **POST** надсилає тіло запиту (JSON) для створення нового ресурсу. ID призначає сервер — ви його не обираєте.
• **201 Created** — правильний статус успіху при створенні ресурсу (не 200).
• Новостворений ресурс повертається в `data`, включаючи призначений сервером `id` = {item_id}.

**POST НЕ є ідемпотентним** — два виклики створюють два окремі елементи з різними ID.

**Поради для тестування:**
— Переконайтеся, що повернутий `id` — новий, якого раніше не існувало.
— Спробуйте надіслати запит без обов'язкових полів → очікуйте 422.
— Спробуйте надіслати зайві невідомі поля → більшість API їх ігнорує (перевірте цю поведінку).
— Після POST зробіть GET /api/{collection}/{item_id}, щоб підтвердити, що ресурс збережено.
""",
        ru=f"""
**Метод: POST  |  Статус: 201 Created**

• **POST** отправляет тело запроса (JSON) для создания нового ресурса. ID назначает сервер — вы его не выбираете.
• **201 Created** — правильный статус успеха при создании ресурса (не 200).
• Новый ресурс возвращается в `data`, включая назначенный сервером `id` = {item_id}.

**POST НЕ является идемпотентным** — два вызова создают два отдельных элемента с разными ID.

**Советы по тестированию:**
— Убедитесь, что возвращённый `id` — новый, которого раньше не существовало.
— Попробуйте отправить запрос без обязательных полей → ожидайте 422.
— Попробуйте отправить лишние неизвестные поля → большинство API их игнорирует (проверьте это поведение).
— После POST сделайте GET /api/{collection}/{item_id}, чтобы убедиться, что ресурс сохранён.
""",
    )


# ---------------------------------------------------------------------------
# PUT / full update
# ---------------------------------------------------------------------------

def _update(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    return _langs(
        en=f"""
**Method: PUT  |  Status: 200 OK**

• **PUT** performs a **full replacement** of the resource. You must send ALL fields in the request body — omitted fields are removed or reset to defaults.
• **PUT is idempotent** — sending the same body twice results in the same final state.
• **200 OK** (some APIs return 204 No Content) — the resource was successfully replaced.
• The `data` field contains the resource **as it now looks** after the full replacement (id={item_id}).

**PUT vs PATCH:**
— PUT = "replace everything"  →  send the full object
— PATCH = "change only this"  →  send only changed fields

**Testing tips:**
— Send a PUT with one field missing and verify the missing field is gone or defaults.
— Send the same PUT twice and confirm both responses are identical (idempotency check).
— Send a PUT to a non-existent ID → expect 404.
""",
        uk=f"""
**Метод: PUT  |  Статус: 200 OK**

• **PUT** виконує **повну заміну** ресурсу. Потрібно надіслати ВСІ поля в тілі запиту — пропущені поля видаляються або скидаються до дефолту.
• **PUT є ідемпотентним** — два однакові запити дають однаковий кінцевий стан.
• **200 OK** (деякі API повертають 204 No Content) — ресурс успішно замінено.
• Поле `data` містить ресурс **у тому вигляді, в якому він зараз є** після повної заміни (id={item_id}).

**PUT проти PATCH:**
— PUT = «замінити все» → надіслати повний об'єкт
— PATCH = «змінити тільки це» → надіслати тільки змінені поля

**Поради для тестування:**
— Надішліть PUT з відсутнім полем і перевірте, що поле зникло або скинулось до дефолту.
— Надішліть той самий PUT двічі і підтвердіть, що обидві відповіді ідентичні (перевірка ідемпотентності).
— Надішліть PUT на неіснуючий ID → очікуйте 404.
""",
        ru=f"""
**Метод: PUT  |  Статус: 200 OK**

• **PUT** выполняет **полную замену** ресурса. Нужно отправить ВСЕ поля в теле запроса — пропущенные поля удаляются или сбрасываются к дефолту.
• **PUT является идемпотентным** — два одинаковых запроса дают одинаковое итоговое состояние.
• **200 OK** (некоторые API возвращают 204 No Content) — ресурс успешно заменён.
• Поле `data` содержит ресурс **в том виде, в каком он сейчас выглядит** после полной замены (id={item_id}).

**PUT vs PATCH:**
— PUT = «заменить всё» → отправить полный объект
— PATCH = «изменить только это» → отправить только изменённые поля

**Советы по тестированию:**
— Отправьте PUT с отсутствующим полем и убедитесь, что поле исчезло или сбросилось к дефолту.
— Отправьте один и тот же PUT дважды и убедитесь, что оба ответа идентичны (проверка идемпотентности).
— Отправьте PUT на несуществующий ID → ожидайте 404.
""",
    )


# ---------------------------------------------------------------------------
# PATCH / partial update
# ---------------------------------------------------------------------------

def _patch(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    fields = kw.get("fields", [])
    fields_str = ", ".join(f"`{f}`" for f in fields) if fields else "some fields"
    return _langs(
        en=f"""
**Method: PATCH  |  Status: 200 OK**

• **PATCH** performs a **partial update** — only the fields you include in the body are changed. Everything else stays the same.
• Updated fields this time: {fields_str}
• The full updated resource (id={item_id}) is returned in `data` so you can see the final state of ALL fields.

**PATCH is not guaranteed to be idempotent** (depends on implementation). Here it is, but e.g. `PATCH /counter {{increment: 1}}` would not be.

**Testing tips:**
— Send PATCH with only one field and confirm all other fields are unchanged in the response.
— Send PATCH with an empty body `{{}}` → expect 400 (nothing to update).
— Send PATCH to a non-existent ID → expect 404.
— Compare PATCH vs PUT: use PATCH when you only know which fields changed.
""",
        uk=f"""
**Метод: PATCH  |  Статус: 200 OK**

• **PATCH** виконує **часткове оновлення** — змінюються тільки поля, які ви вказали в тілі запиту. Все інше залишається незмінним.
• Оновлені поля цього разу: {fields_str}
• Повний оновлений ресурс (id={item_id}) повертається в `data`, щоб ви бачили фінальний стан ВСІХ полів.

**PATCH не гарантовано є ідемпотентним** (залежить від реалізації). Тут є, але наприклад `PATCH /counter {{increment: 1}}` таким не буде.

**Поради для тестування:**
— Надішліть PATCH з одним полем і підтвердіть, що всі інші поля в відповіді незмінні.
— Надішліть PATCH з порожнім тілом `{{}}` → очікуйте 400.
— Надішліть PATCH на неіснуючий ID → очікуйте 404.
— Порівняйте PATCH з PUT: використовуйте PATCH, коли відомо тільки які поля змінились.
""",
        ru=f"""
**Метод: PATCH  |  Статус: 200 OK**

• **PATCH** выполняет **частичное обновление** — изменяются только поля, которые вы указали в теле запроса. Всё остальное остаётся неизменным.
• Обновлённые поля в этот раз: {fields_str}
• Полный обновлённый ресурс (id={item_id}) возвращается в `data`, чтобы вы видели финальное состояние ВСЕХ полей.

**PATCH не гарантированно идемпотентен** (зависит от реализации). Здесь является, но например `PATCH /counter {{increment: 1}}` таковым не будет.

**Советы по тестированию:**
— Отправьте PATCH с одним полем и убедитесь, что все остальные поля в ответе неизменны.
— Отправьте PATCH с пустым телом `{{}}` → ожидайте 400.
— Отправьте PATCH на несуществующий ID → ожидайте 404.
— Сравните PATCH с PUT: используйте PATCH, когда известно только какие поля изменились.
""",
    )


# ---------------------------------------------------------------------------
# DELETE
# ---------------------------------------------------------------------------

def _delete(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    return _langs(
        en=f"""
**Method: DELETE  |  Status: 200 OK**

• **DELETE** removes the resource permanently (until Reset in this learning tool).
• **200 OK** with a confirmation body — the server tells you what was deleted (id={item_id}).
  *(Alternative: 204 No Content — success but no body. Both are valid REST conventions.)*
• **DELETE is idempotent** in REST theory — deleting an already-deleted resource should return 404, not crash.

**What you received:**
`data.deleted = true` and `data.id = {item_id}` confirm the deletion. Some APIs return the deleted object itself.

**Testing tips:**
— After DELETE, immediately GET /api/{collection}/{item_id} → expect 404.
— Try deleting the same ID twice → first: 200, second: 404 (idempotency in action).
— Verify the GET list no longer contains the deleted item.
""",
        uk=f"""
**Метод: DELETE  |  Статус: 200 OK**

• **DELETE** видаляє ресурс назавжди (до скидання в цьому навчальному інструменті).
• **200 OK** з підтвердженням у тілі — сервер повідомляє, що було видалено (id={item_id}).
  *(Альтернатива: 204 No Content — успіх без тіла відповіді. Обидва є коректними REST-конвенціями.)*
• **DELETE є ідемпотентним** у теорії REST — видалення вже видаленого ресурсу має повертати 404, а не помилку сервера.

**Що ви отримали:**
`data.deleted = true` і `data.id = {item_id}` підтверджують видалення. Деякі API повертають сам видалений об'єкт.

**Поради для тестування:**
— Після DELETE відразу зробіть GET /api/{collection}/{item_id} → очікуйте 404.
— Спробуйте видалити той самий ID двічі → перший раз: 200, другий: 404 (ідемпотентність у дії).
— Перевірте, що GET-список більше не містить видалений елемент.
""",
        ru=f"""
**Метод: DELETE  |  Статус: 200 OK**

• **DELETE** удаляет ресурс навсегда (до сброса в этом учебном инструменте).
• **200 OK** с подтверждением в теле — сервер сообщает, что было удалено (id={item_id}).
  *(Альтернатива: 204 No Content — успех без тела ответа. Оба являются корректными REST-конвенциями.)*
• **DELETE является идемпотентным** в теории REST — удаление уже удалённого ресурса должно возвращать 404, а не ошибку сервера.

**Что вы получили:**
`data.deleted = true` и `data.id = {item_id}` подтверждают удаление. Некоторые API возвращают сам удалённый объект.

**Советы по тестированию:**
— После DELETE сразу сделайте GET /api/{collection}/{item_id} → ожидайте 404.
— Попробуйте удалить один и тот же ID дважды → первый раз: 200, второй: 404 (идемпотентность в действии).
— Убедитесь, что GET-список больше не содержит удалённый элемент.
""",
    )


# ---------------------------------------------------------------------------
# 404 Not Found
# ---------------------------------------------------------------------------

def _not_found(collection: str, **kw) -> dict:
    item_id = kw.get("item_id", "?")
    return _langs(
        en=f"""
**Status: 404 Not Found**

• **404** means the server understood the request perfectly, but could not find a resource with id={item_id} in `{collection}`.
• This is a **client error** (4xx range) — the request itself is correct, but what it points to doesn't exist.

**Common causes:**
— The ID was already deleted.
— Typo in the ID (e.g. id=10 instead of id=1).
— The resource was never created.

**Testing tips:**
— 404 is expected behaviour — design your tests to assert it, not just avoid it.
— Distinguish 404 (not found) from 400 (bad request format) and 422 (invalid field values).
— After DELETE, subsequent GET/PUT/PATCH on the same ID must return 404.
""",
        uk=f"""
**Статус: 404 Not Found**

• **404** означає, що сервер чудово зрозумів запит, але не зміг знайти ресурс з id={item_id} у `{collection}`.
• Це **помилка клієнта** (діапазон 4xx) — сам запит коректний, але те, на що він вказує, не існує.

**Поширені причини:**
— ID вже було видалено.
— Помилка в ID (наприклад id=10 замість id=1).
— Ресурс ніколи не створювався.

**Поради для тестування:**
— 404 — очікувана поведінка: проектуйте тести так, щоб перевіряти її, а не уникати.
— Відрізняйте 404 (не знайдено) від 400 (невірний формат запиту) та 422 (невірні значення полів).
— Після DELETE наступні GET/PUT/PATCH на той самий ID мають повертати 404.
""",
        ru=f"""
**Статус: 404 Not Found**

• **404** означает, что сервер прекрасно понял запрос, но не смог найти ресурс с id={item_id} в `{collection}`.
• Это **ошибка клиента** (диапазон 4xx) — сам запрос корректен, но то, на что он указывает, не существует.

**Распространённые причины:**
— ID уже был удалён.
— Опечатка в ID (например id=10 вместо id=1).
— Ресурс никогда не создавался.

**Советы по тестированию:**
— 404 — ожидаемое поведение: проектируйте тесты так, чтобы проверять его, а не избегать.
— Отличайте 404 (не найдено) от 400 (неверный формат запроса) и 422 (неверные значения полей).
— После DELETE последующие GET/PUT/PATCH на тот же ID должны возвращать 404.
""",
    )


# ---------------------------------------------------------------------------
# 422 Validation Error
# ---------------------------------------------------------------------------

def _validation_error(collection: str, **kw) -> dict:
    return _langs(
        en=f"""
**Status: 422 Unprocessable Entity**

• **422** means the request was well-formed (valid JSON, correct Content-Type), but the **field values failed validation**.
• This is a **client error** — fix the request body and try again.
• The `data.errors` array lists every validation failure with the field location and message.

**Common triggers:**
— Missing a required field (e.g. no `name` in users).
— Wrong type (e.g. `"age": "thirty"` instead of `"age": 30`).
— Value out of range (e.g. age > 120 or year < 1000).
— Invalid enum value (e.g. role = "superadmin" instead of "admin"/"moderator"/"user").

**Testing tips:**
— 422 is the expected response for negative/boundary tests on request bodies.
— Read the `errors[].msg` and `errors[].loc` fields — they tell you exactly which field failed and why.
— Test all required fields: remove them one by one and confirm each produces a 422.
""",
        uk=f"""
**Статус: 422 Unprocessable Entity**

• **422** означає, що запит був правильно сформований (валідний JSON, правильний Content-Type), але **значення полів не пройшли валідацію**.
• Це **помилка клієнта** — виправте тіло запиту і спробуйте знову.
• Масив `data.errors` перераховує кожну помилку валідації з місцезнаходженням поля та повідомленням.

**Поширені причини:**
— Відсутнє обов'язкове поле (наприклад, немає `name` у users).
— Неправильний тип (наприклад, `"age": "тридцять"` замість `"age": 30`).
— Значення поза допустимим діапазоном (наприклад, age > 120 або year < 1000).
— Недопустиме значення enum (наприклад, role = "superadmin" замість "admin"/"moderator"/"user").

**Поради для тестування:**
— 422 — очікувана відповідь для негативних/граничних тестів тіл запитів.
— Читайте поля `errors[].msg` і `errors[].loc` — вони точно вказують, яке поле не пройшло і чому.
— Тестуйте всі обов'язкові поля: видаляйте їх по одному і підтверджуйте, що кожне дає 422.
""",
        ru=f"""
**Статус: 422 Unprocessable Entity**

• **422** означает, что запрос был корректно сформирован (валидный JSON, правильный Content-Type), но **значения полей не прошли валидацию**.
• Это **ошибка клиента** — исправьте тело запроса и попробуйте снова.
• Массив `data.errors` перечисляет каждую ошибку валидации с местоположением поля и сообщением.

**Распространённые причины:**
— Отсутствует обязательное поле (например, нет `name` у users).
— Неверный тип (например, `"age": "тридцать"` вместо `"age": 30`).
— Значение вне допустимого диапазона (например, age > 120 или year < 1000).
— Недопустимое значение enum (например, role = "superadmin" вместо "admin"/"moderator"/"user").

**Советы по тестированию:**
— 422 — ожидаемый ответ для негативных/граничных тестов тел запросов.
— Читайте поля `errors[].msg` и `errors[].loc` — они точно указывают, какое поле не прошло и почему.
— Тестируйте все обязательные поля: удаляйте их по одному и убеждайтесь, что каждое даёт 422.
""",
    )


# ---------------------------------------------------------------------------
# 400 Empty PATCH
# ---------------------------------------------------------------------------

def _empty_patch(collection: str, **kw) -> dict:
    return _langs(
        en=f"""
**Status: 400 Bad Request**

• **400** means the request is syntactically valid but semantically wrong — in this case, an empty PATCH body means there is nothing to update.
• Sending `{{}}` or omitting all optional fields in a PATCH request is pointless and rejected.

**Testing tips:**
— A PATCH with an empty body should always be tested as a negative case.
— Compare: POST with an empty body → 422 (missing required fields). PATCH with an empty body → 400 (nothing to patch).
""",
        uk=f"""
**Статус: 400 Bad Request**

• **400** означає, що запит синтаксично правильний, але семантично некоректний — в даному випадку порожнє тіло PATCH означає, що нічого оновлювати.
• Надсилати `{{}}` або не вказувати жодних необов'язкових полів у PATCH запиті — безглуздо, тому відхиляється.

**Поради для тестування:**
— PATCH з порожнім тілом завжди слід тестувати як негативний кейс.
— Порівняйте: POST з порожнім тілом → 422 (відсутні обов'язкові поля). PATCH з порожнім тілом → 400 (нічого патчити).
""",
        ru=f"""
**Статус: 400 Bad Request**

• **400** означает, что запрос синтаксически правильный, но семантически некорректный — в данном случае пустое тело PATCH означает, что нечего обновлять.
• Отправлять `{{}}` или не указывать ни одного необязательного поля в PATCH запросе — бессмысленно, поэтому отклоняется.

**Советы по тестированию:**
— PATCH с пустым телом всегда следует тестировать как негативный кейс.
— Сравните: POST с пустым телом → 422 (отсутствуют обязательные поля). PATCH с пустым телом → 400 (нечего патчить).
""",
    )


# ---------------------------------------------------------------------------
# RESET
# ---------------------------------------------------------------------------

def _reset(collection: str, **kw) -> dict:
    return _langs(
        en=f"""
**Method: POST  |  Status: 200 OK  |  Endpoint: /api/reset**

• This is a **non-standard utility endpoint** — not part of the REST spec, but common in test/demo environments.
• It restores all collections (users and books) to their original 5-item state and resets auto-increment IDs.
• Why POST and not DELETE? Because POST can trigger any action on the server side; here it "creates" a new clean state.

**When to use in real testing:**
— Before each test suite run: reset to a known state (test isolation).
— After destructive tests: restore data so other tests aren't affected.
— In CI/CD pipelines: call reset before every automated test run.

**Key concept — Test Isolation:**
Each test should start from a predictable, identical state. Reset endpoints (or database rollbacks) are the standard tool for this.
""",
        uk=f"""
**Метод: POST  |  Статус: 200 OK  |  Ендпоінт: /api/reset**

• Це **нестандартний утилітарний ендпоінт** — не частина специфікації REST, але поширений у тестових/демо середовищах.
• Він відновлює всі колекції (users і books) до початкового стану з 5 елементів і скидає автоінкрементні ID.
• Чому POST, а не DELETE? Тому що POST може запускати будь-яку дію на сервері; тут він «створює» новий чистий стан.

**Коли використовувати в реальному тестуванні:**
— Перед кожним запуском набору тестів: скидання до відомого стану (ізоляція тестів).
— Після деструктивних тестів: відновлення даних, щоб інші тести не постраждали.
— У CI/CD конвеєрах: виклик reset перед кожним автоматизованим запуском тестів.

**Ключова концепція — Ізоляція тестів:**
Кожен тест повинен починатися з передбачуваного, ідентичного стану. Ендпоінти reset (або відкат бази даних) — стандартний інструмент для цього.
""",
        ru=f"""
**Метод: POST  |  Статус: 200 OK  |  Эндпоинт: /api/reset**

• Это **нестандартный утилитарный эндпоинт** — не часть спецификации REST, но распространён в тестовых/демо средах.
• Он восстанавливает все коллекции (users и books) до исходного состояния из 5 элементов и сбрасывает автоинкрементные ID.
• Почему POST, а не DELETE? Потому что POST может запускать любое действие на стороне сервера; здесь он «создаёт» новое чистое состояние.

**Когда использовать в реальном тестировании:**
— Перед каждым запуском набора тестов: сброс к известному состоянию (изоляция тестов).
— После деструктивных тестов: восстановление данных, чтобы другие тесты не пострадали.
— В CI/CD пайплайнах: вызов reset перед каждым автоматизированным запуском тестов.

**Ключевая концепция — Изоляция тестов:**
Каждый тест должен начинаться из предсказуемого, идентичного состояния. Reset-эндпоинты (или откат базы данных) — стандартный инструмент для этого.
""",
    )


# ---------------------------------------------------------------------------
# unknown fallback
# ---------------------------------------------------------------------------

def _unknown(collection: str, **kw) -> dict:
    return _langs(en="No info available.", uk="Інформація відсутня.", ru="Информация отсутствует.")


# ---------------------------------------------------------------------------
# dispatch table
# ---------------------------------------------------------------------------

_ops = {
    "get_list":         _get_list,
    "get_one":          _get_one,
    "create":           _create,
    "update":           _update,
    "patch":            _patch,
    "delete":           _delete,
    "not_found":        _not_found,
    "validation_error": _validation_error,
    "empty_patch":      _empty_patch,
    "reset":            _reset,
}
