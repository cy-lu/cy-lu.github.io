let INDEX = [];
let RECORD_CACHE = {};
let JSON_CACHE = {};

async function loadJson(path) {
  if (!path) return null;
  if (JSON_CACHE[path]) return JSON_CACHE[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot load ${path}`);
  JSON_CACHE[path] = await res.json();
  return JSON_CACHE[path];
}

function fmt(x) {
  if (x === null || x === undefined || Number.isNaN(Number(x))) return '--';
  return Number(x).toExponential(3);
}
function clearSelect(sel) { sel.innerHTML = ''; }
function addOption(sel, value, text) {
  const opt = document.createElement('option');
  opt.value = value;
  opt.textContent = text;
  sel.appendChild(opt);
}
function unique(arr) { return [...new Set(arr)]; }

async function init() {
  INDEX = await loadJson('data/materials_index.json?v=20260526_5');
  const materialSelect = document.getElementById('materialSelect');
  const materials = unique(INDEX.map(x => x.material)).sort();
  clearSelect(materialSelect);
  materials.forEach(m => addOption(materialSelect, m, m));
  materialSelect.addEventListener('change', updateRecords);
  document.getElementById('recordSelect').addEventListener('change', updateNs);
  document.getElementById('nSelect').addEventListener('change', renderCurrent);
  updateRecords();
}

function recordsForMaterial(material) {
  return INDEX.filter(x => x.material === material).sort((a,b) => a.record_label.localeCompare(b.record_label));
}
function updateRecords() {
  const material = document.getElementById('materialSelect').value;
  const recSel = document.getElementById('recordSelect');
  clearSelect(recSel);
  recordsForMaterial(material).forEach(r => addOption(recSel, r.record_key, r.record_label));
  updateNs();
}
async function getRecord(recordKey) {
  if (!RECORD_CACHE[recordKey]) {
    RECORD_CACHE[recordKey] = await loadJson(`data/records/${recordKey}.json?v=20260526_5`);
  }
  return RECORD_CACHE[recordKey];
}
async function updateNs() {
  const recordKey = document.getElementById('recordSelect').value;
  const nSel = document.getElementById('nSelect');
  clearSelect(nSel);
  const rec = await getRecord(recordKey);
  Object.keys(rec.models_by_N).sort((a,b) => Number(a)-Number(b)).forEach(n => addOption(nSel, n, `N = ${n}`));
  renderCurrent();
}

function usable(m) { return m && m.FDTD_ready && Number.isFinite(Number(m.epsilon_rms)); }
function finiteRms(m) { return m && Number.isFinite(Number(m.epsilon_rms)); }
function cpFamilyBest(entry) {
  const cp = entry.models.CP;
  const scp = entry.models.SCP;
  const ready = [cp, scp].filter(usable);
  if (ready.length) return ready.sort((a,b) => Number(a.epsilon_rms) - Number(b.epsilon_rms))[0];
  const finite = [cp, scp].filter(finiteRms);
  if (finite.length) return finite.sort((a,b) => Number(a.epsilon_rms) - Number(b.epsilon_rms))[0];
  return cp || scp;
}
function familyDisplayName(m) {
  if (!m) return '--';
  return m.family === 'RP' ? 'Rational-pole (RP) model' : 'Critical-point (CP) model';
}
function publicCode(m, n) {
  if (!m) return '--';
  return m.family === 'RP' ? `RP_M${n}` : `CP_M${n}`;
}
function publicCurve(m, n) {
  if (!m) return '';
  return m.model_curve || '';
}
function modelRow(displayName, m, n) {
  const ready = m && m.FDTD_ready ? '<span class="badge good">FDTD-ready</span>' : '<span class="badge bad">not ready</span>';
  const link = m && m.model_json ? `<a href="${m.model_json}" target="_blank">download</a>` : '--';
  return `<tr><td>${displayName}<br><small>${publicCode(m, n)}</small></td><td>${fmt(m?.epsilon_rms)}</td><td>${fmt(m?.absolute_rms)}</td><td>${fmt(m?.G_rho)}</td><td>${ready}</td><td>${link}</td></tr>`;
}
function badgeForQuality(q) {
  if (q === 'excellent' || q === 'acceptable') return 'good';
  if (q === 'warning') return 'warn';
  return 'bad';
}

async function renderCurrent() {
  const recordKey = document.getElementById('recordSelect').value;
  const n = document.getElementById('nSelect').value;
  const rec = await getRecord(recordKey);
  const entry = rec.models_by_N[n];
  const sel = entry.selected;

  const box = document.getElementById('recommendationBox');
  if (!sel) {
    box.innerHTML = `<div class="family">No model</div><span class="badge bad">No FDTD-ready model at this N</span>`;
  } else {
    const q = entry.quality_label;
    box.innerHTML = `
      <div class="family">${familyDisplayName(sel)}</div>
      <p><span class="badge ${badgeForQuality(q)}">${q}</span><span class="badge">${publicCode(sel, n)}</span></p>
      <p><b>ε RMS:</b> ${fmt(sel.epsilon_rms)}<br><b>G ρ:</b> ${fmt(sel.G_rho)}<br><b>Status:</b> ${sel.FDTD_status || '--'}</p>
      ${sel.model_json ? `<p><a href="${sel.model_json}" target="_blank">Download PoleResidue JSON</a></p>` : ''}
    `;
  }

  const cpBest = cpFamilyBest(entry);
  document.getElementById('modelTable').innerHTML = `
    <table><thead><tr><th>Model family</th><th>ε RMS</th><th>Abs RMS</th><th>G ρ</th><th>Status</th><th>JSON</th></tr></thead>
    <tbody>${modelRow('Rational-pole (RP) model', entry.models.RP, n)}${modelRow('Critical-point (CP) model', cpBest, n)}</tbody></table>
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

function addNkTraces(traces, payload, label, mode, dash) {
  if (!payload || !payload.points) return;
  const pts = payload.points;
  const wl = pts.wavelength_um || [];
  if (!wl.length) return;
  if (pts.n) {
    traces.push({x: wl, y: pts.n, mode: mode, name: `${label}: n`, line: dash ? {dash: dash} : undefined, marker: {size: 5}});
  }
  if (pts.k) {
    traces.push({x: wl, y: pts.k, mode: mode, name: `${label}: k`, yaxis: 'y2', line: dash ? {dash: dash} : undefined, marker: {size: 5}});
  }
}

async function renderNkPlot(rec, entry, n) {
  const plotDiv = document.getElementById('nkPlot');
  const note = document.getElementById('plotNote');
  const traces = [];
  const notes = [];

  try {
    const raw = rec.raw_database_points ? await loadJson(`${rec.raw_database_points}?v=20260526_5`) : null;
    const fit = rec.fitting_grid_points ? await loadJson(`${rec.fitting_grid_points}?v=20260526_5`) : null;
    addNkTraces(traces, raw, 'raw data', 'markers', null);
    addNkTraces(traces, fit, 'fit grid', 'lines', null);

    const sel = entry.selected;
    if (sel && sel.model_curve) {
      const curve = await loadJson(`${sel.model_curve}?v=20260526_5`);
      addNkTraces(traces, curve, `${publicCode(sel, n)} model`, 'lines', 'dash');
    }
    const cpBest = cpFamilyBest(entry);
    if (cpBest && cpBest !== sel && cpBest.model_curve) {
      const cpCurve = await loadJson(`${cpBest.model_curve}?v=20260526_5`);
      addNkTraces(traces, cpCurve, `CP_M${n} model`, 'lines', 'dot');
    }
    const rp = entry.models.RP;
    if (rp && rp !== sel && rp.model_curve) {
      const rpCurve = await loadJson(`${rp.model_curve}?v=20260526_5`);
      addNkTraces(traces, rpCurve, `RP_M${n} model`, 'lines', 'dot');
    }

    if (!rec.raw_database_points) notes.push('Raw optical-constant JSON was not found in the copied database.');
    if (!rec.fitting_grid_points) notes.push('Fitting-grid optical-constant JSON was not found in the copied database.');
    if (sel && !sel.model_curve) notes.push('Selected model curve is not available; the PoleResidue JSON may use a schema that this static browser cannot evaluate.');

    if (!traces.length) {
      plotDiv.innerHTML = 'No optical-constant or model-curve data available for this record.';
      note.textContent = notes.join(' ');
      return;
    }

    Plotly.newPlot(plotDiv, traces, {
      margin: {l: 60, r: 60, t: 20, b: 55},
      xaxis: {title: 'Wavelength (µm)'},
      yaxis: {title: 'n'},
      yaxis2: {title: 'k', overlaying: 'y', side: 'right'},
      legend: {orientation: 'h', y: -0.25},
      hovermode: 'x unified'
    }, {responsive: true});
    note.textContent = notes.join(' ');
  } catch (err) {
    plotDiv.innerHTML = `Could not render optical constants: ${err}`;
    note.textContent = '';
  }
}

init().catch(err => {
  document.body.innerHTML = `<pre>${err.stack || err}</pre>`;
});
