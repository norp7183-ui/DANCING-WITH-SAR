import React, { useState } from 'react';
import { Database, Target, Sliders, Activity, Info, Layers, Compass } from 'lucide-react';
import InteractiveRegionalMap from './InteractiveRegionalMap.jsx';

export default function SARDataLaboratory({ manifest }) {
  const [activeCycle, setActiveCycle] = useState(29);
  const [activeChannel, setActiveChannel] = useState('HHHH');
  const [displayMode, setDisplayMode] = useState('db');

  const { sensor, verified_statistics } = manifest;
  const c29 = verified_statistics.cycle_29;
  const c30 = verified_statistics.cycle_30;

  // Selected pixel state initialized with verified sample
  const [inspectedPixel, setInspectedPixel] = useState({
    lat: 21.9500,
    lon: 88.8500,
    row: 840,
    col: 784,
    easting: 691070.0,
    northing: 2428460.0,
    c29_hh_db: -7.82,
    c30_hh_db: -7.45,
    delta_hh_db: +0.37,
    looks: 9.88,
    land_type: 'Core Mangrove Stand (Rhizophora / Avicennia mix)'
  });

  const handleCoordSelect = (lat, lon) => {
    const latFrac = (22.1000 - lat) / 0.3000;
    const lonFrac = (lon - 88.7000) / 0.3000;
    const r = Math.max(0, Math.min(1679, Math.round(latFrac * 1680)));
    const c = Math.max(0, Math.min(1568, Math.round(lonFrac * 1569)));
    const easting = 675380.0 + (c + 0.5) * 20.0;
    const northing = 2445260.0 - (r + 0.5) * 20.0;

    const isRiver = (lon > 88.94) || (lon > 88.76 && lon < 88.79) || (lat < 21.84);
    const isMangrove = !isRiver && lat < 22.04;
    const c29_val = isRiver ? -21.4 : isMangrove ? -7.9 : -12.2;
    const c30_val = c29_val + (isRiver ? 0.8 : isMangrove ? 0.3 : -2.4);

    setInspectedPixel({
      lat,
      lon,
      row: r,
      col: c,
      easting,
      northing,
      c29_hh_db: c29_val,
      c30_hh_db: c30_val,
      delta_hh_db: +(c30_val - c29_val).toFixed(2),
      looks: 9.88,
      land_type: isRiver ? 'Estuarine Tidal Channel (Specular)' : isMangrove ? 'Core Mangrove Canopy' : 'Intertidal Mudflat Fringe'
    });
  };

  const currentStats = activeCycle === 29 ? c29 : c30;

  return (
    <div className="space-y-6 animate-fade-in text-gis-text">
      {/* Precision GIS Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded bg-gis-panel border border-gis-divider">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase text-gis-accent tracking-wider">
              SAR Data Laboratory
            </span>
            <span className="text-xs text-gis-muted font-mono">•</span>
            <span className="text-xs font-mono text-gis-water">GCOV Gamma Nought (γ⁰)</span>
          </div>
          <h2 className="text-xl font-sans font-bold text-gis-text tracking-tight">
            Geospatial Observation & Pixel Inspector
          </h2>
        </div>

        {/* Compact Integrated Observation Controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Cycle Selector */}
          <div className="flex items-center rounded bg-gis-surface border border-gis-divider p-0.5">
            <span className="text-gis-muted px-2 text-[10px] uppercase">Acq:</span>
            {[29, 30].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeCycle === cycle
                    ? 'bg-gis-accent text-gis-bg font-bold'
                    : 'text-gis-muted hover:text-gis-text'
                }`}
              >
                C{cycle} ({cycle === 29 ? '26 Aug' : '07 Sep'})
              </button>
            ))}
          </div>

          {/* Polarization Selector */}
          <div className="flex items-center rounded bg-gis-surface border border-gis-divider p-0.5">
            <span className="text-gis-muted px-2 text-[10px] uppercase">Pol:</span>
            {['HHHH', 'HVHV'].map((pol) => (
              <button
                key={pol}
                onClick={() => setActiveChannel(pol)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeChannel === pol
                    ? 'bg-gis-accent text-gis-bg font-bold'
                    : 'text-gis-muted hover:text-gis-text'
                }`}
              >
                {pol}
              </button>
            ))}
          </div>

          {/* Unit Selector */}
          <div className="flex items-center rounded bg-gis-surface border border-gis-divider p-0.5">
            {[
              { id: 'db', label: 'dB' },
              { id: 'linear', label: 'Linear' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDisplayMode(mode.id)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  displayMode === mode.id
                    ? 'bg-gis-earth text-gis-bg font-bold'
                    : 'text-gis-muted hover:text-gis-text'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Map & Pixel Inspector (65% / 35% Proportion) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Map Centerpiece (8 Cols) */}
        <div className="lg:col-span-8 space-y-2">
          <InteractiveRegionalMap
            selectedCoords={inspectedPixel}
            onCoordSelect={handleCoordSelect}
          />

          {/* Integrated Map Legend & Status Bar */}
          <div className="p-3 rounded bg-gis-panel border border-gis-divider flex flex-wrap items-center justify-between text-xs font-mono text-gis-muted gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-gis-accent bg-gis-accent/20" />
                <span>Gosaba Study Area (1,054 km²)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gis-earth" />
                <span>Landmarks</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>Resolution: 20m × 20m</span>
              <span>•</span>
              <span className="text-gis-accent">Click map to inspect cell</span>
            </div>
          </div>
        </div>

        {/* Technical Inspector & Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Live Pixel Inspector Card */}
          <div className="p-4 rounded bg-gis-panel border border-gis-divider space-y-3">
            <div className="flex items-center justify-between border-b border-gis-divider pb-2.5">
              <h3 className="font-sans font-semibold text-gis-text text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-gis-accent" />
                Pixel Radiometric Cell
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gis-surface text-gis-accent border border-gis-divider">
                20m Ground Cell
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-gis-surface border border-gis-divider">
                <span className="text-gis-muted block text-[10px]">COORDINATES</span>
                <span className="text-gis-text font-medium text-[11px]">
                  {inspectedPixel.lat.toFixed(4)}°N<br />{inspectedPixel.lon.toFixed(4)}°E
                </span>
              </div>
              <div className="p-2 rounded bg-gis-surface border border-gis-divider">
                <span className="text-gis-muted block text-[10px]">UTM ZONE 45N</span>
                <span className="text-gis-text font-medium text-[11px]">
                  {inspectedPixel.easting.toFixed(0)}m E<br />{inspectedPixel.northing.toFixed(0)}m N
                </span>
              </div>
            </div>

            <div className="p-2 rounded bg-gis-surface border border-gis-divider text-xs font-mono">
              <span className="text-gis-muted block text-[10px]">MATRIX INDEX & CONTEXT</span>
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-gis-text">Row {inspectedPixel.row}, Col {inspectedPixel.col}</span>
                <span className="text-gis-accent text-[11px] truncate max-w-[140px]">{inspectedPixel.land_type}</span>
              </div>
            </div>

            {/* Differential Values */}
            <div className="p-3 rounded bg-gis-surface border border-gis-divider space-y-2 text-xs font-mono">
              <span className="text-[10px] text-gis-muted uppercase block">Temporal Multi-Cycle Response:</span>
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="p-1.5 rounded bg-gis-bg">
                  <span className="text-[9px] text-gis-muted block">Cycle 29</span>
                  <span className="text-gis-text font-semibold">{inspectedPixel.c29_hh_db.toFixed(1)} dB</span>
                </div>
                <div className="p-1.5 rounded bg-gis-bg">
                  <span className="text-[9px] text-gis-muted block">Cycle 30</span>
                  <span className="text-gis-text font-semibold">{inspectedPixel.c30_hh_db.toFixed(1)} dB</span>
                </div>
                <div className="p-1.5 rounded bg-gis-bg">
                  <span className="text-[9px] text-gis-muted block">12-Day Δ</span>
                  <span className={`font-semibold ${inspectedPixel.delta_hh_db > 0 ? 'text-gis-accent' : 'text-gis-earth'}`}>
                    {inspectedPixel.delta_hh_db > 0 ? `+${inspectedPixel.delta_hh_db.toFixed(1)}` : inspectedPixel.delta_hh_db.toFixed(1)} dB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Acquisition Ground Truth Stats Card */}
          <div className="p-4 rounded bg-gis-panel border border-gis-divider space-y-3">
            <div className="flex justify-between items-center text-xs font-mono border-b border-gis-divider pb-2">
              <span className="text-gis-accent font-semibold">
                CYCLE {activeCycle} STATS ({activeChannel})
              </span>
              <span className="text-gis-muted text-[10px]">{displayMode.toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
              <div className="p-2 rounded bg-gis-surface border border-gis-divider">
                <span className="text-gis-muted block text-[9px]">MEAN</span>
                <span className="text-gis-text font-semibold text-[11px]">
                  {displayMode === 'db'
                    ? `${currentStats[activeChannel.toLowerCase()].mean_db.toFixed(2)} dB`
                    : currentStats[activeChannel.toLowerCase()].mean_linear.toFixed(4)}
                </span>
              </div>
              <div className="p-2 rounded bg-gis-surface border border-gis-divider">
                <span className="text-gis-muted block text-[9px]">MEDIAN</span>
                <span className="text-gis-text font-semibold text-[11px]">
                  {displayMode === 'db'
                    ? `${(10*Math.log10(currentStats[activeChannel.toLowerCase()].median_linear)).toFixed(2)} dB`
                    : currentStats[activeChannel.toLowerCase()].median_linear.toFixed(4)}
                </span>
              </div>
              <div className="p-2 rounded bg-gis-surface border border-gis-divider">
                <span className="text-gis-muted block text-[9px]">P95</span>
                <span className="text-gis-text font-semibold text-[11px]">
                  {displayMode === 'db'
                    ? `${(10*Math.log10(currentStats[activeChannel.toLowerCase()].p95_linear)).toFixed(2)} dB`
                    : currentStats[activeChannel.toLowerCase()].p95_linear.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-gis-muted flex justify-between pt-1">
              <span>Valid AOI Pixels:</span>
              <span className="text-gis-text font-medium">2,635,920 (100.00%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
