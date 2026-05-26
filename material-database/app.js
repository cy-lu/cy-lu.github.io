let INDEX = null;
let CURRENT_RECORD = null;

const fmt = (x, digits=5) => {
  if (x === null || x === undefined || Number.isNaN(Number(x))) return "—";
  const v = Number(x);
  if (Math.abs(v) > 0 && Math.abs(v) < 1e-3) return v.toExponential(3);
  return v.toPrecision(digits);
};

const pillClass = (label) => {
  if (!label) return "neutral";
  if (label.includes("excellent")) return "good";
  if (label.includes("acceptable")) return "accept";
  if (label.includes("warning")) return "warn";
  if (label.includes("poor") || label.includes("fail")) return "bad";
  return "neutral";
};

function option(el, value, text) {
  const o = document.createElement("option");
  o.value = value;
  o.textContent = text;
  el.appendChild(o);
}

async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return await res.json();
}

async function init() {
  INDEX = await loadJSON("data/materials_index.json");
  const materialSelect = document.getElementById("materialSelect");
  materialSelect.innerHTML = "";
  for (const mat of INDEX.materials) {
    option(materialSelect, mat.material, `${mat.material} (${mat.material_class || "unclassified"})`);
  }
  materialSelect.addEventListener("change", populateRecords);
  document.getElementById("recordSelect").addEventListener("change", loadCurrentRecord);
  document.getElementById("nSelect").addEventListener("change", renderCurrentN);
  document.getElementById("showFitCurve").addEventListener("change", renderPlots);
  populateRecords();
}

function selectedMaterialEntry() {
  const material = document.getElementById("materialSelect").value;
  return INDEX.materials.find(m => m.material === material);
}

function populateRecords() {
  const mat = selectedMaterialEntry();
  const recSelect = document.getElementById("recordSelect");
  recSelect.innerHTML = "";
  if (!mat) return;
  for (const rec of mat.records) {
    const q = rec.final_recommendation?.quality_label || "";
    option(recSelect, rec.record_key, `${rec.book}/${rec.page} — ${q}`);
  }
  loadCurrentRecord();
}

async function loadCurrentRecord() {
  const recKey = document.getElementById("recordSelect").value;
  if (!recKey) return;
  CURRENT_RECORD = await loadJSON(`data/records/${recKey}.json`);
  const nSelect = document.getElementById("nSelect");
  nSelect.innerHTML = "";
  for (const n of CURRENT_RECORD.available_N) option(n, n, `N = ${n}`);
  const finalN = CURRENT_RECORD.final_recommendation?.final_N;
  if (finalN && CURRENT_RECORD.available_N.includes(finalN)) nSelect.value = String(finalN);
  renderCurrentN();
}

function renderSummary() {
  const m = CURRENT_RECORD.metadata;
  const fr = CURRENT_RECORD.final_recommendation || {};
  document.getElementById("recordSummary").innerHTML = `
    <h2>Record</h2>
    <div class="kpi">
      <div><div class="label">Material</div><div class="value">${m.material}</div></div>
      <div><div class="label">Class</div><div class="value">${m.material_class || "unclassified"}</div></div>
      <div><div class="label">Book / page</div><div class="value">${m.book} / ${m.page}</div></div>
      <div><div class="label">Window</div><div class="value">${fmt(m.requested_wl_min_um, 4)}–${fmt(m.requested_wl_max_um, 4)} µm</div></div>
    </div>`;
  const pill = `<span class="statusPill ${pillClass(fr.quality_label)}">${fr.quality_label || "—"}</span>`;
  document.getElementById("finalSummary").innerHTML = `
    <h2>Final recommendation</h2>
    <div class="kpi">
      <div><div class="label">Family</div><div class="value">${fr.final_family || "none"}</div></div>
      <div><div class="label">Internal model</div><div class="value">${fr.final_specific_model || "none"}</div></div>
      <div><div class="label">N</div><div class="value">${fr.final_N || "—"}</div></div>
      <div><div class="label">RMS</div><div class="value">${fmt(fr.final_RMS)}</div></div>
    </div>
    <p>${pill}</p>
    <p class="smallText">${fr.selection_reason || ""}</p>`;
}

function modelDownloadLink(c) {
  if (c && c.model_json_url) return `<a href="${c.model_json_url}" download>download JSON</a>`;
  return "—";
}

function renderModelTable(nEntry) {
  const rp = nEntry.candidates.RP || {};
  const cp = nEntry.candidates.CP || {};
  const rows = [
    ["RP", rp.specific_model || "RP", rp.RMS, rp.abs_RMS, rp.G_rho, rp.FDTD_status, rp.FDTD_ready, modelDownloadLink(rp)],
    ["CP", cp.specific_model || "CP family", cp.RMS, cp.abs_RMS, cp.G_rho, cp.FDTD_status, cp.FDTD_ready, modelDownloadLink(cp)],
  ];
  const selected = nEntry.selected_family;
  const htmlRows = rows.map(r => `
    <tr class="${r[0] === selected ? "selectedRow" : ""}">
      <td>${r[0]}</td><td>${r[1]}</td><td>${fmt(r[2])}</td><td>${fmt(r[3])}</td><td>${fmt(r[4], 8)}</td>
      <td>${r[5] || "—"}</td><td>${r[6] ? "yes" : "no"}</td><td>${r[7]}</td>
    </tr>`).join("");
  document.getElementById("modelTable").innerHTML = `
    <p>Selected at this N: <strong>${nEntry.selected_family}</strong> / ${nEntry.selected_specific_model || "none"}
    &nbsp; <span class="statusPill ${pillClass(nEntry.quality_label)}">${nEntry.quality_label}</span></p>
    <table>
      <thead><tr><th>Family</th><th>Internal model</th><th>ε RMS</th><th>Abs RMS</th><th>G rho</th><th>Status</th><th>Ready</th><th>JSON</th></tr></thead>
      <tbody>${htmlRows}</tbody>
    </table>`;
}

function complex(re, im) { return {re, im}; }
function cadd(a,b){ return {re:a.re+b.re, im:a.im+b.im}; }
function csub(a,b){ return {re:a.re-b.re, im:a.im-b.im}; }
function cmul(a,b){ return {re:a.re*b.re-a.im*b.im, im:a.re*b.im+a.im*b.re}; }
function cdiv(a,b){ const d=b.re*b.re+b.im*b.im; return {re:(a.re*b.re+a.im*b.im)/d, im:(a.im*b.re-a.re*b.im)/d}; }
function cconj(a){ return {re:a.re, im:-a.im}; }
function cneg(a){ return {re:-a.re, im:-a.im}; }

function parseComplex(obj) {
  if (Array.isArray(obj)) return complex(Number(obj[0] || 0), Number(obj[1] || 0));
  return complex(Number(obj.real || 0), Number(obj.imag || 0));
}

function evalPoleResidue(model, wl) {
  const epsRe = [];
  const epsIm = [];
  const epsInf = Number(model.eps_inf || 0);
  const pairs = model.poles || [];
  for (const lam of wl) {
    const fTHz = 299.792458 / Number(lam);
    const omega = 2 * Math.PI * fTHz * 1e12;
    let eps = complex(epsInf, 0);
    const iw = complex(0, omega);
    for (const pair of pairs) {
      const a = parseComplex(pair[0]);
      const c = parseComplex(pair[1]);
      // Tidy3D compact PoleResidue convention used by the production exporters:
      // epsilon = eps_inf - sum[ c/(i*w + a) + conj(c)/(i*w + conj(a)) ]
      const term1 = cdiv(c, cadd(iw, a));
      const term2 = cdiv(cconj(c), cadd(iw, cconj(a)));
      eps = csub(eps, cadd(term1, term2));
    }
    epsRe.push(eps.re);
    epsIm.push(eps.im);
  }
  return {eps_real: epsRe, eps_imag: epsIm};
}

async function renderPlots() {
  if (!CURRENT_RECORD) return;
  const n = document.getElementById("nSelect").value;
  const nEntry = CURRENT_RECORD.models_by_N[n];
  const fitUrl = CURRENT_RECORD.data_files.fitting_grid_points_url || CURRENT_RECORD.data_files.raw_database_points_url;
  if (!fitUrl) {
    document.getElementById("plotNK").innerHTML = "No experimental/fitting-grid data file was copied.";
    document.getElementById("plotEps").innerHTML = "No experimental/fitting-grid data file was copied.";
    return;
  }

  const data = await loadJSON(fitUrl);
  const p = data.points || data;
  const wl = p.wavelength_um || p.wl_um || [];
  const nvals = p.n || [];
  const kvals = p.k || [];
  let epsRe = p.eps_real || p.eps1 || [];
  let epsIm = p.eps_imag || p.eps2 || [];
  if ((!epsRe.length || !epsIm.length) && nvals.length && kvals.length) {
    epsRe = nvals.map((nv, i) => nv*nv - kvals[i]*kvals[i]);
    epsIm = nvals.map((nv, i) => 2*nv*kvals[i]);
  }

  const tracesNK = [
    {x: wl, y: nvals, mode: "markers", name: "n data", marker: {size: 4}},
    {x: wl, y: kvals, mode: "markers", name: "k data", marker: {size: 4}},
  ];
  const tracesEps = [
    {x: wl, y: epsRe, mode: "markers", name: "Re ε data", marker: {size: 4}},
    {x: wl, y: epsIm, mode: "markers", name: "Im ε data", marker: {size: 4}},
  ];

  if (document.getElementById("showFitCurve").checked && nEntry.selected_family !== "none") {
    const c = nEntry.candidates[nEntry.selected_family];
    if (c && c.model_json_url) {
      try {
        const model = await loadJSON(c.model_json_url);
        const fit = evalPoleResidue(model, wl);
        const fitN = fit.eps_real.map((er, i) => {
          const ei = fit.eps_imag[i];
          const abs = Math.sqrt(er*er + ei*ei);
          return Math.sqrt(Math.max(0, (abs + er) / 2));
        });
        const fitK = fit.eps_real.map((er, i) => {
          const ei = fit.eps_imag[i];
          const abs = Math.sqrt(er*er + ei*ei);
          return Math.sqrt(Math.max(0, (abs - er) / 2));
        });
        tracesNK.push({x: wl, y: fitN, mode: "lines", name: `${nEntry.selected_family} fit n`});
        tracesNK.push({x: wl, y: fitK, mode: "lines", name: `${nEntry.selected_family} fit k`});
        tracesEps.push({x: wl, y: fit.eps_real, mode: "lines", name: `${nEntry.selected_family} fit Re ε`});
        tracesEps.push({x: wl, y: fit.eps_imag, mode: "lines", name: `${nEntry.selected_family} fit Im ε`});
      } catch (err) {
        console.warn("Could not evaluate selected model JSON", err);
      }
    }
  }

  const layoutBase = {
    margin: {l: 55, r: 20, t: 30, b: 55},
    xaxis: {title: "wavelength (µm)"},
    legend: {orientation: "h", x: 0, y: -0.25},
  };
  Plotly.newPlot("plotNK", tracesNK, {...layoutBase, title: "n and k"}, {responsive: true});
  Plotly.newPlot("plotEps", tracesEps, {...layoutBase, title: "dielectric function ε"}, {responsive: true});
}

function renderClassWarning() {
  const m = CURRENT_RECORD.metadata;
  const fr = CURRENT_RECORD.final_recommendation;
  const difficult = ["chalcogenide_or_2D", "metal", "semiconductor"];
  const warning = difficult.includes(m.material_class)
    ? "This class often requires higher N or class-aware physics terms. Treat high-RMS compact fits with caution."
    : "This class is usually well represented by compact FDTD-ready CP/RP models in the current scan.";
  document.getElementById("classWarning").innerHTML = `
    <p><strong>${m.material_class || "unclassified"}</strong>: ${warning}</p>
    <p>Current record status: <span class="statusPill ${pillClass(fr.quality_label)}">${fr.quality_label}</span></p>`;
}

function renderCurrentN() {
  if (!CURRENT_RECORD) return;
  renderSummary();
  const n = document.getElementById("nSelect").value;
  const nEntry = CURRENT_RECORD.models_by_N[n];
  renderModelTable(nEntry);
  renderClassWarning();
  renderPlots();
}

init().catch(err => {
  document.body.innerHTML = `<pre style="padding:20px;color:#b91c1c">${err.stack || err}</pre>`;
});
