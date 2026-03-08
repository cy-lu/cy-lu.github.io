MATLAB teaching code package for Computational Structural Mechanics

Files:
- clt_main_example.m
  Main example script for a symmetric [0/45/-45/90]s carbon/epoxy laminate
- build_laminate_ABD.m
  Builds laminate A, B, D, and ABD matrices
- stress_xy_to_12.m
  Transforms global laminate stresses into ply material stresses
- tsai_hill_index.m
  Computes Tsai-Hill failure index
- plot_clt_results.m
  Simple plotting script for ply stresses and failure index

Suggested order:
1. Run clt_main_example.m
2. Inspect A, B, D, eps0, kappa, and per-ply sigma_12 / FI
3. Run plot_clt_results.m
