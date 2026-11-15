import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Waves, Satellite, Calendar, MapPin, Eye } from 'lucide-react';

export default function CinematicOpening({ onEnter, manifest }) {
  const [activeCycle, setActiveCycle] = useState(32);

  const acquisitions = [
    {
      cycle: 29,
      date: '26 AUG 2026',
      time: '18:13 IST (12:43 UTC)',
      type: 'PREDICTED ORBIT (P05023)',
      desc: 'Late monsoon wetness baseline. Elevated soil/canopy dielectric moisture.'
    },
    {
      cycle: 30,
      date: '07 SEP 2026',
      time: '18:13 IST (12:43 UTC)',
      type: '12-DAY ORBITAL REPEAT',
      desc: 'Exact geometric repeat. Astronomical tidal phase shifted by ~9.6 hours.'
    },
    {
      cycle: 31,
      date: '19 SEP 2026',
      time: '18:13 IST (12:43 UTC)',
      type: '24-DAY TRANSITION',
      desc: 'Post-monsoon drainage transition. Geometrically aligned coordinate grid.'
    },
    {
      cycle: 32,
      date: '01 OCT 2026',
      time: '18:13 IST (12:43 UTC)',
      type: 'VERIFIED REFERENCE BASELINE',
      desc: 'Audited reference GeoTIFF. EPSG:32645, 1680x1569 grid, 9.88 nominal looks.'
    }
  ];

  return (
    <div className="min-h-screen w-screen bg-editorial-bg text-editorial-text flex flex-col justify-between selection:bg-editorial-accent selection:text-editorial-bg">
      {/* Top Editorial Journal Header */}
      <header className="px-8 lg:px-16 pt-8 pb-6 border-b border-editorial-divider flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-editorial-accent" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-editorial-muted font-medium">
            NASA Space Apps 2026 • Earth Observation Research Report
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-editorial-muted">
          <span>NISAR Track 019 / Frame 077</span>
          <span className="hidden md:inline">•</span>
          <span className="px-2 py-0.5 rounded border border-editorial-divider bg-editorial-surface text-editorial-text font-medium">
            Gosaba, West Bengal, India
          </span>
        </div>
      </header>

      {/* Main Editorial Hero Article */}
      <main className="px-8 lg:px-16 py-12 max-w-6xl mx-auto w-full my-auto space-y-12">
        {/* Title & Core Subtitle */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-editorial-divider bg-editorial-surface text-editorial-accent font-mono text-xs uppercase tracking-wider font-semibold">
            <Satellite className="w-3.5 h-3.5" />
            L-Band (1.25 GHz / 24 cm) Spaceborne Radar Synthesis
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold text-editorial-text tracking-tight leading-[1.05]">
            DANCING WITH <br />
            <span className="text-editorial-accent">THE SARs</span>
          </h1>

          <p className="text-lg sm:text-xl font-serif text-editorial-muted max-w-3xl leading-relaxed italic pt-1">
            "When NISAR observes a change in radar backscatter over the Sundarbans, can we investigate whether it represents a persistent change in surface or vegetation structure, a temporary hydrological effect, or an uncertain observation?"
          </p>
        </div>

        {/* Real Sundarbans Imagery Hero Frame */}
        <div className="relative rounded-lg overflow-hidden border border-editorial-divider bg-editorial-surface shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Satellite Image (7 cols) */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden bg-gis-bg">
              <img
                src="https://eoimages.gsfc.nasa.gov/images/imagerecords/147000/147667/sundarbans_oli_2020336_lrg.jpg"
                alt="NASA Earth Observatory Sundarbans Mangrove Complex"
                className="w-full h-full object-cover object-center filter saturate-[0.85] contrast-[1.05]"
              />
              <div className="absolute bottom-3 left-3 bg-gis-bg/85 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] font-mono text-gis-text border border-gis-divider">
                NASA Earth Observatory: Landsat OLI Natural Color • Sundarbans Mangrove Complex
              </div>
            </div>

            {/* Editorial Context & Methodology Notes (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-editorial-earth font-bold block">
                  Geospatial Study Bounds
                </span>
                <h3 className="text-xl font-heading font-semibold text-editorial-text">
                  Gosaba Mangrove Complex Window
                </h3>
                <p className="text-xs text-editorial-muted leading-relaxed">
                  Located between 21.80°N–22.10°N and 88.70°E–89.00°E (EPSG:32645), this 1,054 km² study window encompasses the active deltaic junction of the Raimangal and Bidya tidal river estuaries.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
                    <span className="text-editorial-muted block text-[10px]">GRID RESOLUTION</span>
                    <span className="font-semibold text-editorial-text">20m × 20m</span>
                  </div>
                  <div className="p-2.5 rounded bg-editorial-bg border border-editorial-divider">
                    <span className="text-editorial-muted block text-[10px]">TOTAL PIXELS</span>
                    <span className="font-semibold text-editorial-text">2,635,920 px</span>
                  </div>
                </div>
              </div>

              {/* Enter Investigation Action Button */}
              <button
                onClick={onEnter}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded bg-editorial-accent text-editorial-bg font-heading font-bold text-sm tracking-wider uppercase shadow-md hover:bg-[#527261] transition-colors cursor-pointer"
              >
                <span>Enter The Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4-Acquisition Sequence Ribbon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-editorial-muted uppercase tracking-wider">
            <span>Verified 12-Day Orbital Repeat Timeline (Track 019 Descending):</span>
            <span className="text-editorial-text font-bold">4 Cycles Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {acquisitions.map((acq) => {
              const isSelected = activeCycle === acq.cycle;
              return (
                <div
                  key={acq.cycle}
                  onClick={() => setActiveCycle(acq.cycle)}
                  className={`p-4 rounded border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-editorial-surface border-editorial-accent shadow-sm translate-y-[-2px]'
                      : 'bg-editorial-bg border-editorial-divider hover:border-editorial-muted'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={`font-bold ${isSelected ? 'text-editorial-accent' : 'text-editorial-muted'}`}>
                      CYCLE {acq.cycle}
                    </span>
                    <span className="text-editorial-muted">{acq.time.split(' ')[0]}</span>
                  </div>
                  <p className="text-base font-heading font-semibold text-editorial-text">{acq.date}</p>
                  <span className="text-[10px] font-mono text-editorial-earth font-medium block mt-1">
                    {acq.type}
                  </span>
                  <p className="text-xs text-editorial-muted mt-2 leading-relaxed">
                    {acq.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Editorial Journal Colophon / Footer */}
      <footer className="px-8 lg:px-16 py-6 border-t border-editorial-divider bg-editorial-surface text-xs font-mono text-editorial-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span>DANCING WITH THE SARs • NASA Space Apps Challenge 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <span>CRS: EPSG:32645 (WGS 84 / UTM 45N)</span>
          <span>Radiometric Datum: Gamma Nought (γ⁰)</span>
          <span className="text-editorial-accent font-semibold">Verified Baseline Active</span>
        </div>
      </footer>
    </div>
  );
}
