import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

export default function EvidenceStudio({ manifest }) {
  const [selectedCase, setSelectedCase] = useState(0);

  const testCases = [
    {
      title: "Pronounced Decrease (Δγ⁰ < -6.0 dB) along River Margin",
      observation: "A 200m buffer zone along the Raimangal river displays a -7.2 dB decrease in HHHH and -4.1 dB in HVHV between Cycle 29 and Cycle 30 (12-day interval).",
      hypotheses: [
        {
          name: "Hypothesis A: Permanent Mangrove Deforestation",
          plausibility: "LOW / UNLIKELY",
          reasoning: "Mangrove tree removal in a 12-day window would leave fallen debris, high roughness, and subsequent high surface backscatter, rather than specular attenuation.",
          status: "REJECTED_WITHOUT_GROUND_TRUTH"
        },
        {
          name: "Hypothesis B: High-Tide Mudflat/Root Inundation",
          plausibility: "VERY HIGH",
          reasoning: "A ~9.6-hour tidal shift aligns with water submersing exposed mudflats, causing specular reflection away from the SAR antenna and plummeting backscatter.",
          status: "SUPPORTED_BY_PHYSICS"
        },
        {
          name: "Hypothesis C: Temporary Foliar Moisture Loss",
          plausibility: "MODERATE",
          reasoning: "Would primarily reduce HV volume scattering by 1-2 dB, but cannot account for a massive -7.2 dB drop in HHHH.",
          status: "INSUFFICIENT_MAGNITUDE"
        }
      ],
      conclusion: "Evidence strongly points toward tidal water inundation. Classifying this as mangrove forest loss would constitute a false positive error."
    },
    {
      title: "Localized Extreme Spike (Δγ⁰ > +25.0 dB) in Main Waterway",
      observation: "A discrete cluster of 2 pixels inside the Bidya River channel jumps from -24.5 dB in Cycle 29 to +12.3 dB in Cycle 30.",
      hypotheses: [
        {
          name: "Hypothesis A: Mangrove Island Emergence / Colonization",
          plausibility: "IMPOSSIBLE",
          reasoning: "Mangrove colonization requires years of sedimentation and seedling establishment; cannot occur in 12 days.",
          status: "PHYSICALLY_IMPOSSIBLE"
        },
        {
          name: "Hypothesis B: Transient River Vessel / Mechanized Boat",
          plausibility: "VERY HIGH",
          reasoning: "Metallic hull and cabin structures act as resonant dihedral/trihedral corner reflectors, returning intense radar backscatter over a dark water background.",
          status: "STRONGLY_SUPPORTED"
        }
      ],
      conclusion: "Confirmed as transient river traffic. Pixel must be excluded from vegetation and bathymetric trend analysis."
    }
  ];

  const currentCase = testCases[selectedCase];

  return (
    <div className="space-y-8 animate-fade-in text-editorial-text">
      {/* Workspace Header */}
      <div className="border-b border-editorial-divider pb-5 space-y-1.5">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-editorial-divider bg-editorial-surface text-editorial-earth text-xs font-mono uppercase font-semibold">
          Scientific Evidence & Hypothesis Matrix
        </div>
        <h2 className="text-3xl font-sans font-bold tracking-tight text-editorial-text">
          Evidence & Interpretation Studio
        </h2>
        <p className="text-sm text-editorial-muted">
          Systematic hypothesis testing to separate genuine vegetation structural alteration from tidal and surface dielectric artifacts.
        </p>
      </div>

      {/* Case Studies Selector */}
      <div className="flex gap-2.5">
        {testCases.map((tc, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCase(idx)}
            className={`px-4 py-2.5 rounded text-xs font-sans font-semibold border text-left transition-all cursor-pointer ${
              selectedCase === idx
                ? 'bg-editorial-surface border-editorial-accent text-editorial-text shadow-sm'
                : 'bg-editorial-bg border-editorial-divider text-editorial-muted hover:text-editorial-text'
            }`}
          >
            Case {idx + 1}: {tc.title.split(')')[0]})
          </button>
        ))}
      </div>

      {/* Selected Investigation */}
      <div className="p-6 rounded border border-editorial-divider bg-editorial-surface space-y-5">
        <div>
          <span className="text-xs font-mono text-editorial-accent uppercase font-bold">Observation Record:</span>
          <h3 className="text-xl font-sans font-bold text-editorial-text mt-0.5">{currentCase.title}</h3>
          <p className="text-sm text-editorial-text mt-2 bg-editorial-bg p-3.5 rounded border border-editorial-divider font-serif leading-relaxed italic">
            "{currentCase.observation}"
          </p>
        </div>

        {/* Hypotheses Matrix */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-mono text-editorial-muted uppercase tracking-wider font-semibold">
            Evaluated Working Hypotheses:
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {currentCase.hypotheses.map((hyp, i) => (
              <div
                key={i}
                className="p-4 rounded bg-editorial-bg border border-editorial-divider space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-sans font-semibold text-editorial-text">{hyp.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    hyp.plausibility.includes('HIGH')
                      ? 'bg-editorial-accent/20 text-editorial-accent border border-editorial-accent/30'
                      : hyp.plausibility.includes('MODERATE')
                      ? 'bg-editorial-earth/20 text-editorial-earth border border-editorial-earth/30'
                      : 'bg-editorial-warning/15 text-editorial-warning border border-editorial-warning/30'
                  }`}>
                    {hyp.plausibility}
                  </span>
                </div>
                <p className="text-xs text-editorial-muted leading-relaxed font-sans">
                  {hyp.reasoning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Verdict */}
        <div className="p-4 rounded bg-editorial-bg border border-editorial-accent flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-editorial-accent shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-mono uppercase tracking-wider text-editorial-accent font-bold">
              Scientific Verdict & Guardrail:
            </h5>
            <p className="text-xs text-editorial-text mt-0.5 leading-relaxed font-sans">
              {currentCase.conclusion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
