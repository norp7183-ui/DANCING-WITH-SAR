import React, { useState } from 'react';
import { Calendar, ArrowRight, AlertTriangle, TrendingDown, TrendingUp, Sliders, Layers } from 'lucide-react';

export default function TemporalChangeObservatory({ manifest }) {
  const [activePolarization, setActivePolarization] = useState('HHHH');

  const { verified_statistics } = manifest;

  const thresholdData = {
    HHHH: [
      { label: 'Stable (|Δ| ≤ 1.0 dB)', count: '1,026,954', pct: 38.96, color: 'bg-gis-accent', note: 'Speckle-invariant core forest & interior mudflats' },
      { label: 'Moderate (1.0 < |Δ| ≤ 3.0 dB)', count: '1,199,081', pct: 45.49, color: 'bg-gis-earth', note: 'Subtle tidal inundation and foliar moisture fluctuations' },
      { label: 'Significant (3.0 < |Δ| ≤ 5.0 dB)', count: '270,709', pct: 10.27, color: 'bg-gis-warning', note: 'Tidal creek bank boundary movement' },
      { label: 'Pronounced (|Δ| > 5.0 dB)', count: '139,176', pct: 5.28, color: 'bg-[#8F3B3B]', note: 'Specular water appearance, aquaculture pond flooding, or vessels' }
    ],
    HVHV: [
      { label: 'Stable (|Δ| ≤ 1.0 dB)', count: '1,083,363', pct: 41.10, color: 'bg-gis-accent', note: 'Depolarizing volume scattering stability' },
      { label: 'Moderate (1.0 < |Δ| ≤ 3.0 dB)', count: '1,180,892', pct: 44.80, color: 'bg-gis-earth', note: 'Canopy wetness and multi-path dielectric response' },
      { label: 'Significant (3.0 < |Δ| ≤ 5.0 dB)', count: '250,413', pct: 9.50, color: 'bg-gis-warning', note: 'Tidal margin structural exposure' },
      { label: 'Pronounced (|Δ| > 5.0 dB)', count: '121,252', pct: 4.60, color: 'bg-[#8F3B3B]', note: 'Localized water/land state changes' }
    ]
  };

  const currentBins = thresholdData[activePolarization];

  return (
    <div className="space-y-6 animate-fade-in text-gis-text">
      {/* Precision Header with Provisional Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded bg-gis-panel border border-gis-divider">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-gis-surface border border-gis-warning/40 text-gis-warning text-xs font-mono uppercase font-semibold mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            PROVISIONAL RECONCILIATION — HYDROLOGICALLY CONFOUNDED
          </div>
          <h2 className="text-xl font-sans font-bold text-gis-text tracking-tight">
            Temporal Change Observatory (Cycle 29 vs Cycle 30)
          </h2>
          <p className="text-xs text-gis-muted mt-0.5 font-mono">
            12-day orbital repeat differential analysis (2026-08-26 to 2026-09-07). Backscatter changes reflect tidal phase offsets and dielectric shifts.
          </p>
        </div>

        {/* Pol Toggle */}
        <div className="flex items-center rounded bg-gis-surface border border-gis-divider p-0.5 self-start md:self-auto font-mono text-xs">
          {['HHHH', 'HVHV'].map((p) => (
            <button
              key={p}
              onClick={() => setActivePolarization(p)}
              className={`px-3 py-1 rounded transition-colors ${
                activePolarization === p
                  ? 'bg-gis-accent text-gis-bg font-bold'
                  : 'text-gis-muted hover:text-gis-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Scientific Caution Banner */}
      <div className="p-4 rounded bg-gis-panel border-l-4 border-gis-earth text-xs text-gis-text space-y-1">
        <p className="font-semibold text-gis-earth uppercase font-mono tracking-wide text-[11px]">
          Scientific Ground Rule:
        </p>
        <p className="leading-relaxed text-gis-muted">
          In a tidal mangrove delta, short-term backscatter decreases (-3 dB to -8 dB) are frequently caused by water submersing the pneumatophore/soil layer and introducing forward specular reflection. It must <strong>NEVER</strong> be interpreted as deforestation, logging, or canopy degradation without multi-cycle baseline persistence and ground-truth validation.
        </p>
      </div>

      {/* Change Threshold Distribution */}
      <div className="p-5 rounded bg-gis-panel border border-gis-divider space-y-5">
        <div className="flex items-center justify-between border-b border-gis-divider pb-2.5">
          <h3 className="font-sans font-semibold text-gis-text text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-gis-accent" />
            Mutually Exclusive Differential Magnitude Classes ({activePolarization})
          </h3>
          <span className="text-xs font-mono text-gis-muted">
            Total Analyzed: 2,635,920 Valid Pixels (100.00%)
          </span>
        </div>

        {/* Stacked Percentage Visualizer */}
        <div className="space-y-1.5">
          <div className="h-5 w-full rounded bg-gis-surface overflow-hidden flex border border-gis-divider">
            {currentBins.map((bin, idx) => (
              <div
                key={idx}
                style={{ width: `${bin.pct}%` }}
                className={`${bin.color} opacity-90 hover:opacity-100 transition-opacity relative group cursor-pointer`}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-0.5 bg-gis-bg border border-gis-divider text-[10px] font-mono text-gis-text rounded whitespace-nowrap z-20 shadow-xl">
                  {bin.label}: {bin.pct.toFixed(2)}% ({bin.count} px)
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-gis-muted px-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Class Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentBins.map((bin, i) => (
            <div
              key={i}
              className="p-3.5 rounded bg-gis-surface border border-gis-divider space-y-1.5 hover:border-gis-accent transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gis-text font-sans">{bin.label}</span>
                <span className="text-xs font-mono font-bold text-gis-accent">{bin.pct.toFixed(1)}%</span>
              </div>
              <p className="text-sm font-mono font-bold text-gis-text">{bin.count} px</p>
              <p className="text-[11px] text-gis-muted leading-normal border-t border-gis-divider pt-1.5">
                {bin.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Discrete Extreme Pixel Audit */}
      <div className="p-5 rounded bg-gis-panel border border-gis-divider space-y-3">
        <div className="flex items-center justify-between border-b border-gis-divider pb-2.5">
          <div>
            <h3 className="font-sans font-semibold text-gis-text text-sm">
              Discrete Extreme Pixel Investigation (0.003% Population)
            </h3>
            <p className="text-xs text-gis-muted mt-0.5 font-mono">
              Top positive (&gt; +25 dB) and negative (&lt; -25 dB) outliers investigated for spatial clustering.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gis-surface text-gis-text border border-gis-divider">
            80 Records Audited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded bg-gis-surface border border-gis-divider space-y-1.5">
            <span className="text-gis-accent font-bold block flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Pronounced Positive Shifts (Δγ⁰ up to +41.5 dB)
            </span>
            <p className="text-gis-muted leading-relaxed font-sans text-xs">
              <strong>Dominant Location:</strong> River channels (Raimangal, Gosaba, Bidya) and creek mouths.<br />
              <strong>Hypothesis:</strong> Transient steel/fiberglass motor vessels and mechanized country boats traversing waterways during pass time (point corner reflectors), or localized low-tide exposed mudbank emergence.
            </p>
          </div>

          <div className="p-3.5 rounded bg-gis-surface border border-gis-divider space-y-1.5">
            <span className="text-gis-earth font-bold block flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              Pronounced Negative Shifts (Δγ⁰ down to -29.3 dB)
            </span>
            <p className="text-gis-muted leading-relaxed font-sans text-xs">
              <strong>Dominant Location:</strong> Intertidal mudflat borders and aquaculture (gher) ponds.<br />
              <strong>Hypothesis:</strong> Shift from exposed high-dielectric saturated mud to smooth specular open water inundation. Radar energy is scattered away from the sensor into the forward direction, collapsing backscatter below -25 dB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
