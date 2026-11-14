# NISAR-Based Mangrove Change Detection
## Sundarbans Delta, West Bengal, India (Gosaba Community Block)

An end-to-end geospatial and remote-sensing system to investigate mangrove vegetation dynamics, forest degradation, and hydrological shifts in the Sundarbans Delta using NASA-ISRO Synthetic Aperture Radar (NISAR) observations.

---

### 1. Study Location

- **Target Location**: Gosaba, West Bengal, India
- **Central Coordinates**: Latitude `21.9500° N`, Longitude `88.8500° E`
- **Spatial Extent (Bounding Box)**:
  - `min_lon`: `88.7000° E`, `min_lat`: `21.8000° N`
  - `max_lon`: `89.0000° E`, `max_lat`: `22.1000° N`
- **Ecosystem**: Tidally dominated mangrove wetland complex (Sundarbans Biosphere Reserve) bordered by the Bidya, Gomor, and Matla river systems.

---

### 2. Scientific Principles & Working Rules

1. **Dual-Frequency Separation & Data Providers**:
   - **L-band GCOV**: Acquired via **NASA Alaska Satellite Facility (ASF) DAAC**.
   - **S-band GCOV**: Acquired via **ISRO Bhoonidhi Data Hub** (operational from Cycle 25 onwards).
   - *ASF DAAC must not be assumed to host both frequency datasets.*
2. **Native Calibrated Radiometry**:
   - NISAR GCOV products are natively distributed as calibrated gamma-nought ($\gamma^0$) linear power.
   - Decibel conversion is computed via: $\gamma^0_{dB} = 10 \cdot \log_{10}(\gamma^0)$.
   - *Duplicate radiometric calibrations must never be applied.*
3. **Mandatory Environmental Covariates**:
   - The Sundarbans exhibits a semi-diurnal macro-tidal range ($4 - 6\text{ m}$). High tide causes severe **trunk-water double bounce** ($+3$ to $+6\text{ dB}$ surge in L-band HH/VV), while low tide exposes muddy sediments with pneumatophores.
   - Monsoon rains (August–September) alter canopy dielectric constants and moisture levels.
   - **Tidal stage and rainfall are mandatory covariates.** Never interpret backscatter drops or surges as mangrove loss or growth without tidal and precipitation cross-referencing.
4. **Dynamic Polarization Audit**:
   - Never assume dual-pol ($HH/HV$) or quad-pol exists in both frequencies. Each granule must have its polarizations inspected and recorded individually.
   - Indices like RVI or cross-pol ratios ($HV/HH$) are candidate methods that require verification against verified polarizations.
5. **No Synthetic or Fabricated Conclusions**:
   - We do not fabricate satellite scenes, observations, statistics, or ecological classifications.
   - Multi-frequency differences (L-band vs. S-band) are treated as complementary observations, not unverified deterministic decision trees.

---

### 3. Repository Architecture

```text
nisar-sundarbans-mangroves/
├── .gitignore                     # Rigorous policy blocking large HDF5/TIFFs & credentials
├── README.md                      # Project documentation and scientific overview
├── requirements.txt               # Pinned Python dependencies
│
├── notebooks/                     # Colab-ready research & processing workflows
│   └── 01_asf_data_discovery.ipynb  # L-band GCOV discovery & archive audit (NASA ASF)
│
├── src/                           # Python processing pipeline package
│   ├── __init__.py
│   └── config.py                  # Gosaba AOI, data provider endpoints, and radar constants
│
├── data/                          # Data directory (managed size boundaries)
│   ├── raw/                       # [Git-ignored] Raw multi-GB HDF5 (.h5) granules
│   ├── intermediate/              # [Git-ignored] Full-resolution intermediate rasters
│   ├── processed/                 # Subset GeoTIFFs, change maps, and audit logs
│   └── aoi/                       # [Committed] Gosaba AOI GeoJSON polygon definition
│
├── web/                           # Static Web Dashboard (GitHub Pages ready)
│   ├── css/                       # UI styling
│   ├── js/                        # Leaflet map logic & Chart.js integration
│   └── data/                      # Lightweight assets (< 5 MB) consumed by the client
│       ├── aoi.geojson            # Gosaba boundary GeoJSON
│       └── rasters/               # Optimized 8-bit web overlays
│
└── docs/                          # Scientific documentation & methodology reports
```

---

### 4. Implementation Roadmap (7 Phases)

- **[x] Phase 1**: Environment Setup, Repository Skeleton, AOI & Discovery Notebook.
- **[ ] Phase 2**: L-band (ASF) & S-band (Bhoonidhi) Data Discovery and Archive Audit.
- **[ ] Phase 3**: HDF5 Dynamic Structure Inspection & AOI Subsetting Pipeline.
- **[ ] Phase 4**: Multi-Temporal Radar Analysis & Disentangling Environmental Factors.
- **[ ] Phase 5**: Web Data Layer Preparation & Pre-computation.
- **[ ] Phase 6**: Interactive Web Dashboard Development (Gosaba Study Area).
- **[ ] Phase 7**: Scientific Verification, Documentation & GitHub Pages Deployment.

---

### 5. Getting Started

#### Local Environment Setup
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

#### Running Discovery in Google Colab
1. Upload `notebooks/01_asf_data_discovery.ipynb` to Google Colab.
2. Store your NASA Earthdata credentials in Colab Secrets (`EARTHDATA_USERNAME`, `EARTHDATA_PASSWORD`).
3. Run all cells to query the ASF DAAC archive over Gosaba for the provisional August–September 2026 observation window.
