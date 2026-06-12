from pathlib import Path
import re

repo = Path(r"D:\GitHub_work\cy-lu.github.io")
index = repo / "index.html"

fig_line = repo / "material-database" / "assets" / "ccpr_cp_vs_reference_eps_rms_by_N.png"
fig_dist = repo / "material-database" / "assets" / "comparison_of_ccpr_cp_and_fitter_distributions.png"

missing = [str(p) for p in [fig_line, fig_dist] if not p.exists()]
if missing:
    raise SystemExit("ERROR: missing figure(s):\n" + "\n".join(missing))

html = index.read_text(encoding="utf-8")

backup = repo / "index.html.before_ccpr_cp_reference_figures_update"
if not backup.exists():
    backup.write_text(html, encoding="utf-8")

# Remove only our material-database injected CSS blocks.
html = re.sub(
    r"\s*/\* MATERIAL_DATABASE_SECTION_STYLE_START \*/.*?/\* MATERIAL_DATABASE_SECTION_STYLE_END \*/\s*",
    "\n",
    html,
    flags=re.S,
)
html = re.sub(
    r"\s*/\* MATERIAL_DB_BUTTON_POLISH_START \*/.*?/\* MATERIAL_DB_BUTTON_POLISH_END \*/\s*",
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

.mdb-browse-button {
  display: inline-block;
  background: #0b7285 !important;
  border-color: #0b7285 !important;
  color: #ffffff !important;
  border-radius: 8px;
  padding: 9px 18px;
  font-weight: 700;
  text-decoration: none !important;
  box-shadow: 0 2px 9px rgba(0,0,0,0.10);
}

.mdb-browse-button:hover {
  background: #075c6b !important;
  border-color: #075c6b !important;
  color: #ffffff !important;
  text-decoration: none !important;
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

.mdb-clean-table {
  width: 100%;
  max-width: 880px;
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
  font-weight: 500;
  color: #444;
}

.mdb-clean-table td {
  font-weight: 650;
}

.mdb-equation {
  max-width: 920px;
  background: #fff;
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent2);
  border-radius: 4px;
  padding: 12px 14px;
  margin: 10px 0;
  overflow-x: auto;
  font-size: 0.96rem;
  line-height: 1.55;
}

.mdb-benchmark-figure {
  margin: 14px 0 18px;
  max-width: 920px;
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
}

@media (max-width: 575px) {
  .mdb-metrics-clean {
    grid-template-columns: 1fr;
  }
}
/* MATERIAL_DATABASE_SECTION_STYLE_END */
'''

html = html.replace("</style>", css + "\n</style>", 1)

material_tab = r'''
<div class="tab-pane fade" id="materialdatabase" style="padding-top:0;"><br>
  <div class="material-db-overview">
    <p class="mdb-kicker">Optical material models</p>
    <h2>FDTD Optical Material Database</h2>

    <p class="mdb-lead">
      This section provides a searchable database of compact optical material models for time-domain electromagnetic simulation.
      The current visible&ndash;near-IR release is organized around complex-conjugate pole-residue rational-pole models
      (CCPR/RP) and critical-point (CP) extensions of the same pole-residue framework.
    </p>

    <p class="mdb-lead">
      RP provides the general complex pole-residue representation, while CP introduces critical-point-inspired structure for
      optical spectra with interband-like features. In both cases, the final fitted parameters are exported as PoleResidue JSON
      files following the Tidy3D-compatible file convention for easy implementation and are used directly by the centered-ADE
      FDTD update.
    </p>

    <div class="material-db-actions">
      <a class="btn materialdb-primary-action mdb-browse-button" href="material-database/">Browse models</a>
      <span class="mdb-small-note">Current release: June 2026  visible&ndash;near-IR  fitting parameters exported in PoleResidue JSON format</span>
    </div>

    <div class="mdb-metrics-clean">
      <div class="mdb-metric-clean"><strong>405</strong><span>source-specific records</span></div>
      <div class="mdb-metric-clean"><strong>60</strong><span>material labels</span></div>
      <div class="mdb-metric-clean"><strong>3929</strong><span>centered-ADE-ready exports</span></div>
      <div class="mdb-metric-clean"><strong>396 / 405</strong><span>records with recommendation</span></div>
    </div>

    <div class="mdb-clean-panel">
      <h3>Model representation</h3>
      <p>
        In the PoleResidue convention used by the exported JSON files, the CCPR/RP model is written as a complex-conjugate
        pole-residue expansion,
      </p>
      <div class="mdb-equation">
        &epsilon;<sub>RP</sub>(&omega;) =
        &epsilon;<sub>&infin;</sub> +
        &sum;<sub>m</sub>
        [
        c<sub>m</sub> / (a<sub>m</sub> - i&omega;) +
        c<sub>m</sub><sup>*</sup> / (a<sub>m</sub><sup>*</sup> - i&omega;)
        ],
        &nbsp; Re(a<sub>m</sub>) &gt; 0.
      </div>
      <p>
        The complex-conjugate pairing gives a real time-domain response, while the positive decay convention is converted to
        the centered-ADE update coefficients used in FDTD.
      </p>

      <p>
        The CP model uses a critical-point-inspired line shape before conversion to the same PoleResidue export format,
      </p>
      <div class="mdb-equation">
        &epsilon;<sub>CP</sub>(&omega;) =
        &epsilon;<sub>&infin;</sub> +
        &sum;<sub>&ell;</sub>
        A<sub>&ell;</sub> e<sup>i&phi;<sub>&ell;</sub></sup>
        (&Omega;<sub>&ell;</sub> - &omega; - i&Gamma;<sub>&ell;</sub>)<sup>-&nu;<sub>&ell;</sub></sup>,
        &nbsp; &Gamma;<sub>&ell;</sub> &gt; 0.
      </div>
      <p>
        Here &Omega;<sub>&ell;</sub>, &Gamma;<sub>&ell;</sub>, A<sub>&ell;</sub>, &phi;<sub>&ell;</sub>, and
        &nu;<sub>&ell;</sub> describe the critical-point energy, broadening, strength, phase, and line-shape exponent.
        After fitting, the CP response is represented through the same PoleResidue JSON pathway, so the FDTD implementation
        remains a centered-ADE PoleResidue update.
      </p>
    </div>

    <div class="mdb-clean-panel">
      <h3>Causality, passivity, and centered-ADE readiness</h3>
      <p>
        The fitting workflow does not select models by RMS error alone. Exported models are screened for causal pole placement,
        passive dielectric response on the fitted wavelength grid, valid PoleResidue JSON export, available model-response curves,
        and numerical readiness for the centered-ADE update at CFL = 0.75.
      </p>
    </div>

    <div class="mdb-clean-panel">
      <h3>Fitting accuracy versus pole-pair order</h3>
      <p>
        The figures below summarize the relative complex-permittivity RMS error as a function of pole-pair order N on common
        optical records. The reference curve corresponds to an external on-demand pole-residue fitter, while CCPR and CP denote
        the database fitting families. Increasing N generally reduces the median error of the released CCPR and CP candidates,
        but the final recommendation is selected using both fitting accuracy and physical/numerical readiness.
      </p>

      <figure class="mdb-benchmark-figure">
        <img src="material-database/assets/ccpr_cp_vs_reference_eps_rms_by_N.png" alt="Median relative epsilon RMS versus pole-pair order for reference fitter, CCPR, and CP models">
        <figcaption>
          Median relative &epsilon;-RMS versus pole-pair order N on common optical records. The blue curve is an external
          on-demand pole-residue fitting reference. CCPR and CP show the released database fitting families after
          causal/passive screening and centered-ADE readiness checks at CFL = 0.75. Shaded bands indicate the interquartile range.
        </figcaption>
      </figure>

      <figure class="mdb-benchmark-figure">
        <img src="material-database/assets/comparison_of_ccpr_cp_and_fitter_distributions.png" alt="Distribution of relative epsilon RMS by pole-pair order for CCPR CP database and reference fitter">
        <figcaption>
          Distribution of relative &epsilon;-RMS by pole-pair order N. The left panel summarizes the CCPR/CP database models,
          and the right panel shows the external reference fitter. This view complements the median trend by showing the spread
          and low-error tails across the common optical records.
        </figcaption>
      </figure>
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

    <p class="mdb-contact">
      Questions, corrections, or suggestions:
      <a href="mailto:jinyoulu@ntu.edu.tw">jinyoulu@ntu.edu.tw</a>.
    </p>
  </div>
</div>
'''.strip()

# Replace only the div with id="materialdatabase".
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

print("MATERIALDATABASE_REFERENCE_FIGURES_SAFE_UPDATE_DONE")
print("line_figure =", fig_line)
print("distribution_figure =", fig_dist)
print("backup =", backup)
