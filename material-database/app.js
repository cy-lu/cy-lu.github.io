let INDEX = [];
let RECORD_CACHE = {};

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot load ${path}`);
  return await res.json();
}

function fmt(x, digits=5) {
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
  INDEX = await loadJson('data/materials_index.json');
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
    RECORD_CACHE[recordKey] = await loadJson(`data/records/${recordKey}.json`);
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

function usable(m) {
  return m && m.FDTD_ready && Number.isFinite(Number(m.epsilon_rms));
}

function finiteRms(m) {
  return m && Number.isFinite(Number(m.epsilon_rms));
}

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
  if (m.family === 'RP') return 'Rational-pole model';
  return 'Critical-point model';
}

function variantText(m) {
  if (!m) return '--';
  if (m.specific_model === 'SemiCP') return `CP-family variant: SemiCP_M${m.N}`;
  if (m.specific_model === 'CP') return `CP-family variant: CP_M${m.N}`;
  return `RP_M${m.N}`;
}

function modelRow(displayName, m) {
  const ready = m && m.FDTD_ready ? '<span class="badge good">FDTD-ready</span>' : '<span class="badge bad">not ready</span>';
  const link = m && m.model_json ? `<a href="${m.model_json}" target="_blank">download</a>` : '--';
  return `<tr><td>${displayName}<br><small>${variantText(m)}</small></td><td>${fmt(m?.epsilon_rms)}</td><td>${fmt(m?.absolute_rms)}</td><td>${fmt(m?.G_rho)}</td><td>${ready}</td><td>${link}</td></tr>`;
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
      <p><span class="badge ${badgeForQuality(q)}">${q}</span><span class="badge">${variantText(sel)}</span></p>
      <p><b>epsilon RMS:</b> ${fmt(sel.epsilon_rms)}<br><b>G rho:</b> ${fmt(sel.G_rho)}<br><b>Status:</b> ${sel.FDTD_status || '--'}</p>
      ${sel.model_json ? `<p><a href="${sel.model_json}" target="_blank">Download PoleResidue JSON</a></p>` : ''}
    `;
  }

  const cpBest = cpFamilyBest(entry);
  document.getElementById('modelTable').innerHTML = `
    <table><thead><tr><th>Model family</th><th>ε RMS</th><th>Abs RMS</th><th>G rho</th><th>Status</th><th>JSON</th></tr></thead>
    <tbody>${modelRow('Rational-pole model', entry.models.RP)}${modelRow('Critical-point model', cpBest)}</tbody></table>
  `;

  document.getElementById('metadataBox').textContent = JSON.stringify({
    material: rec.material,
    material_class: rec.material_class,
    book: rec.book,
    page: rec.page,
    wavelength_range_um: rec.wavelength_range_um,
    final_recommendation: rec.final_recommendation
  }, null, 2);

  renderNkPlot(rec);
}

async function renderNkPlot(rec) {
  if (!rec.raw_database_points) {
    document.getElementById('nkPlot').innerHTML = 'No optical-constant JSON copied.';
    return;
  }
  try {
    const raw = await loadJson(rec.raw_database_points);
    const pts = raw.points || {};
    const wl = pts.wavelength_um || [];
    const traces = [];
    if (pts.n) traces.push({x: wl, y: pts.n, mode: 'markers', name: 'n data'});
    if (pts.k) traces.push({x: wl, y: pts.k, mode: 'markers', name: 'k data', yaxis: 'y2'});
    Plotly.newPlot('nkPlot', traces, {
      margin: {l: 55, r: 55, t: 20, b: 50},
      xaxis: {title: 'Wavelength (µm)'},
      yaxis: {title: 'n'},
      yaxis2: {title: 'k', overlaying: 'y', side: 'right'},
      legend: {orientation: 'h'}
    }, {responsive: true});
  } catch (err) {
    document.getElementById('nkPlot').innerHTML = `Could not load optical-constant data: ${err}`;
  }
}

init().catch(err => {
  document.body.innerHTML = `<pre>${err.stack || err}</pre>`;
});
