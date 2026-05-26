let INDEX = [];
let RECORD_CACHE = {};
let JSON_CACHE = {};

const APP_VERSION = '20260526_9';
const DEFAULT_FIT_RANGE_UM = [0.3, 1.1];

async function loadJson(path) {
  if (!path) return null;
  const cacheKey = path;
  if (JSON_CACHE[cacheKey]) return JSON_CACHE[cacheKey];
  const sep = path.includes('?') ? '&' : '?';
  const url = `${path}${sep}v=${APP_VERSION}`;
  const res = await fetch(url, {cache: 'no-store'});
  if (!res.ok) throw new Error(`Cannot load ${url} [HTTP ${res.status}]`);
  JSON_CACHE[cacheKey] = await res.json();
  return JSON_CACHE[cacheKey];
}

function fmt(x) {
  if (x === null || x === undefined || Number.isNaN(Number(x))) return '--';
  return Number(x).toExponential(3);
}
function clearSelect(sel) { sel.innerHTML = ''; }
function addOption(sel, value, text) {
  const opt = document.createElement('option');
  opt.value = String(value);
  opt.textContent = text;
  sel.appendChild(opt);
}
function unique(arr) { return [...new Set(arr)]; }
function safeModelsByN(rec) { return (rec && rec.models_by_N && typeof rec.models_by_N === 'object') ? rec.models_by_N : {}; }
function validNs(rec) {
  return Object.keys(safeModelsByN(rec))
    .filter(n => Number.isFinite(Number(n)))
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
  INDEX = await loadJson('data/materials_index.json');
  const materialSelect = document.getElementById('materialSelect');
  const materials = unique(INDEX.map(x => x.material)).sort();
  clearSelect(materialSelect);
  materials.forEach(m => addOption(materialSelect, m, m));
  materialSelect.addEventListener('change', updateRecords);
  document.getElementById('recordSelect').addEventListener('change', updateNs);
  document.getElementById('nSelect').addEventListener('change', renderCurrent);
  ensurePlotControls();
  await updateRecords();
}

function ensurePlotControls() {
  if (document.getElementById('plotModelSelect')) return;
  const plotDiv = document.getElementById('nkPlot');
  if (!plotDiv || !plotDiv.parentElement) return;

  const controls = document.createElement('div');
  controls.className = 'plot-controls';
  controls.innerHTML = `
    <label>Displayed model curve
      <select id="plotModelSelect">
        <option value="recommended">Recommended model</option>
        <option value="CP">CP model only</option>
        <option value="RP">RP model only</option>
        <option value="both">RP and CP models</option>
      </select>
    </label>
    <label class="checkbox-label">
      <input type="checkbox" id="showFitGridToggle" />
      Show fitting grid
    </label>
    <span class="plot-range-label" id="plotRangeLabel"></span>
  `;
  plotDiv.parentElement.insertBefore(controls, plotDiv);
  document.getElementById('plotModelSelect').addEventListener('change', renderCurrent);
  document.getElementById('showFitGridToggle').addEventListener('change', renderCurrent);
}

function recordsForMaterial(material) {
  return INDEX.filter(x => x.material === material).sort((a,b) => String(a.record_label).localeCompare(String(b.record_label)));
}

async function updateRecords() {
  const material = document.getElementById('materialSelect').value;
  const recSel = document.getElementById('recordSelect');
  clearSelect(recSel);
  const recs = recordsForMaterial(material);
  recs.forEach(r => addOption(recSel, r.record_key, r.record_label));
  await updateNs();
}

async function getRecord(recordKey) {
  if (!recordKey) return null;
  if (!RECORD_CACHE[recordKey]) {
    RECORD_CACHE[recordKey] = await loadJson(`data/records/${recordKey}.json`);
  }
  return RECORD_CACHE[recordKey];
}

function clearStalePanels(message) {
  document.getElementById('recommendationBox').innerHTML = `<div class="family">${message}</div>`;
  document.getElementById('modelTable').innerHTML = '';
  document.getElementById('metadataBox').textContent = '';
  const plotDiv = document.getElementById('nkPlot');
  if (plotDiv) plotDiv.innerHTML = message;
  const note = document.getElementById('plotNote');
  if (note) note.textContent = '';
}

async function updateNs() {
  const recordKey = document.getElementById('recordSelect').value;
  const nSel = document.getElementById('nSelect');
  clearSelect(nSel);
  clearStalePanels('Loading record...');

  try {
    const rec = await getRecord(recordKey);
    const ns = validNs(rec);
    if (!ns.length) {
      addOption(nSel, '', 'No fitted order');
      clearStalePanels('No fitted model order is available for this record.');
      return;
    }
    ns.forEach(n => addOption(nSel, n, `N = ${n}`));
    nSel.value = preferredN(rec, ns);
    if (!nSel.value) nSel.value = ns[0];
    await renderCurrent();
  } catch (err) {
    addOption(nSel, '', 'Record load failed');
    clearStalePanels(`Could not load selected record: ${err.message || err}`);
  }
}

function usable(m) { return m && m.FDTD_ready && Number.isFinite(Number(m.epsilon_rms)); }
function finiteRms(m) { return m && Number.isFinite(Number(m.epsilon_rms)); }
function cpFamilyBest(entry) {
  const cp = entry?.models?.CP;
  const scp = entry?.models?.SCP;
  const ready = [cp, scp].filter(usable);
  if (ready.length) return ready.sort((a,b) => Number(a.epsilon_rms) - Number(b.epsilon_rms))[0];
  const finite = [cp, scp].filter(finiteRms);
  if (finite.length) return finite.sort((a,b) => Number(a.epsilon_rms) - Number(b.epsilon_rms))[0];
  return cp || scp || null;
}
function familyDisplayName(m) {
  if (!m) return '--';
  return m.family === 'RP' ? 'Rational-pole (RP) model' : 'Critical-point (CP) model';
}
function publicCode(m, n) {
  if (!m) return '--';
  return m.family === 'RP' ? `RP_M${n}` : `CP_M${n}`;
}
function modelRow(displayName, m, n) {
  const ready = m && m.FDTD_ready ? '<span class="badge good">FDTD-ready</span>' : '<span class="badge bad">not ready</span>';
  let link = '--';
  if (m && m.model_json) link = `<a href="${m.model_json}" target="_blank">download</a>`;
  else if (m && m.FDTD_ready) link = '<span class="muted">not exported</span>';
  return `<tr><td>${displayName}<br><small>${publicCode(m, n)}</small></td><td>${fmt(m?.epsilon_rms)}</td><td>${fmt(m?.absolute_rms)}</td><td>${fmt(m?.G_rho)}</td><td>${ready}</td><td>${link}</td></tr>`;
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
  if (!m) return '';
  const rms = Number(m.epsilon_rms);
  if (Number.isFinite(rms) && rms > 0.05) {
    return `<p class="warning-note">This model is FDTD-ready but optically inaccurate over the selected wavelength range.</p>`;
  }
  return '';
}

async function renderCurrent() {
  const recordKey = document.getElementById('recordSelect').value;
  const n = document.getElementById('nSelect').value;
  if (!recordKey || !n) {
    clearStalePanels('No model order selected.');
    return;
  }

  let rec, entry;
  try {
    rec = await getRecord(recordKey);
    entry = safeModelsByN(rec)[String(n)];
  } catch (err) {
    clearStalePanels(`Could not load selected record: ${err.message || err}`);
    return;
  }

  if (!entry) {
    clearStalePanels(`No model entry is available for N = ${n}.`);
    return;
  }

  const sel = entry.selected || null;
  const box = document.getElementById('recommendationBox');
  if (!sel) {
    box.innerHTML = `<div class="family">No model</div><span class="badge bad">No FDTD-ready model at this N</span>`;
  } else {
    const q = entry.quality_label;
    const downloadLine = sel.model_json ? `<p><a href="${sel.model_json}" target="_blank">Download PoleResidue JSON</a></p>` : `<p class="muted">PoleResidue JSON is not exported for this selected entry.</p>`;
    box.innerHTML = `
      <div class="family">${familyDisplayName(sel)}</div>
      <p><span class="badge ${badgeForQuality(q)}">${q}</span> <span class="badge">${publicCode(sel, n)}</span></p>
      <p><b>ε RMS:</b> ${fmt(sel.epsilon_rms)}<br><b>G ρ:</b> ${fmt(sel.G_rho)}<br><b>Status:</b> ${sel.FDTD_status || '--'}</p>
      ${poorFitWarning(sel)}
      ${downloadLine}
    `;
  }

  const cpBest = cpFamilyBest(entry);
  document.getElementById('modelTable').innerHTML = `
    <table><thead><tr><th>Model family</th><th>ε RMS</th><th>Abs RMS</th><th>G ρ</th><th>Status</th><th>JSON</th></tr></thead>
    <tbody>${modelRow('Rational-pole (RP) model', entry.models?.RP, n)}${modelRow('Critical-point (CP) model', cpBest, n)}</tbody></table>
  `;

  const meta = {
    material: rec.material,
    material_class: rec.material_class,
    record: `${rec.book} / ${rec.page}`,
    wavelength_range_um: rec.wavelength_range_um,
    selected_N: Number(n),
    selected_family: sel ? (sel.family === 'RP' ? 'RP' : 'CP') : 'none',
    selected_model: sel ? publicCode(sel, n) : 'none',
    epsilon_rms: sel ? sel.epsilon_rms : null,
    FDTD_status: sel ? sel.FDTD_status : 'NO_FDTD_READY_MODEL'
  };
  document.getElementById('metadataBox').textContent = JSON.stringify(meta, null, 2);

  await renderNkPlot(rec, entry, Number(n));
}

function getWavelengthArray(points) { return points.wavelength_um || points.wavelength || points.lambda_um || points.wl_um || []; }
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

function addExperimentalTraces(traces, payload, range) {
  if (!payload || !payload.points) return;
  const pts = payload.points;
  const wl = getWavelengthArray(pts);
  if (!wl.length) return;
  if (pts.n) {
    const s = filterXY(wl, pts.n, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, mode: 'markers', name: 'experiment n', marker: {size: 8, opacity: 0.9, symbol: 'circle'}, hovertemplate: 'λ=%{x:.4f} µm<br>n=%{y:.4g}<extra>experiment n</extra>'});
  }
  if (pts.k) {
    const s = filterXY(wl, pts.k, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, yaxis: 'y2', mode: 'markers', name: 'experiment k', marker: {size: 8, opacity: 0.9, symbol: 'circle'}, hovertemplate: 'λ=%{x:.4f} µm<br>k=%{y:.4g}<extra>experiment k</extra>'});
  }
}

function addFitGridTraces(traces, payload, range) {
  if (!payload || !payload.points) return;
  const pts = payload.points;
  const wl = getWavelengthArray(pts);
  if (!wl.length) return;
  if (pts.n) {
    const s = filterXY(wl, pts.n, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, mode: 'markers', name: 'fit grid n', marker: {size: 4, opacity: 0.4, symbol: 'circle-open'}, hovertemplate: 'λ=%{x:.4f} µm<br>n=%{y:.4g}<extra>fit grid n</extra>'});
  }
  if (pts.k) {
    const s = filterXY(wl, pts.k, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, yaxis: 'y2', mode: 'markers', name: 'fit grid k', marker: {size: 4, opacity: 0.4, symbol: 'circle-open'}, hovertemplate: 'λ=%{x:.4f} µm<br>k=%{y:.4g}<extra>fit grid k</extra>'});
  }
}

function addModelTraces(traces, payload, label, dash, range) {
  if (!payload || !payload.points) return;
  const pts = payload.points;
  const wl = getWavelengthArray(pts);
  if (!wl.length) return;
  const lineStyle = {width: 2.6};
  if (dash) lineStyle.dash = dash;
  if (pts.n) {
    const s = filterXY(wl, pts.n, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, mode: 'lines', name: `${label} n`, line: lineStyle, hovertemplate: 'λ=%{x:.4f} µm<br>n=%{y:.4g}<extra>' + `${label} n` + '</extra>'});
  }
  if (pts.k) {
    const s = filterXY(wl, pts.k, range);
    if (s.x.length) traces.push({x: s.x, y: s.y, yaxis: 'y2', mode: 'lines', name: `${label} k`, line: lineStyle, hovertemplate: 'λ=%{x:.4f} µm<br>k=%{y:.4g}<extra>' + `${label} k` + '</extra>'});
  }
}

function modelForPlotChoice(entry, choice) {
  const cpBest = cpFamilyBest(entry);
  const rp = entry?.models?.RP;
  const sel = entry?.selected;
  if (choice === 'RP') return [rp].filter(Boolean);
  if (choice === 'CP') return [cpBest].filter(Boolean);
  if (choice === 'both') return [rp, cpBest].filter(Boolean);
  return [sel].filter(Boolean);
}

async function renderNkPlot(rec, entry, n) {
  const plotDiv = document.getElementById('nkPlot');
  const note = document.getElementById('plotNote');
  const traces = [];
  const notes = [];
  const range = fitRange(rec);
  const selector = document.getElementById('plotModelSelect');
  const choice = selector ? selector.value : 'recommended';
  const showFitGrid = document.getElementById('showFitGridToggle')?.checked || false;
  const rangeLabel = document.getElementById('plotRangeLabel');
  if (rangeLabel) rangeLabel.textContent = `Displayed wavelength range: ${rangeText(range)}`;

  try {
    const raw = rec.raw_database_points ? await loadJson(rec.raw_database_points) : null;
    const fit = rec.fitting_grid_points ? await loadJson(rec.fitting_grid_points) : null;

    addExperimentalTraces(traces, raw, range);
    if (showFitGrid) addFitGridTraces(traces, fit, range);

    const models = modelForPlotChoice(entry, choice);
    for (const m of models) {
      if (m && m.model_curve) {
        const curve = await loadJson(m.model_curve);
        const dash = m.family === 'RP' ? 'dash' : null;
        addModelTraces(traces, curve, publicCode(m, n), dash, range);
      } else if (m) {
        const exported = m.model_json ? '' : ' PoleResidue JSON is not exported.';
        notes.push(`${publicCode(m, n)} model curve is not available.${exported}`);
      }
    }

    if (!rec.raw_database_points) notes.push('Raw optical-constant JSON was not found in the copied database.');
    if (!rec.fitting_grid_points) notes.push('Fitting-grid optical-constant JSON was not found in the copied database.');

    if (!traces.length) {
      if (window.Plotly && plotDiv.data) Plotly.purge(plotDiv);
      plotDiv.innerHTML = 'No optical-constant or model-curve data available for this record within the fitted wavelength window.';
      note.textContent = notes.join(' ');
      return;
    }

    Plotly.newPlot(plotDiv, traces, {
      margin: {l: 64, r: 74, t: 20, b: 68},
      xaxis: {title: `Wavelength, λ (µm)`, range: range, zeroline: false, automargin: true},
      yaxis: {title: 'n', automargin: true, zeroline: false},
      yaxis2: {title: 'k', overlaying: 'y', side: 'right', automargin: true, zeroline: false},
      legend: {orientation: 'h', y: -0.30, x: 0, traceorder: 'normal'},
      hovermode: 'x unified'
    }, {responsive: true, displaylogo: false});
    note.textContent = notes.join(' ');
  } catch (err) {
    if (window.Plotly && plotDiv.data) Plotly.purge(plotDiv);
    plotDiv.innerHTML = `Could not render optical constants: ${err.message || err}`;
    note.textContent = '';
  }
}

init().catch(err => { document.body.innerHTML = `<pre>${err.stack || err}</pre>`; });
