export const APPLICATION_MANIFEST = {
  project: "DANCING WITH THE SARs",
  subtitle: "Evidence-First Multi-Temporal SAR Interpretation for the Sundarbans Delta",
  research_question: "When NISAR observes a change in radar backscatter over the Sundarbans, can we investigate whether it represents a persistent change in surface or vegetation structure, a temporary hydrological effect, or an uncertain observation?",
  study_area: {
    name: "Gosaba Community Development Block",
    location: "Sundarbans Delta, West Bengal, India",
    geographic_bounds: {
      min_lon: 88.7000,
      max_lon: 89.0000,
      min_lat: 21.8000,
      max_lat: 22.1000,
      center: [21.9500, 88.8500]
    },
    projected_bounds: {
      crs: "EPSG:32645",
      utm_zone: "45N",
      left: 675380.0,
      right: 706760.0,
      bottom: 2411660.0,
      top: 2445260.0,
      pixel_spacing_m: 20.0,
      dimensions: { rows: 1680, cols: 1569 },
      total_pixels: 2635920
    }
  },
  sensor: {
    mission: "NASA-ISRO Synthetic Aperture Radar (NISAR)",
    frequency: "Frequency A (L-band, 1.25 GHz / ~24 cm wavelength)",
    mode: "Mode 2005 (Quad-Pol Primary, Dual-Pol Sideband)",
    orbit: "Track 019 Descending, Frame 077",
    product: "L2 Geocoded Covariance (GCOV)",
    radiometric_quantity: "Gamma Nought (γ⁰, ellipsoid terrain-flattened)",
    nominal_looks: { mean: 9.88, std: 1.05, min: 6.0, max: 13.5 }
  },
  acquisitions: [
    {
      cycle: 29,
      date: "2026-08-26",
      time_utc: "12:43:14",
      time_ist: "18:13:14",
      orbit_type: "PREDICTED (P05023)",
      status: "VERIFIED_GEOMETRY",
      notes: "Monsoon late-season acquisition; high antecedent soil wetness."
    },
    {
      cycle: 30,
      date: "2026-09-07",
      time_utc: "12:43:16",
      time_ist: "18:13:16",
      orbit_type: "PREDICTED (P05023)",
      status: "VERIFIED_GEOMETRY",
      notes: "12-day orbital repeat. Estimated astronomical tidal phase shift ~9.6 hours."
    },
    {
      cycle: 31,
      date: "2026-09-19",
      time_utc: "12:43:17",
      time_ist: "18:13:17",
      orbit_type: "PREDICTED (P05023)",
      status: "VERIFIED_GEOMETRY",
      notes: "24-day repeat interval; autumnal transition."
    },
    {
      cycle: 32,
      date: "2026-10-01",
      time_utc: "12:43:18",
      time_ist: "18:13:18",
      orbit_type: "PREDICTED (P05023)",
      status: "VERIFIED_REFERENCE",
      notes: "Post-monsoon reference acquisition. Fully audited HDF5 and GeoTIFF reference."
    }
  ],
  verified_statistics: {
    cycle_29: {
      hhhh: { mean_linear: 0.1577, median_linear: 0.1478, p95_linear: 0.3819, mean_db: -8.513 },
      hvhv: { mean_linear: 0.0409, median_linear: 0.0407, p95_linear: 0.0891, mean_db: -14.445 }
    },
    cycle_30: {
      hhhh: { mean_linear: 0.1641, median_linear: 0.1568, p95_linear: 0.3951, mean_db: -8.208 },
      hvhv: { mean_linear: 0.0379, median_linear: 0.0382, p95_linear: 0.0845, mean_db: -14.790 }
    },
    differential: {
      delta_hhhh_mean_db: +0.305,
      delta_hvhv_mean_db: -0.345,
      delta_crosspol_ratio_mean_db: -0.650,
      stable_core_pct: { hhhh: 38.96, hvhv: 41.10 },
      status: "PROVISIONAL",
      caveat: "Differential changes reflect dielectric and tidal shifts over 12 days, not structural vegetation loss."
    }
  }
};
