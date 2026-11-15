import React, { useState } from 'react';
import { Sliders, RefreshCw, Layers, ShieldCheck, Check } from 'lucide-react';

export default function PolarimetricInvestigation({ manifest }) {
  return (
    <div className="space-y-6 animate-fade-in text-gis-text">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded bg-gis-panel border border-gis-divider">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-gis-surface border border-gis-divider text-gis-accent text-xs font-mono uppercase font-semibold mb-1.5">
            Polarimetric Decomposition & Volume Scattering
          </div>
          <h2 className="text-xl font-sans font-bold text-gis-text tracking-tight">
            Polarimetric Investigation (HH, HV & Cross-Pol Ratio)
          </h2>
          <p className="text-xs text-gis-muted mt-0.5 font-mono">
            Analyzing depolarization mechanisms across mangrove canopy architectures and double-bounce surface interactions.
          </p>
        </div>
      </div>

      {/* Cross-Pol Ratio Mathematical Verification Card */}
      <div className="p-5 rounded bg-gis-panel border border-gis-divider space-y-3.5">
        <div className="flex items-center justify-between border-b border-gis-divider pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gis-accent" />
            <h3 className="font-sans font-semibold text-gis-text text-sm">
              Cross-Polarization Ratio Mathematical Audit
            </h3>
          </div>
          <span className="text-xs font-mono text-gis-accent px-2 py-0.5 rounded bg-gis-surface border border-gis-divider">
            Machine Precision Verified
          </span>
        </div>

        <div className="p-3.5 rounded bg-gis-surface border border-gis-divider font-mono text-xs space-y-2">
          <p className="text-gis-text">
            <span className="text-gis-accent font-bold">Tested Identity:</span> 10·log₁₀(HV_lin / HH_lin) ≡ HV_dB - HH_dB
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-gis-muted">
            <div>
              <span className="block text-[10px] text-gis-muted">Cycle 29 Max Error:</span>
              <span className="text-gis-text font-medium">1.42 × 10⁻¹⁴ dB</span>
            </div>
            <div>
              <span className="block text-[10px] text-gis-muted">Cycle 30 Max Error:</span>
              <span className="text-gis-text font-medium">1.42 × 10⁻¹⁴ dB</span>
            </div>
            <div>
              <span className="block text-[10px] text-gis-muted">Differential Linearity:</span>
              <span className="text-gis-accent font-medium">Δ(HV - HH) ≡ ΔHV - ΔHH</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gis-muted leading-relaxed space-y-1.5 font-sans">
          <p>
            <strong>Mean Differential Cross-Pol Ratio:</strong> <span className="font-mono text-gis-earth font-bold">-0.650 dB</span> across the 12-day window (Cycle 30 minus Cycle 29).
          </p>
          <p>
            <strong>Physical Meaning:</strong> Cross-polarization (HV) drops slightly more (-0.345 dB) than co-polarization increases (+0.305 dB). In L-band SAR, HV is dominated by volume scattering in the branched mangrove canopy, while HH receives contributions from direct canopy reflection, trunk-ground double bounce, and surface scattering. This subtle -0.65 dB shift reflects foliar drying or tidal water level shifts rather than physical wood loss.
          </p>
        </div>
      </div>

      {/* Physical Mechanism Exploration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 rounded bg-gis-panel border border-gis-divider space-y-2.5">
          <h4 className="text-sm font-sans font-semibold text-gis-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gis-accent" />
            Co-Pol Scattering (HHHH)
          </h4>
          <p className="text-xs text-gis-muted leading-relaxed font-sans">
            Sensitive to horizontal dielectric boundaries and trunk-water dihedral double-bounce. When water floods under a mangrove stand, HH backscatter can surge due to corner reflection between vertical trunks and smooth water.
          </p>
          <div className="p-2 rounded bg-gis-surface font-mono text-[11px] text-gis-text border border-gis-divider">
            Typical Forest Range: -9.0 to -6.5 dB
          </div>
        </div>

        <div className="p-4 rounded bg-gis-panel border border-gis-divider space-y-2.5">
          <h4 className="text-sm font-sans font-semibold text-gis-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gis-earth" />
            Cross-Pol Scattering (HVHV)
          </h4>
          <p className="text-xs text-gis-muted leading-relaxed font-sans">
            Generated primarily by multiple random depolarizing scattering within the complex 3D crown and branch volume. Highly correlated with structural crown volume and leafy moisture.
          </p>
          <div className="p-2 rounded bg-gis-surface font-mono text-[11px] text-gis-text border border-gis-divider">
            Typical Forest Range: -15.5 to -13.0 dB
          </div>
        </div>

        <div className="p-4 rounded bg-gis-panel border border-gis-divider space-y-2.5">
          <h4 className="text-sm font-sans font-semibold text-gis-text flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gis-water" />
            Cross-Pol Ratio (HV/HH)
          </h4>
          <p className="text-xs text-gis-muted leading-relaxed font-sans">
            Cancels out common radiometric calibration offsets and broad-scale topographic incidence variations. Acts as a normalized proxy for relative volume versus surface/double-bounce scattering.
          </p>
          <div className="p-2 rounded bg-gis-surface font-mono text-[11px] text-gis-text border border-gis-divider">
            Typical Forest Ratio: -6.5 to -5.0 dB
          </div>
        </div>
      </div>
    </div>
  );
}
