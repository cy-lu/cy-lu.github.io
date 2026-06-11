import argparse
import math
import re
from pathlib import Path

import pandas as pd


def find_col(df, candidates, required=True):
    cols = {c.lower().strip(): c for c in df.columns}
    for c in candidates:
        key = c.lower().strip()
        if key in cols:
            return cols[key]
    if required:
        raise SystemExit(f"ERROR: cannot find column among {candidates}. Available={list(df.columns)}")
    return None


def bool_series(s):
    if s is None:
        return None
    return s.astype(str).str.lower().isin(["true", "1", "yes", "y", "ready", "fdtd_ready"])


def compute_release_stats(data):
    all_csv = data / "tables" / "website_all_models_long.csv"
    ready_csv = data / "tables" / "website_fdtd_ready_models.csv"
    rec_csv = data / "tables" / "website_record_summary.csv"
    recmd_csv = data / "tables" / "website_final_recommendations.csv"

    all_df = pd.read_csv(all_csv)
    ready_df = pd.read_csv(ready_csv)
    rec_df = pd.read_csv(rec_csv)
    recmd_df = pd.read_csv(recmd_csv)

    mat_col = find_col(rec_df, ["material"], required=False)
    rk_col = find_col(rec_df, ["record_key"], required=True)

    stats = {}
    stats["materials"] = int(rec_df[mat_col].nunique()) if mat_col else None
    stats["records"] = int(rec_df[rk_col].nunique())
    stats["candidate_rows"] = int(len(all_df))
    stats["exported_ready"] = int(len(ready_df))
    stats["recommended_records"] = int(len(recmd_df))
    stats["records_without_recommendation"] = stats["records"] - stats["recommended_records"]

    eps_col = find_col(recmd_df, ["epsilon_rms", "relative_RMS", "relative_rms"], required=False)
    if eps_col:
        eps = pd.to_numeric(recmd_df[eps_col], errors="coerce")
        stats["rms_le_1e_3"] = int((eps <= 1e-3).sum())
        stats["rms_le_5e_3"] = int((eps <= 5e-3).sum())
        stats["rms_le_1e_2"] = int((eps <= 1e-2).sum())
        stats["rms_gt_5e_2"] = int((eps > 5e-2).sum())
    else:
        stats["rms_le_1e_3"] = None
        stats["rms_le_5e_3"] = None
        stats["rms_le_1e_2"] = None
        stats["rms_gt_5e_2"] = None

    return stats


def best_proposed_by_record_N(data):
    df = pd.read_csv(data / "tables" / "website_all_models_long.csv")

    rk = find_col(df, ["record_key"])
    ncol = find_col(df, ["N", "order_N", "model_order"])
    eps = find_col(df, ["epsilon_rms", "relative_RMS", "relative_rms"])
    fam = find_col(df, ["family", "public_family"], required=False)

    ready_col = find_col(df, ["FDTD_ready", "exportable", "summary_FDTD_ready"], required=False)
    model_json = find_col(df, ["model_json", "website_model_json"], required=False)

    tmp = df.copy()
    tmp["_eps"] = pd.to_numeric(tmp[eps], errors="coerce")
    tmp["_N"] = pd.to_numeric(tmp[ncol], errors="coerce")

    mask = tmp["_eps"].notna() & tmp["_N"].between(1, 5)
    if ready_col:
        mask &= bool_series(tmp[ready_col])
    if model_json:
        mask &= tmp[model_json].notna() & (tmp[model_json].astype(str).str.len() > 0)

    tmp = tmp.loc[mask].copy()
    if tmp.empty:
        raise SystemExit("ERROR: no valid proposed rows for plotting")

    idx = tmp.groupby([rk, "_N"])["_eps"].idxmin()
    out = tmp.loc[idx, [rk, "_N", "_eps"]].copy()
    out.columns = ["record_key", "N", "epsilon_rms"]
    out["source"] = "Proposed"
    return out


def tidy3d_by_record_N(csv_path):
    df = pd.read_csv(csv_path)

    rk = find_col(df, ["record_key", "public_record_key", "database_record_key"])
    ncol = find_col(df, ["N", "order_N", "num_poles", "model_order"])
    eps = find_col(df, ["epsilon_rms", "relative_epsilon_rms", "relative_RMS", "tidy3d_rms", "Tidy3D RMS"])

    tmp = df.copy()
    tmp["_eps"] = pd.to_numeric(tmp[eps], errors="coerce")
    tmp["_N"] = pd.to_numeric(tmp[ncol], errors="coerce")
    tmp = tmp[tmp["_eps"].notna() & tmp["_N"].between(1, 5)].copy()

    if tmp.empty:
        raise SystemExit("ERROR: no valid Tidy3D rows for plotting")

    idx = tmp.groupby([rk, "_N"])["_eps"].idxmin()
    out = tmp.loc[idx, [rk, "_N", "_eps"]].copy()
    out.columns = ["record_key", "N", "epsilon_rms"]
    out["source"] = "Tidy3D reference"
    return out


def make_benchmark_figure(repo, tidy3d_csv):
    import numpy as np
    import matplotlib.pyplot as plt

    data = repo / "material-database" / "data"
    out_dir = repo / "material-database" / "assets"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_png = out_dir / "proposed_vs_tidy3d_eps_rms_by_N.png"

    proposed = best_proposed_by_record_N(data)
    tidy = tidy3d_by_record_N(Path(tidy3d_csv))

    # Paired common record/N only.
    key_cols = ["record_key", "N"]
    common = proposed[key_cols].merge(tidy[key_cols], on=key_cols, how="inner")
    proposed = proposed.merge(common, on=key_cols, how="inner")
    tidy = tidy.merge(common, on=key_cols, how="inner")

    if proposed.empty or tidy.empty:
        raise SystemExit("ERROR: no paired common record/N rows between Proposed and Tidy3D")

    fig, axes = plt.subplots(1, 2, figsize=(10.5, 3.0), sharey=True)

    panels = [
        (axes[0], proposed, "Proposed", "#d94829"),
        (axes[1], tidy, "Tidy3D reference", "#2b8cbe"),
    ]

    for ax, dat, title, color in panels:
        vals = []
        labels = []
        for n in range(1, 6):
            y = dat.loc[dat["N"] == n, "epsilon_rms"].astype(float).values
            y = y[np.isfinite(y) & (y > 0)]
            vals.append(y)
            labels.append(str(n))

        bp = ax.boxplot(
            vals,
            labels=labels,
            patch_artist=True,
            showfliers=False,
            widths=0.55,
        )
        for patch in bp["boxes"]:
            patch.set_facecolor(color)
            patch.set_alpha(0.25)
            patch.set_edgecolor(color)
        for item in bp["medians"] + bp["whiskers"] + bp["caps"]:
            item.set_color(color)
            item.set_linewidth(1.6)

        rng = np.random.default_rng(7)
        for i, y in enumerate(vals, start=1):
            if len(y) == 0:
                continue
            x = i + rng.normal(0, 0.035, size=len(y))
            ax.scatter(x, y, s=10, alpha=0.35, color=color, edgecolors="none")

        ax.set_yscale("log")
        ax.set_title(title, fontsize=12)
        ax.set_xlabel("Model order N")
        ax.grid(True, which="both", axis="y", alpha=0.18)
        ax.set_ylim(1e-7, 2)

    axes[0].set_ylabel("relative ε RMS")
    fig.text(0.015, 0.94, "a", fontsize=15, fontweight="bold")
    fig.tight_layout()
    fig.savefig(out_png, dpi=220, bbox_inches="tight")
    plt.close(fig)

    print(f"FIGURE_WRITTEN={out_png}")
    print(f"paired rows proposed={len(proposed)}, tidy3d={len(tidy)}")
    print("paired common record/N =", len(common))
    return out_png


def replace_or_insert_block(html, name, block, anchor_regex):
    start = f"<!-- {name}_START -->"
    end = f"<!-- {name}_END -->"
    wrapped = f"{start}\n{block}\n{end}"

    if start in html and end in html:
        pat = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
        return pat.sub(wrapped, html)

    m = re.search(anchor_regex, html, flags=re.I)
    if not m:
        return html + "\n\n" + wrapped + "\n"

    return html[:m.start()] + wrapped + "\n\n" + html[m.start():]


def patch_homepage(repo, stats, figure_exists):
    index = repo / "index.html"
    html = index.read_text(encoding="utf-8")
    backup = repo / "index.html.before_material_database_scope_update"
    if not backup.exists():
        backup.write_text(html, encoding="utf-8")

    # Conservative numeric/text fixes.
    html = html.replace("3991 exported model files", f"{stats['exported_ready']} exported FDTD-ready model files")
    html = html.replace("3991 exported model files", f"{stats['exported_ready']} exported FDTD-ready model files")
    html = html.replace("3991", str(stats["exported_ready"]))
    html = html.replace("402 of 405", f"{stats['recommended_records']} of {stats['records']}")
    html = html.replace("402 / 405", f"{stats['recommended_records']} / {stats['records']}")
    html = html.replace("denominator is 402", f"denominator is {stats['recommended_records']}")
    html = html.replace("Three records have no recommended exported model", f"{stats['records_without_recommendation']} records have no recommended exported model")
    html = html.replace("Last updated: May 2026", "Last updated: June 2026")
    html = html.replace(
        "The workflow uses two pole-based representations: RP models and CP models.",
        "The workflow uses three pole-based representations: rational-pole (RP), analytical critical-point (CP), and semi-analytical critical-point (SCP) models."
    )

    scope_block = f'''
<section class="material-db-scope-note">
  <h3>Intended use and validity range</h3>
  <p>
    This database is intended for users who need compact, directly exportable dispersive material models for visiblenear-IR FDTD simulations. Each model is fitted only over the wavelength interval supported by its source-specific experimental record, typically within the 0.31.1 µm range or a subset of that window. The reported model quality, passivity status, and FDTD-readiness classification apply only within that fitted wavelength range.
  </p>
  <p>
    The models should not be treated as universal material descriptions outside the fitted interval. Extrapolation to longer or shorter wavelengths may produce inaccurate optical constants, even when the model is passive and FDTD-stable. Users should check the plotted optical constants, fitted permittivity response, and reported ε-RMS before using a model in production simulations.
  </p>

  <h3>Relation to on-demand fast fitting</h3>
  <p>
    This database is complementary to on-demand dispersion fitting tools such as Tidy3D FastFitter. Fast fitting is useful when a user needs a custom material model from a selected optical-constant dataset, wavelength range, weighting scheme, or target model order. In contrast, this database provides a precomputed and audited release of RP, CP, and SCP candidate models for hundreds of source-specific records.
  </p>
  <p>
    The purpose of the database is not only to minimize fitting error, but to provide a reproducible FDTD-ready model package. For each record, the database stores the experimental points, fitting grid, model response curves, exported PoleResidue JSON files, passivity information, stability status, and model-quality metrics.
  </p>
</section>
'''.strip()

    html = replace_or_insert_block(
        html,
        "MATERIAL_DATABASE_SCOPE_NOTE",
        scope_block,
        r"(<h[23][^>]*>\s*Database Scope\s*</h[23]>)"
    )

    if figure_exists:
        fig_block = '''
<figure class="material-db-benchmark-figure">
  <img src="material-database/assets/proposed_vs_tidy3d_eps_rms_by_N.png" alt="Relative epsilon RMS comparison between the proposed database models and a Tidy3D fast-fitting reference." style="max-width:100%; height:auto; border:1px solid #ddd; border-radius:6px;" />
  <figcaption>
    Relative ε-RMS distribution by model order N for the proposed audited database models and a Tidy3D fast-fitting reference, evaluated on paired source-specific records and model orders using the same ε-RMS definition.
  </figcaption>
</figure>
'''.strip()

        html = replace_or_insert_block(
            html,
            "MATERIAL_DATABASE_BENCHMARK_FIGURE",
            fig_block,
            r"(How\s+ε-RMS\s+is\s+computed|How\s+epsilon-RMS\s+is\s+computed)"
        )

    index.write_text(html, encoding="utf-8")
    print(f"HOMEPAGE_PATCHED={index}")
    print(f"backup={backup}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=r"D:\GitHub_work\cy-lu.github.io")
    ap.add_argument("--tidy3d-csv", default="")
    args = ap.parse_args()

    repo = Path(args.repo)
    data = repo / "material-database" / "data"

    stats = compute_release_stats(data)
    print("release stats:", stats)

    fig_exists = False
    if args.tidy3d_csv:
        make_benchmark_figure(repo, args.tidy3d_csv)
        fig_exists = True
    else:
        print("No --tidy3d-csv provided; homepage text will be patched without benchmark figure.")

    patch_homepage(repo, stats, fig_exists)


if __name__ == "__main__":
    main()
