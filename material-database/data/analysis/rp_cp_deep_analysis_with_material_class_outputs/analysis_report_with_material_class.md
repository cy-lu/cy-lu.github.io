# Deep RP vs CP-family database analysis with material classes

## Executive conclusion

This analysis folds Analytical CP and SemiCP into one CP-family and compares only RP vs CP-family for website selection.
The default rule is FDTD-ready first, then epsilon RMS.  A model without FDTD-ready status or without JSON is not treated as usable.

- record-N rows analysed: **1380**
- material records analysed: **276**
- materials analysed: **54**
- material classes analysed: **10**
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
- : **2** records

Records reaching primary target RMS <= 0.005: **176 / 276** (63.8%)
Records reaching secondary target RMS <= 0.01: **201 / 276** (72.8%)
Records with no usable model: **2**

## Material-class record counts

| material_class               |   records |
|:-----------------------------|----------:|
| metal                        |       103 |
| chalcogenide_or_2D           |        43 |
| semiconductor                |        40 |
| high_k_oxide                 |        23 |
| carbon                       |        21 |
| transparent_dielectric_oxide |        15 |
| lossy_transition_metal_oxide |        14 |
| nitride_or_carbide           |        12 |
| fluoride                     |         3 |
| TCO_or_semiconducting_oxide  |         2 |

## Material-class final recommendation summary

| material_class               | final_family   | final_specific_model   |   records |   median_final_RMS |   mean_final_RMS |   primary_target_fraction |   secondary_target_fraction |   records_in_class |   fraction_within_class |
|:-----------------------------|:---------------|:-----------------------|----------:|-------------------:|-----------------:|--------------------------:|----------------------------:|-------------------:|------------------------:|
| TCO_or_semiconducting_oxide  | CP             | SemiCP                 |         2 |        0.0234345   |      0.0234345   |                  0.5      |                    0.5      |                  2 |               1         |
| carbon                       | CP             | SemiCP                 |        19 |        0.00274211  |      0.00324316  |                  0.894737 |                    0.947368 |                 21 |               0.904762  |
| carbon                       | RP             | RP                     |         1 |        0.00106787  |      0.00106787  |                  1        |                    1        |                 21 |               0.047619  |
| carbon                       | none           |                        |         1 |      nan           |    nan           |                  0        |                    0        |                 21 |               0.047619  |
| chalcogenide_or_2D           | CP             | AnalyticalCP           |        15 |        0.0123012   |      0.0250142   |                  0.266667 |                    0.466667 |                 43 |               0.348837  |
| chalcogenide_or_2D           | CP             | SemiCP                 |        21 |        0.00873192  |      0.0416519   |                  0.333333 |                    0.52381  |                 43 |               0.488372  |
| chalcogenide_or_2D           | RP             | RP                     |         6 |        0.0316352   |      0.0543587   |                  0        |                    0        |                 43 |               0.139535  |
| chalcogenide_or_2D           | none           |                        |         1 |      nan           |    nan           |                  0        |                    0        |                 43 |               0.0232558 |
| fluoride                     | CP             | AnalyticalCP           |         1 |        3.41159e-05 |      3.41159e-05 |                  1        |                    1        |                  3 |               0.333333  |
| fluoride                     | CP             | SemiCP                 |         2 |        0.000994803 |      0.000994803 |                  1        |                    1        |                  3 |               0.666667  |
| high_k_oxide                 | CP             | AnalyticalCP           |         9 |        0.00158525  |      0.00226284  |                  1        |                    1        |                 23 |               0.391304  |
| high_k_oxide                 | CP             | SemiCP                 |        14 |        0.00130402  |      0.00171206  |                  1        |                    1        |                 23 |               0.608696  |
| lossy_transition_metal_oxide | CP             | AnalyticalCP           |         1 |        0.0058596   |      0.0058596   |                  0        |                    1        |                 14 |               0.0714286 |
| lossy_transition_metal_oxide | CP             | SemiCP                 |        13 |        0.00341348  |      0.00328741  |                  1        |                    1        |                 14 |               0.928571  |
| metal                        | CP             | AnalyticalCP           |         3 |        0.0276492   |      0.0272861   |                  0        |                    0        |                103 |               0.0291262 |
| metal                        | CP             | SemiCP                 |       100 |        0.00406468  |      0.00987314  |                  0.55     |                    0.68     |                103 |               0.970874  |
| nitride_or_carbide           | CP             | AnalyticalCP           |         1 |        0.00363934  |      0.00363934  |                  1        |                    1        |                 12 |               0.0833333 |
| nitride_or_carbide           | CP             | SemiCP                 |        11 |        0.00153991  |      0.00450277  |                  0.818182 |                    0.818182 |                 12 |               0.916667  |
| semiconductor                | CP             | AnalyticalCP           |        14 |        0.004244    |      0.0287531   |                  0.571429 |                    0.642857 |                 40 |               0.35      |
| semiconductor                | CP             | SemiCP                 |        22 |        0.0040556   |      0.018458    |                  0.727273 |                    0.772727 |                 40 |               0.55      |
| semiconductor                | RP             | RP                     |         4 |        0.0030866   |      0.00319339  |                  0.75     |                    1        |                 40 |               0.1       |
| transparent_dielectric_oxide | CP             | AnalyticalCP           |         3 |        0.00045379  |      0.000509281 |                  1        |                    1        |                 15 |               0.2       |
| transparent_dielectric_oxide | CP             | SemiCP                 |        12 |        0.00064619  |      0.00104474  |                  1        |                    1        |                 15 |               0.8       |

## Material-class selected-family counts by N

| material_class               |   N |   CP |   RP |   none |
|:-----------------------------|----:|-----:|-----:|-------:|
| TCO_or_semiconducting_oxide  |   1 |    1 |    1 |      0 |
| TCO_or_semiconducting_oxide  |   2 |    1 |    1 |      0 |
| TCO_or_semiconducting_oxide  |   3 |    2 |    0 |      0 |
| TCO_or_semiconducting_oxide  |   4 |    1 |    0 |      1 |
| TCO_or_semiconducting_oxide  |   5 |    1 |    0 |      1 |
| carbon                       |   1 |   20 |    0 |      1 |
| carbon                       |   2 |   19 |    0 |      2 |
| carbon                       |   3 |   16 |    0 |      5 |
| carbon                       |   4 |   16 |    1 |      4 |
| carbon                       |   5 |   15 |    0 |      6 |
| chalcogenide_or_2D           |   1 |   39 |    0 |      4 |
| chalcogenide_or_2D           |   2 |   32 |    1 |     10 |
| chalcogenide_or_2D           |   3 |   31 |    5 |      7 |
| chalcogenide_or_2D           |   4 |   31 |    4 |      8 |
| chalcogenide_or_2D           |   5 |   29 |    4 |     10 |
| fluoride                     |   1 |    3 |    0 |      0 |
| fluoride                     |   2 |    2 |    0 |      1 |
| fluoride                     |   3 |    2 |    1 |      0 |
| fluoride                     |   4 |    2 |    0 |      1 |
| fluoride                     |   5 |    2 |    0 |      1 |
| high_k_oxide                 |   1 |   23 |    0 |      0 |
| high_k_oxide                 |   2 |   21 |    2 |      0 |
| high_k_oxide                 |   3 |   21 |    1 |      1 |
| high_k_oxide                 |   4 |   17 |    6 |      0 |
| high_k_oxide                 |   5 |   18 |    3 |      2 |
| lossy_transition_metal_oxide |   1 |   14 |    0 |      0 |
| lossy_transition_metal_oxide |   2 |   14 |    0 |      0 |
| lossy_transition_metal_oxide |   3 |   14 |    0 |      0 |
| lossy_transition_metal_oxide |   4 |   12 |    2 |      0 |
| lossy_transition_metal_oxide |   5 |   13 |    1 |      0 |
| metal                        |   1 |   74 |    0 |     29 |
| metal                        |   2 |   92 |    0 |     11 |
| metal                        |   3 |   97 |    0 |      6 |
| metal                        |   4 |   98 |    0 |      5 |
| metal                        |   5 |   97 |    0 |      6 |
| nitride_or_carbide           |   1 |   11 |    0 |      1 |
| nitride_or_carbide           |   2 |   11 |    0 |      1 |
| nitride_or_carbide           |   3 |   10 |    1 |      1 |
| nitride_or_carbide           |   4 |    9 |    2 |      1 |
| nitride_or_carbide           |   5 |   10 |    1 |      1 |
| semiconductor                |   1 |   29 |    0 |     11 |
| semiconductor                |   2 |   28 |    7 |      5 |
| semiconductor                |   3 |   28 |    4 |      8 |
| semiconductor                |   4 |   29 |    6 |      5 |
| semiconductor                |   5 |   31 |    7 |      2 |
| transparent_dielectric_oxide |   1 |   14 |    0 |      1 |
| transparent_dielectric_oxide |   2 |   14 |    1 |      0 |
| transparent_dielectric_oxide |   3 |   13 |    1 |      1 |
| transparent_dielectric_oxide |   4 |   12 |    0 |      3 |
| transparent_dielectric_oxide |   5 |   13 |    0 |      2 |

## Material-class FDTD readiness by family and N

| material_class               |   N | family   |   usable_count |   total_record_N_in_class |   usable_fraction |   median_RMS_usable |
|:-----------------------------|----:|:---------|---------------:|--------------------------:|------------------:|--------------------:|
| TCO_or_semiconducting_oxide  |   1 | RP       |              2 |                         2 |          1        |         0.0464235   |
| TCO_or_semiconducting_oxide  |   1 | CP       |              2 |                         2 |          1        |         0.0394328   |
| TCO_or_semiconducting_oxide  |   1 | SCP      |              2 |                         2 |          1        |         0.0432004   |
| TCO_or_semiconducting_oxide  |   2 | RP       |              1 |                         2 |          0.5      |         0.0538236   |
| TCO_or_semiconducting_oxide  |   2 | CP       |              1 |                         2 |          0.5      |         0.00635202  |
| TCO_or_semiconducting_oxide  |   2 | SCP      |              2 |                         2 |          1        |         0.0303393   |
| TCO_or_semiconducting_oxide  |   3 | RP       |              0 |                         2 |          0        |       nan           |
| TCO_or_semiconducting_oxide  |   3 | CP       |              1 |                         2 |          0.5      |         0.00116883  |
| TCO_or_semiconducting_oxide  |   3 | SCP      |              2 |                         2 |          1        |         0.0228898   |
| TCO_or_semiconducting_oxide  |   4 | RP       |              1 |                         2 |          0.5      |         0.0014058   |
| TCO_or_semiconducting_oxide  |   4 | CP       |              1 |                         2 |          0.5      |         0.000473593 |
| TCO_or_semiconducting_oxide  |   4 | SCP      |              1 |                         2 |          0.5      |         0.000251234 |
| TCO_or_semiconducting_oxide  |   5 | RP       |              0 |                         2 |          0        |       nan           |
| TCO_or_semiconducting_oxide  |   5 | CP       |              1 |                         2 |          0.5      |         0.000341077 |
| TCO_or_semiconducting_oxide  |   5 | SCP      |              1 |                         2 |          0.5      |         8.56102e-05 |
| carbon                       |   1 | RP       |              9 |                        21 |          0.428571 |         0.0734236   |
| carbon                       |   1 | CP       |             20 |                        21 |          0.952381 |         0.108864    |
| carbon                       |   1 | SCP      |             20 |                        21 |          0.952381 |         0.107105    |
| carbon                       |   2 | RP       |              8 |                        21 |          0.380952 |         0.021097    |
| carbon                       |   2 | CP       |             18 |                        21 |          0.857143 |         0.00864898  |
| carbon                       |   2 | SCP      |             18 |                        21 |          0.857143 |         0.00871701  |
| carbon                       |   3 | RP       |              9 |                        21 |          0.428571 |         0.00640579  |
| carbon                       |   3 | CP       |             15 |                        21 |          0.714286 |         0.0051147   |
| carbon                       |   3 | SCP      |             16 |                        21 |          0.761905 |         0.00272511  |
| carbon                       |   4 | RP       |              9 |                        21 |          0.428571 |         0.00214081  |
| carbon                       |   4 | CP       |             14 |                        21 |          0.666667 |         0.00503015  |
| carbon                       |   4 | SCP      |             16 |                        21 |          0.761905 |         0.00170823  |
| carbon                       |   5 | RP       |             10 |                        21 |          0.47619  |         0.0016388   |
| carbon                       |   5 | CP       |             13 |                        21 |          0.619048 |         0.00374193  |
| carbon                       |   5 | SCP      |             15 |                        21 |          0.714286 |         0.0012816   |
| chalcogenide_or_2D           |   1 | RP       |             11 |                        43 |          0.255814 |         0.157947    |
| chalcogenide_or_2D           |   1 | CP       |             31 |                        43 |          0.72093  |         0.14339     |
| chalcogenide_or_2D           |   1 | SCP      |             35 |                        43 |          0.813953 |         0.134695    |
| chalcogenide_or_2D           |   2 | RP       |              8 |                        43 |          0.186047 |         0.0787044   |
| chalcogenide_or_2D           |   2 | CP       |             26 |                        43 |          0.604651 |         0.0735283   |
| chalcogenide_or_2D           |   2 | SCP      |             29 |                        43 |          0.674419 |         0.119639    |
| chalcogenide_or_2D           |   3 | RP       |              9 |                        43 |          0.209302 |         0.0782951   |
| chalcogenide_or_2D           |   3 | CP       |             28 |                        43 |          0.651163 |         0.0624254   |
| chalcogenide_or_2D           |   3 | SCP      |             24 |                        43 |          0.55814  |         0.0222399   |
| chalcogenide_or_2D           |   4 | RP       |             14 |                        43 |          0.325581 |         0.036508    |
| chalcogenide_or_2D           |   4 | CP       |             29 |                        43 |          0.674419 |         0.0352396   |
| chalcogenide_or_2D           |   4 | SCP      |             26 |                        43 |          0.604651 |         0.0162529   |
| chalcogenide_or_2D           |   5 | RP       |             19 |                        43 |          0.44186  |         0.0142284   |
| chalcogenide_or_2D           |   5 | CP       |             30 |                        43 |          0.697674 |         0.0218391   |
| chalcogenide_or_2D           |   5 | SCP      |             22 |                        43 |          0.511628 |         0.00787027  |
| fluoride                     |   1 | RP       |              2 |                         3 |          0.666667 |         0.000623466 |
| fluoride                     |   1 | CP       |              3 |                         3 |          1        |         0.000449406 |
| fluoride                     |   1 | SCP      |              3 |                         3 |          1        |         0.00037953  |
| fluoride                     |   2 | RP       |              0 |                         3 |          0        |       nan           |
| fluoride                     |   2 | CP       |              1 |                         3 |          0.333333 |         0.00817213  |
| fluoride                     |   2 | SCP      |              2 |                         3 |          0.666667 |         0.00100254  |
| fluoride                     |   3 | RP       |              1 |                         3 |          0.333333 |         7.68948e-07 |
| fluoride                     |   3 | CP       |              1 |                         3 |          0.333333 |         0.00836644  |
| fluoride                     |   3 | SCP      |              2 |                         3 |          0.666667 |         0.00100094  |
| fluoride                     |   4 | RP       |              1 |                         3 |          0.333333 |         0.00987955  |
| fluoride                     |   4 | CP       |              1 |                         3 |          0.333333 |         0.00836614  |
| fluoride                     |   4 | SCP      |              2 |                         3 |          0.666667 |         0.00098806  |
| fluoride                     |   5 | RP       |              0 |                         3 |          0        |       nan           |
| fluoride                     |   5 | CP       |              1 |                         3 |          0.333333 |         0.00853508  |
| fluoride                     |   5 | SCP      |              2 |                         3 |          0.666667 |         0.000960162 |
| high_k_oxide                 |   1 | RP       |             11 |                        23 |          0.478261 |         0.00475144  |
| high_k_oxide                 |   1 | CP       |             17 |                        23 |          0.73913  |         0.00208989  |
| high_k_oxide                 |   1 | SCP      |             23 |                        23 |          1        |         0.00202234  |
| high_k_oxide                 |   2 | RP       |             12 |                        23 |          0.521739 |         0.0047202   |
| high_k_oxide                 |   2 | CP       |             23 |                        23 |          1        |         0.00107522  |
| high_k_oxide                 |   2 | SCP      |             23 |                        23 |          1        |         0.00101359  |
| high_k_oxide                 |   3 | RP       |              6 |                        23 |          0.26087  |         0.000283558 |
| high_k_oxide                 |   3 | CP       |             22 |                        23 |          0.956522 |         0.000325557 |
| high_k_oxide                 |   3 | SCP      |             22 |                        23 |          0.956522 |         0.000216134 |
| high_k_oxide                 |   4 | RP       |             15 |                        23 |          0.652174 |         9.53736e-05 |
| high_k_oxide                 |   4 | CP       |             20 |                        23 |          0.869565 |         0.000117608 |
| high_k_oxide                 |   4 | SCP      |             21 |                        23 |          0.913043 |         0.000128871 |
| high_k_oxide                 |   5 | RP       |              9 |                        23 |          0.391304 |         5.10441e-05 |
| high_k_oxide                 |   5 | CP       |             20 |                        23 |          0.869565 |         0.000122011 |
| high_k_oxide                 |   5 | SCP      |             21 |                        23 |          0.913043 |         4.35235e-05 |
| lossy_transition_metal_oxide |   1 | RP       |              5 |                        14 |          0.357143 |         0.493205    |
| lossy_transition_metal_oxide |   1 | CP       |             13 |                        14 |          0.928571 |         0.141762    |
| lossy_transition_metal_oxide |   1 | SCP      |              8 |                        14 |          0.571429 |         0.101476    |
| lossy_transition_metal_oxide |   2 | RP       |              6 |                        14 |          0.428571 |         0.013163    |
| lossy_transition_metal_oxide |   2 | CP       |             13 |                        14 |          0.928571 |         0.0142483   |
| lossy_transition_metal_oxide |   2 | SCP      |             14 |                        14 |          1        |         0.0110495   |
| lossy_transition_metal_oxide |   3 | RP       |              8 |                        14 |          0.571429 |         0.0132684   |
| lossy_transition_metal_oxide |   3 | CP       |             14 |                        14 |          1        |         0.0146181   |
| lossy_transition_metal_oxide |   3 | SCP      |             12 |                        14 |          0.857143 |         0.00440882  |
| lossy_transition_metal_oxide |   4 | RP       |             13 |                        14 |          0.928571 |         0.00585467  |
| lossy_transition_metal_oxide |   4 | CP       |             13 |                        14 |          0.928571 |         0.00499878  |
| lossy_transition_metal_oxide |   4 | SCP      |             14 |                        14 |          1        |         0.00283838  |
| lossy_transition_metal_oxide |   5 | RP       |              8 |                        14 |          0.571429 |         0.00607812  |
| lossy_transition_metal_oxide |   5 | CP       |             12 |                        14 |          0.857143 |         0.00416064  |
| lossy_transition_metal_oxide |   5 | SCP      |             14 |                        14 |          1        |         0.000596678 |
| metal                        |   1 | RP       |             12 |                       103 |          0.116505 |         0.425798    |
| metal                        |   1 | CP       |             73 |                       103 |          0.708738 |         0.267498    |
| metal                        |   1 | SCP      |             68 |                       103 |          0.660194 |         0.274616    |
| metal                        |   2 | RP       |             29 |                       103 |          0.281553 |         0.199253    |
| metal                        |   2 | CP       |             74 |                       103 |          0.718447 |         0.075129    |
| metal                        |   2 | SCP      |             89 |                       103 |          0.864078 |         0.0385973   |
| metal                        |   3 | RP       |             21 |                       103 |          0.203883 |         0.113109    |
| metal                        |   3 | CP       |             75 |                       103 |          0.728155 |         0.0356857   |
| metal                        |   3 | SCP      |             95 |                       103 |          0.92233  |         0.0113552   |
| metal                        |   4 | RP       |             26 |                       103 |          0.252427 |         0.0536037   |
| metal                        |   4 | CP       |             75 |                       103 |          0.728155 |         0.0159158   |
| metal                        |   4 | SCP      |             97 |                       103 |          0.941748 |         0.00477635  |
| metal                        |   5 | RP       |             39 |                       103 |          0.378641 |         0.0386915   |
| metal                        |   5 | CP       |             78 |                       103 |          0.757282 |         0.0129679   |
| metal                        |   5 | SCP      |             94 |                       103 |          0.912621 |         0.0031269   |
| nitride_or_carbide           |   1 | RP       |              3 |                        12 |          0.25     |         0.34546     |
| nitride_or_carbide           |   1 | CP       |             10 |                        12 |          0.833333 |         0.166758    |
| nitride_or_carbide           |   1 | SCP      |             11 |                        12 |          0.916667 |         0.153521    |
| nitride_or_carbide           |   2 | RP       |              5 |                        12 |          0.416667 |         0.0027809   |
| nitride_or_carbide           |   2 | CP       |             11 |                        12 |          0.916667 |         0.00803581  |
| nitride_or_carbide           |   2 | SCP      |             10 |                        12 |          0.833333 |         0.0233131   |
| nitride_or_carbide           |   3 | RP       |              5 |                        12 |          0.416667 |         0.00219916  |
| nitride_or_carbide           |   3 | CP       |              8 |                        12 |          0.666667 |         0.00333839  |
| nitride_or_carbide           |   3 | SCP      |             10 |                        12 |          0.833333 |         0.0093971   |
| nitride_or_carbide           |   4 | RP       |              4 |                        12 |          0.333333 |         0.00137889  |
| nitride_or_carbide           |   4 | CP       |              7 |                        12 |          0.583333 |         0.000873595 |
| nitride_or_carbide           |   4 | SCP      |             10 |                        12 |          0.833333 |         0.000775898 |
| nitride_or_carbide           |   5 | RP       |              3 |                        12 |          0.25     |         0.000914503 |
| nitride_or_carbide           |   5 | CP       |              9 |                        12 |          0.75     |         0.00163444  |
| nitride_or_carbide           |   5 | SCP      |             11 |                        12 |          0.916667 |         0.00117199  |
| semiconductor                |   1 | RP       |              1 |                        40 |          0.025    |         0.309348    |
| semiconductor                |   1 | CP       |             12 |                        40 |          0.3      |         0.181318    |
| semiconductor                |   1 | SCP      |             27 |                        40 |          0.675    |         0.172567    |
| semiconductor                |   2 | RP       |              9 |                        40 |          0.225    |         0.0182613   |
| semiconductor                |   2 | CP       |             27 |                        40 |          0.675    |         0.0304828   |
| semiconductor                |   2 | SCP      |             28 |                        40 |          0.7      |         0.0344501   |
| semiconductor                |   3 | RP       |             12 |                        40 |          0.3      |         0.00758535  |
| semiconductor                |   3 | CP       |             25 |                        40 |          0.625    |         0.0249416   |
| semiconductor                |   3 | SCP      |             25 |                        40 |          0.625    |         0.0105953   |
| semiconductor                |   4 | RP       |             12 |                        40 |          0.3      |         0.00593911  |
| semiconductor                |   4 | CP       |             25 |                        40 |          0.625    |         0.00763293  |
| semiconductor                |   4 | SCP      |             22 |                        40 |          0.55     |         0.00395808  |
| semiconductor                |   5 | RP       |             18 |                        40 |          0.45     |         0.00281959  |
| semiconductor                |   5 | CP       |             32 |                        40 |          0.8      |         0.00333014  |
| semiconductor                |   5 | SCP      |             30 |                        40 |          0.75     |         0.00371207  |
| transparent_dielectric_oxide |   1 | RP       |             13 |                        15 |          0.866667 |         0.00121414  |
| transparent_dielectric_oxide |   1 | CP       |             14 |                        15 |          0.933333 |         0.000900537 |
| transparent_dielectric_oxide |   1 | SCP      |             13 |                        15 |          0.866667 |         0.000520707 |
| transparent_dielectric_oxide |   2 | RP       |              4 |                        15 |          0.266667 |         0.0012269   |
| transparent_dielectric_oxide |   2 | CP       |             12 |                        15 |          0.8      |         0.00015108  |
| transparent_dielectric_oxide |   2 | SCP      |             15 |                        15 |          1        |         7.44979e-05 |
| transparent_dielectric_oxide |   3 | RP       |              2 |                        15 |          0.133333 |         1.58117e-05 |
| transparent_dielectric_oxide |   3 | CP       |              9 |                        15 |          0.6      |         5.28498e-05 |
| transparent_dielectric_oxide |   3 | SCP      |             13 |                        15 |          0.866667 |         2.69989e-05 |
| transparent_dielectric_oxide |   4 | RP       |              4 |                        15 |          0.266667 |         3.82527e-05 |
| transparent_dielectric_oxide |   4 | CP       |              8 |                        15 |          0.533333 |         3.92241e-05 |
| transparent_dielectric_oxide |   4 | SCP      |             12 |                        15 |          0.8      |         2.09607e-05 |
| transparent_dielectric_oxide |   5 | RP       |              3 |                        15 |          0.2      |         8.52866e-06 |
| transparent_dielectric_oxide |   5 | CP       |             10 |                        15 |          0.666667 |         7.67633e-05 |
| transparent_dielectric_oxide |   5 | SCP      |             11 |                        15 |          0.733333 |         2.40288e-05 |

## Material-class threshold coverage

| material_class               |   threshold_RMS |   N_max | family            |   records_reached |   total_records_in_class |   coverage_fraction |
|:-----------------------------|----------------:|--------:|:------------------|------------------:|-------------------------:|--------------------:|
| TCO_or_semiconducting_oxide  |           0.005 |       1 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.005 |       1 | CP_folded         |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.005 |       1 | Selected_RP_or_CP |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.005 |       2 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.005 |       2 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       2 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       3 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.005 |       3 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       3 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       4 | RP                |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       4 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       4 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       5 | RP                |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       5 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.005 |       5 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       1 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.01  |       1 | CP_folded         |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.01  |       1 | Selected_RP_or_CP |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.01  |       2 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.01  |       2 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       2 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       3 | RP                |                 0 |                        2 |           0         |
| TCO_or_semiconducting_oxide  |           0.01  |       3 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       3 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       4 | RP                |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       4 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       4 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       5 | RP                |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       5 | CP_folded         |                 1 |                        2 |           0.5       |
| TCO_or_semiconducting_oxide  |           0.01  |       5 | Selected_RP_or_CP |                 1 |                        2 |           0.5       |
| carbon                       |           0.005 |       1 | RP                |                 2 |                       21 |           0.0952381 |
| carbon                       |           0.005 |       1 | CP_folded         |                 4 |                       21 |           0.190476  |
| carbon                       |           0.005 |       1 | Selected_RP_or_CP |                 4 |                       21 |           0.190476  |
| carbon                       |           0.005 |       2 | RP                |                 4 |                       21 |           0.190476  |
| carbon                       |           0.005 |       2 | CP_folded         |                 7 |                       21 |           0.333333  |
| carbon                       |           0.005 |       2 | Selected_RP_or_CP |                 7 |                       21 |           0.333333  |
| carbon                       |           0.005 |       3 | RP                |                 6 |                       21 |           0.285714  |
| carbon                       |           0.005 |       3 | CP_folded         |                15 |                       21 |           0.714286  |
| carbon                       |           0.005 |       3 | Selected_RP_or_CP |                15 |                       21 |           0.714286  |
| carbon                       |           0.005 |       4 | RP                |                 9 |                       21 |           0.428571  |
| carbon                       |           0.005 |       4 | CP_folded         |                17 |                       21 |           0.809524  |
| carbon                       |           0.005 |       4 | Selected_RP_or_CP |                18 |                       21 |           0.857143  |
| carbon                       |           0.005 |       5 | RP                |                11 |                       21 |           0.52381   |
| carbon                       |           0.005 |       5 | CP_folded         |                17 |                       21 |           0.809524  |
| carbon                       |           0.005 |       5 | Selected_RP_or_CP |                18 |                       21 |           0.857143  |
| carbon                       |           0.01  |       1 | RP                |                 3 |                       21 |           0.142857  |
| carbon                       |           0.01  |       1 | CP_folded         |                 5 |                       21 |           0.238095  |
| carbon                       |           0.01  |       1 | Selected_RP_or_CP |                 5 |                       21 |           0.238095  |
| carbon                       |           0.01  |       2 | RP                |                 7 |                       21 |           0.333333  |
| carbon                       |           0.01  |       2 | CP_folded         |                12 |                       21 |           0.571429  |
| carbon                       |           0.01  |       2 | Selected_RP_or_CP |                12 |                       21 |           0.571429  |
| carbon                       |           0.01  |       3 | RP                |                 9 |                       21 |           0.428571  |
| carbon                       |           0.01  |       3 | CP_folded         |                17 |                       21 |           0.809524  |
| carbon                       |           0.01  |       3 | Selected_RP_or_CP |                17 |                       21 |           0.809524  |
| carbon                       |           0.01  |       4 | RP                |                12 |                       21 |           0.571429  |
| carbon                       |           0.01  |       4 | CP_folded         |                18 |                       21 |           0.857143  |
| carbon                       |           0.01  |       4 | Selected_RP_or_CP |                19 |                       21 |           0.904762  |
| carbon                       |           0.01  |       5 | RP                |                14 |                       21 |           0.666667  |
| carbon                       |           0.01  |       5 | CP_folded         |                18 |                       21 |           0.857143  |
| carbon                       |           0.01  |       5 | Selected_RP_or_CP |                19 |                       21 |           0.904762  |
| chalcogenide_or_2D           |           0.005 |       1 | RP                |                 1 |                       43 |           0.0232558 |
| chalcogenide_or_2D           |           0.005 |       1 | CP_folded         |                 2 |                       43 |           0.0465116 |
| chalcogenide_or_2D           |           0.005 |       1 | Selected_RP_or_CP |                 2 |                       43 |           0.0465116 |
| chalcogenide_or_2D           |           0.005 |       2 | RP                |                 1 |                       43 |           0.0232558 |
| chalcogenide_or_2D           |           0.005 |       2 | CP_folded         |                 4 |                       43 |           0.0930233 |
| chalcogenide_or_2D           |           0.005 |       2 | Selected_RP_or_CP |                 4 |                       43 |           0.0930233 |
| chalcogenide_or_2D           |           0.005 |       3 | RP                |                 2 |                       43 |           0.0465116 |
| chalcogenide_or_2D           |           0.005 |       3 | CP_folded         |                 8 |                       43 |           0.186047  |
| chalcogenide_or_2D           |           0.005 |       3 | Selected_RP_or_CP |                 8 |                       43 |           0.186047  |
| chalcogenide_or_2D           |           0.005 |       4 | RP                |                 3 |                       43 |           0.0697674 |
| chalcogenide_or_2D           |           0.005 |       4 | CP_folded         |                 9 |                       43 |           0.209302  |
| chalcogenide_or_2D           |           0.005 |       4 | Selected_RP_or_CP |                 9 |                       43 |           0.209302  |
| chalcogenide_or_2D           |           0.005 |       5 | RP                |                 5 |                       43 |           0.116279  |
| chalcogenide_or_2D           |           0.005 |       5 | CP_folded         |                11 |                       43 |           0.255814  |
| chalcogenide_or_2D           |           0.005 |       5 | Selected_RP_or_CP |                11 |                       43 |           0.255814  |
| chalcogenide_or_2D           |           0.01  |       1 | RP                |                 3 |                       43 |           0.0697674 |
| chalcogenide_or_2D           |           0.01  |       1 | CP_folded         |                 5 |                       43 |           0.116279  |
| chalcogenide_or_2D           |           0.01  |       1 | Selected_RP_or_CP |                 5 |                       43 |           0.116279  |
| chalcogenide_or_2D           |           0.01  |       2 | RP                |                 5 |                       43 |           0.116279  |
| chalcogenide_or_2D           |           0.01  |       2 | CP_folded         |                 8 |                       43 |           0.186047  |
| chalcogenide_or_2D           |           0.01  |       2 | Selected_RP_or_CP |                 8 |                       43 |           0.186047  |
| chalcogenide_or_2D           |           0.01  |       3 | RP                |                 7 |                       43 |           0.162791  |
| chalcogenide_or_2D           |           0.01  |       3 | CP_folded         |                13 |                       43 |           0.302326  |
| chalcogenide_or_2D           |           0.01  |       3 | Selected_RP_or_CP |                13 |                       43 |           0.302326  |
| chalcogenide_or_2D           |           0.01  |       4 | RP                |                 8 |                       43 |           0.186047  |
| chalcogenide_or_2D           |           0.01  |       4 | CP_folded         |                14 |                       43 |           0.325581  |
| chalcogenide_or_2D           |           0.01  |       4 | Selected_RP_or_CP |                14 |                       43 |           0.325581  |
| chalcogenide_or_2D           |           0.01  |       5 | RP                |                11 |                       43 |           0.255814  |
| chalcogenide_or_2D           |           0.01  |       5 | CP_folded         |                18 |                       43 |           0.418605  |
| chalcogenide_or_2D           |           0.01  |       5 | Selected_RP_or_CP |                18 |                       43 |           0.418605  |
| fluoride                     |           0.005 |       1 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.005 |       1 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       1 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       2 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.005 |       2 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       2 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       3 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.005 |       3 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       3 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       4 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.005 |       4 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       4 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       5 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.005 |       5 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.005 |       5 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       1 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.01  |       1 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       1 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       2 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.01  |       2 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       2 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       3 | RP                |                 2 |                        3 |           0.666667  |
| fluoride                     |           0.01  |       3 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       3 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       4 | RP                |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       4 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       4 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       5 | RP                |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       5 | CP_folded         |                 3 |                        3 |           1         |
| fluoride                     |           0.01  |       5 | Selected_RP_or_CP |                 3 |                        3 |           1         |
| high_k_oxide                 |           0.005 |       1 | RP                |                 9 |                       23 |           0.391304  |
| high_k_oxide                 |           0.005 |       1 | CP_folded         |                15 |                       23 |           0.652174  |
| high_k_oxide                 |           0.005 |       1 | Selected_RP_or_CP |                15 |                       23 |           0.652174  |
| high_k_oxide                 |           0.005 |       2 | RP                |                12 |                       23 |           0.521739  |
| high_k_oxide                 |           0.005 |       2 | CP_folded         |                21 |                       23 |           0.913043  |
| high_k_oxide                 |           0.005 |       2 | Selected_RP_or_CP |                21 |                       23 |           0.913043  |
| high_k_oxide                 |           0.005 |       3 | RP                |                16 |                       23 |           0.695652  |
| high_k_oxide                 |           0.005 |       3 | CP_folded         |                22 |                       23 |           0.956522  |
| high_k_oxide                 |           0.005 |       3 | Selected_RP_or_CP |                22 |                       23 |           0.956522  |
| high_k_oxide                 |           0.005 |       4 | RP                |                21 |                       23 |           0.913043  |
| high_k_oxide                 |           0.005 |       4 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.005 |       4 | Selected_RP_or_CP |                23 |                       23 |           1         |
| high_k_oxide                 |           0.005 |       5 | RP                |                21 |                       23 |           0.913043  |
| high_k_oxide                 |           0.005 |       5 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.005 |       5 | Selected_RP_or_CP |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       1 | RP                |                11 |                       23 |           0.478261  |
| high_k_oxide                 |           0.01  |       1 | CP_folded         |                17 |                       23 |           0.73913   |
| high_k_oxide                 |           0.01  |       1 | Selected_RP_or_CP |                17 |                       23 |           0.73913   |
| high_k_oxide                 |           0.01  |       2 | RP                |                16 |                       23 |           0.695652  |
| high_k_oxide                 |           0.01  |       2 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       2 | Selected_RP_or_CP |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       3 | RP                |                20 |                       23 |           0.869565  |
| high_k_oxide                 |           0.01  |       3 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       3 | Selected_RP_or_CP |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       4 | RP                |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       4 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       4 | Selected_RP_or_CP |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       5 | RP                |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       5 | CP_folded         |                23 |                       23 |           1         |
| high_k_oxide                 |           0.01  |       5 | Selected_RP_or_CP |                23 |                       23 |           1         |
| lossy_transition_metal_oxide |           0.005 |       1 | RP                |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       1 | CP_folded         |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       1 | Selected_RP_or_CP |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       2 | RP                |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       2 | CP_folded         |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       2 | Selected_RP_or_CP |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       3 | RP                |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.005 |       3 | CP_folded         |                 7 |                       14 |           0.5       |
| lossy_transition_metal_oxide |           0.005 |       3 | Selected_RP_or_CP |                 7 |                       14 |           0.5       |
| lossy_transition_metal_oxide |           0.005 |       4 | RP                |                 5 |                       14 |           0.357143  |
| lossy_transition_metal_oxide |           0.005 |       4 | CP_folded         |                13 |                       14 |           0.928571  |
| lossy_transition_metal_oxide |           0.005 |       4 | Selected_RP_or_CP |                13 |                       14 |           0.928571  |
| lossy_transition_metal_oxide |           0.005 |       5 | RP                |                 6 |                       14 |           0.428571  |
| lossy_transition_metal_oxide |           0.005 |       5 | CP_folded         |                13 |                       14 |           0.928571  |
| lossy_transition_metal_oxide |           0.005 |       5 | Selected_RP_or_CP |                13 |                       14 |           0.928571  |
| lossy_transition_metal_oxide |           0.01  |       1 | RP                |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.01  |       1 | CP_folded         |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.01  |       1 | Selected_RP_or_CP |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.01  |       2 | RP                |                 0 |                       14 |           0         |
| lossy_transition_metal_oxide |           0.01  |       2 | CP_folded         |                 4 |                       14 |           0.285714  |
| lossy_transition_metal_oxide |           0.01  |       2 | Selected_RP_or_CP |                 4 |                       14 |           0.285714  |
| lossy_transition_metal_oxide |           0.01  |       3 | RP                |                 3 |                       14 |           0.214286  |
| lossy_transition_metal_oxide |           0.01  |       3 | CP_folded         |                12 |                       14 |           0.857143  |
| lossy_transition_metal_oxide |           0.01  |       3 | Selected_RP_or_CP |                12 |                       14 |           0.857143  |
| lossy_transition_metal_oxide |           0.01  |       4 | RP                |                10 |                       14 |           0.714286  |
| lossy_transition_metal_oxide |           0.01  |       4 | CP_folded         |                14 |                       14 |           1         |
| lossy_transition_metal_oxide |           0.01  |       4 | Selected_RP_or_CP |                14 |                       14 |           1         |
| lossy_transition_metal_oxide |           0.01  |       5 | RP                |                11 |                       14 |           0.785714  |
| lossy_transition_metal_oxide |           0.01  |       5 | CP_folded         |                14 |                       14 |           1         |
| lossy_transition_metal_oxide |           0.01  |       5 | Selected_RP_or_CP |                14 |                       14 |           1         |
| metal                        |           0.005 |       1 | RP                |                 0 |                      103 |           0         |
| metal                        |           0.005 |       1 | CP_folded         |                 0 |                      103 |           0         |
| metal                        |           0.005 |       1 | Selected_RP_or_CP |                 0 |                      103 |           0         |
| metal                        |           0.005 |       2 | RP                |                 0 |                      103 |           0         |
| metal                        |           0.005 |       2 | CP_folded         |                 7 |                      103 |           0.0679612 |
| metal                        |           0.005 |       2 | Selected_RP_or_CP |                 7 |                      103 |           0.0679612 |
| metal                        |           0.005 |       3 | RP                |                 2 |                      103 |           0.0194175 |
| metal                        |           0.005 |       3 | CP_folded         |                23 |                      103 |           0.223301  |
| metal                        |           0.005 |       3 | Selected_RP_or_CP |                23 |                      103 |           0.223301  |
| metal                        |           0.005 |       4 | RP                |                 3 |                      103 |           0.0291262 |
| metal                        |           0.005 |       4 | CP_folded         |                50 |                      103 |           0.485437  |
| metal                        |           0.005 |       4 | Selected_RP_or_CP |                50 |                      103 |           0.485437  |
| metal                        |           0.005 |       5 | RP                |                 6 |                      103 |           0.0582524 |
| metal                        |           0.005 |       5 | CP_folded         |                55 |                      103 |           0.533981  |
| metal                        |           0.005 |       5 | Selected_RP_or_CP |                55 |                      103 |           0.533981  |
| metal                        |           0.01  |       1 | RP                |                 0 |                      103 |           0         |
| metal                        |           0.01  |       1 | CP_folded         |                 0 |                      103 |           0         |
| metal                        |           0.01  |       1 | Selected_RP_or_CP |                 0 |                      103 |           0         |
| metal                        |           0.01  |       2 | RP                |                 0 |                      103 |           0         |
| metal                        |           0.01  |       2 | CP_folded         |                15 |                      103 |           0.145631  |
| metal                        |           0.01  |       2 | Selected_RP_or_CP |                15 |                      103 |           0.145631  |
| metal                        |           0.01  |       3 | RP                |                 3 |                      103 |           0.0291262 |
| metal                        |           0.01  |       3 | CP_folded         |                42 |                      103 |           0.407767  |
| metal                        |           0.01  |       3 | Selected_RP_or_CP |                42 |                      103 |           0.407767  |
| metal                        |           0.01  |       4 | RP                |                 5 |                      103 |           0.0485437 |
| metal                        |           0.01  |       4 | CP_folded         |                63 |                      103 |           0.61165   |
| metal                        |           0.01  |       4 | Selected_RP_or_CP |                63 |                      103 |           0.61165   |
| metal                        |           0.01  |       5 | RP                |                10 |                      103 |           0.0970874 |
| metal                        |           0.01  |       5 | CP_folded         |                68 |                      103 |           0.660194  |
| metal                        |           0.01  |       5 | Selected_RP_or_CP |                68 |                      103 |           0.660194  |
| nitride_or_carbide           |           0.005 |       1 | RP                |                 1 |                       12 |           0.0833333 |
| nitride_or_carbide           |           0.005 |       1 | CP_folded         |                 3 |                       12 |           0.25      |
| nitride_or_carbide           |           0.005 |       1 | Selected_RP_or_CP |                 3 |                       12 |           0.25      |
| nitride_or_carbide           |           0.005 |       2 | RP                |                 3 |                       12 |           0.25      |
| nitride_or_carbide           |           0.005 |       2 | CP_folded         |                 5 |                       12 |           0.416667  |
| nitride_or_carbide           |           0.005 |       2 | Selected_RP_or_CP |                 5 |                       12 |           0.416667  |
| nitride_or_carbide           |           0.005 |       3 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.005 |       3 | CP_folded         |                 5 |                       12 |           0.416667  |
| nitride_or_carbide           |           0.005 |       3 | Selected_RP_or_CP |                 5 |                       12 |           0.416667  |
| nitride_or_carbide           |           0.005 |       4 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.005 |       4 | CP_folded         |                 8 |                       12 |           0.666667  |
| nitride_or_carbide           |           0.005 |       4 | Selected_RP_or_CP |                 8 |                       12 |           0.666667  |
| nitride_or_carbide           |           0.005 |       5 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.005 |       5 | CP_folded         |                10 |                       12 |           0.833333  |
| nitride_or_carbide           |           0.005 |       5 | Selected_RP_or_CP |                10 |                       12 |           0.833333  |
| nitride_or_carbide           |           0.01  |       1 | RP                |                 1 |                       12 |           0.0833333 |
| nitride_or_carbide           |           0.01  |       1 | CP_folded         |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.01  |       1 | Selected_RP_or_CP |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.01  |       2 | RP                |                 3 |                       12 |           0.25      |
| nitride_or_carbide           |           0.01  |       2 | CP_folded         |                 6 |                       12 |           0.5       |
| nitride_or_carbide           |           0.01  |       2 | Selected_RP_or_CP |                 6 |                       12 |           0.5       |
| nitride_or_carbide           |           0.01  |       3 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.01  |       3 | CP_folded         |                 6 |                       12 |           0.5       |
| nitride_or_carbide           |           0.01  |       3 | Selected_RP_or_CP |                 6 |                       12 |           0.5       |
| nitride_or_carbide           |           0.01  |       4 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.01  |       4 | CP_folded         |                 8 |                       12 |           0.666667  |
| nitride_or_carbide           |           0.01  |       4 | Selected_RP_or_CP |                 8 |                       12 |           0.666667  |
| nitride_or_carbide           |           0.01  |       5 | RP                |                 4 |                       12 |           0.333333  |
| nitride_or_carbide           |           0.01  |       5 | CP_folded         |                10 |                       12 |           0.833333  |
| nitride_or_carbide           |           0.01  |       5 | Selected_RP_or_CP |                10 |                       12 |           0.833333  |
| semiconductor                |           0.005 |       1 | RP                |                 0 |                       40 |           0         |
| semiconductor                |           0.005 |       1 | CP_folded         |                 0 |                       40 |           0         |
| semiconductor                |           0.005 |       1 | Selected_RP_or_CP |                 0 |                       40 |           0         |
| semiconductor                |           0.005 |       2 | RP                |                 0 |                       40 |           0         |
| semiconductor                |           0.005 |       2 | CP_folded         |                 6 |                       40 |           0.15      |
| semiconductor                |           0.005 |       2 | Selected_RP_or_CP |                 6 |                       40 |           0.15      |
| semiconductor                |           0.005 |       3 | RP                |                 5 |                       40 |           0.125     |
| semiconductor                |           0.005 |       3 | CP_folded         |                15 |                       40 |           0.375     |
| semiconductor                |           0.005 |       3 | Selected_RP_or_CP |                15 |                       40 |           0.375     |
| semiconductor                |           0.005 |       4 | RP                |                 6 |                       40 |           0.15      |
| semiconductor                |           0.005 |       4 | CP_folded         |                19 |                       40 |           0.475     |
| semiconductor                |           0.005 |       4 | Selected_RP_or_CP |                19 |                       40 |           0.475     |
| semiconductor                |           0.005 |       5 | RP                |                12 |                       40 |           0.3       |
| semiconductor                |           0.005 |       5 | CP_folded         |                26 |                       40 |           0.65      |
| semiconductor                |           0.005 |       5 | Selected_RP_or_CP |                27 |                       40 |           0.675     |
| semiconductor                |           0.01  |       1 | RP                |                 0 |                       40 |           0         |
| semiconductor                |           0.01  |       1 | CP_folded         |                 0 |                       40 |           0         |
| semiconductor                |           0.01  |       1 | Selected_RP_or_CP |                 0 |                       40 |           0         |
| semiconductor                |           0.01  |       2 | RP                |                 1 |                       40 |           0.025     |
| semiconductor                |           0.01  |       2 | CP_folded         |                 9 |                       40 |           0.225     |
| semiconductor                |           0.01  |       2 | Selected_RP_or_CP |                10 |                       40 |           0.25      |
| semiconductor                |           0.01  |       3 | RP                |                 7 |                       40 |           0.175     |
| semiconductor                |           0.01  |       3 | CP_folded         |                16 |                       40 |           0.4       |
| semiconductor                |           0.01  |       3 | Selected_RP_or_CP |                16 |                       40 |           0.4       |
| semiconductor                |           0.01  |       4 | RP                |                15 |                       40 |           0.375     |
| semiconductor                |           0.01  |       4 | CP_folded         |                23 |                       40 |           0.575     |
| semiconductor                |           0.01  |       4 | Selected_RP_or_CP |                25 |                       40 |           0.625     |
| semiconductor                |           0.01  |       5 | RP                |                21 |                       40 |           0.525     |
| semiconductor                |           0.01  |       5 | CP_folded         |                29 |                       40 |           0.725     |
| semiconductor                |           0.01  |       5 | Selected_RP_or_CP |                30 |                       40 |           0.75      |
| transparent_dielectric_oxide |           0.005 |       1 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.005 |       1 | CP_folded         |                12 |                       15 |           0.8       |
| transparent_dielectric_oxide |           0.005 |       1 | Selected_RP_or_CP |                12 |                       15 |           0.8       |
| transparent_dielectric_oxide |           0.005 |       2 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.005 |       2 | CP_folded         |                14 |                       15 |           0.933333  |
| transparent_dielectric_oxide |           0.005 |       2 | Selected_RP_or_CP |                14 |                       15 |           0.933333  |
| transparent_dielectric_oxide |           0.005 |       3 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.005 |       3 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.005 |       3 | Selected_RP_or_CP |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.005 |       4 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.005 |       4 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.005 |       4 | Selected_RP_or_CP |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.005 |       5 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.005 |       5 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.005 |       5 | Selected_RP_or_CP |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       1 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.01  |       1 | CP_folded         |                13 |                       15 |           0.866667  |
| transparent_dielectric_oxide |           0.01  |       1 | Selected_RP_or_CP |                13 |                       15 |           0.866667  |
| transparent_dielectric_oxide |           0.01  |       2 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.01  |       2 | CP_folded         |                14 |                       15 |           0.933333  |
| transparent_dielectric_oxide |           0.01  |       2 | Selected_RP_or_CP |                14 |                       15 |           0.933333  |
| transparent_dielectric_oxide |           0.01  |       3 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.01  |       3 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       3 | Selected_RP_or_CP |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       4 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.01  |       4 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       4 | Selected_RP_or_CP |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       5 | RP                |                11 |                       15 |           0.733333  |
| transparent_dielectric_oxide |           0.01  |       5 | CP_folded         |                15 |                       15 |           1         |
| transparent_dielectric_oxide |           0.01  |       5 | Selected_RP_or_CP |                15 |                       15 |           1         |

## Global readiness by family and N

| family   |   N |   usable_count |   total_record_N |   usable_fraction |   median_RMS_usable |
|:---------|----:|---------------:|-----------------:|------------------:|--------------------:|
| RP       |   1 |             69 |              276 |          0.25     |          0.0450566  |
| RP       |   2 |             82 |              276 |          0.297101 |          0.0336022  |
| RP       |   3 |             73 |              276 |          0.264493 |          0.0150781  |
| RP       |   4 |             99 |              276 |          0.358696 |          0.00585467 |
| RP       |   5 |            109 |              276 |          0.394928 |          0.00673475 |
| CP       |   1 |            195 |              276 |          0.706522 |          0.152386   |
| CP       |   2 |            206 |              276 |          0.746377 |          0.0303675  |
| CP       |   3 |            198 |              276 |          0.717391 |          0.0151099  |
| CP       |   4 |            193 |              276 |          0.699275 |          0.00854469 |
| CP       |   5 |            206 |              276 |          0.746377 |          0.00527537 |
| SCP      |   1 |            210 |              276 |          0.76087  |          0.132478   |
| SCP      |   2 |            230 |              276 |          0.833333 |          0.0206831  |
| SCP      |   3 |            221 |              276 |          0.800725 |          0.00574678 |
| SCP      |   4 |            221 |              276 |          0.800725 |          0.00246245 |
| SCP      |   5 |            221 |              276 |          0.800725 |          0.00154554 |

## Global selected-family counts by N

|   N |   CP |   RP |   none |
|----:|-----:|-----:|-------:|
|   1 |  228 |    1 |     47 |
|   2 |  234 |   12 |     30 |
|   3 |  234 |   13 |     29 |
|   4 |  227 |   21 |     28 |
|   5 |  229 |   16 |     31 |

## Global cumulative threshold coverage

|   threshold_RMS |   N_max | family            |   records_reached |   total_records |   coverage_fraction |
|----------------:|--------:|:------------------|------------------:|----------------:|--------------------:|
|           0.005 |       1 | RP                |                26 |             276 |           0.0942029 |
|           0.005 |       1 | CP_folded         |                39 |             276 |           0.141304  |
|           0.005 |       1 | Selected_RP_or_CP |                39 |             276 |           0.141304  |
|           0.005 |       2 | RP                |                33 |             276 |           0.119565  |
|           0.005 |       2 | CP_folded         |                68 |             276 |           0.246377  |
|           0.005 |       2 | Selected_RP_or_CP |                68 |             276 |           0.246377  |
|           0.005 |       3 | RP                |                48 |             276 |           0.173913  |
|           0.005 |       3 | CP_folded         |               114 |             276 |           0.413043  |
|           0.005 |       3 | Selected_RP_or_CP |               114 |             276 |           0.413043  |
|           0.005 |       4 | RP                |                65 |             276 |           0.235507  |
|           0.005 |       4 | CP_folded         |               158 |             276 |           0.572464  |
|           0.005 |       4 | Selected_RP_or_CP |               159 |             276 |           0.576087  |
|           0.005 |       5 | RP                |                79 |             276 |           0.286232  |
|           0.005 |       5 | CP_folded         |               174 |             276 |           0.630435  |
|           0.005 |       5 | Selected_RP_or_CP |               176 |             276 |           0.637681  |
|           0.01  |       1 | RP                |                31 |             276 |           0.112319  |
|           0.01  |       1 | CP_folded         |                47 |             276 |           0.17029   |
|           0.01  |       1 | Selected_RP_or_CP |                47 |             276 |           0.17029   |
|           0.01  |       2 | RP                |                45 |             276 |           0.163043  |
|           0.01  |       2 | CP_folded         |                95 |             276 |           0.344203  |
|           0.01  |       2 | Selected_RP_or_CP |                96 |             276 |           0.347826  |
|           0.01  |       3 | RP                |                66 |             276 |           0.23913   |
|           0.01  |       3 | CP_folded         |               148 |             276 |           0.536232  |
|           0.01  |       3 | Selected_RP_or_CP |               148 |             276 |           0.536232  |
|           0.01  |       4 | RP                |                92 |             276 |           0.333333  |
|           0.01  |       4 | CP_folded         |               182 |             276 |           0.65942   |
|           0.01  |       4 | Selected_RP_or_CP |               185 |             276 |           0.67029   |
|           0.01  |       5 | RP                |               109 |             276 |           0.394928  |
|           0.01  |       5 | CP_folded         |               199 |             276 |           0.721014  |
|           0.01  |       5 | Selected_RP_or_CP |               201 |             276 |           0.728261  |

## First acceptable N distribution

|   N |   records | family            |   threshold_RMS |
|----:|----------:|:------------------|----------------:|
|   1 |        26 | RP                |           0.005 |
|   2 |         7 | RP                |           0.005 |
|   3 |        15 | RP                |           0.005 |
|   4 |        17 | RP                |           0.005 |
|   5 |        14 | RP                |           0.005 |
|   1 |        31 | RP                |           0.01  |
|   2 |        14 | RP                |           0.01  |
|   3 |        21 | RP                |           0.01  |
|   4 |        26 | RP                |           0.01  |
|   5 |        17 | RP                |           0.01  |
|   1 |        39 | CP_folded         |           0.005 |
|   2 |        29 | CP_folded         |           0.005 |
|   3 |        46 | CP_folded         |           0.005 |
|   4 |        44 | CP_folded         |           0.005 |
|   5 |        16 | CP_folded         |           0.005 |
|   1 |        47 | CP_folded         |           0.01  |
|   2 |        48 | CP_folded         |           0.01  |
|   3 |        53 | CP_folded         |           0.01  |
|   4 |        34 | CP_folded         |           0.01  |
|   5 |        17 | CP_folded         |           0.01  |
|   1 |        39 | Selected_RP_or_CP |           0.005 |
|   2 |        29 | Selected_RP_or_CP |           0.005 |
|   3 |        46 | Selected_RP_or_CP |           0.005 |
|   4 |        45 | Selected_RP_or_CP |           0.005 |
|   5 |        17 | Selected_RP_or_CP |           0.005 |
|   1 |        47 | Selected_RP_or_CP |           0.01  |
|   2 |        49 | Selected_RP_or_CP |           0.01  |
|   3 |        52 | Selected_RP_or_CP |           0.01  |
|   4 |        37 | Selected_RP_or_CP |           0.01  |
|   5 |        16 | Selected_RP_or_CP |           0.01  |

## Important diagnostic counts

- cp_rescues_when_rp_unusable: **783** rows
- rp_wins_by_record_N: **63** rows
- rp_final_recommendations: **11** rows
- no_usable_records: **2** rows
- hard_records_not_reaching_primary_target: **98** rows
- hard_records_not_reaching_secondary_target: **73** rows
- unstable_low_RMS_traps: **102** rows

## Most difficult records by final RMS

| material_class              | material_query   | book   | page           |   record_index | final_family   | final_specific_model   |   final_N |   final_RMS | final_quality_band   | final_selection_mode         |
|:----------------------------|:-----------------|:-------|:---------------|---------------:|:---------------|:-----------------------|----------:|------------:|:---------------------|:-----------------------------|
| chalcogenide_or_2D          | As2Se3           | As2Se3 | Joseph-700nm   |              2 | CP             | SemiCP                 |         2 |   0.472918  | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | Si               | Si     | Green-1995     |             23 | CP             | AnalyticalCP           |         1 |   0.149031  | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WSe2             | WSe2   | Gu-1L          |              1 | RP             | RP                     |         3 |   0.14368   | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | InAs             | InAs   | Adachi         |              1 | CP             | SemiCP                 |         3 |   0.124444  | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | InSb             | InSb   | Adachi         |              1 | CP             | AnalyticalCP           |         5 |   0.103436  | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WS2              | WS2    | Munkhbat-o     |              1 | CP             | AnalyticalCP           |         4 |   0.103344  | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WSe2             | WSe2   | Gu-4L          |              4 | CP             | SemiCP                 |         4 |   0.101369  | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WSe2             | WSe2   | Gu-3L          |              3 | CP             | SemiCP                 |         5 |   0.0963361 | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | InP              | InP    | Adachi         |              1 | CP             | SemiCP                 |         5 |   0.0874368 | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WSe2             | WSe2   | Gu-5L          |              5 | RP             | RP                     |         3 |   0.0782951 | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | GaSb             | GaSb   | Adachi         |              1 | CP             | SemiCP                 |         3 |   0.0769515 | poor_fit             | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Beal           |              1 | CP             | AnalyticalCP           |         5 |   0.075667  | poor_fit             | lowest_RMS_no_primary_target |
| metal                       | Au               | Au     | Yakubovsky-4nm |             17 | CP             | SemiCP                 |         5 |   0.0640064 | poor_fit             | lowest_RMS_no_primary_target |
| metal                       | V                | V      | Johnson        |              3 | CP             | SemiCP                 |         5 |   0.055196  | poor_fit             | lowest_RMS_no_primary_target |
| semiconductor               | GaAs             | GaAs   | Adachi         |              1 | CP             | AnalyticalCP           |         5 |   0.0531661 | poor_fit             | lowest_RMS_no_primary_target |
| TCO_or_semiconducting_oxide | ZnO              | ZnO    | Querry         |              1 | CP             | SemiCP                 |         3 |   0.0446758 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Au               | Au     | Rakic-BB       |              8 | CP             | SemiCP                 |         3 |   0.0439975 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Islam-1L       |              2 | CP             | AnalyticalCP           |         5 |   0.0431228 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Au               | Au     | Yakubovsky-6nm |             18 | CP             | SemiCP                 |         5 |   0.042173  | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | W                | W      | Rakic-BB       |              4 | CP             | SemiCP                 |         3 |   0.0416433 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Cu               | Cu     | McPeak         |              9 | CP             | AnalyticalCP           |         4 |   0.0409908 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| semiconductor               | GaP              | GaP    | Adachi         |              1 | CP             | SemiCP                 |         3 |   0.0402477 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Ag               | Ag     | Ferrera-298K   |              9 | CP             | SemiCP                 |         2 |   0.0397977 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Cr               | Cr     | Johnson        |              1 | CP             | SemiCP                 |         3 |   0.0397582 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Ermolaev-1L    |             14 | CP             | AnalyticalCP           |         5 |   0.0364467 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| semiconductor               | Ge               | Ge     | Nunley         |              1 | CP             | AnalyticalCP           |         5 |   0.0359864 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | WSe2             | WSe2   | Gu-2L          |              2 | RP             | RP                     |         5 |   0.0337068 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| semiconductor               | GaAs             | GaAs   | Papatryfonos   |              3 | CP             | AnalyticalCP           |         5 |   0.0299053 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Song-6L        |             10 | RP             | RP                     |         5 |   0.0295637 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Ag               | Ag     | Ferrera-404K   |             10 | CP             | SemiCP                 |         2 |   0.0292185 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | As2Se3           | As2Se3 | Joseph-400nm   |              1 | CP             | SemiCP                 |         3 |   0.0288139 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Ullberg        |             13 | CP             | AnalyticalCP           |         4 |   0.0286414 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Au               | Au     | Johnson        |              4 | CP             | AnalyticalCP           |         5 |   0.0276492 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Song-bulk      |             12 | CP             | AnalyticalCP           |         5 |   0.0273265 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoS2             | MoS2   | Song-10L       |              5 | CP             | SemiCP                 |         4 |   0.0270388 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| chalcogenide_or_2D          | MoSe2            | MoSe2  | Beal           |              1 | CP             | SemiCP                 |         5 |   0.0266008 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Pd               | Pd     | Johnson        |              3 | CP             | SemiCP                 |         3 |   0.0264429 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Ti               | Ti     | Johnson        |              3 | CP             | SemiCP                 |         5 |   0.0256342 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Ag               | Ag     | Johnson        |              4 | CP             | SemiCP                 |         3 |   0.0254853 | usable_but_high_RMS  | lowest_RMS_no_primary_target |
| metal                       | Fe               | Fe     | Johnson        |              3 | CP             | SemiCP                 |         5 |   0.0240863 | usable_but_high_RMS  | lowest_RMS_no_primary_target |

## Output files

Main website files:
- `website_lookup_by_record_N.csv`
- `final_recommendation_per_record.csv`

Material-class files:
- `material_class_map.csv`
- `material_class_final_recommendation_summary.csv`
- `material_class_selection_by_N.csv`
- `material_class_readiness_by_family_N.csv`
- `material_class_threshold_coverage.csv`
- `material_class_difficult_records.csv`

Diagnostic files:
- `cp_rescues_when_rp_unusable.csv`
- `rp_wins_by_record_N.csv`
- `rp_final_recommendations.csv`
- `no_usable_records.csv`
- `hard_records_not_reaching_primary_target.csv`
- `hard_records_not_reaching_secondary_target.csv`
- `unstable_low_RMS_traps.csv`

Plots are in `plots/`.
