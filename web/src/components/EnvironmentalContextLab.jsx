import React from 'react';
import { Waves, AlertTriangle } from 'lucide-react';

export default function EnvironmentalContextLab({ manifest }) {
  return (
    <div className="space-y-8 animate-fade-in text-editorial-text">
      {/* Workspace Header */}
      <div className="border-b border-editorial-divider pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-editorial-divider bg-editorial-surface text-editorial-earth text-xs font-mono uppercase font-semibold">
          Hydrological & Inundation Context
        </div>
        <h2 className="text-3xl font-sans font-bold tracking-tight text-editorial-text">
          Environmental Context & Estuarine Dynamics
        </h2>
        <p className="text-sm text-editorial-muted">
          Semi-diurnal tidal cycles, estuarine hydrodynamic phase progression, and meteorological precipitation influence.
        </p>
      </div>

      {/* Honest Scientific Framing Banner */}
      <div className="p-5 rounded border border-editorial-divider bg-editorial-surface text-xs text-editorial-text space-y-2.5">
        <div className="flex items-center gap-2 text-editorial-earth font-sans font-semibold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          Astronomical Tidal Progression Model (Pending In-Situ Water Gauge Data)
        </div>
        <p className="leading-relaxed text-editorial-muted">
          The Sundarbans delta experiences a semi-diurnal macro-tidal regime with a cycle period of approximately <strong>12 hours and 25 minutes (12.42 hours)</strong>. Because the satellite repeats its descending pass every <strong>288.0 hours (12 days)</strong>, the observation phase shifts relative to the tidal cycle by approximately:
        </p>
        <p className="font-mono text-editorial-accent bg-editorial-bg p-2.5 rounded border border-editorial-divider text-xs">
          288.0 hours mod 12.42 hours ≈ 9.6 hours phase shift
        </p>
        <p className="text-editorial-muted italic">
          Disclaimer: This is an astronomical harmonic expectation. In-situ tide gauge readings from Sagar Island or Hiron Point have not yet been integrated into this dataset.
        </p>
      </div>

      {/* Tidal Progression Model Visualization */}
      <div className="p-6 rounded border border-editorial-divider bg-editorial-surface space-y-5">
        <div className="flex items-center justify-between border-b border-editorial-divider pb-3">
          <h3 className="font-sans font-semibold text-editorial-text flex items-center gap-2 text-sm uppercase tracking-wider">
            <Waves className="w-4 h-4 text-editorial-accent" />
            12-Day Orbital Repeat vs Semi-Diurnal Tidal Shift
          </h3>
          <span className="text-xs font-mono text-editorial-muted">
            Pass Time: Fixed 18:13 IST (12:43 UTC)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded bg-editorial-bg border border-editorial-divider space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-editorial-accent font-bold">CYCLE 29</span>
              <span className="text-editorial-muted">2026-08-26 18:13 IST</span>
            </div>
            <div className="h-24 rounded bg-editorial-surface p-3 border border-editorial-divider flex items-center justify-center text-center">
              <div>
                <p className="text-xs font-sans font-semibold text-editorial-accent uppercase">Hypothesized Low / Ebb Phase</p>
                <p className="text-xs text-editorial-muted mt-0.5">
                  Exposed intertidal mudflats, moist surface dielectric roughness, high cross-channel contrast.
                </p>
              </div>
            </div>
            <p className="text-xs text-editorial-muted leading-normal">
              Backscatter in intertidal fringes is elevated (-10 to -14 dB HHHH) due to direct surface scattering from wet micro-rough mud and root clusters.
            </p>
          </div>

          <div className="p-5 rounded bg-editorial-bg border border-editorial-divider space-y-2.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-editorial-accent font-bold">CYCLE 30</span>
              <span className="text-editorial-muted">2026-09-07 18:13 IST</span>
            </div>
            <div className="h-24 rounded bg-editorial-surface p-3 border border-editorial-divider flex items-center justify-center text-center">
              <div>
                <p className="text-xs font-sans font-semibold text-editorial-earth uppercase">Hypothesized High / Flood Phase (~9.6h Shift)</p>
                <p className="text-xs text-editorial-muted mt-0.5">
                  Water submerses intertidal mudbanks and mangrove root floor; increased specular reflection.
                </p>
              </div>
            </div>
            <p className="text-xs text-editorial-muted leading-normal">
              Submerged mudflats experience dramatic drop in backscatter (collapsing below -25 dB HHHH) as the flat water surface reflects radar pulses away from the receiver.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
