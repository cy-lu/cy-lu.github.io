from pathlib import Path
import re

repo = Path(r"D:\GitHub_work\cy-lu.github.io")
index = repo / "index.html"
html = index.read_text(encoding="utf-8")

backup = repo / "index.html.before_force_materialdatabase_tab_replace"
if not backup.exists():
    backup.write_text(html, encoding="utf-8")

# Remove previous injected material-database style blocks.
html = re.sub(
    r"\s*<!-- MATERIAL_DATABASE_SECTION_STYLE_START -->.*?<!-- MATERIAL_DATABASE_SECTION_STYLE_END -->\s*",
    "\n",
    html,
    flags=re.S,
)

css = r'''
/* MATERIAL_DATABASE_SECTION_STYLE_START */
.material-db-overview {
  max-width: 980px;
}

.material-db-overview .mdb-kicker {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  color: var(--muted);
}

.material-db-overview .mdb-lead {
  max-width: 920px;
  line-height: 1.68;
}

.material-db-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 16px 0 20px;
}

.material-db-actions .btn {
  border-radius: 8px;
  padding: 9px 16px;
  font-weight: 600;
}

.mdb-metrics-clean {
  display: grid;
  grid-template-columns: repeat(4, minmax(135px, 1fr));
  gap: 12px;
  margin: 18px 0 22px;
}

.mdb-metric-clean {
  background: #fff;
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent2);
  border-radius: 4px;
  padding: 13px 15px;
}

.mdb-metric-clean strong {
  display: block;
  font-size: 1.28rem;
  line-height: 1.2;
  color: var(--text);
}

.mdb-metric-clean span {
  display: block;
  margin-top: 4px;
  font-size: 0.86rem;
  color: var(--muted);
  line-height: 1.35;
}

.mdb-clean-panel {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.mdb-clean-panel h3 {
  font-size: 1.02rem;
  margin: 0 0 9px;
  border: none;
  padding: 0;
}

.mdb-clean-panel p {
  max-width: 940px;
  line-height: 1.68;
}

.mdb-clean-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.mdb-clean-table {
  width: 100%;
  max-width: 760px;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.94rem;
}

.mdb-clean-table th,
.mdb-clean-table td {
  border-bottom: 1px solid var(--border);
  padding: 7px 4px;
  vertical-align: top;
}

.mdb-clean-table th {
  width: 68%;
  font-weight: 500;
  color: #444;
}

.mdb-clean-table td {
  font-weight: 650;
}

.mdb-benchmark-figure {
  margin: 14px 0 0;
  max-width: 900px;
}

.mdb-benchmark-figure img {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fff;
}

.mdb-benchmark-figure figcaption {
  margin-top: 7px;
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.45;
}

.mdb-small-note {
  color: var(--muted);
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .mdb-metrics-clean {
    grid-template-columns: repeat(2, minmax(135px, 1fr));
  }
  .mdb-clean-split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575px) {
  .mdb-metrics-clean {
    grid-template-columns: 1fr;
  }
}
/* MATERIAL_DATABASE_SECTION_STYLE_END */
'''

# Insert CSS into the first main style block.
html = html.replace("</style>", css + "\n</style>", 1)

fig_path = repo / "material-database" / "assets" / "proposed_vs_tidy3d_eps_rms_by_N.png"
fig_html = ""
if fig_path.exists():
    fig_html = '''
<figure class="mdb-benchmark-figure">
  <img src="material-database/assets/proposed_vs_tidy3d_eps_rms_by_N.png" alt="Relative epsilon RMS comparison between the proposed database and a Tidy3D FastFitter reference">
  <figcaption>
    Relative &epsilon;-RMS distribution by model order N for the proposed audited database and a Tidy3D FastFitter reference.
    This comparison is used as a fitting-quality reference on paired source records; the database additionally reports causal,
    passive, and centered-ADE-ready exported models.
  </figcaption>
</figure>'''

material_tab = f'''
<div class="tab-pane fade" id="materialdatabase" style="padding-top:0;"><br>
  <div class="material-db-overview">
    <p class="mdb-kicker">Optical material models</p>
    <h2>FDTD-Ready Optical Material Model Database</h2>

    <p class="mdb-lead">
      This section provides a searchable database of compact optical material models for time-domain electromagnetic simulation.
      The current visible&ndash;near-IR release contains precomputed rational-pole (RP), analytical critical-point (CP), and
      semi-analytical critical-point (SCP) dielectric-function fits to source-specific experimental optical-constant records.
    </p>

    <p class="mdb-lead">
      The exported files are provided in Tidy3D PoleResidue JSON format for centered-ADE FDTD workflows. Candidate models are
      screened for fitting quality, causal pole structure, passive dielectric response, export completeness, and usability in the
      centered-ADE time-domain update used for this database.
    </p>

    <div class="material-db-actions">
      <a class="btn materialdb-primary-action" href="material-database/">Browse models</a>
      <span class="mdb-small-note">Current release: June 2026  visible&ndash;near-IR  Tidy3D PoleResidue JSON</span>
    </div>

    <div class="mdb-metrics-clean">
      <div class="mdb-metric-clean"><strong>405</strong><span>source-specific records</span></div>
      <div class="mdb-metric-clean"><strong>60</strong><span>material labels</span></div>
      <div class="mdb-metric-clean"><strong>3929</strong><span>centered-ADE-ready exports</span></div>
      <div class="mdb-metric-clean"><strong>396 / 405</strong><span>records with recommendation</span></div>
    </div>

    <div class="mdb-clean-panel">
      <h3>Scope of use</h3>
      <p>
        Use this database when you need an already-audited dispersive material model for FDTD within the fitted
        visible&ndash;near-IR interval. Each record is fitted independently over the wavelength range supported by its own
        experimental data, usually within 0.3&ndash;1.1&nbsp;&micro;m or a subset of that range.
      </p>
      <p>
        These models should not be treated as universal optical constants outside the fitted interval. Extrapolation can be
        inaccurate even when a model is causal, passive, and usable in the centered-ADE update. Users should inspect the online
        n/k and permittivity plots before using a model in production simulations.
      </p>
    </div>

    <div class="mdb-clean-split">
      <div class="mdb-clean-panel">
        <h3>Model families</h3>
        <p>
          The release includes RP, CP, and SCP pole-based representations. Automated fitting and refinement are performed over
          N = 1&ndash;5 pole pairs, producing 6075 candidate model rows.
        </p>
      </div>

      <div class="mdb-clean-panel">
        <h3>Causality, passivity, and centered-ADE readiness</h3>
        <p>
          Recommended models are selected from exported candidates that satisfy the database production checks: causal pole placement,
          passive dielectric response on the fitting grid, available model-response curves, valid PoleResidue JSON export, and
          readiness for the centered-ADE FDTD update.
        </p>
      </div>
    </div>

    <div class="mdb-clean-panel">
      <h3>Release statistics</h3>
      <table class="mdb-clean-table">
        <tbody>
          <tr><th>Candidate model rows</th><td>6075</td></tr>
          <tr><th>Exported centered-ADE-ready model files</th><td>3929</td></tr>
          <tr><th>Records with final recommendation</th><td>396 / 405</td></tr>
          <tr><th>Records without recommended export</th><td>9 / 405</td></tr>
          <tr><th>Full fitted 0.3&ndash;1.1&nbsp;&micro;m records</th><td>279 / 405</td></tr>
          <tr><th>Partial-window records</th><td>126 / 405</td></tr>
        </tbody>
      </table>
    </div>

    <div class="mdb-clean-panel">
      <h3>How &epsilon;-RMS is computed</h3>
      <p>
        Experimental optical constants are converted to
        &epsilon;<sub>exp</sub>(&lambda;) = [n(&lambda;) + i k(&lambda;)]<sup>2</sup> and compared with the fitted
        &epsilon;<sub>fit</sub>(&lambda;) on the same fitting grid. The reported error is
        &epsilon;-RMS = sqrt(mean(|&epsilon;<sub>fit</sub> &minus; &epsilon;<sub>exp</sub>|<sup>2</sup> /
        (|&epsilon;<sub>exp</sub>|<sup>2</sup> + 10<sup>&minus;12</sup>))).
      </p>
      <table class="mdb-clean-table">
        <tbody>
          <tr><th>Recommended &epsilon;-RMS &le; 10<sup>&minus;3</sup></th><td>59 / 396</td></tr>
          <tr><th>Recommended &epsilon;-RMS &le; 5&times;10<sup>&minus;3</sup></th><td>241 / 396</td></tr>
          <tr><th>Recommended &epsilon;-RMS &le; 10<sup>&minus;2</sup></th><td>281 / 396</td></tr>
          <tr><th>Recommended &epsilon;-RMS &gt; 5&times;10<sup>&minus;2</sup></th><td>39 / 396</td></tr>
        </tbody>
      </table>
      <p class="mdb-small-note">
        These statistics use the final recommended model for each recommended record, so the denominator is 396 rather than
        the 3929 exported model files.
      </p>
    </div>

    <div class="mdb-clean-panel">
      <h3>Relation to Tidy3D FastFitter</h3>
      <p>
        This database is complementary to on-demand fitting tools such as Tidy3D FastFitter. Fast fitting is useful when a user
        needs a custom model for a chosen dataset, wavelength range, weighting scheme, or target order. This database instead
        provides a reproducible lookup release of precomputed RP/CP/SCP models with experimental data, fitting grids, model
        curves, JSON exports, causal/passive screening, centered-ADE readiness, and recommendation metadata.
      </p>
      {fig_html}
    </div>

    <p class="mdb-contact">
      Questions, corrections, or suggestions:
      <a href="mailto:jinyoulu@ntu.edu.tw">jinyoulu@ntu.edu.tw</a>.
    </p>
  </div>
</div>
'''.strip()

# Find the exact div with id="materialdatabase", regardless of class.
m = re.search(r'<div\b[^>]*\bid=["\']materialdatabase["\'][^>]*>', html, flags=re.I)
if not m:
    raise SystemExit("ERROR: cannot find div id=materialdatabase")

tag_re = re.compile(r'<(/?)div\b[^>]*>', re.I)
depth = 0
end = None
for t in tag_re.finditer(html, m.start()):
    if not t.group(1):
        depth += 1
    else:
        depth -= 1
        if depth == 0:
            end = t.end()
            break

if end is None:
    raise SystemExit("ERROR: cannot find closing div for materialdatabase")

html = html[:m.start()] + material_tab + html[end:]

index.write_text(html, encoding="utf-8")
print("FORCE_MATERIALDATABASE_TAB_REPLACED")
print("figure_included =", fig_path.exists())
print("backup =", backup)
