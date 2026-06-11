import csv
import json
import math
import re
import ast
from pathlib import Path

REPO = Path(r"D:\GitHub_work\cy-lu.github.io")


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def find_col(rows, candidates, required=True):
    cols = {c.lower().strip(): c for c in rows[0].keys()} if rows else {}
    for c in candidates:
        key = c.lower().strip()
        if key in cols:
            return cols[key]
    if required:
        raise SystemExit(f"ERROR: cannot find column among {candidates}. Available={list(cols.values())}")
    return None


def to_float(x):
    try:
        v = float(str(x).strip())
        return v if math.isfinite(v) else None
    except Exception:
        return None


def parse_range(wr):
    if wr is None:
        return None
    if isinstance(wr, str):
        txt = wr.strip()
        try:
            wr = json.loads(txt)
        except Exception:
            try:
                wr = ast.literal_eval(txt)
            except Exception:
                return None
    if isinstance(wr, (list, tuple)) and len(wr) >= 2:
        try:
            return float(wr[0]), float(wr[1])
        except Exception:
            return None
    return None


def compute_stats(repo):
    data = repo / "material-database" / "data"
    tables = data / "tables"

    all_rows = read_csv(tables / "website_all_models_long.csv")
    ready_rows = read_csv(tables / "website_fdtd_ready_models.csv")
    rec_rows = read_csv(tables / "website_record_summary.csv")
    recmd_rows = read_csv(tables / "website_final_recommendations.csv")

    mat_col = find_col(rec_rows, ["material"], required=False)
    rk_col = find_col(rec_rows, ["record_key"], required=True)

    materials = len(set(r[mat_col] for r in rec_rows if mat_col and r.get(mat_col)))
    records = len(set(r[rk_col] for r in rec_rows if r.get(rk_col)))

    full_records = 0
    partial_records = 0
    for fp in (data / "records").glob("*.json"):
        obj = json.loads(fp.read_text(encoding="utf-8-sig"))
        parsed = parse_range(obj.get("wavelength_range_um"))
        if parsed is None:
            partial_records += 1
            continue
        wl0, wl1 = parsed
        if wl0 <= 0.305 and wl1 >= 1.095:
            full_records += 1
        else:
            partial_records += 1

    eps_col = find_col(recmd_rows, ["epsilon_rms", "relative_RMS", "relative_rms"], required=False)
    eps = [to_float(r.get(eps_col)) for r in recmd_rows] if eps_col else []
    eps = [x for x in eps if x is not None]

    return {
        "materials": materials,
        "records": records,
        "candidate_rows": len(all_rows),
        "ready_models": len(ready_rows),
        "recommended_records": len(recmd_rows),
        "records_without_recommendation": records - len(recmd_rows),
        "full_records": full_records,
        "partial_records": partial_records,
        "rms_denominator": len(eps),
        "rms_le_1e3": sum(x <= 1e-3 for x in eps),
        "rms_le_5e3": sum(x <= 5e-3 for x in eps),
        "rms_le_1e2": sum(x <= 1e-2 for x in eps),
        "rms_gt_5e2": sum(x > 5e-2 for x in eps),
    }


def make_figure_block(repo):
    fig = repo / "material-database" / "assets" / "proposed_vs_tidy3d_eps_rms_by_N.png"
    if not fig.exists():
        return ""
    return '''
    <figure class="mdb-figure">
      <img src="material-database/assets/proposed_vs_tidy3d_eps_rms_by_N.png"
           alt="Relative epsilon RMS comparison between the proposed center-ADE-ready database models and a Tidy3D FastFitter reference." />
      <figcaption>
        Relative ε-RMS distribution by model order N for the proposed audited database and a Tidy3D FastFitter reference.
        The comparison is intended as a fitting-quality reference on paired source-specific records and model orders; the proposed
        release additionally screens models for causal/passive behavior and center-ADE FDTD usability.
      </figcaption>
    </figure>
'''.rstrip()


def make_section(s, figure_block):
    return f'''
<section id="material-database" class="material-database-section">
  <div class="mdb-hero">
    <p class="mdb-kicker">Optical material models</p>
    <h2>FDTD-Ready Optical Material Model Database</h2>
    <p class="mdb-summary">
      A searchable release of compact optical material models for time-domain electromagnetic simulations.
      The database provides precomputed rational-pole (RP), analytical critical-point (CP), and semi-analytical critical-point (SCP)
      dielectric-function fits to source-specific experimental optical-constant records.
    </p>
    <p class="mdb-summary">
      The exported files are Tidy3D PoleResidue JSON models intended for centered-ADE FDTD workflows.
      Candidate models are screened for fitting quality, causal pole structure, passivity, export completeness, and compatibility
      with the centered-ADE time-domain update used in the database validation.
    </p>
    <div class="mdb-actions">
      <a class="mdb-primary-link" href="material-database/">Browse models</a>
      <span class="mdb-release-note">Current release: visiblenear-IR  June 2026</span>
    </div>
  </div>

  <div class="mdb-metrics">
    <div><strong>{s["records"]}</strong><span>source records</span></div>
    <div><strong>{s["materials"]}</strong><span>materials</span></div>
    <div><strong>{s["ready_models"]}</strong><span>center-ADE-ready exports</span></div>
    <div><strong>{s["recommended_records"]} / {s["records"]}</strong><span>recommended records</span></div>
  </div>

  <div class="mdb-panel">
    <h3>Scope of use</h3>
    <p>
      Use this database when you need an already-audited dispersive model for FDTD simulations within the fitted visiblenear-IR window.
      Each source record is fitted independently over its available wavelength interval, typically within 0.31.1&nbsp;µm or a subset
      of that range.
    </p>
    <p>
      The models are not universal material descriptions outside their fitted intervals. Extrapolation can be inaccurate even when a
      model is causal, passive, and stable in the centered-ADE update. Users should inspect the online n/k and ε plots before using a
      model in production simulations.
    </p>
  </div>

  <div class="mdb-split">
    <div class="mdb-panel">
      <h3>Model families</h3>
      <p>
        The release contains RP, CP, and SCP pole-based representations. Automated fitting and refinement are performed over
        N = 15 pole pairs, producing {s["candidate_rows"]} candidate model rows.
      </p>
    </div>

    <div class="mdb-panel">
      <h3>Causality, passivity, and center-ADE usability</h3>
      <p>
        Recommended models are selected from exported candidates that satisfy the database production checks: causal pole placement,
        passive dielectric response over the fitted grid, available model-response curves, valid PoleResidue JSON export, and readiness
        for the centered-ADE FDTD update.
      </p>
    </div>
  </div>

  <div class="mdb-panel">
    <h3>Release statistics</h3>
    <table class="mdb-table">
      <tbody>
        <tr><th>Candidate model rows</th><td>{s["candidate_rows"]}</td></tr>
        <tr><th>Exported center-ADE-ready model files</th><td>{s["ready_models"]}</td></tr>
        <tr><th>Records with final recommendation</th><td>{s["recommended_records"]} / {s["records"]}</td></tr>
        <tr><th>Records without recommended export</th><td>{s["records_without_recommendation"]} / {s["records"]}</td></tr>
        <tr><th>Full fitted 0.31.1&nbsp;µm records</th><td>{s["full_records"]} / {s["records"]}</td></tr>
        <tr><th>Partial-window records</th><td>{s["partial_records"]} / {s["records"]}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="mdb-panel">
    <h3>How ε-RMS is computed</h3>
    <p>
      The experimental optical constants are converted to ε<sub>exp</sub>(λ) = [n(λ) + i k(λ)] and compared with the fitted
      ε<sub>fit</sub>(λ) on the same fitting grid. The reported error is
      ε-RMS = sqrt(mean(|ε<sub>fit</sub>  ε<sub>exp</sub>| / (|ε<sub>exp</sub>| + 10))).
      This is a relative RMS error of the complex dielectric function, not a direct RMS error of n or k.
    </p>
    <table class="mdb-table mdb-rms-table">
      <tbody>
        <tr><th>Recommended ε-RMS  10</th><td>{s["rms_le_1e3"]} / {s["rms_denominator"]}</td></tr>
        <tr><th>Recommended ε-RMS  510</th><td>{s["rms_le_5e3"]} / {s["rms_denominator"]}</td></tr>
        <tr><th>Recommended ε-RMS  10</th><td>{s["rms_le_1e2"]} / {s["rms_denominator"]}</td></tr>
        <tr><th>Recommended ε-RMS > 510</th><td>{s["rms_gt_5e2"]} / {s["rms_denominator"]}</td></tr>
      </tbody>
    </table>
    <p class="mdb-small">
      These statistics use the final recommended model for each recommended source record. The denominator is therefore
      {s["rms_denominator"]}, not the {s["ready_models"]} exported model files.
    </p>
  </div>

  <div class="mdb-panel">
    <h3>Relation to Tidy3D FastFitter</h3>
    <p>
      This database is complementary to on-demand fitting tools such as Tidy3D FastFitter. Fast fitting is appropriate when a user needs
      a custom model for a chosen dataset, wavelength range, weighting scheme, or target order. This release instead provides a
      reproducible lookup database of precomputed RP/CP/SCP models with attached experimental data, fitting grids, model curves,
      JSON exports, causal/passive screening, centered-ADE readiness, and recommendation metadata.
    </p>
{figure_block}
  </div>

  <p class="mdb-contact">
    Questions, corrections, or suggestions: <a href="mailto:jinyoulu@ntu.edu.tw">jinyoulu@ntu.edu.tw</a>.
  </p>
</section>
'''.strip()


def inject_style(html):
    css = r'''
<!-- MATERIAL_DATABASE_SECTION_STYLE_START -->
<style>
.material-database-section {
  margin-top: 2.5rem;
  max-width: 980px;
}
.mdb-hero {
  padding: 1.35rem 0 0.4rem;
}
.mdb-kicker {
  margin: 0 0 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  opacity: 0.68;
}
.material-database-section h2 {
  margin: 0 0 0.7rem;
}
.material-database-section h3 {
  margin: 0 0 0.55rem;
  font-size: 1.05rem;
}
.mdb-summary {
  max-width: 900px;
  line-height: 1.65;
  margin-bottom: 0.95rem;
}
.mdb-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.7rem;
}
.mdb-primary-link {
  display: inline-block;
  padding: 0.58rem 0.9rem;
  border: 1px solid currentColor;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}
.mdb-release-note,
.mdb-small,
.mdb-contact {
  font-size: 0.92rem;
  opacity: 0.78;
}
.mdb-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 0.75rem;
  margin: 1.2rem 0 1.35rem;
}
.mdb-metrics div {
  padding: 0.8rem 0.85rem;
  border: 1px solid rgba(0,0,0,0.13);
  border-radius: 10px;
  background: rgba(255,255,255,0.55);
}
.mdb-metrics strong {
  display: block;
  font-size: 1.32rem;
  line-height: 1.2;
}
.mdb-metrics span {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.84rem;
  opacity: 0.72;
}
.mdb-panel {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.10);
}
.mdb-panel p {
  line-height: 1.62;
}
.mdb-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.mdb-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.55rem;
  font-size: 0.94rem;
}
.mdb-table th,
.mdb-table td {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.10);
  text-align: left;
  vertical-align: top;
}
.mdb-table th {
  width: 68%;
  font-weight: 500;
  opacity: 0.82;
}
.mdb-table td {
  font-weight: 650;
}
.mdb-rms-table th {
  width: 72%;
}
.mdb-figure {
  margin: 1rem 0 0;
}
.mdb-figure img {
  display: block;
  max-width: 100%;
  height: auto;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 8px;
  background: #fff;
}
.mdb-figure figcaption {
  margin-top: 0.45rem;
  font-size: 0.9rem;
  line-height: 1.45;
  opacity: 0.78;
}
.mdb-contact {
  margin-top: 1.2rem;
}
@media (max-width: 760px) {
  .mdb-metrics,
  .mdb-split {
    grid-template-columns: 1fr;
  }
}
</style>
<!-- MATERIAL_DATABASE_SECTION_STYLE_END -->
'''.strip()

    start = "<!-- MATERIAL_DATABASE_SECTION_STYLE_START -->"
    end = "<!-- MATERIAL_DATABASE_SECTION_STYLE_END -->"
    if start in html and end in html:
        return re.sub(re.escape(start) + r".*?" + re.escape(end), css, html, flags=re.S)

    if "</head>" in html:
        return html.replace("</head>", css + "\n</head>", 1)
    return css + "\n" + html


def find_bounds(html):
    m = re.search(r'<section\b[^>]*id=["\']material-database["\'][^>]*>', html, flags=re.I)
    if m:
        start = m.start()
        depth = 0
        tag_re = re.compile(r'<(/?)section\b[^>]*>', re.I)
        for t in tag_re.finditer(html, start):
            if not t.group(1):
                depth += 1
            else:
                depth -= 1
                if depth == 0:
                    return start, t.end()

    h = re.search(r'<h[1-6][^>]*>\s*FDTD-Ready Optical Material.*?</h[1-6]>', html, flags=re.I | re.S)
    if not h:
        raise SystemExit("ERROR: cannot find material database heading")
    start = h.start()
    rest = html[h.end():]
    nxt = re.search(r'<h2\b|</main>|</body>|</html>', rest, flags=re.I)
    end = h.end() + (nxt.start() if nxt else len(rest))
    return start, end


def main():
    repo = REPO
    index = repo / "index.html"
    html = index.read_text(encoding="utf-8")

    backup = repo / "index.html.before_material_database_relayout_v5"
    if not backup.exists():
        backup.write_text(html, encoding="utf-8")

    stats = compute_stats(repo)
    print("stats =", stats)

    figure_block = make_figure_block(repo)

    html = inject_style(html)
    start, end = find_bounds(html)
    html = html[:start] + make_section(stats, figure_block) + "\n" + html[end:]
    index.write_text(html, encoding="utf-8")

    print("RELAYOUT_V5_DONE")
    print("figure_included =", bool(figure_block))
    print("backup =", backup)


if __name__ == "__main__":
    main()
