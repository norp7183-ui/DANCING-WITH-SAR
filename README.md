# NISAR-Based Mangrove Change Detection
## Sundarbans Delta, West Bengal, India (Gosaba Community Block)

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/norp7183-ui/DANCING-WITH-SAR)
[![Open Notebook 01 in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/norp7183-ui/DANCING-WITH-SAR/blob/main/notebooks/01_asf_data_discovery.ipynb)
[![Open Notebook 02 in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/norp7183-ui/DANCING-WITH-SAR/blob/main/notebooks/02_hdf5_structure_inspection.ipynb)
[![Open Notebook 03 in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/norp7183-ui/DANCING-WITH-SAR/blob/main/notebooks/03_gcov_subset_pipeline.ipynb)

An end-to-end geospatial and remote-sensing research pipeline to investigate mangrove vegetation dynamics, forest degradation, and hydrological shifts in the Sundarbans Delta using NASA-ISRO Synthetic Aperture Radar (NISAR) Level-2 GCOV observations.

---

### 1. Study Location

- **Target Location**: Gosaba, West Bengal, India
- **Central Coordinates**: Latitude `21.9500° N`, Longitude `88.8500° E`
- **Spatial Extent (Bounding Box)**:
  - `min_lon`: `88.7000° E`, `min_lat`: `21.8000° N`
  - `max_lon`: `89.0000° E`, `max_lat`: `22.1000° N`
- **Projected CRS**: WGS 84 / UTM Zone 45N (`EPSG:32645`)
- **Ecosystem**: Tidally dominated mangrove wetland complex (Sundarbans Biosphere Reserve) bordered by the Bidya, Gomor, and Matla river estuaries.

---

### 2. Scientific Principles & Working Rules

1. **Dual-Frequency Separation & Data Providers**:
   - **L-band GCOV (1.25 GHz / ~24 cm)**: Acquired via **NASA Alaska Satellite Facility (ASF) DAAC**. Verified archive contains 15 provisional granules over Gosaba for August–October 2026.
   - **S-band GCOV (3.20 GHz / ~9.3 cm)**: Acquired via **ISRO Bhoonidhi Data Hub**. S-band acquisitions are scheduled under the NISAR Reference Observation Plan from Cycle 25 onwards, but active archive availability over Gosaba remains unverified pending authenticated portal access.
   - *ASF DAAC must not be assumed to host both frequency datasets.*
2. **Native Calibrated Radiometry**:
   - NISAR Level-2 GCOV products are natively distributed as calibrated gamma-nought ($\gamma^0$) linear power.
   - Decibel conversion is computed via: $\gamma^0_{dB} = 10 \cdot \log_{10}(\gamma^0)$.
   - *Duplicate radiometric calibrations must never be applied.*
3. **Mandatory Environmental Covariates**:
   - The Sundarbans exhibits a semi-diurnal macro-tidal range ($4 - 6\text{ m}$). Tidal inundation can induce significant trunk-water double bounce interactions in L-band co-polarized channels ($HH/VV$), while low tide exposes muddy substrates and root pneumatophores.
   - Monsoon rains (August–September) alter canopy dielectric constants and moisture levels.
   - **Tidal stage and rainfall are mandatory covariates.** Rather than assuming static decibel offsets, tidal height (from Canning / Sagar Island gauges) and rainfall records must be cross-referenced before attributing radar backscatter shifts to canopy gain or degradation.
4. **Dynamic Polarization Audit**:
   - Never assume dual-pol ($HH/HV$) or quad-pol exists in both frequencies. Each granule must have its polarizations inspected and recorded individually.
   - Quad-pol decompositions (e.g. Freeman-Durden, Cloude-Pottier) require complete covariance matrices and must never be applied to dual-pol data.
5. **Spatial Resolution Harmonization**:
   - L-band Frequency A native posting: **10 m** or **20 m**.
   - S-band Frequency B native posting: **80 m** (standard regional multi-looked configuration).
   - Harmonized cross-frequency comparison is performed on a common **80 m grid** ($420 \times 392$ pixels).
   - *Resampling S-band to 20 m does not create additional spatial information.*
6. **No Synthetic or Fabricated Conclusions**:
   - We do not fabricate satellite scenes, observations, statistics, or ecological classifications.
   - Multi-frequency differences are treated as complementary observations, not unverified deterministic decision trees.

---

### 3. Repository Architecture

```text
DANCING-WITH-SAR/
├── .gitignore                                 # Rigorous policy blocking large HDF5/TIFFs & credentials
├── README.md                                  # Project overview and scientific specifications
├── requirements.txt                           # Pinned Python dependencies
│
├── notebooks/                                 # Research & processing workflows (Colab ready)
│   ├── 01_asf_data_discovery.ipynb            # Phase 2: L-band GCOV discovery & archive audit (NASA ASF)
│   ├── 02_hdf5_structure_inspection.ipynb     # Phase 3A: HDF5 structure, coordinate & geometry audit
│   └── 03_gcov_subset_pipeline.ipynb          # Phase 3B: Authenticated access & small-window test pipeline
│
├── src/                                       # Core Python configuration & utilities
│   ├── __init__.py
│   └── config.py                              # Gosaba AOI, coordinate bounds, endpoints, and constants
│
├── data/                                      # Data directory (managed size boundaries)
│   ├── raw/                                   # [Git-ignored] Raw multi-GB HDF5 (.h5) granules
│   ├── intermediate/                          # [Git-ignored] Full-resolution intermediate rasters
│   ├── aoi/                                   # [Committed] Gosaba AOI GeoJSON polygon definition
│   │   └── gosaba_aoi.geojson
│   └── processed/                             # [Committed] Inventory catalogs & validation metadata
│       ├── asf_lband_inventory.csv            # 15 NASA ASF L-band candidate granules
│       ├── asf_lband_inventory.json
│       ├── asf_nisar_raw_response.json
│       ├── bhoonidhi_sband_inventory.csv      # ISRO Bhoonidhi S-band regional inventory
│       ├── bhoonidhi_sband_inventory.json
│       ├── cross_frequency_comparison.csv     # Matched L-band / S-band observation table
│       ├── cross_frequency_comparison.json
│       ├── product_quality_audit.csv          # Ephemeris, CRID, and geometry comparison
│       ├── hdf5_dataset_inventory.json        # Complete HDF5 group & dataset hierarchy
│       ├── gosaba_subset_metadata.json        # UTM 45N bounds and pixel-center affine offset
│       ├── http_range_benchmark.json          # URS OAuth handshake & HTTP range benchmark
│       └── pipeline_validation.json           # Comprehensive pipeline validation specifications
│
├── scripts/                                   # Automation and access benchmarking
│   ├── test_authenticated_access.py           # Authenticated HTTP Range & fsspec block-cache test
│   ├── git_manager.py                         # Git repository initialization and staging manager
│   └── push_to_github.py                      # Secure GitHub push utility
│
├── web/                                       # Web dashboard & visualization assets
│   ├── data/
│   │   ├── aoi.geojson                        # Lightweight Gosaba boundary GeoJSON
│   │   └── rasters/                           # [.gitkeep] Optimized web rasters (< 5 MB)
│
└── docs/                                      # Comprehensive scientific audit documentation
    ├── data_discovery.md                      # Phase 2: NASA ASF & ISRO Bhoonidhi archive audit
    ├── phase3a_hdf5_inspection.md             # Phase 3A: HDF5 structure, geometry & memory audit
    └── phase3b_pipeline_feasibility.md        # Phase 3B: Authenticated access & pipeline feasibility
```

---

### 4. Implementation Roadmap (7 Phases)

- **[x] Phase 1**: Project Foundation & Setup (Repository structure, AOI GeoJSON, scientific constraints).
- **[x] Phase 2**: Data Discovery & Archive Audit (15 L-band scenes cataloged via ASF; S-band status documented).
- **[x] Phase 3A**: HDF5 Dynamic Structure & Geometry Inspection (Incidence angle variation, 64-byte/pixel quad-pol memory model, pixel-center affine registration).
- **[ ] Phase 3B**: Pipeline Feasibility & Access Verification (**Implementation prepared; authenticated execution pending in Google Colab**).
- **[ ] Phase 4**: Multi-Temporal Radar Analysis & Environmental Covariates (Not Started).
- **[ ] Phase 5**: Web Data Layer Preparation & Pre-computation (Not Started).
- **[ ] Phase 6**: Interactive Web Dashboard Development (Not Started).
- **[ ] Phase 7**: Scientific Verification, Documentation & GitHub Pages Deployment (Not Started).

---

### 5. Running the Research Notebooks

#### In Google Colab
1. Click the **Open in Colab** badges above for any notebook.
2. In `notebooks/03_gcov_subset_pipeline.ipynb`:
   - **Step 1**: Installs required packages (`earthaccess`, `fsspec`, `h5py`, `rasterio`).
   - **Step 2**: Prompts interactively for NASA Earthdata Login credentials via `earthaccess.login(strategy="interactive", persist=False)`.
   - **Step 3**: Probes `bytes=0-511` to verify `HTTP 206 Partial Content`, `Content-Range`, and binary HDF5 magic bytes (`\x89HDF\r\n\x1a\n`).
   - **Step 4**: Performs a controlled remote read of the $100 \times 100$ `HHHH` diagonal power window and quality mask using `earthaccess.get_fsspec_https_session()` with 8 MB block caching, verifying cache hits/misses and displaying a two-panel preview.
   - *Steps 5 and 6 remain locked awaiting experimental validation of selective remote access.*

#### In Local Environment
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```
