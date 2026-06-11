import csv
import json
import math
import ast
import re
from pathlib import Path


REPO = Path(r"D:\GitHub_work\cy-lu.github.io")


def read_csv(path):
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


def find_col(rows, candidates, required=True):
    if not rows:
        if required:
            raise SystemExit("ERROR: empty CSV")
        return None
    cols = {c.lower().strip(): c for c in rows[0].keys()}
    for c in candidates:
        k = c.lower().strip()
        if k in cols:
            return cols[k]
    if required:
        raise SystemExit(f"ERROR: cannot find column among {candidates}. Available={list(rows[0].keys())}")
    return None


def to_float(x):
    try:
        v = float(str(x).strip())
        return v if math.isfinite(v) else None
    except Exception:
        return None


def compute_stats(repo):
    data = repo / "material-database" / "data"
    tables = data / "tables"

    all_rows = read_csv(tables / "website_all_models_long.csv")
    ready_rows = read_csv(tables / "website_fdtd_ready_models.csv")
    rec_rows = read_csv(tables / "website_record_summary.csv")
    recmd_rows = read_csv(tables / "website_final_recommendations.csv")

    mat_col = find_col(rec_rows, ["material"], required=False)
    rk_col = find_col(rec_rows, ["record_key"])

    materials = len(set(r[mat_col] for r in rec_rows if mat_col and r.get(mat_col)))
    records = len(set(r[rk_col] for r in rec_rows if r.get(rk_col)))

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


def stat_card(label, value):
    return f'''
      <div class="mdb-card">
        <div class="mdb-value">{value}</div>
        <div class="mdb-label">{label}</div>
      </div>'''.rstrip()


def make_material_database_section(stats, fig_exists):
    cards = "\n".join([
        stat_card("material labels", stats["materials"]),
        stat_card("source-specific records", stats["records"]),
        stat_card("candidate model rows", stats["candidate_rows"]),
        stat_card("FDTD-ready exported models", stats["ready_models"]),
        stat_card("records with recommendation", f'{stats["recommended_records"]} / {stats["records"]}'),
        stat_card("records without recommendation", stats["records_without_recommendation"]),
        stat_card("full 0.31.1 µm records", f'{stats["full_records"]} / {stats["records"]}'),
        stat_card("partial-window records", f'{stats["partial_records"]} / {stats["records"]}'),
    ])

    rms_cards = "\n".join([
        stat_card("recommended ε-RMS  10", f'{stats["rms_le_1e3"]} / {stats["rms_denominator"]}'),
        stat_card("recommended ε-RMS  510", f'{stats["rms_le_5e3"]} / {stats["rms_denominator"]}'),
        stat_card("recommended ε-RMS  10", f'{stats["rms_le_1e2"]} / {stats["rms_denominator"]}'),
        stat_card("recommended ε-RMS > 510", f'{stats["rms_gt_5e2"]} / {stats["rms_denominator"]}'),
    ])

    fig_html = ""
    if fig_exists:
        fig_html = '''
    <figure class="mdb-figure">
      <img src="material-database/assets/proposed_vs_tidy3d_eps_rms_by_N.png" alt="Relative epsilon RMS comparison between the proposed audited database and Tidy3D FastFitter reference." />
      <figcaption>
        Relative ε-RMS distribution by model order N for the proposed audited database models and a Tidy3D FastFitter reference, evaluated on paired source-specific records using the same ε-RMS definition.
      </figcaption>
    </figure>
'''.rstrip()

    return f'''
<section id="material-database" class="material-database-section">
  <div class="mdb-header">
    <p class="mdb-eyebrow">Optical material models</p>
    <h2>FDTD-Ready Optical Material Model Database</h2>
    <p class="mdb-lead">
      A searchable release of compact, directly exportable dispersive material models for broadband time-domain electromagnetic simulations.
      The database provides precomputed rational-pole (RP), analytical critical-point (CP), and semi-analytical critical-point (SCP)
      fits to source-specific experimental optical-constant records.
    </p>
    <p class="mdb-lead">
      Each exported model is provided in Tidy3D PoleResidue JSON format and is reported with fitting quality, passivity information,
      artifact availability, and a final time-domain amplification-matrix stability audit.
    </p>
    <p><a class="mdb-button" href="material-database/">Browse the database</a></p>
  </div>

  <div class="mdb-block">
    <h3>Release at a glance</h3>
    <div class="mdb-grid">
{cards}
    </div>
  </div>

  <div class="mdb-two-col">
    <div class="mdb-block">
      <h3>Intended use and validity range</h3>
      <p>
        This database is intended for users who need compact dispersive models for visiblenear-IR FDTD simulations.
        Each model is fitted only over the wavelength interval supported by its own experimental record, typically within
        0.31.1&nbsp;µm or a subset of that range.
      </p>
      <p>
        The models should not be treated as universal optical-constant descriptions outside the fitted interval.
        Extrapolation to longer or shorter wavelengths may be inaccurate even when the fitted model is passive and FDTD-stable.
        Users should check the online optical-constant and permittivity plots before using a model in production simulations.
      </p>
    </div>

    <div class="mdb-block">
      <h3>Model families and FDTD readiness</h3>
      <p>
        The release contains three pole-based model families: RP, CP, and SCP. Automated fitting and refinement are performed
        over N = 15 pole pairs, producing {stats["candidate_rows"]} candidate model rows in the current release.
      </p>
      <p>
        A model is marked FDTD-ready only after passing the production gates, including passivity screening, successful JSON
        and curve export, and a final amplification-matrix stability check. The recommended model is selected from this
        audited candidate set rather than from fitting error alone.
      </p>
    </div>
  </div>

  <div class="mdb-block">
    <h3>How ε-RMS is computed</h3>
    <p>
      For each source-specific record, the experimental optical constants are converted to a complex dielectric function,
      ε<sub>exp</sub>(λ) = [n(λ) + i k(λ)]. The fitted model gives ε<sub>fit</sub>(λ) on the same fitting grid.
      The reported dimensionless error is
      ε-RMS = sqrt(mean(|ε<sub>fit</sub>  ε<sub>exp</sub>| / (|ε<sub>exp</sub>| + 10))).
      This is a relative RMS error of the complex dielectric function, not a direct RMS error of n or k alone.
    </p>
    <div class="mdb-grid mdb-grid-small">
{rms_cards}
    </div>
    <p class="mdb-note">
      These RMS statistics use the final recommended model for each recommended source-specific record, so the denominator is
      {stats["rms_denominator"]}, not the {stats["ready_models"]} exported FDTD-ready model files. A value of ε-RMS  10
      indicates an average relative complex-permittivity error below approximately 1% on the fitting grid; it does not imply
      that every wavelength point has less than 1% pointwise error.
    </p>
  </div>

  <div class="mdb-block">
    <h3>Relation to Tidy3D FastFitter and on-demand fitting</h3>
    <p>
      This database is complementary to on-demand fitting tools such as Tidy3D FastFitter. A fast fitter is useful when a user
      needs a custom model from a chosen optical-constant dataset, wavelength range, weighting scheme, or target model order.
      In contrast, this database provides a precomputed and reproducible release of audited RP, CP, and SCP candidates for
      hundreds of source-specific optical records.
    </p>
    <p>
      The goal is not only to minimize fitting error, but to provide FDTD-ready material files with traceable experimental data,
      fitting grids, model curves, JSON exports, passivity status, stability status, and recommendation logic. For custom wavelength
      bands or application-specific weighting, users should perform a new fit and apply equivalent passivity and FDTD-stability checks.
    </p>
{fig_html}
  </div>

  <div class="mdb-block">
    <h3>Current release</h3>
    <p>
      Current release: record-specific visiblenear-IR RP/CP/SCP optical material fits with Tidy3D PoleResidue JSON exports.
      {stats["records_without_recommendation"]} of {stats["records"]} source-specific records currently have no recommended exported model.
    </p>
    <p>
      For questions, corrections, or suggestions, please contact
      <a href="mailto:jinyoulu@ntu.edu.tw">jinyoulu@ntu.edu.tw</a>.
    </p>
    <p class="mdb-note">Last updated: June 2026.</p>
  </div>
</section>
'''.strip()


def inject_style(html):
    css = r'''
<!-- MATERIAL_DATABASE_SECTION_STYLE_START -->
<style>
.material-database-section { margin-top: 2.5rem; }
.material-database-section h2 { margin-bottom: 0.6rem; }
.mdb-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  opacity: 0.72;
  margin-bottom: 0.25rem;
}
.mdb-lead { max-width: 960px; line-height: 1.65; }
.mdb-button {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.62rem 0.95rem;
  border-radius: 8px;
  border: 1px solid currentColor;
  text-decoration: none;
}
.mdb-block { margin-top: 1.6rem; }
.mdb-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-top: 1.2rem;
}
.mdb-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(130px, 1fr));
  gap: 0.85rem;
  margin-top: 0.9rem;
}
.mdb-grid-small { grid-template-columns: repeat(4, minmax(150px, 1fr)); }
.mdb-card {
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 10px;
  padding: 0.85rem 0.9rem;
  background: rgba(255,255,255,0.55);
}
.mdb-value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}
.mdb-label {
  margin-top: 0.25rem;
  font-size: 0.88rem;
  opacity: 0.75;
  line-height: 1.35;
}
.mdb-note { font-size: 0.92rem; opacity: 0.82; }
.mdb-figure { margin: 1.2rem 0 0; }
.mdb-figure img {
  max-width: 100%;
  height: auto;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 8px;
}
.mdb-figure figcaption {
  margin-top: 0.45rem;
  font-size: 0.9rem;
  opacity: 0.78;
}
@media (max-width: 900px) {
  .mdb-two-col { grid-template-columns: 1fr; }
  .mdb-grid, .mdb-grid-small { grid-template-columns: repeat(2, minmax(130px, 1fr)); }
}
@media (max-width: 560px) {
  .mdb-grid, .mdb-grid-small { grid-template-columns: 1fr; }
}
</style>
<!-- MATERIAL_DATABASE_SECTION_STYLE_END -->
'''.strip()

    start = "<!-- MATERIAL_DATABASE_SECTION_STYLE_START -->"
    end = "<!-- MATERIAL_DATABASE_SECTION_STYLE_END -->"
    if start in html and end in html:
        pat = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
        return pat.sub(css, html)

    if "</head>" in html:
        return html.replace("</head>", css + "\n</head>", 1)
    return css + "\n" + html


def find_material_block_bounds(html):
    heading_pat = re.compile(
        r'<h[1-6][^>]*>\s*FDTD-Ready Optical Material.*?</h[1-6]>',
        re.I | re.S
    )
    m = heading_pat.search(html)
    if not m:
        pos = html.find("FDTD-Ready Optical Material")
        if pos < 0:
            raise SystemExit("ERROR: cannot find Material Database heading text")
        start = html.rfind("<h", 0, pos)
        if start < 0:
            start = pos
        heading_end = pos
    else:
        start = m.start()
        heading_end = m.end()

    next_h2 = re.search(r'<h2\b[^>]*>', html[heading_end:], re.I)
    if next_h2:
        end = heading_end + next_h2.start()
        return start, end

    for marker in ["</main>", "</body>", "</html>"]:
        p = html.find(marker, heading_end)
        if p >= 0:
            return start, p

    return start, len(html)


def main():
    repo = REPO
    index = repo / "index.html"
    html = index.read_text(encoding="utf-8")

    backup = repo / "index.html.before_full_material_database_relayout_v3"
    if not backup.exists():
        backup.write_text(html, encoding="utf-8")

    stats = compute_stats(repo)
    print("stats =", stats)

    fig_exists = (repo / "material-database" / "assets" / "proposed_vs_tidy3d_eps_rms_by_N.png").exists()

    html = inject_style(html)
    start, end = find_material_block_bounds(html)
    new_section = make_material_database_section(stats, fig_exists)
    html = html[:start] + new_section + "\n" + html[end:]

    index.write_text(html, encoding="utf-8")

    print("RELAYOUT_DONE")
    print("index =", index)
    print("backup =", backup)
    print("figure_exists =", fig_exists)


if __name__ == "__main__":
    main()
