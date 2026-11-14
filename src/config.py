"""
Project Configuration: NISAR-Based Mangrove Change Detection
Study Area: Gosaba, Sundarbans Delta, West Bengal, India

Scientific Guidelines Incorporated:
1. Distinct sources: L-band GCOV from NASA ASF DAAC; S-band GCOV from ISRO Bhoonidhi.
2. GCOV products contain calibrated gamma-nought (gamma0) power; do not duplicate radiometric calibration.
3. Candidate indices (RVI, ratios) depend strictly on verified product polarizations.
4. Tidal stage and rainfall are compulsory environmental covariates, not optional documentation.
5. No deterministic L/S decision trees without in-situ validation.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Tuple


# ==============================================================================
# 1. Geographic Study Area: Gosaba & Sundarbans Delta
# ==============================================================================
@dataclass(frozen=True)
class StudyAreaConfig:
    name: str = "Gosaba, Sundarbans Delta, West Bengal"
    center_lat: float = 21.9500
    center_lon: float = 88.8500
    
    # Bounding box coordinates [min_lon, min_lat, max_lon, max_lat]
    min_lon: float = 88.7000
    min_lat: float = 21.8000
    max_lon: float = 89.0000
    max_lat: float = 22.1000
    
    crs_geographic: str = "EPSG:4326"
    crs_projected: str = "EPSG:32645"  # WGS 84 / UTM zone 45N
    
    @property
    def bbox(self) -> Tuple[float, float, float, float]:
        """Returns (min_lon, min_lat, max_lon, max_lat)."""
        return (self.min_lon, self.min_lat, self.max_lon, self.max_lat)

    @property
    def wkt_polygon(self) -> str:
        """Well-Known Text polygon for spatial search queries."""
        return (
            f"POLYGON(({self.min_lon} {self.min_lat}, "
            f"{self.max_lon} {self.min_lat}, "
            f"{self.max_lon} {self.max_lat}, "
            f"{self.min_lon} {self.max_lat}, "
            f"{self.min_lon} {self.min_lat}))"
        )


# ==============================================================================
# 2. Satellite Mission & Data Providers (Strictly Separated)
# ==============================================================================
@dataclass(frozen=True)
class DataProviderConfig:
    # NASA Alaska Satellite Facility (ASF) DAAC provides L-band
    l_band_provider: str = "NASA Alaska Satellite Facility (ASF) DAAC"
    l_band_platform: str = "NISAR"
    l_band_instrument: str = "L-SAR"
    l_band_product_type: str = "GCOV"  # Geocoded Polarimetric Covariance
    l_band_frequency_ghz: float = 1.25  # ~24 cm wavelength
    l_band_search_api: str = "https://api.daac.asf.alaska.edu/services/search/param"
    
    # ISRO Bhoonidhi Data Hub provides S-band (Cycle 25+)
    s_band_provider: str = "ISRO National Remote Sensing Centre (NRSC) Bhoonidhi"
    s_band_platform: str = "NISAR"
    s_band_instrument: str = "S-SAR"
    s_band_product_type: str = "GCOV"
    s_band_frequency_ghz: float = 3.20  # ~9.3 cm wavelength
    s_band_min_cycle: int = 25  # S-band operational products scheduled cycle 25+
    s_band_portal: str = "https://bhoonidhi.nrsc.gov.in"


# ==============================================================================
# 3. Candidate Observation Dates (Provisional targets, requiring archive verification)
# ==============================================================================
CANDIDATE_DATES_2026: List[str] = [
    "2026-08-23",
    "2026-09-04",
    "2026-09-16",
    "2026-09-28",
]


# ==============================================================================
# 4. Mandatory Metadata Attributes To Record Per Granule
# ==============================================================================
REQUIRED_METADATA_FIELDS: List[str] = [
    "granule_id",
    "frequency_band",        # 'L' or 'S'
    "product_maturity",      # e.g., 'Beta', 'Validated', 'Provisional'
    "processing_baseline",   # e.g., software/algorithm version tag
    "acquisition_time_utc",  # Full ISO 8601 timestamp
    "orbit_direction",       # 'Ascending' or 'Descending'
    "track_number",
    "frame_number",
    "available_polarizations", # Dynamically audited list, e.g. ['HH', 'HV']
    "covariance_terms",      # Terms in HDF5, e.g. ['HHHH', 'HVHV', 'HHHV']
    "pixel_spacing_meters",  # Ground sampling distance
    "projection_epsg",       # CRS of the geocoded grid
]


# ==============================================================================
# 5. Radiometric Principles & Conversion Parameters
# ==============================================================================
class RadiometricPrinciples:
    """
    NISAR GCOV products are natively delivered as calibrated gamma-nought (gamma0)
    linear power.
    
    SCIENTIFIC PRINCIPLES:
    - Never apply duplicate calibration factors.
    - Linear power to decibel conversion: gamma0_dB = 10.0 * log10(gamma0_linear).
    - Do NOT apply an arbitrary fixed -35 dB threshold or hardcoded noise clamp.
    - Low-signal clipping or noise masking must derive strictly from the product's
      documented Noise Equivalent Sigma Zero (NESZ) or HDF5 validity mask.
    """
    POWER_TO_DB_FACTOR: float = 10.0



# ==============================================================================
# 6. Environmental Covariates Configuration (Mandatory, Non-Optional)
# ==============================================================================
@dataclass(frozen=True)
class EnvironmentalCovariatesConfig:
    # Tide gauge stations for Gosaba / Sundarbans estuary
    primary_tide_station: str = "Canning (South 24 Parganas)"
    secondary_tide_station: str = "Sagar Island / Diamond Harbour"
    tidal_regime: str = "Semi-diurnal macro-tidal"
    
    # Tidal stage categories to cross-reference with SAR acquisition timestamp
    tidal_stages: Tuple[str, ...] = (
        "Low Tide (Exposed mudflats / pneumatophores)",
        "Ebb Tide (Receding water)",
        "Flood Tide (Advancing water)",
        "High Tide (Submerged forest floor - high double-bounce risk)",
    )
    
    # Precipitation / Monsoon Covariates
    precipitation_sources: Tuple[str, ...] = (
        "India Meteorological Department (IMD) Alipore/Canning AWS",
        "ERA5 Reanalysis hourly total precipitation",
        "GPM IMERG 30-minute precipitation",
    )
    monsoon_context: str = "August-September coincides with active/receding Southwest Monsoon"


# Global instances
STUDY_AREA = StudyAreaConfig()
DATA_PROVIDERS = DataProviderConfig()
ENVIRONMENT = EnvironmentalCovariatesConfig()
