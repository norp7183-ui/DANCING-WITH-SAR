# NISAR Data Discovery & Archive Audit Report (Revised)
## Sundarbans Delta (Gosaba Community Block), West Bengal, India
**Phase 2 Scientific Findings, Version Deduplication, and Cross-Frequency Evaluation**

---

### 1. Executive Summary & Audit Context

This document presents the revised scientific findings of **Phase 2: NISAR Data Discovery & Archive Audit** covering the Gosaba study area ($21.8000^\circ - 22.1000^\circ\text{ N}, 88.7000^\circ - 89.0000^\circ\text{ E}$) across the temporal window of **August 20, 2026 to October 01, 2026**.

All findings have been updated in accordance with the Phase 2 Scientific Audit requirements:
1. **Geometry Correction**: NISAR operates in a nominal **Left-Looking** geometry. The look directions and illumination azimuths for both Ascending and Descending orbits have been derived directly from radar flight mechanics and swath coordinates, correcting earlier assumptions.
2. **Temporal Offset Disentanglement**: Calendar-date differences have been cleanly separated from exact UTC overpass times. Hourly offsets are not inferred without an explicit target timestamp.
3. **ISRO Bhoonidhi S-band Verification**: The official Bhoonidhi search API endpoint has been inspected at `https://bhoonidhi-api.nrsc.gov.in/data/search`. Live network testing confirmed `HTTP 401 Unauthorized`, proving that authenticated access requires an NRSC-issued bearer token. S-band passes are classified as **PARTIALLY VERIFIED (Planned ROP Cycle 25+ passes; unverified archive granules)**, pending authenticated query evidence.
4. **Environmental Demarcation**: The scientifically invalid claim that nighttime acquisitions are automatically environmentally stable has been removed. Dynamic tidal inundation, monsoon precipitation, and dew formation occur across both daytime and nighttime passes.
5. **Polarization & Multi-Frequency Rigor**: Within-frequency multi-temporal analysis is separated from cross-frequency comparisons. Equal polarization labels ($HH$ in L-band vs $HH$ in S-band) are documented as physically distinct radar responses due to wavelength differences ($24\text{ cm}$ vs $9.3\text{ cm}$). Quad-pol decompositions are strictly prohibited on dual-pol data.
6. **Granule Deduplication Audit**: Every L-band granule is fully tokenized (Product ID, PGE version, CRID, ephemeris accuracy, coverage indicator, counter). Superseded Urgent Response (`UR`) and preliminary run (`001`) granules are explicitly documented and separated from the recommended primary baseline (`PR`, run `002`).

---

### 2. Orbit & Look Geometry Verification

#### 2.1 The Left-Looking Radar Geometry
NISAR’s radar antenna is mounted to view the Earth to the **LEFT** of the spacecraft velocity vector during nominal science operations (in contrast to right-looking civilian sensors like Sentinel-1 or ALOS-2). 

```text
       ASCENDING PASS (Heading ~350° N)               DESCENDING PASS (Heading ~190° S)
                  ▲ Flight Direction                             │
                  │                                              │ Flight Direction
                  │                                              ▼
   Look LEFT ◄────┘                                              └────► Look LEFT
   (Points WEST / NORTH-WEST)                                    (Points EAST / SOUTH-EAST)
   Swath: 87.40° E to 90.47° E                                   Swath: 87.16° E to 90.12° E
```

- **Track 170 (Ascending Pass)**:
  - Flight trajectory: South to North (heading $\approx 349^\circ - 350^\circ$).
  - Radar look direction: **Left**.
  - Ground illumination: **West / North-West**.
  - Local incidence angle at Gosaba ($88.8500^\circ\text{ E}$): Located in the mid-range of the swath ($~38^\circ - 41^\circ$).
- **Track 019 (Descending Pass)**:
  - Flight trajectory: North to South (heading $\approx 190^\circ - 191^\circ$).
  - Radar look direction: **Left**.
  - Ground illumination: **East / South-East**.
  - Local incidence angle at Gosaba ($88.8500^\circ\text{ E}$): Located in the mid-to-far range of the swath ($~42^\circ - 44^\circ$).

> [!WARNING]
> **Geometric Confounding in Cross-Track Comparisons**: Because Track 170 illuminates looking West/North-West at $~39^\circ$ incidence, while Track 019 illuminates looking East/South-East at $~43^\circ$ incidence, vertical mangrove structures, riverbank bluffs, and canopy trees present opposite radar shadowing and specular reflection angles. **Multi-temporal change detection must be computed within the same track (Track 019 to Track 019, or Track 170 to Track 170). Cross-track comparison requires rigorous incidence angle normalization and terrain co-registration.**

---

### 3. Track A: NASA ASF DAAC L-Band Granule Inventory & Deduplication

#### 3.1 Verified Archive Discovery
- **Verification Status**: `VERIFIED`
- **Verification Source**: NASA Alaska Satellite Facility (ASF) DAAC Search API (`api.daac.asf.alaska.edu`)
- **Query Parameters**: `dataset='NISAR'`, `processingLevel='GCOV'`, `intersectsWith=POLYGON((88.7 21.8, 89.0 21.8, 89.0 22.1, 88.7 22.1, 88.7 21.8))`, `start='2026-08-20T00:00:00Z'`, `end='2026-10-01T23:59:59Z'`.
- **Total Granules Found**: 15 granules (covering 10 unique passes).

#### 3.2 Granule Tokenization & Version Deduplication Table
Granule IDs adhere to the official JPL D-102255 / D-102274 naming convention:
`NISAR_IL_PT_PROD_CYL_REL_P_FRM_MODE_POLE_S_StartDateTime_EndDateTime_CRID_A_C_LOC_CTR`

| # | Granule ID | Date (UTC) | Start (UTC) | Track | Frame | Pol | Ephem. (A) | Cov. (C) | Counter | Status | Selection & Deduplication Rationale |
| :-: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | `NISAR_L2_PR_GCOV_028_170_A_012_4005_DHDH_A_20260824T232910_20260824T232919_P05023_N_P_J_001` | 2026-08-24 | 23:29:10Z | 170 | 012 | Dual | N (NRT) | P (Part) | 001 | VERIFIED | **SECONDARY**: Frame 012 covers southern fringe; Frame 013 covers Gosaba core. |
| 2 | `NISAR_L2_PR_GCOV_028_170_A_013_4005_DHDH_A_20260824T232918_20260824T232952_P05023_N_F_J_001` | 2026-08-24 | 23:29:18Z | 170 | 013 | Dual | N (NRT) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 28 Track 170 scene. |
| 3 | `NISAR_L2_PR_GCOV_029_019_D_077_2005_QPDH_A_20260826T124314_20260826T124348_P05023_N_F_J_001` | 2026-08-26 | 12:43:14Z | 019 | 077 | **Quad** | N (NRT) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 29 Track 019 Quad-Pol baseline scene. |
| 4 | `NISAR_L2_UR_GCOV_029_170_A_012_4005_DHDH_A_20260905T232910_20260905T232919_P05023_F_P_J_001` | 2026-09-05 | 23:29:10Z | 170 | 012 | Dual | F (Fcst) | P (Part) | 001 | VERIFIED | **SUPERSEDED**: Urgent Response with forecast ephemeris; superseded by PR. |
| 5 | `NISAR_L2_PR_GCOV_029_170_A_012_4005_DHDH_A_20260905T232910_20260905T232919_P05023_N_P_J_001` | 2026-09-05 | 23:29:10Z | 170 | 012 | Dual | N (NRT) | P (Part) | 001 | VERIFIED | **SUPERSEDED**: Preliminary run 001; superseded by reprocessed run 002. |
| 6 | `NISAR_L2_PR_GCOV_029_170_A_012_4005_DHDH_A_20260905T232910_20260905T232919_P05023_N_P_J_002` | 2026-09-05 | 23:29:10Z | 170 | 012 | Dual | N (NRT) | P (Part) | 002 | VERIFIED | **SECONDARY**: Reprocessed run 002, but Frame 012 is southern fringe. |
| 7 | `NISAR_L2_UR_GCOV_029_170_A_013_4005_DHDH_A_20260905T232918_20260905T232952_P05023_F_F_J_001` | 2026-09-05 | 23:29:18Z | 170 | 013 | Dual | F (Fcst) | F (Full) | 001 | VERIFIED | **SUPERSEDED**: Urgent Response with forecast ephemeris; superseded by PR. |
| 8 | `NISAR_L2_PR_GCOV_029_170_A_013_4005_DHDH_A_20260905T232918_20260905T232952_P05023_N_F_J_001` | 2026-09-05 | 23:29:18Z | 170 | 013 | Dual | N (NRT) | F (Full) | 001 | VERIFIED | **SUPERSEDED**: Preliminary run 001; superseded by reprocessed run 002. |
| 9 | `NISAR_L2_PR_GCOV_029_170_A_013_4005_DHDH_A_20260905T232918_20260905T232952_P05023_N_F_J_002` | 2026-09-05 | 23:29:18Z | 170 | 013 | Dual | N (NRT) | F (Full) | 002 | VERIFIED | **SELECTED**: Reprocessed run 002 with highest calibration quality. |
| 10 | `NISAR_L2_PR_GCOV_030_019_D_077_2005_QPDH_A_20260907T124313_20260907T124348_P05023_N_F_J_001` | 2026-09-07 | 12:43:13Z | 019 | 077 | **Quad** | N (NRT) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 30 Track 019 Quad-Pol scene. |
| 11 | `NISAR_L2_UR_GCOV_030_170_A_013_4005_DHDH_A_20260917T232917_20260917T232952_P05023_F_F_J_001` | 2026-09-17 | 23:29:17Z | 170 | 013 | Dual | F (Fcst) | F (Full) | 001 | VERIFIED | **SUPERSEDED**: Urgent Response product; superseded by PR. |
| 12 | `NISAR_L2_PR_GCOV_030_170_A_013_4005_DHDH_A_20260917T232917_20260917T232952_P05023_F_F_J_001` | 2026-09-17 | 23:29:17Z | 170 | 013 | Dual | F (Fcst) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 30 Track 170 scene. |
| 13 | `NISAR_L2_PR_GCOV_031_019_D_077_2005_QPDH_A_20260919T124313_20260919T124348_P05023_F_F_J_001` | 2026-09-19 | 12:43:13Z | 019 | 077 | **Quad** | F (Fcst) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 31 Track 019 Quad-Pol scene. |
| 14 | `NISAR_L2_PR_GCOV_031_170_A_013_4005_DHDH_A_20260929T232917_20260929T232952_P05023_N_F_J_001` | 2026-09-29 | 23:29:17Z | 170 | 013 | Dual | N (NRT) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 31 Track 170 scene. |
| 15 | `NISAR_L2_PR_GCOV_032_019_D_077_2005_QPDH_A_20261001T124313_20261001T124348_P05023_N_F_J_001` | 2026-10-01 | 12:43:13Z | 019 | 077 | **Quad** | N (NRT) | F (Full) | 001 | VERIFIED | **SELECTED**: Primary Cycle 32 Track 019 Quad-Pol scene. |

---

### 4. Track B: ISRO Bhoonidhi S-Band Investigation & API Audit

#### 4.1 Official API Endpoint & Authentication Inspection
- **Official API Search Endpoint**: `https://bhoonidhi-api.nrsc.gov.in/data/search`
- **Portal URL**: `https://bhoonidhi.nrsc.gov.in/bhoonidhi/`
- **Access Protocol Verification Result**:
  - Live probe of `https://bhoonidhi-api.nrsc.gov.in/data/search` returned `HTTP Error 401: Unauthorized`.
  - **Audit Confirmation**: The Bhoonidhi STAC API is active and live, but unauthenticated public queries are prohibited. Programmatic querying requires an `Authorization: Bearer <NRSC_TOKEN>` header issued to registered users by NRSC (`bhoonidhi@nrsc.gov.in`).
  - Without an active authorized bearer token, programmatic catalog searches cannot be executed from terminal or script.

#### 4.2 Distinguishing Operational Availability, Planned Acquisitions & Archive Products
To maintain scientific credibility, S-band status is partitioned into three distinct tiers:
1. **Mission Operational Availability (`VERIFIED`)**:
   - Official ISRO policy confirms standard Level-2 (L2-GCOV) daily processing and open data release commenced with **Cycle 25** (July 8, 2026).
   - Source: *ISRO National Remote Sensing Centre (NRSC) NISAR S-SAR Data Policy & Science Release Announcement*.
2. **Planned Acquisitions under Reference Observation Plan (`PARTIALLY VERIFIED`)**:
   - The NISAR Reference Observation Plan (ROP) schedules S-band acquisitions over Indian land and coastal zones for nominal 12-day repeat tracks across Cycles 28 to 32.
   - Overpasses over Gosaba occur nominally on Track 170 (Ascending, ~23:29 UTC) and Track 019 (Descending, ~12:43 UTC).
3. **Verified Archived Granules over Gosaba (`NOT VERIFIED`)**:
   - Because the API requires token authorization and direct catalog records were not retrieved, the exact spatial bounding coordinates, processing baseline version, and archived delivery status of S-band granules over Gosaba **cannot be claimed as confirmed**.
   - These records are cataloged in [bhoonidhi_sband_inventory.csv](file:///c:/Users/vamsi/Downloads/New%20folder/data/processed/bhoonidhi_sband_inventory.csv) with verification status:  
     `PARTIALLY VERIFIED (Planned ROP Cycle 25+ pass; unverified archive granule)`.

---

### 5. Temporal Offset Analysis (Candidate Dates vs. Actual Passes)

The user's candidate observation dates were defined as calendar targets without an associated time of day:
- August 23, 2026
- September 04, 2026
- September 16, 2026
- September 28, 2026

#### Disentangled Calendar-Date and Exact Time Offsets:
Hourly offsets cannot be computed without a target timestamp. Instead, calendar-day differences ($\Delta\text{Date}$) and exact satellite overpass UTC timestamps are reported separately:

| Target Calendar Date | Actual Overpass Date (UTC) | Exact Overpass Time (UTC) | Track & Orbit | Calendar Offset ($\Delta\text{Date}$) | Reason for Offset |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **2026-08-23** | **2026-08-24** | 23:29:18Z | Track 170 (Ascending) | **+1 calendar day** | Fixed 12-day repeat ground track geometry |
| **2026-08-23** | **2026-08-26** | 12:43:14Z | Track 019 (Descending) | **+3 calendar days** | Fixed 12-day repeat ground track geometry |
| **2026-09-04** | **2026-09-05** | 23:29:18Z | Track 170 (Ascending) | **+1 calendar day** | Fixed 12-day repeat ground track geometry |
| **2026-09-04** | **2026-09-07** | 12:43:13Z | Track 019 (Descending) | **+3 calendar days** | Fixed 12-day repeat ground track geometry |
| **2026-09-16** | **2026-09-17** | 23:29:17Z | Track 170 (Ascending) | **+1 calendar day** | Fixed 12-day repeat ground track geometry |
| **2026-09-16** | **2026-09-19** | 12:43:13Z | Track 019 (Descending) | **+3 calendar days** | Fixed 12-day repeat ground track geometry |
| **2026-09-28** | **2026-09-29** | 23:29:17Z | Track 170 (Ascending) | **+1 calendar day** | Fixed 12-day repeat ground track geometry |
| **2026-09-28** | **2026-10-01** | 12:43:13Z | Track 019 (Descending) | **+3 calendar days** | Fixed 12-day repeat ground track geometry |

---

### 6. Environmental Confounding & Covariate Analysis

#### 6.1 Scientific Correction: Rejecting the "Nighttime Stability" Assumption
In coastal estuarine environments like the Sundarbans, nighttime acquisitions are **not** inherently more environmentally stable:
1. **Semi-Diurnal Tidal Cycling**: Tides operate on a lunar cycle (~12.4 hour period). High tide ($4 - 6\text{ m}$) regularly occurs at night. When high tide coincides with a 23:29 UTC pass, the forest floor is submerged, creating a $+3\text{ to }+6\text{ dB}$ surge in L-band $HH/VV$ backscatter due to trunk-water double-bounce.
2. **Monsoon Convection**: During the Southwest Monsoon (August–September), heavy convective rainfall and thunderstorms frequently strike during late-night and pre-dawn hours.
3. **Nocturnal Dew & Canopy Wetting**: Radiative cooling after dark increases relative humidity to near $100\%$, condensing dew on leaf surfaces and altering dielectric properties.

#### 6.2 Role of Track 170 vs. Track 019
- **Track 170 (Ascending, 23:29 UTC)** is designated as an **independent ascending-track cross-check**, providing a separate observation angle and temporal sampling point.
- **Acquisition UTC timestamps are strictly metadata indices** used to query external hydrographic gauge data (Canning Station, Sagar Island) and meteorological stations (IMD AWS, ERA5 reanalysis). **Timestamps are never a substitute for actual environmental measurements.**

---

### 7. Polarization & Cross-Frequency Methodology

#### 7.1 Separation of Within-Frequency and Cross-Frequency Workflows
To avoid invalid physical assumptions, the analytical pipeline separates within-frequency tracking from cross-frequency comparisons:

```text
┌────────────────────────────────────────────────────────┐   ┌────────────────────────────────────────────────────────┐
│             WITHIN-FREQUENCY TRACKING (L-BAND)         │   │             WITHIN-FREQUENCY TRACKING (S-BAND)         │
│  • Track 019 vs Track 019 (Descending Quad-Pol)        │   │  • S-band Track 019 vs S-band Track 019 (Dual-Pol)     │
│  • Identical 24 cm wavelength, same look geometry      │   │  • Identical 9.3 cm wavelength, same look geometry     │
│  • Direct 12-day backscatter log-ratio (dB difference) │   │  • Upper-canopy foliage & roughness temporal shifts    │
└───────────────────────────┬────────────────────────────┘   └───────────────────────────┬────────────────────────────┘
                            │                                                            │
                            └────────────────────────────┬───────────────────────────────┘
                                                         │
                                                         ▼
                               ┌────────────────────────────────────────────────────────┐
                               │           CROSS-FREQUENCY COMPARATIVE ANALYSIS         │
                               │  • Separate physical scattering regimes:               │
                               │    - L-band: deep penetration, woody biomass, trunks   │
                               │    - S-band: upper canopy leaves, secondary twigs      │
                               │  • Channel names (HH, HV) ARE NOT directly comparable  │
                               │  • Requires co-registration & angle normalization      │
                               │  • No quad-pol decomposition on dual-pol S-band        │
                               └────────────────────────────────────────────────────────┘
```

#### 7.2 Physical Divergence of Equal Polarization Channel Names
Never assume that an "$HH$" channel in L-band produces numerical backscatter comparable to an "$HH$" channel in S-band:
- **Wavelength & Penetration**: L-band ($\lambda \approx 24\text{ cm}$) penetrates dense mangrove canopies (*Avicennia*, *Rhizophora*), interacting with branches, trunks, and the forest floor. S-band ($\lambda \approx 9.3\text{ cm}$) is heavily attenuated and scattered within the top $1 - 2\text{ m}$ of dense foliage.
- **Dielectric Extinction**: Wet leaves induce much higher two-way signal extinction in S-band than in L-band.
- **Decomposition Restrictions**:
  - Full quad-pol decompositions (Freeman-Durden 3-component, Cloude-Pottier $H/\alpha$) require complete $3 \times 3$ or $4 \times 4$ coherency/covariance matrices containing co-pol and cross-pol complex correlations ($S_{HH}S_{VV}^*$).
  - **Quad-pol decompositions must never be applied to dual-pol data ($HH/HV$).** For dual-pol data, only intensity ratios ($HV/HH$) and dual-pol Radar Vegetation Index ($RVI_{dual}$) are mathematically valid.

---

### 8. Updated Verification Status Summary & Phase 3 Transition

#### 8.1 Summary Table of Datasets & Verification Status

| Frequency | Data Provider | Track & Frame | Observation Mode | Verified Passes | Primary Verification Status | Primary Source Reference |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **L-band** (1.25 GHz) | NASA ASF DAAC | Track 019 (Frame 077) | Descending Quad-Pol ($HH/HV/VH/VV$) | 4 passes (Aug 26, Sep 07, Sep 19, Oct 01) | **VERIFIED** | NASA ASF DAAC API query response (`api.daac.asf.alaska.edu`) |
| **L-band** (1.25 GHz) | NASA ASF DAAC | Track 170 (Frame 013) | Ascending Dual-Pol ($HH/HV$) | 4 passes (Aug 24, Sep 05, Sep 17, Sep 29) | **VERIFIED** | NASA ASF DAAC API query response (`api.daac.asf.alaska.edu`) |
| **S-band** (3.20 GHz) | ISRO Bhoonidhi | Track 019 & Track 170 | Dual-Pol / Compact-Pol | 8 scheduled passes (Cycles 28–32) | **PARTIALLY VERIFIED** | ISRO NRSC NISAR Cycle 25 Release Announcement; STAC API (`bhoonidhi-api.nrsc.gov.in/data/search`) returned HTTP 401 |

#### 8.2 Unresolved Issues Before Phase 3
1. **Authenticated Access for Bhoonidhi STAC API**:
   - Because `https://bhoonidhi-api.nrsc.gov.in/data/search` requires an NRSC Bearer Token, actual S-band granule files for Gosaba cannot be downloaded programmatically without user credentials.
   - *Phase 3 Handling*: Phase 3 HDF5 reading and preprocessing code will be designed to support both NASA L-SAR HDF5 structures and ISRO S-SAR HDF5 structures harmoniously, with manual ingest or token-based ingestion hooks.
2. **Environmental Gauge Data Acquisition**:
   - Real tide gauge readings (Canning Station) and rainfall metrics (IMD Canning AWS) must be collected for the 8 overpass timestamps before classifying radar change maps.

#### 8.3 Recommended Execution Strategy for Phase 3
1. **Primary Time Series**: Focus HDF5 dynamic reader development on the **Track 019 Descending Quad-Pol series** (Aug 26, Sep 07, Sep 19, Oct 01, 2026). This series provides identical look geometry ($42^\circ - 44^\circ$ looking East/South-East) and full 10-term covariance matrices without cross-track distortion.
2. **Cross-Check Series**: Use the **Track 170 Ascending Dual-Pol series** as an independent geometric verification.
3. **Subsetting without Full Granule Downloads**: Implement spatial coordinate array slicing directly on the HDF5 grid structure targeting the Gosaba bounding box ($[88.70^\circ, 21.80^\circ]$ to $[89.00^\circ, 22.10^\circ]$).
