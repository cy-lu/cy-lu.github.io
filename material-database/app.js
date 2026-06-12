let INDEX = [];
let RECORD_CACHE = Object.create(null);
let JSON_CACHE = Object.create(null);
let RENDER_TOKEN = 0;

const APP_VERSION = '20260527_28_eps_toggle';
const DEFAULT_FIT_RANGE_UM = [0.3, 1.1];
const ALL_CLASSES = 'All material classes';

/* MATERIAL_CLASS_ORDER_START */
const MATERIAL_CLASS_ORDER = [
  'Metal / conductor',
  'Semiconductor',
  'Transparent dielectric',
  '2D / layered material',
  'Chalcogenide glass'
];
/* MATERIAL_CLASS_ORDER_END */

function sanitizeJsonText(text) {
  return text
    .replace(/:\s*NaN(?=\s*[,}\]])/g, ': null')
    .replace(/:\s*Infinity(?=\s*[,}\]])/g, ': null')
    .replace(/:\s*-Infinity(?=\s*[,}\]])/g, ': null')
    .replace(/\[\s*NaN(?=\s*[,\]])/g, '[null')
    .replace(/,\s*NaN(?=\s*[,\]])/g, ', null')
    .replace(/\[\s*Infinity(?=\s*[,\]])/g, '[null')
    .replace(/,\s*Infinity(?=\s*[,\]])/g, ', null')
    .replace(/\[\s*-Infinity(?=\s*[,\]])/g, '[null')
    .replace(/,\s*-Infinity(?=\s*[,\]])/g, ', null');
}


function normalizeDataPath(path) {
  if (!path) return path;
  const s = String(path);

  // Do not touch absolute URLs or root-relative URLs.
  if (/^(https?:)?\/\//.test(s) || s.startsWith('/')) return s;

  // Already correct for this website.
  if (s.startsWith('data/')) return s;

  // All database artifacts live under material-database/data/.
  if (
    s.startsWith('experimental/') ||
    s.startsWith('records/') ||
    s.startsWith('models/') ||
    s.startsWith('model_curves/') ||
    s.startsWith('tables/')
  ) {
    return 'data/' + s;
  }

  return s;
}

async function loadJson(path) {
  path = normalizeDataPath(path);
  if (!path) return null;
  const cacheKey = String(path);
  if (Object.prototype.hasOwnProperty.call(JSON_CACHE, cacheKey)) return JSON_CACHE[cacheKey];
  const sep = path.includes('?') ? '&' : '?';
  const url = `${path}${sep}v=${APP_VERSION}`;
  const res = await fetch(url, {cache: 'no-store'});
  if (!res.ok) throw new Error(`Cannot load ${url} [HTTP ${res.status}]`);
  const text = await res.text();
  try {
    const obj = JSON.parse(sanitizeJsonText(text));
    JSON_CACHE[cacheKey] = obj;
    return obj;
  } catch (err) {
    throw new Error(`Invalid JSON in ${path}: ${err.message || err}`);
  }
}

function isFiniteValue(v) {
  if (v === null || v === undefined || v === '') return false;
  const x = Number(v);
  return Number.isFinite(x);
}
function num(v) { return isFiniteValue(v) ? Number(v) : NaN; }
function fmt(x) { return isFiniteValue(x) ? Number(x).toExponential(3) : '--'; }
function clearSelect(sel) { if (sel) sel.innerHTML = ''; }
function addOption(sel, value, text) {
  const opt = document.createElement('option');
  opt.value = String(value);
  opt.textContent = text;
  sel.appendChild(opt);
}
function unique(arr) { return [...new Set(arr.filter(x => x !== null && x !== undefined && x !== ''))]; }
function getEl(id) { return document.getElementById(id); }
function setHtml(id, html) { const el = getEl(id); if (el) el.innerHTML = html; }
function setText(id, text) { const el = getEl(id); if (el) el.textContent = text; }
function escapeHtml(s) { return String(s ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch])); }
function escapeAttr(s) { return escapeHtml(s); }

function categoryOfIndexRow(x) {
  return x.material_category || x.material_class || x.category || x.class || 'Other materials';
}
function safeModelsByN(rec) {
  return (rec && rec.models_by_N && typeof rec.models_by_N === 'object') ? rec.models_by_N : {};
}
function validNs(rec) {
  return Object.keys(safeModelsByN(rec))
    .filter(n => Number.isFinite(Number(n)) && safeModelsByN(rec)[n] && typeof safeModelsByN(rec)[n] === 'object')
    .sort((a,b) => Number(a)-Number(b));
}
function preferredN(rec, ns) {
  const candidates = [
    rec?.final_recommendation?.N,
    rec?.selected_N,
    rec?.selected_n,
    rec?.recommended_N,
    ns.includes('5') ? '5' : null,
    ns.length ? ns[0] : null
  ].filter(v => v !== null && v !== undefined).map(v => String(v));
  for (const c of candidates) if (ns.includes(c)) return c;
  return ns.length ? ns[0] : '';
}

async function init() {
  ensurePlotControls();
  INDEX = await loadJson('data/materials_index.json');
  if (!Array.isArray(INDEX)) throw new Error('materials_index.json must be an array');

  const classSelect = getEl('classSelect');
  const materialSelect = getEl('materialSelect');
  const search = getEl('materialSearch');

  const classValues = unique(INDEX.map(categoryOfIndexRow));
  const classes = [
    ...MATERIAL_CLASS_ORDER.filter(c => classValues.includes(c)),
    ...classValues.filter(c => !MATERIAL_CLASS_ORDER.includes(c)).sort((a,b) => String(a).localeCompare(String(b)))
  ];
  clearSelect(classSelect);
  addOption(classSelect, ALL_CLASSES, ALL_CLASSES);
  classes.forEach(c => addOption(classSelect, c, c));

  const materialCount = unique(INDEX.map(x => x.material)).length;
  const readyCount = INDEX.reduce((s, x) => s + Number(x.fdtd_ready_count || x.FDTD_ready_count || 0), 0);
  const stats = getEl('databaseStats');
  if (stats) stats.textContent = `${INDEX.length} records · ${materialCount} materials${readyCount ? ` · ${readyCount} FDTD-ready entries` : ''}`;

  classSelect.addEventListener('change', () => updateMaterials());
  search.addEventListener('input', () => updateMaterials({keepMaterial: false}));
  materialSelect.addEventListener('change', () => updateRecords());
  getEl('recordSelect').addEventListener('change', () => updateNs());
  getEl('nSelect').addEventListener('change', () => renderCurrent());

  updateMaterials({keepMaterial: false});
  await updateRecords();
}

function filteredIndexForControls() {
  const cls = getEl('classSelect')?.value || ALL_CLASSES;
  const q = (getEl('materialSearch')?.value || '').trim().toLowerCase();
  return INDEX.filter(x => {
    const okClass = cls === ALL_CLASSES || categoryOfIndexRow(x) === cls;
    const okSearch = !q || String(x.material || '').toLowerCase().includes(q) || String(x.record_label || '').toLowerCase().includes(q);
    return okClass && okSearch;
  });
}

function updateMaterials(opts={keepMaterial:true}) {
  const materialSelect = getEl('materialSelect');
  const prev = materialSelect.value;
  const rows = filteredIndexForControls();
  const materials = unique(rows.map(x => x.material)).sort((a,b) => String(a).localeCompare(String(b)));
  clearSelect(materialSelect);
  if (!materials.length) {
    addOption(materialSelect, '', 'No matching material');
    updateRecords();
    return;
  }
  for (const m of materials) {
    const nrec = rows.filter(x => x.material === m).length;
    addOption(materialSelect, m, `${m} (${nrec})`);
  }
  if (opts.keepMaterial && materials.includes(prev)) materialSelect.value = prev;
  else materialSelect.value = materials[0];
  updateRecords();
}

function recordsForMaterial(material) {
  return filteredIndexForControls()
    .filter(x => x.material === material)
    .sort((a,b) => String(a.record_label || a.record_key).localeCompare(String(b.record_label || b.record_key)));
}

async function updateRecords() {
  const token = ++RENDER_TOKEN;
  const material = getEl('materialSelect').value;
  const recSel = getEl('recordSelect');
  clearSelect(recSel);
  clearSelect(getEl('nSelect'));
  clearPanels('Loading records...');

  const recs = recordsForMaterial(material);
  if (!recs.length) {
    addOption(recSel, '', 'No records');
    addOption(getEl('nSelect'), '', 'No fitted order');
    clearPanels('No records are available for this material.');
    return;
  }
  recs.forEach(r => addOption(recSel, r.record_key, r.record_label || r.record_key));
  if (token !== RENDER_TOKEN) return;
  await updateNs(token);
}

async function getRecord(recordKey) {
  if (!recordKey) return null;
  if (!RECORD_CACHE[recordKey]) RECORD_CACHE[recordKey] = await loadJson(`data/records/${recordKey}.json`);
  return RECORD_CACHE[recordKey];
}

function clearPanels(message) {
  setHtml('recommendationBox', `<div class="family">${escapeHtml(message)}</div>`);
  setHtml('modelTable', '');
  setText('metadataBox', '');
  setHtml('sourceBox', '');
  const plotDiv = getEl('nkPlot');
  if (plotDiv) {
    if (window.Plotly && plotDiv.data) Plotly.purge(plotDiv);
    plotDiv.innerHTML = escapeHtml(message);
  }
  setText('plotNote', '');
  const rangeLabel = getEl('plotRangeLabel');
  if (rangeLabel) rangeLabel.textContent = '';
}

async function updateNs(existingToken=null) {
  const token = existingToken || ++RENDER_TOKEN;
  const recordKey = getEl('recordSelect').value;
  const nSel = getEl('nSelect');
  clearSelect(nSel);
  clearPanels('Loading record...');
  try {
    const rec = await getRecord(recordKey);
    if (token !== RENDER_TOKEN) return;
    const ns = validNs(rec);
    if (!ns.length) {
      addOption(nSel, '', 'No fitted order');
      clearPanels('No fitted model order is available for this record.');
      return;
    }
    ns.forEach(n => addOption(nSel, n, `N = ${n}`));
    const preferred = preferredN(rec, ns);
    nSel.value = preferred || ns[0];
    if (!nSel.value && nSel.options.length) nSel.selectedIndex = 0;
    await renderCurrent(token);
  } catch (err) {
    if (token !== RENDER_TOKEN) return;
    addOption(nSel, '', 'Record load failed');
    clearPanels(`Could not load selected record: ${err.message || err}`);
  }
}

function usable(m) { return !!(m && m.FDTD_ready && isFiniteValue(m.epsilon_rms)); }
function finiteRms(m) { return !!(m && isFiniteValue(m.epsilon_rms)); }
function cpFamilyBest(entry) {
  const cp = entry?.models?.CP || null;
  const scp = entry?.models?.SCP || null;
  const ready = [cp, scp].filter(usable);
  if (ready.length) return ready.sort((a,b) => num(a.epsilon_rms) - num(b.epsilon_rms))[0];
  const finite = [cp, scp].filter(finiteRms);
  if (finite.length) return finite.sort((a,b) => num(a.epsilon_rms) - num(b.epsilon_rms))[0];
  return cp || scp || null;
}
function familyDisplayName(m) { return !m ? '--' : (m.family === 'RP' ? 'Rational-pole (RP)' : 'Critical-point (CP)'); }
function publicCode(m, n) { return !m ? '--' : (m.family === 'RP' ? `RP_M${n}` : `CP_M${n}`); }
function statusBadge(m) {
  if (!m) return '<span class="badge bad">not available</span>';
  if (m.FDTD_ready && m.model_json) return '<span class="badge good">FDTD-ready</span>';
  if (m.FDTD_ready && !m.model_json) return '<span class="badge warn">not exported</span>';
  return '<span class="badge bad">not ready</span>';
}
function modelRow(displayName, m, n) {
  let link = '--';
  if (m && m.model_json) link = `<a href="${escapeAttr(normalizeDataPath(modelJsonPath(m)))}" target="_blank">download</a>`;
  else if (m && m.FDTD_ready) link = '<span class="muted">not exported</span>';
  return `<tr><td>${displayName}<br><small>${publicCode(m, n)}</small></td><td>${fmt(m?.epsilon_rms)}</td><td>${fmt(m?.absolute_rms)}</td><td>${statusBadge(m)}</td><td>${link}</td></tr>`;
}
function badgeForQuality(q) {
  if (q === 'excellent' || q === 'acceptable') return 'good';
  if (q === 'warning') return 'warn';
  return 'bad';
}
function fitRange(rec) {
  const r = rec && Array.isArray(rec.wavelength_range_um) ? rec.wavelength_range_um : DEFAULT_FIT_RANGE_UM;
  const lo = Number(r[0]);
  const hi = Number(r[1]);
  if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) return [lo, hi];
  return DEFAULT_FIT_RANGE_UM;
}
function rangeText(range) { return `${range[0].toFixed(3)}-${range[1].toFixed(3)} µm`; }
function poorFitWarning(m) {
  const rms = num(m?.epsilon_rms);
  if (Number.isFinite(rms) && rms > 0.05) return `<p class="warning-note">This model is FDTD-ready but optically inaccurate over the selected wavelength range.</p>`;
  return '';
}


function modelCurvePath(m) {
  return m ? (m.model_curve || m.model_curve_json || m.website_model_curve || '') : '';
}

function modelJsonPath(m) {
  return m ? (m.model_json || m.website_model_json || '') : '';
}

function isUsableModel(m) {
  return !!(m && m.FDTD_ready && modelJsonPath(m) && modelCurvePath(m) && isFiniteValue(m.epsilon_rms));
}

function bestModel(models) {
  const arr = (models || []).filter(isUsableModel);
  if (!arr.length) return null;
  arr.sort((a, b) => {
    const ar = Number(a.epsilon_rms);
    const br = Number(b.epsilon_rms);
    if (Number.isFinite(ar) && Number.isFinite(br) && ar !== br) return ar - br;
    const af = String(a.family || '');
    const bf = String(b.family || '');
    return af.localeCompare(bf);
  });
  return arr[0];
}

function normalizeModelEntry(entry, n=null) {
  if (Array.isArray(entry)) {
    const rows = entry.filter(x => x && typeof x === 'object');
    const models = {};
    for (const m0 of rows) {
      const m = {...m0};
      if (!m.model_curve && m.model_curve_json) m.model_curve = m.model_curve_json;
      if (!m.model_json && m.website_model_json) m.model_json = m.website_model_json;
      if (!m.model_curve && m.website_model_curve) m.model_curve = m.website_model_curve;
      const fam = String(m.family || m.public_family || '').toUpperCase();
      if (fam) models[fam] = m;
    }

    let selected = rows.find(m => m && (m.recommended === true || m.selected === true) && isUsableModel(m));
    if (!selected) selected = bestModel(rows);

    return {
      N: n !== null && n !== undefined ? Number(n) : (selected ? Number(selected.N) : null),
      quality_label: selected ? (selected.quality_label || 'unknown') : 'none',
      selected: selected,
      models: models
    };
  }

  if (entry && typeof entry === 'object') {
    const out = {...entry};
    out.models = out.models || {};
    for (const k of Object.keys(out.models)) {
      const m = out.models[k];
      if (m && typeof m === 'object') {
        if (!m.model_curve && m.model_curve_json) m.model_curve = m.model_curve_json;
        if (!m.model_json && m.website_model_json) m.model_json = m.website_model_json;
        if (!m.model_curve && m.website_model_curve) m.model_curve = m.website_model_curve;
      }
    }
    if (!out.selected) out.selected = bestModel(Object.values(out.models));
    return out;
  }

  return {N: n, quality_label: 'none', selected: null, models: {}};
}

function normalizePointPayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const pts = payload.points;

  if (Array.isArray(pts)) {
    const out = {...payload, points: {}};
    const keys = ['wavelength_um', 'wl_um', 'lambda_um', 'wavelength', 'n', 'k', 'eps_real', 'eps_imag'];
    for (const key of keys) out.points[key] = [];
    for (const row of pts) {
      if (!row || typeof row !== 'object') continue;
      const wl = row.wavelength_um ?? row.wl_um ?? row.lambda_um ?? row.wavelength;
      out.points.wavelength_um.push(wl);
      out.points.wl_um.push(wl);
      out.points.lambda_um.push(wl);
      out.points.wavelength.push(wl);
      out.points.n.push(row.n);
      out.points.k.push(row.k);
      out.points.eps_real.push(row.eps_real);
      out.points.eps_imag.push(row.eps_imag);
    }
    return out;
  }

  if (pts && typeof pts === 'object') {
    const out = {...payload, points: {...pts}};
    const wl = out.points.wavelength_um || out.points.wl_um || out.points.lambda_um || out.points.wavelength;
    if (wl) {
      out.points.wavelength_um = wl;
      out.points.wl_um = wl;
      out.points.lambda_um = wl;
      out.points.wavelength = wl;
    }
    return out;
  }

  return payload;
}


async function renderCurrent(existingToken=null) {
  const token = existingToken || ++RENDER_TOKEN;
  const recordKey = getEl('recordSelect').value;
  const n = getEl('nSelect').value;
  if (!recordKey || !n) { clearPanels('No model order selected.'); return; }

  let rec, entry;
  try {
    rec = await getRecord(recordKey);
    entry = normalizeModelEntry(safeModelsByN(rec)[String(n)], n);
  } catch (err) {
    if (token !== RENDER_TOKEN) return;
    clearPanels(`Could not load selected record: ${err.message || err}`);
    return;
  }
  if (token !== RENDER_TOKEN) return;
  if (!entry || typeof entry !== 'object') { clearPanels(`No model entry is available for N = ${n}.`); return; }

  const sel = entry.selected || null;
  const box = getEl('recommendationBox');
  if (!sel) {
    box.innerHTML = `<div class="family">No model</div><span class="badge bad">No FDTD-ready model at this N</span>`;
  } else {
    const q = entry.quality_label || 'unknown';
    const downloadLine = sel.model_json
      ? `<p><a class="button-link" href="${escapeAttr(normalizeDataPath(modelJsonPath(sel)))}" target="_blank">Download PoleResidue JSON</a></p>`
      : `<p class="muted">PoleResidue JSON is not exported for this selected entry.</p>`;
    box.innerHTML = `
      <div class="family">${familyDisplayName(sel)}</div>
      <p><span class="badge ${badgeForQuality(q)}">${escapeHtml(q)}</span><span class="badge">${publicCode(sel, n)}</span></p>
      <p class="metric-line"><b>ε RMS:</b> ${fmt(sel.epsilon_rms)}<br><b>Abs RMS:</b> ${fmt(sel.absolute_rms)}<br><b>Format:</b> PoleResidue JSON<br><b>Status:</b> ${escapeHtml(sel.FDTD_status || '--')}</p>
      ${poorFitWarning(sel)}
      ${downloadLine}
    `;
  }

  const cpBest = cpFamilyBest(entry);
  setHtml('modelTable', `
    <table><thead><tr><th>Model family</th><th>ε RMS</th><th>Abs RMS</th><th>Status</th><th>JSON</th></tr></thead>
    <tbody>${modelRow('Rational-pole (RP)', entry.models?.RP || null, n)}${modelRow('Critical-point (CP)', cpBest, n)}</tbody></table>
  `);

  const meta = {
    material: rec.material,
    material_category: rec.material_category || rec.material_class,
    record: `${rec.book} / ${rec.page}`,
    wavelength_range_um: rec.wavelength_range_um,
    selected_N: Number(n),
    selected_family: sel ? (sel.family === 'RP' ? 'RP' : 'CP') : 'none',
    selected_model: sel ? publicCode(sel, n) : 'none',
    epsilon_rms: sel && isFiniteValue(sel.epsilon_rms) ? Number(sel.epsilon_rms) : null,
    FDTD_status: sel ? (sel.FDTD_status || null) : 'NO_FDTD_READY_MODEL',
    exported: !!(sel && sel.model_json)
  };
  setText('metadataBox', JSON.stringify(meta, null, 2));

  await renderNkPlot(rec, entry, Number(n), token);
  await renderSourcePanel(rec, token);
}

function getWavelengthArray(points) { return points?.wavelength_um || points?.wavelength || points?.lambda_um || points?.wl_um || []; }
function filterXY(wl, y, range) {
  const pairs = [];
  if (!Array.isArray(wl) || !Array.isArray(y)) return {x: [], y: []};
  for (let i = 0; i < wl.length && i < y.length; i++) {
    const x = Number(wl[i]);
    const yy = Number(y[i]);
    if (Number.isFinite(x) && Number.isFinite(yy) && x >= range[0] && x <= range[1]) pairs.push([x, yy]);
  }
  pairs.sort((a, b) => a[0] - b[0]);
  return {x: pairs.map(p => p[0]), y: pairs.map(p => p[1])};
}

function currentPlotQuantity() {
  const el = getEl('plotQuantitySelect') || document.getElementById('plotQuantitySelect');
  return el && el.value === 'eps' ? 'eps' : 'nk';
}

function primaryAxisTitle() {
  return currentPlotQuantity() === 'eps' ? 'Re ε' : 'n';
}

function secondaryAxisTitle() {
  return currentPlotQuantity() === 'eps' ? 'Im ε' : 'k';
}

function epsilonSeriesFromNK(points, component) {
  const nArr = points?.n || points?.refractive_index_n || [];
  const kArr = points?.k || points?.extinction_coefficient_k || [];
  if (!Array.isArray(nArr) || !Array.isArray(kArr)) return [];
  const out = [];
  const m = Math.min(nArr.length, kArr.length);
  for (let i = 0; i < m; i++) {
    const n = Number(nArr[i]);
    const k = Number(kArr[i]);
    if (!Number.isFinite(n) || !Number.isFinite(k)) {
      out.push(null);
    } else if (component === 'primary') {
      out.push(n*n - k*k);
    } else {
      out.push(2*n*k);
    }
  }
  return out;
}

function seriesFromPoints(points, quantity, component) {
  if (!points || typeof points !== 'object') return [];
  if (quantity === 'eps') {
    if (component === 'primary') {
      const direct = points.eps_real || points.epsilon_real || points.re_eps || points.Re_epsilon || points.real_epsilon;
      return Array.isArray(direct) && direct.length ? direct : epsilonSeriesFromNK(points, 'primary');
    }
    const direct = points.eps_imag || points.epsilon_imag || points.im_eps || points.Im_epsilon || points.imag_epsilon;
    return Array.isArray(direct) && direct.length ? direct : epsilonSeriesFromNK(points, 'secondary');
  }
  if (component === 'primary') return points.n || points.refractive_index_n || [];
  return points.k || points.extinction_coefficient_k || [];
}

function quantityTraceNames(prefix) {
  return currentPlotQuantity() === 'eps'
    ? [`${prefix} Re ε`, `${prefix} Im ε`]
    : [`${prefix} n`, `${prefix} k`];
}

function hoverQuantityLabels() {
  return currentPlotQuantity() === 'eps' ? ['Re ε', 'Im ε'] : ['n', 'k'];
}

function addOpticalTraces(traces, payload, prefix, mode, markerStyle, lineStyle, range) {
  if (!payload || !payload.points) return;
  const pts = payload.points;
  const wl = getWavelengthArray(pts);
  if (!wl.length) return;

  const quantity = currentPlotQuantity();
  const names = quantityTraceNames(prefix);
  const labels = hoverQuantityLabels();
  const primary = seriesFromPoints(pts, quantity, 'primary');
  const secondary = seriesFromPoints(pts, quantity, 'secondary');

  if (primary && primary.length) {
    const s = filterXY(wl, primary, range);
    if (s.x.length) {
      const tr = {
        x: s.x,
        y: s.y,
        mode,
        name: names[0],
        hovertemplate: 'λ=%{x:.4f} µm<br>' + labels[0] + '=%{y:.4g}<extra>' + names[0] + '</extra>'
      };
      if (markerStyle) tr.marker = markerStyle;
      if (lineStyle) tr.line = lineStyle;
      traces.push(tr);
    }
  }

  if (secondary && secondary.length) {
    const s = filterXY(wl, secondary, range);
    if (s.x.length) {
      const tr = {
        x: s.x,
        y: s.y,
        yaxis: 'y2',
        mode,
        name: names[1],
        hovertemplate: 'λ=%{x:.4f} µm<br>' + labels[1] + '=%{y:.4g}<extra>' + names[1] + '</extra>'
      };
      if (markerStyle) tr.marker = markerStyle;
      if (lineStyle) tr.line = lineStyle;
      traces.push(tr);
    }
  }
}

function addExperimentalTraces(traces, payload, range) {
  addOpticalTraces(traces, payload, 'experiment', 'markers', {size: 7.5, opacity: 0.9, symbol: 'circle'}, null, range);
}

function addFitGridTraces(traces, payload, range) {
  addOpticalTraces(traces, payload, 'fit grid', 'markers', {size: 4, opacity: 0.45, symbol: 'circle-open'}, null, range);
}

function addModelTraces(traces, payload, label, dash, range) {
  const lineStyle = {width: 2.4};
  if (dash) lineStyle.dash = dash;
  addOpticalTraces(traces, payload, label, 'lines', null, lineStyle, range);
}

function modelForPlotChoice(entry, choice) {
  const e = normalizeModelEntry(entry);
  const models = e.models || {};
  const rp = models.RP || null;

  const cpCandidates = [models.SCP, models.CP].filter(Boolean);
  const cpBest = bestModel(cpCandidates) || cpCandidates[0] || null;
  const sel = e.selected || bestModel(Object.values(models));

  if (choice === 'RP') return [rp].filter(Boolean);
  if (choice === 'CP') return [cpBest].filter(Boolean);
  if (choice === 'both') return [rp, cpBest].filter(Boolean);
  return [sel].filter(Boolean);
}


function ensurePlotControls() {
  if (getEl('plotModelSelect')) return;
  const plotDiv = getEl('nkPlot');
  if (!plotDiv || !plotDiv.parentElement) return;
  const controls = document.createElement('div');
  controls.className = 'plot-controls';
  controls.innerHTML = `
    <label>Plot quantity
      <select id="plotQuantitySelect">
        <option value="nk">n, k</option>
        <option value="eps">Re ε, Im ε</option>
      </select>
    </label>
    <label>Displayed model curve
      <select id="plotModelSelect">
        <option value="recommended">Recommended model</option>
        <option value="CP">CP model only</option>
        <option value="RP">RP model only</option>
        <option value="both">RP and CP models</option>
      </select>
    </label>
    <label class="checkbox-label"><input type="checkbox" id="showFitGridToggle" /> Show fitting grid</label>
    <span class="plot-range-label" id="plotRangeLabel"></span>
  `;
  plotDiv.parentElement.insertBefore(controls, plotDiv);
  const plotQuantitySelect = getEl('plotQuantitySelect') || document.getElementById('plotQuantitySelect');
  if (plotQuantitySelect) plotQuantitySelect.addEventListener('change', () => renderCurrent());
  getEl('plotModelSelect').addEventListener('change', () => renderCurrent());
  getEl('showFitGridToggle').addEventListener('change', () => renderCurrent());
}

async function renderNkPlot(rec, entry, n, token) {
  const plotDiv = getEl('nkPlot');
  const note = getEl('plotNote');
  const traces = [];
  const notes = [];
  const range = fitRange(rec);
  const selector = getEl('plotModelSelect');
  const choice = selector ? selector.value : 'recommended';
  const showFitGrid = getEl('showFitGridToggle')?.checked || false;
  const rangeLabel = getEl('plotRangeLabel');
  if (rangeLabel) rangeLabel.textContent = `Displayed wavelength range: ${rangeText(range)}`;

  try {
    const raw = rec.raw_database_points ? normalizePointPayload(await loadJson(rec.raw_database_points)) : null;
    const fit = rec.fitting_grid_points ? normalizePointPayload(await loadJson(rec.fitting_grid_points)) : null;
    if (token !== RENDER_TOKEN) return;
    addExperimentalTraces(traces, raw, range);
    if (showFitGrid) addFitGridTraces(traces, fit, range);
    for (const m of modelForPlotChoice(entry, choice)) {
      const curvePath = modelCurvePath(m);
      if (m && curvePath) {
        const curve = normalizePointPayload(await loadJson(curvePath));
        if (token !== RENDER_TOKEN) return;
        addModelTraces(traces, curve, publicCode(m, n), m.family === 'RP' ? 'dash' : null, range);
      } else if (m) {
        notes.push(`${publicCode(m, n)} model curve is not available.`);
      }
    }
    if (!rec.raw_database_points) notes.push('Raw optical-constant JSON was not found.');
    if (!rec.fitting_grid_points) notes.push('Fitting-grid optical-constant JSON was not found.');
    if (!traces.length) {
      if (window.Plotly && plotDiv.data) Plotly.purge(plotDiv);
      plotDiv.innerHTML = 'No optical-constant or model-curve data available for this record within the fitted wavelength window.';
      if (note) note.textContent = notes.join(' ');
      return;
    }
    Plotly.newPlot(plotDiv, traces, {
      margin: {l: 64, r: 74, t: 16, b: 68},
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: '#ffffff',
      xaxis: {title: `Wavelength, λ (µm)`, range: range, zeroline: false, automargin: true, showgrid: true, gridcolor: '#eeeeee'},
      yaxis: {title: primaryAxisTitle(), automargin: true, zeroline: false, showgrid: true, gridcolor: '#eeeeee'},
      yaxis2: {title: secondaryAxisTitle(), overlaying: 'y', side: 'right', automargin: true, zeroline: false, showgrid: false},
      legend: {orientation: 'h', y: -0.28, x: 0, traceorder: 'normal'},
      hovermode: 'x unified'
    }, {responsive: true, displaylogo: false});
    if (note) note.textContent = notes.join(' ');
  } catch (err) {
    if (token !== RENDER_TOKEN) return;
    if (window.Plotly && plotDiv.data) Plotly.purge(plotDiv);
    plotDiv.innerHTML = `Could not render optical constants: ${escapeHtml(err.message || String(err))}`;
    if (note) note.textContent = '';
  }
}

function cleanCitationHtml(s) {
  return String(s || '').replace(/\n/g, '<br>');
}
async function renderSourcePanel(rec, token) {
  const box = getEl('sourceBox');
  if (!box || !rec) return;
  let rawPayload = null;
  try {
    rawPayload = rec.raw_database_points ? await loadJson(rec.raw_database_points) : null;
  } catch (_) {}
  if (token !== RENDER_TOKEN) return;
  const src = rec.experimental_source || rawPayload?.metadata || rawPayload || {};
  const book = src.book || rec.book || '';
  const page = src.page || rec.page || '';
  const url = src.url || src.download_url || src.source_url || src.refractiveindex_url || rawPayload?.metadata?.url || '';
  const citation = src.citation || src.reference || src.references || rawPayload?.metadata?.citation || '';
  const comments = src.comments || rawPayload?.metadata?.comments || '';
  const sourceLabel = src.label || `${book} / ${page}`;
  const rawLink = rec.raw_database_points ? `<a href="${escapeAttr(normalizeDataPath(rec.raw_database_points))}" target="_blank">raw experimental JSON</a>` : '<span class="muted">not available</span>';
  const fitLink = rec.fitting_grid_points ? `<a href="${escapeAttr(normalizeDataPath(rec.fitting_grid_points))}" target="_blank">fitting-grid JSON</a>` : '<span class="muted">not available</span>';
  const sourceUrl = url ? `<a href="${escapeAttr(url)}" target="_blank">open source page</a>` : '<span class="muted">not available</span>';
  box.innerHTML = `
    <div class="source-grid">
      <div><span class="source-label">Material class</span><strong>${escapeHtml(rec.material_category || rec.material_class || 'Other materials')}</strong></div>
      <div><span class="source-label">Database record</span><strong>${escapeHtml(sourceLabel)}</strong></div>
      <div><span class="source-label">Raw data</span>${rawLink}</div>
      <div><span class="source-label">Fitting grid</span>${fitLink}</div>
      <div><span class="source-label">Original source</span>${sourceUrl}</div>
    </div>
    ${citation ? `<div class="citation-block"><span class="source-label">Reference</span><p>${cleanCitationHtml(citation)}</p></div>` : ''}
    ${comments ? `<div class="citation-block"><span class="source-label">Notes</span><p>${escapeHtml(comments)}</p></div>` : ''}
  `;
}

init().catch(err => { document.body.innerHTML = `<pre>${escapeHtml(err.stack || err)}</pre>`; });
