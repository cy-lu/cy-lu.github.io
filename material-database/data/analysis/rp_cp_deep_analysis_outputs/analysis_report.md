# Deep RP vs CP-family database analysis

## Executive conclusion

This analysis folds Analytical CP and SemiCP into one CP-family and compares only RP vs CP-family for website selection.
The default selection is FDTD-ready first, then epsilon RMS.  A model without FDTD-ready status or without JSON is not treated as usable.

- record-N rows analysed: **1380**
- material records analysed: **276**
- materials analysed: **54**
- N range: **1–5**
- primary RMS target: **0.005**
- secondary RMS target: **0.01**

## Final per-record recommendation

- CP: **263** records
- RP: **11** records
- none: **2** records

Specific internal model counts:
- SemiCP: **216** records
- AnalyticalCP: **47** records
- RP: **11** records
- none: **2** records

Records reaching primary target RMS <= 0.005: **176 / 276** (63.8%)
Records reaching secondary target RMS <= 0.01: **201 / 276** (72.8%)
Records with no usable model: **2**

## What should the website do?

Use `website_lookup_by_record_N.csv` for the N selector.  It already contains the selected family, specific model, RMS, G_rho, and model JSON path.
Use `final_recommendation_per_record.csv` for the default model when the user does not manually choose N.

Recommended website logic:

1. Select only usable models: FDTD-ready, finite RMS, and JSON present.
2. Fold CP and SemiCP into CP-family by choosing the lower-RMS usable CP/SemiCP candidate.
3. Compare RP vs CP-family at the chosen N.
4. Default per material record: choose the smallest N that reaches the primary RMS target; if none reaches it, choose the lowest-RMS usable model.

## Readiness by family and N

|   N | family    |   rows |   FDTD_ready_count |   usable_with_json_count |   FDTD_ready_fraction |   usable_fraction |   median_RMS_ready |
|----:|:----------|-------:|-------------------:|-------------------------:|----------------------:|------------------:|-------------------:|
|   1 | RP        |    276 |                 69 |                       69 |              0.25     |          0.25     |         0.0450566  |
|   1 | CP        |    276 |                195 |                      195 |              0.706522 |          0.706522 |         0.152386   |
|   1 | SCP       |    276 |                210 |                      210 |              0.76087  |          0.76087  |         0.132478   |
|   1 | CP_folded |    276 |                229 |                      229 |              0.82971  |          0.82971  |         0.137608   |
|   2 | RP        |    276 |                 82 |                       82 |              0.297101 |          0.297101 |         0.0336022  |
|   2 | CP        |    276 |                206 |                      206 |              0.746377 |          0.746377 |         0.0303675  |
|   2 | SCP       |    276 |                230 |                      230 |              0.833333 |          0.833333 |         0.0206831  |
|   2 | CP_folded |    276 |                246 |                      246 |              0.891304 |          0.891304 |         0.02205    |
|   3 | RP        |    276 |                 73 |                       73 |              0.264493 |          0.264493 |         0.0150781  |
|   3 | CP        |    276 |                198 |                      198 |              0.717391 |          0.717391 |         0.0151099  |
|   3 | SCP       |    276 |                221 |                      221 |              0.800725 |          0.800725 |         0.00574678 |
|   3 | CP_folded |    276 |                243 |                      243 |              0.880435 |          0.880435 |         0.00639535 |
|   4 | RP        |    276 |                 99 |                       99 |              0.358696 |          0.358696 |         0.00585467 |
|   4 | CP        |    276 |                193 |                      193 |              0.699275 |          0.699275 |         0.00854469 |
|   4 | SCP       |    276 |                221 |                      221 |              0.800725 |          0.800725 |         0.00246245 |
|   4 | CP_folded |    276 |                243 |                      243 |              0.880435 |          0.880435 |         0.00300153 |
|   5 | RP        |    276 |                109 |                      109 |              0.394928 |          0.394928 |         0.00673475 |
|   5 | CP        |    276 |                206 |                      206 |              0.746377 |          0.746377 |         0.00527537 |
|   5 | SCP       |    276 |                221 |                      221 |              0.800725 |          0.800725 |         0.00154554 |
|   5 | CP_folded |    276 |                243 |                      243 |              0.880435 |          0.880435 |         0.00193823 |

## Selected family counts by N

|   N |   CP |   RP |   none |
|----:|-----:|-----:|-------:|
|   1 |  228 |    1 |     47 |
|   2 |  234 |   12 |     30 |
|   3 |  234 |   13 |     29 |
|   4 |  227 |   21 |     28 |
|   5 |  229 |   16 |     31 |

## Cumulative threshold coverage

|   threshold_RMS | family            |   N_max |   records_reaching_threshold |   total_records |   coverage_fraction |
|----------------:|:------------------|--------:|-----------------------------:|----------------:|--------------------:|
|           0.005 | RP                |       1 |                           26 |             276 |           0.0942029 |
|           0.005 | RP                |       2 |                           33 |             276 |           0.119565  |
|           0.005 | RP                |       3 |                           48 |             276 |           0.173913  |
|           0.005 | RP                |       4 |                           65 |             276 |           0.235507  |
|           0.005 | RP                |       5 |                           79 |             276 |           0.286232  |
|           0.005 | CP_folded         |       1 |                           39 |             276 |           0.141304  |
|           0.005 | CP_folded         |       2 |                           68 |             276 |           0.246377  |
|           0.005 | CP_folded         |       3 |                          114 |             276 |           0.413043  |
|           0.005 | CP_folded         |       4 |                          158 |             276 |           0.572464  |
|           0.005 | CP_folded         |       5 |                          174 |             276 |           0.630435  |
|           0.005 | Selected_RP_or_CP |       1 |                           39 |             276 |           0.141304  |
|           0.005 | Selected_RP_or_CP |       2 |                           68 |             276 |           0.246377  |
|           0.005 | Selected_RP_or_CP |       3 |                          114 |             276 |           0.413043  |
|           0.005 | Selected_RP_or_CP |       4 |                          159 |             276 |           0.576087  |
|           0.005 | Selected_RP_or_CP |       5 |                          176 |             276 |           0.637681  |
|           0.01  | RP                |       1 |                           31 |             276 |           0.112319  |
|           0.01  | RP                |       2 |                           45 |             276 |           0.163043  |
|           0.01  | RP                |       3 |                           66 |             276 |           0.23913   |
|           0.01  | RP                |       4 |                           92 |             276 |           0.333333  |
|           0.01  | RP                |       5 |                          109 |             276 |           0.394928  |
|           0.01  | CP_folded         |       1 |                           47 |             276 |           0.17029   |
|           0.01  | CP_folded         |       2 |                           95 |             276 |           0.344203  |
|           0.01  | CP_folded         |       3 |                          148 |             276 |           0.536232  |
|           0.01  | CP_folded         |       4 |                          182 |             276 |           0.65942   |
|           0.01  | CP_folded         |       5 |                          199 |             276 |           0.721014  |
|           0.01  | Selected_RP_or_CP |       1 |                           47 |             276 |           0.17029   |
|           0.01  | Selected_RP_or_CP |       2 |                           96 |             276 |           0.347826  |
|           0.01  | Selected_RP_or_CP |       3 |                          148 |             276 |           0.536232  |
|           0.01  | Selected_RP_or_CP |       4 |                          185 |             276 |           0.67029   |
|           0.01  | Selected_RP_or_CP |       5 |                          201 |             276 |           0.728261  |
|           0.02  | RP                |       1 |                           34 |             276 |           0.123188  |
|           0.02  | RP                |       2 |                           58 |             276 |           0.210145  |
|           0.02  | RP                |       3 |                           82 |             276 |           0.297101  |
|           0.02  | RP                |       4 |                          106 |             276 |           0.384058  |
|           0.02  | RP                |       5 |                          126 |             276 |           0.456522  |
|           0.02  | CP_folded         |       1 |                           50 |             276 |           0.181159  |
|           0.02  | CP_folded         |       2 |                          122 |             276 |           0.442029  |
|           0.02  | CP_folded         |       3 |                          177 |             276 |           0.641304  |
|           0.02  | CP_folded         |       4 |                          212 |             276 |           0.768116  |
|           0.02  | CP_folded         |       5 |                          226 |             276 |           0.818841  |
|           0.02  | Selected_RP_or_CP |       1 |                           50 |             276 |           0.181159  |
|           0.02  | Selected_RP_or_CP |       2 |                          128 |             276 |           0.463768  |
|           0.02  | Selected_RP_or_CP |       3 |                          182 |             276 |           0.65942   |
|           0.02  | Selected_RP_or_CP |       4 |                          216 |             276 |           0.782609  |
|           0.02  | Selected_RP_or_CP |       5 |                          228 |             276 |           0.826087  |
|           0.05  | RP                |       1 |                           37 |             276 |           0.134058  |
|           0.05  | RP                |       2 |                           66 |             276 |           0.23913   |
|           0.05  | RP                |       3 |                           93 |             276 |           0.336957  |
|           0.05  | RP                |       4 |                          127 |             276 |           0.460145  |
|           0.05  | RP                |       5 |                          154 |             276 |           0.557971  |
|           0.05  | CP_folded         |       1 |                           66 |             276 |           0.23913   |
|           0.05  | CP_folded         |       2 |                          190 |             276 |           0.688406  |
|           0.05  | CP_folded         |       3 |                          226 |             276 |           0.818841  |
|           0.05  | CP_folded         |       4 |                          243 |             276 |           0.880435  |
|           0.05  | CP_folded         |       5 |                          255 |             276 |           0.923913  |
|           0.05  | Selected_RP_or_CP |       1 |                           66 |             276 |           0.23913   |
|           0.05  | Selected_RP_or_CP |       2 |                          191 |             276 |           0.692029  |
|           0.05  | Selected_RP_or_CP |       3 |                          227 |             276 |           0.822464  |
|           0.05  | Selected_RP_or_CP |       4 |                          246 |             276 |           0.891304  |
|           0.05  | Selected_RP_or_CP |       5 |                          259 |             276 |           0.938406  |

## First acceptable N distribution

|   threshold_RMS | family            | first_N     |   count |   fraction |
|----------------:|:------------------|:------------|--------:|-----------:|
|           0.005 | RP                | 1           |      26 |  0.0942029 |
|           0.005 | RP                | 2           |       7 |  0.0253623 |
|           0.005 | RP                | 3           |      15 |  0.0543478 |
|           0.005 | RP                | 4           |      17 |  0.0615942 |
|           0.005 | RP                | 5           |      14 |  0.0507246 |
|           0.005 | RP                | not_reached |     197 |  0.713768  |
|           0.005 | CP_folded         | 1           |      39 |  0.141304  |
|           0.005 | CP_folded         | 2           |      29 |  0.105072  |
|           0.005 | CP_folded         | 3           |      46 |  0.166667  |
|           0.005 | CP_folded         | 4           |      44 |  0.15942   |
|           0.005 | CP_folded         | 5           |      16 |  0.057971  |
|           0.005 | CP_folded         | not_reached |     102 |  0.369565  |
|           0.005 | Selected_RP_or_CP | 1           |      39 |  0.141304  |
|           0.005 | Selected_RP_or_CP | 2           |      29 |  0.105072  |
|           0.005 | Selected_RP_or_CP | 3           |      46 |  0.166667  |
|           0.005 | Selected_RP_or_CP | 4           |      45 |  0.163043  |
|           0.005 | Selected_RP_or_CP | 5           |      17 |  0.0615942 |
|           0.005 | Selected_RP_or_CP | not_reached |     100 |  0.362319  |
|           0.01  | RP                | 1           |      31 |  0.112319  |
|           0.01  | RP                | 2           |      14 |  0.0507246 |
|           0.01  | RP                | 3           |      21 |  0.076087  |
|           0.01  | RP                | 4           |      26 |  0.0942029 |
|           0.01  | RP                | 5           |      17 |  0.0615942 |
|           0.01  | RP                | not_reached |     167 |  0.605072  |
|           0.01  | CP_folded         | 1           |      47 |  0.17029   |
|           0.01  | CP_folded         | 2           |      48 |  0.173913  |
|           0.01  | CP_folded         | 3           |      53 |  0.192029  |
|           0.01  | CP_folded         | 4           |      34 |  0.123188  |
|           0.01  | CP_folded         | 5           |      17 |  0.0615942 |
|           0.01  | CP_folded         | not_reached |      77 |  0.278986  |
|           0.01  | Selected_RP_or_CP | 1           |      47 |  0.17029   |
|           0.01  | Selected_RP_or_CP | 2           |      49 |  0.177536  |
|           0.01  | Selected_RP_or_CP | 3           |      52 |  0.188406  |
|           0.01  | Selected_RP_or_CP | 4           |      37 |  0.134058  |
|           0.01  | Selected_RP_or_CP | 5           |      16 |  0.057971  |
|           0.01  | Selected_RP_or_CP | not_reached |      75 |  0.271739  |
|           0.02  | RP                | 1           |      34 |  0.123188  |
|           0.02  | RP                | 2           |      24 |  0.0869565 |
|           0.02  | RP                | 3           |      24 |  0.0869565 |
|           0.02  | RP                | 4           |      24 |  0.0869565 |
|           0.02  | RP                | 5           |      20 |  0.0724638 |
|           0.02  | RP                | not_reached |     150 |  0.543478  |
|           0.02  | CP_folded         | 1           |      50 |  0.181159  |
|           0.02  | CP_folded         | 2           |      72 |  0.26087   |
|           0.02  | CP_folded         | 3           |      55 |  0.199275  |
|           0.02  | CP_folded         | 4           |      35 |  0.126812  |
|           0.02  | CP_folded         | 5           |      14 |  0.0507246 |
|           0.02  | CP_folded         | not_reached |      50 |  0.181159  |
|           0.02  | Selected_RP_or_CP | 1           |      50 |  0.181159  |
|           0.02  | Selected_RP_or_CP | 2           |      78 |  0.282609  |
|           0.02  | Selected_RP_or_CP | 3           |      54 |  0.195652  |
|           0.02  | Selected_RP_or_CP | 4           |      34 |  0.123188  |
|           0.02  | Selected_RP_or_CP | 5           |      12 |  0.0434783 |
|           0.02  | Selected_RP_or_CP | not_reached |      48 |  0.173913  |
|           0.05  | RP                | 1           |      37 |  0.134058  |
|           0.05  | RP                | 2           |      29 |  0.105072  |
|           0.05  | RP                | 3           |      27 |  0.0978261 |
|           0.05  | RP                | 4           |      34 |  0.123188  |
|           0.05  | RP                | 5           |      27 |  0.0978261 |
|           0.05  | RP                | not_reached |     122 |  0.442029  |
|           0.05  | CP_folded         | 1           |      66 |  0.23913   |
|           0.05  | CP_folded         | 2           |     124 |  0.449275  |
|           0.05  | CP_folded         | 3           |      36 |  0.130435  |
|           0.05  | CP_folded         | 4           |      17 |  0.0615942 |
|           0.05  | CP_folded         | 5           |      12 |  0.0434783 |
|           0.05  | CP_folded         | not_reached |      21 |  0.076087  |
|           0.05  | Selected_RP_or_CP | 1           |      66 |  0.23913   |
|           0.05  | Selected_RP_or_CP | 2           |     125 |  0.452899  |
|           0.05  | Selected_RP_or_CP | 3           |      36 |  0.130435  |
|           0.05  | Selected_RP_or_CP | 4           |      19 |  0.0688406 |
|           0.05  | Selected_RP_or_CP | 5           |      13 |  0.0471014 |
|           0.05  | Selected_RP_or_CP | not_reached |      17 |  0.0615942 |

## Important diagnostic counts

- cp_rescues_when_rp_unusable: **783** rows
- rp_wins_by_record_N: **63** rows
- rp_final_recommendations: **11** rows
- no_usable_records: **2** rows
- hard_records_not_reaching_primary_target: **98** rows
- hard_records_not_reaching_secondary_target: **73** rows
- unstable_low_RMS_traps: **102** rows

## Most difficult records by final RMS

| material_query   | book   | page           |   record_index | material_class              | final_family   | final_specific_model   |   final_N |   final_RMS | final_quality_band   | final_selection_mode              |
|:-----------------|:-------|:---------------|---------------:|:----------------------------|:---------------|:-----------------------|----------:|------------:|:---------------------|:----------------------------------|
| As2Se3           | As2Se3 | Joseph-700nm   |              2 | chalcogenide_or_2D          | CP             | SemiCP                 |         2 |   0.472918  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Si               | Si     | Green-1995     |             23 | semiconductor               | CP             | AnalyticalCP           |         1 |   0.149031  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WSe2             | WSe2   | Gu-1L          |              1 | chalcogenide_or_2D          | RP             | RP                     |         3 |   0.14368   | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| InAs             | InAs   | Adachi         |              1 | semiconductor               | CP             | SemiCP                 |         3 |   0.124444  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| InSb             | InSb   | Adachi         |              1 | semiconductor               | CP             | AnalyticalCP           |         5 |   0.103436  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WS2              | WS2    | Munkhbat-o     |              1 | chalcogenide_or_2D          | CP             | AnalyticalCP           |         4 |   0.103344  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WSe2             | WSe2   | Gu-4L          |              4 | chalcogenide_or_2D          | CP             | SemiCP                 |         4 |   0.101369  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WSe2             | WSe2   | Gu-3L          |              3 | chalcogenide_or_2D          | CP             | SemiCP                 |         5 |   0.0963361 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| InP              | InP    | Adachi         |              1 | semiconductor               | CP             | SemiCP                 |         5 |   0.0874368 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WSe2             | WSe2   | Gu-5L          |              5 | chalcogenide_or_2D          | RP             | RP                     |         3 |   0.0782951 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| GaSb             | GaSb   | Adachi         |              1 | semiconductor               | CP             | SemiCP                 |         3 |   0.0769515 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| MoS2             | MoS2   | Beal           |              1 | chalcogenide_or_2D          | CP             | AnalyticalCP           |         5 |   0.075667  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Au               | Au     | Yakubovsky-4nm |             17 | metal                       | CP             | SemiCP                 |         5 |   0.0640064 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| V                | V      | Johnson        |              3 | metal                       | CP             | SemiCP                 |         5 |   0.055196  | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| GaAs             | GaAs   | Adachi         |              1 | semiconductor               | CP             | AnalyticalCP           |         5 |   0.0531661 | poor_>0.05           | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| ZnO              | ZnO    | Querry         |              1 | TCO_or_semiconducting_oxide | CP             | SemiCP                 |         3 |   0.0446758 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Au               | Au     | Rakic-BB       |              8 | metal                       | CP             | SemiCP                 |         3 |   0.0439975 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| MoS2             | MoS2   | Islam-1L       |              2 | chalcogenide_or_2D          | CP             | AnalyticalCP           |         5 |   0.0431228 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Au               | Au     | Yakubovsky-6nm |             18 | metal                       | CP             | SemiCP                 |         5 |   0.042173  | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| W                | W      | Rakic-BB       |              4 | metal                       | CP             | SemiCP                 |         3 |   0.0416433 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Cu               | Cu     | McPeak         |              9 | metal                       | CP             | AnalyticalCP           |         4 |   0.0409908 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| GaP              | GaP    | Adachi         |              1 | semiconductor               | CP             | SemiCP                 |         3 |   0.0402477 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Ag               | Ag     | Ferrera-298K   |              9 | metal                       | CP             | SemiCP                 |         2 |   0.0397977 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Cr               | Cr     | Johnson        |              1 | metal                       | CP             | SemiCP                 |         3 |   0.0397582 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| MoS2             | MoS2   | Ermolaev-1L    |             14 | chalcogenide_or_2D          | CP             | AnalyticalCP           |         5 |   0.0364467 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Ge               | Ge     | Nunley         |              1 | semiconductor               | CP             | AnalyticalCP           |         5 |   0.0359864 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| WSe2             | WSe2   | Gu-2L          |              2 | chalcogenide_or_2D          | RP             | RP                     |         5 |   0.0337068 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| GaAs             | GaAs   | Papatryfonos   |              3 | semiconductor               | CP             | AnalyticalCP           |         5 |   0.0299053 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| MoS2             | MoS2   | Song-6L        |             10 | chalcogenide_or_2D          | RP             | RP                     |         5 |   0.0295637 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |
| Ag               | Ag     | Ferrera-404K   |             10 | metal                       | CP             | SemiCP                 |         2 |   0.0292185 | rough_<=0.05         | BEST_AVAILABLE_ABOVE_TARGET_0.005 |

## Output files

Main files:
- `analysis_report.md` — this report
- `website_lookup_by_record_N.csv` — one row per material record and N, selected RP/CP-family model
- `final_recommendation_per_record.csv` — one default recommendation per material record
- `family_readiness_by_N.csv`
- `threshold_coverage_by_N.csv`
- `first_acceptable_N_distribution.csv`
- `cp_rescues_when_rp_unusable.csv`
- `rp_wins_by_record_N.csv`
- `rp_final_recommendations.csv`
- `hard_records_not_reaching_primary_target.csv`
- `unstable_low_RMS_traps.csv`
