import React from 'react';
import { Compass, ShieldCheck, AlertTriangle, Layers, Database, Activity, Target } from 'lucide-react';

export default function ResearchOverview({ manifest }) {
  const { study_area, sensor, research_question, acquisitions } = manifest;

  return (
    <div className="space-y-10 animate-fade-in text-editorial-text">
      {/* Editorial Title Article Header */}
      <div className="space-y-3 max-w-4xl border-b border-editorial-divider pb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-editorial-divider bg-editorial-surface text-editorial-accent text-xs font-mono uppercase font-semibold">
          <Compass className="w-3.5 h-3.5" />
          Project Overview & Baseline
        </div>
        <h2 className="text-3xl font-sans font-bold tracking-tight text-editorial-text">
          The Sundarbans Mangrove Observation Problem
        </h2>
        <p className="text-base font-serif italic text-editorial-muted leading-relaxed">
          "{research_question}"
        </p>
      </div>

      {/* Trust & Boundary Guardrail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded border border-editorial-divider bg-editorial-surface space-y-2.5">
          <div className="flex items-center gap-2 text-editorial-accent font-sans font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>01 / Verified Baseline</span>
          </div>
          <p className="text-xs text-editorial-muted leading-relaxed">
            Cycle 32 reference baseline GeoTIFF, EPSG:32645 affine geometry, 20m grid alignment across Cycles 29–32 audited from native HDF5 coordinate arrays.
          </p>
        </div>

        <div className="p-5 rounded border border-editorial-divider bg-editorial-surface space-y-2.5">
          <div className="flex items-center gap-2 text-editorial-earth font-sans font-semibold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>02 / Provisional Differentials</span>
          </div>
          <p className="text-xs text-editorial-muted leading-relaxed">
            Cycle 29 vs 30 decibel shifts represent dielectric & tidal effects over 12 days; not attributable to canopy loss without in-situ water gauges.
          </p>
        </div>

        <div className="p-5 rounded border border-editorial-divider bg-editorial-surface space-y-2.5">
          <div className="flex items-center gap-2 text-editorial-text font-sans font-semibold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>03 / Zero Synthetic Claims</span>
          </div>
          <p className="text-xs text-editorial-muted leading-relaxed">
            No black-box machine learning, uncalibrated degradation percentages, or fabricated tidal elevations are presented.
          </p>
        </div>
      </div>

      {/* Geospatial Study Window & Instrument Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Window Geometry */}
        <div className="p-5 rounded border border-editorial-divider bg-editorial-surface space-y-4">
          <div className="flex items-center justify-between border-b border-editorial-divider pb-2.5">
            <h3 className="font-sans font-semibold text-editorial-text text-sm uppercase tracking-wider">
              Gosaba Study Window (EPSG:32645)
            </h3>
            <span className="text-xs font-mono text-editorial-muted">WGS 84 / UTM 45N</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted block text-[10px]">LATITUDE SPAN</span>
              <span className="font-semibold text-editorial-text">21.8000°N — 22.1000°N</span>
            </div>
            <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted block text-[10px]">LONGITUDE SPAN</span>
              <span className="font-semibold text-editorial-text">88.7000°E — 89.0000°E</span>
            </div>
            <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted block text-[10px]">UTM 45N EASTING</span>
              <span className="font-semibold text-editorial-text">675,380m — 706,760m</span>
            </div>
            <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted block text-[10px]">UTM 45N NORTHING</span>
              <span className="font-semibold text-editorial-text">2,411,660m — 2,445,260m</span>
            </div>
          </div>

          <div className="p-3 rounded bg-editorial-bg border border-editorial-divider text-xs text-editorial-muted space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Grid Matrix Dimensions:</span>
              <span className="text-editorial-text font-semibold">1,680 rows × 1,569 columns</span>
            </div>
            <div className="flex justify-between">
              <span>Total Valid Pixels:</span>
              <span className="text-editorial-text font-semibold">2,635,920 pixels</span>
            </div>
            <div className="flex justify-between">
              <span>Ground Sample Spacing:</span>
              <span className="text-editorial-text font-semibold">20.0 m × 20.0 m</span>
            </div>
            <div className="flex justify-between">
              <span>Pixel-Centre Phase:</span>
              <span className="text-editorial-accent font-semibold">10.0m mod 20.0m (Invariant)</span>
            </div>
          </div>
        </div>

        {/* Spaceborne Sensor Parameters */}
        <div className="p-5 rounded border border-editorial-divider bg-editorial-surface space-y-4">
          <div className="flex items-center justify-between border-b border-editorial-divider pb-2.5">
            <h3 className="font-sans font-semibold text-editorial-text text-sm uppercase tracking-wider">
              NISAR Frequency A Parameters
            </h3>
            <span className="text-xs font-mono text-editorial-accent font-semibold">L-Band (1.25 GHz)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted">Wavelength:</span>
              <span className="font-mono font-medium text-editorial-text">~24.0 cm (High canopy penetration)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted">Orbit Configuration:</span>
              <span className="font-mono font-medium text-editorial-text">Track 019 Descending, Frame 077</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted">Radiometric Product:</span>
              <span className="font-mono font-medium text-editorial-text">L2 Geocoded Covariance (GCOV γ⁰)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted">Equivalent Number of Looks:</span>
              <span className="font-mono font-medium text-editorial-text">Mean 9.88 (Range 6.0 – 13.5)</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-editorial-bg border border-editorial-divider">
              <span className="text-editorial-muted">Speckle Uncertainty:</span>
              <span className="font-mono font-medium text-editorial-text">±1.37 dB (for 10 nominal looks)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
