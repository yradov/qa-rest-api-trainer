/* =========================================================
   REST API Learning Tool — Frontend Logic
   ========================================================= */

'use strict';

// ── State ─────────────────────────────────────────────────
let currentLang = 'en';
let logEntries  = [];

// ── Schemas (for form field generation) ──────────────────
const SCHEMAS = {
  users: [
    { key: 'name',  label: 'Name',  type: 'text',   placeholder: 'e.g. Alice',            required: true,  hint: 'min 1, max 100 chars' },
    { key: 'email', label: 'Email', type: 'text',   placeholder: 'e.g. alice@example.com', required: true,  hint: 'min 5, max 200 chars' },
    { key: 'age',   label: 'Age',   type: 'number', placeholder: 'e.g. 28',                required: true,  hint: '1 – 120' },
    { key: 'role',  label: 'Role',  type: 'select', options: ['user', 'moderator', 'admin'], required: false, hint: 'default: user' },
  ],
  books: [
    { key: 'title',  label: 'Title',  type: 'text',   placeholder: 'e.g. Clean Code',       required: true,  hint: 'min 1, max 200 chars' },
    { key: 'author', label: 'Author', type: 'text',   placeholder: 'e.g. Robert C. Martin', required: true,  hint: 'min 1, max 150 chars' },
    { key: 'year',   label: 'Year',   type: 'number', placeholder: 'e.g. 2008',             required: true,  hint: '1000 – 2030' },
    { key: 'genre',  label: 'Genre',  type: 'text',   placeholder: 'e.g. Programming',      required: true,  hint: 'min 1, max 100 chars' },
  ],
};

// ── Boot ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadCollection('users');
  loadCollection('books');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('btn-reset').addEventListener('click', resetAll);
  document.getElementById('btn-clear-log').addEventListener('click', clearLog);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
});

// ── Tabs ──────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b   => b.classList.toggle('active',   b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === name));
  if (name === 'about') renderGlossary(currentLang);
}

// ── Language ──────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  // Re-render glossary if the About tab is visible
  const aboutPanel = document.querySelector('.tab-panel[data-panel="about"]');
  if (aboutPanel && aboutPanel.classList.contains('active')) renderGlossary(lang);
}

// ── API request helper ────────────────────────────────────
async function apiCall(method, url, body = null) {
  const sep     = url.includes('?') ? '&' : '?';
  const langUrl = `${url}${sep}lang=${currentLang}`;

  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  };
  if (body !== null) opts.body = JSON.stringify(body);

  let response, json;
  try {
    response = await fetch(langUrl, opts);
    json = await response.json();
  } catch (err) {
    addLog(method, url, 0, { error: String(err), info: 'Network error.' });
    return null;
  }

  addLog(method, url, response.status, json);
  return json;
}

// ── Load & render collections ─────────────────────────────
async function loadCollection(name) {
  const json = await apiCall('GET', `/api/${name}`);
  if (json) renderTable(name, json.data ?? []);
}

function renderTable(name, items) {
  const tbody = document.querySelector(`#table-${name} tbody`);
  tbody.innerHTML = '';

  if (!items || items.length === 0) {
    const schema = SCHEMAS[name];
    const colCount = schema.length + 2; // id + fields + actions
    tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center;color:var(--muted);padding:20px">No items</td></tr>`;
    return;
  }

  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = buildRowCells(name, item);
    tbody.appendChild(tr);
  });
}

function buildRowCells(name, item) {
  const schema = SCHEMAS[name];
  let cells = `<td class="id-cell">#${item.id}</td>`;
  schema.forEach(f => {
    cells += `<td>${escHtml(String(item[f.key] ?? ''))}</td>`;
  });
  cells += `
    <td class="actions">
      <button class="btn-sm btn-put"    onclick="openPut('${name}', ${item.id})">PUT</button>
      <button class="btn-sm btn-patch"  onclick="openPatch('${name}', ${item.id})">PATCH</button>
      <button class="btn-sm btn-delete" onclick="doDelete('${name}', ${item.id})">DELETE</button>
    </td>`;
  return cells;
}

// ── DELETE ────────────────────────────────────────────────
async function doDelete(collection, id) {
  if (!confirm(`DELETE /api/${collection}/${id} ?`)) return;
  const json = await apiCall('DELETE', `/api/${collection}/${id}`);
  if (json) loadCollection(collection);
}

// ── Reset ─────────────────────────────────────────────────
async function resetAll() {
  if (!confirm('Reset all collections to initial state?')) return;
  const json = await apiCall('POST', '/api/reset');
  if (json) {
    renderTable('users', json.data.users);
    renderTable('books', json.data.books);
  }
}

// ── Modal helpers ─────────────────────────────────────────
let _modalSubmit = null;

function openModal(title, subtitle, fields, onSubmit) {
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent    = title;
  document.getElementById('modal-subtitle').textContent = subtitle;

  const form = document.getElementById('modal-form');
  form.innerHTML = '';

  fields.forEach(f => {
    const group = document.createElement('div');
    group.className = 'form-group';
    if (f.type === 'select') {
      group.innerHTML = `
        <label>${f.label}${f.required ? ' *' : ''}</label>
        <select name="${f.key}" id="field-${f.key}">
          ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
        </select>
        ${f.hint ? `<div class="form-hint">${f.hint}</div>` : ''}`;
    } else {
      group.innerHTML = `
        <label>${f.label}${f.required ? ' *' : ''}</label>
        <input type="${f.type}" name="${f.key}" id="field-${f.key}"
               placeholder="${f.placeholder ?? ''}"
               ${f.value !== undefined ? `value="${escHtml(String(f.value))}"` : ''}>
        ${f.hint ? `<div class="form-hint">${f.hint}</div>` : ''}`;
    }
    form.appendChild(group);
    // set select value after appending
    if (f.type === 'select' && f.value !== undefined) {
      document.getElementById(`field-${f.key}`).value = f.value;
    }
  });

  _modalSubmit = onSubmit;
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  _modalSubmit = null;
}

function submitModal() {
  if (!_modalSubmit) return;
  const data = {};
  SCHEMAS[_currentCollection].forEach(f => {
    const el = document.getElementById(`field-${f.key}`);
    if (!el) return;
    const raw = el.value.trim();
    if (raw === '') return; // skip empty optional fields in PATCH
    data[f.key] = f.type === 'number' ? Number(raw) : raw;
  });
  _modalSubmit(data);
}

let _currentCollection = '';

// ── POST (create) ─────────────────────────────────────────
function openPost(collection) {
  _currentCollection = collection;
  openModal(
    `POST /api/${collection}`,
    `Create a new ${collection.slice(0, -1)}`,
    SCHEMAS[collection],
    async (data) => {
      closeModal();
      const json = await apiCall('POST', `/api/${collection}`, data);
      if (json) loadCollection(collection);
    }
  );
}

// ── PUT (full update) ─────────────────────────────────────
async function openPut(collection, id) {
  _currentCollection = collection;
  // First fetch current values
  const json = await apiCall('GET', `/api/${collection}/${id}`);
  if (!json || !json.data) return;
  const current = json.data;

  const fields = SCHEMAS[collection].map(f => ({ ...f, value: current[f.key] }));
  openModal(
    `PUT /api/${collection}/${id}`,
    `Full replacement — ALL fields required`,
    fields,
    async (data) => {
      closeModal();
      const res = await apiCall('PUT', `/api/${collection}/${id}`, data);
      if (res) loadCollection(collection);
    }
  );
}

// ── PATCH (partial update) ────────────────────────────────
async function openPatch(collection, id) {
  _currentCollection = collection;
  // Fetch current to show hints
  const json = await apiCall('GET', `/api/${collection}/${id}`);
  if (!json || !json.data) return;
  const current = json.data;

  // All fields optional — show current value as placeholder
  const fields = SCHEMAS[collection].map(f => ({
    ...f,
    required:    false,
    placeholder: `current: ${current[f.key]}`,
    value:       undefined,
    hint:        (f.hint || '') + ' — leave blank to keep current',
  }));

  openModal(
    `PATCH /api/${collection}/${id}`,
    `Partial update — only fill fields you want to change`,
    fields,
    async (data) => {
      closeModal();
      const res = await apiCall('PATCH', `/api/${collection}/${id}`, data);
      if (res) loadCollection(collection);
    }
  );
}

// ── Log ───────────────────────────────────────────────────
function addLog(method, url, status, json) {
  const entry = { method, url, status, json, time: new Date() };
  logEntries.unshift(entry);
  renderLogEntry(entry, true);

  const empty = document.getElementById('log-empty');
  if (empty) empty.remove();
}

function renderLogEntry(entry, prepend = false) {
  const list = document.getElementById('log-list');
  const idx  = logEntries.indexOf(entry);

  const el = document.createElement('div');
  el.className = 'log-entry';
  el.dataset.idx = idx;

  const statusClass = entry.status >= 500 ? 'status-5xx'
                    : entry.status >= 400 ? 'status-4xx'
                    : 'status-2xx';

  const infoText = typeof entry.json?.info === 'string' ? entry.json.info : '';

  el.innerHTML = `
    <div class="log-summary" onclick="toggleLog(this)">
      <span class="method-badge badge-${entry.method}">${entry.method}</span>
      <span class="status-badge ${statusClass}">${entry.status || 'ERR'}</span>
      <span class="log-url">${escHtml(entry.url)}</span>
      <span class="log-time">${formatTime(entry.time)}</span>
      <span class="log-chevron">▶</span>
    </div>
    <div class="log-body">
      <div class="log-pane">
        <h3>Response JSON</h3>
        <div class="log-json">${escHtml(JSON.stringify(entry.json, null, 2))}</div>
      </div>
      <div class="log-pane">
        <h3>Explanation</h3>
        <div class="log-info">${formatInfo(infoText)}</div>
      </div>
    </div>`;

  if (prepend && list.firstChild) {
    list.insertBefore(el, list.firstChild);
  } else {
    list.appendChild(el);
  }
}

function toggleLog(summaryEl) {
  summaryEl.parentElement.classList.toggle('open');
}

function clearLog() {
  logEntries = [];
  const list = document.getElementById('log-list');
  list.innerHTML = '<div class="log-empty" id="log-empty">No requests yet. Start by using the controls above.</div>';
}

// ── Text formatting ───────────────────────────────────────
function formatInfo(text) {
  if (!text) return '<em style="color:var(--muted)">No explanation available.</em>';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,.08);padding:1px 5px;border-radius:3px;font-family:monospace;font-size:12px">$1</code>')
    .replace(/— /g, '— ')
    .replace(/\n/g, '<br>');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}


function formatTime(d) {
  return d.toTimeString().slice(0, 8);
}

// ── Glossary renderer ─────────────────────────────────────
function renderGlossary(lang) {
  const container = document.getElementById('glossary-root');
  if (!container) return;

  const data = GLOSSARY[lang] || GLOSSARY.en;

  // sidebar nav links
  const navLinks = data.sections.map((s, i) =>
    `<a href="#g-section-${i}">${s.title}</a>`
  ).join('');

  // sections content
  const sectionsHtml = data.sections.map((section, i) => {
    const itemsHtml = section.items.map(item => {
      const defHtml = formatGlossaryText(item.def);
      return `
        <div class="g-item">
          <div class="g-term">${escHtml(item.term)}</div>
          ${item.full ? `<div class="g-full">${escHtml(item.full)}</div>` : ''}
          <div class="g-def">${defHtml}</div>
          ${item.note ? `<div class="g-note">${item.note}</div>` : ''}
        </div>`;
    }).join('');

    return `
      <div class="g-section" id="g-section-${i}">
        <div class="g-section-title">${escHtml(section.title)}</div>
        ${itemsHtml}
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="glossary-wrap">
      <nav class="glossary-nav">
        <div class="glossary-nav-title">${escHtml(data.title)}</div>
        ${navLinks}
      </nav>
      <div>
        <div class="glossary-header">
          <h2>${escHtml(data.title)}</h2>
          <p>${escHtml(data.subtitle)}</p>
        </div>
        <div class="glossary-content">${sectionsHtml}</div>
      </div>
    </div>`;
}

function formatGlossaryText(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/`([^`]+)`/g,     '<code>$1</code>');
}
