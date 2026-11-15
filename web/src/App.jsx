import React, { useState } from 'react';
import { 
  Radar, 
  Layers, 
  Calendar, 
  Sliders, 
  Waves, 
  Scale, 
  ShieldCheck, 
  Compass, 
  ArrowLeft,
  ChevronRight,
  Satellite
} from 'lucide-react';

import { APPLICATION_MANIFEST } from './data/manifest.js';
import CinematicOpening from './components/CinematicOpening.jsx';
import ResearchOverview from './components/ResearchOverview.jsx';
import SARDataLaboratory from './components/SARDataLaboratory.jsx';
import TemporalChangeObservatory from './components/TemporalChangeObservatory.jsx';
import PolarimetricInvestigation from './components/PolarimetricInvestigation.jsx';
import EnvironmentalContextLab from './components/EnvironmentalContextLab.jsx';
import EvidenceStudio from './components/EvidenceStudio.jsx';

export default function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: '1. Research Overview', icon: Compass, env: 'editorial', badge: 'Context' },
    { id: 'sar_lab', label: '2. SAR Data Laboratory', icon: Radar, env: 'gis', badge: 'Interactive' },
    { id: 'temporal', label: '3. Temporal Observatory', icon: Calendar, env: 'gis', badge: 'Provisional' },
    { id: 'polarimetry', label: '4. Polarimetric Lab', icon: Sliders, env: 'gis', badge: 'Decomposition' },
    { id: 'environmental', label: '5. Environmental Context', icon: Waves, env: 'editorial', badge: 'Tidal' },
    { id: 'evidence', label: '6. Evidence Studio', icon: Scale, env: 'editorial', badge: 'Synthesis' }
  ];

  if (showOpening) {
    return (
      <CinematicOpening
        onEnter={() => setShowOpening(false)}
        manifest={APPLICATION_MANIFEST}
      />
    );
  }

  const currentItem = navigationItems.find(i => i.id === activeTab);
  const isGisEnvironment = currentItem?.env === 'gis';

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
      isGisEnvironment ? 'bg-gis-bg text-gis-text' : 'bg-editorial-bg text-editorial-text'
    }`}>
      {/* Precision Scientific Sidebar (270px width) */}
      <aside className={`w-[270px] shrink-0 border-r flex flex-col justify-between transition-colors duration-200 ${
        isGisEnvironment
          ? 'bg-gis-panel border-gis-divider text-gis-text'
          : 'bg-editorial-surface border-editorial-divider text-editorial-text'
      }`}>
        <div className="p-5 space-y-6">
          {/* Header & Return to Front Page */}
          <div>
            <button
              onClick={() => setShowOpening(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-mono mb-4 transition-colors ${
                isGisEnvironment ? 'text-gis-muted hover:text-gis-accent' : 'text-editorial-muted hover:text-editorial-accent'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Front Page</span>
            </button>

            <div className="flex items-center gap-2.5">
              <span className={`p-1.5 rounded border ${
                isGisEnvironment 
                  ? 'bg-gis-bg text-gis-accent border-gis-divider'
                  : 'bg-editorial-bg text-editorial-accent border-editorial-divider'
              }`}>
                <Satellite className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-xs font-mono font-bold tracking-wider uppercase">
                  DANCING WITH SARS
                </h1>
                <span className={`text-[10px] font-mono tracking-wider block ${
                  isGisEnvironment ? 'text-gis-muted' : 'text-editorial-muted'
                }`}>
                  NISAR Sundarbans Delta
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Workspaces */}
          <nav className="space-y-1">
            <div className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2.5 pb-1 ${
              isGisEnvironment ? 'text-gis-muted' : 'text-editorial-muted'
            }`}>
              Scientific Workspaces
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-all group ${
                    isActive
                      ? isGisEnvironment
                        ? 'bg-gis-surface text-gis-accent font-semibold border border-gis-divider'
                        : 'bg-editorial-bg text-editorial-accent font-semibold border border-editorial-divider shadow-sm'
                      : isGisEnvironment
                      ? 'text-gis-muted hover:text-gis-text hover:bg-gis-surface/40'
                      : 'text-editorial-muted hover:text-editorial-text hover:bg-editorial-bg/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive 
                        ? (isGisEnvironment ? 'text-gis-accent' : 'text-editorial-accent')
                        : (isGisEnvironment ? 'text-gis-muted' : 'text-editorial-muted')
                    }`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    isActive
                      ? isGisEnvironment
                        ? 'bg-gis-accent/20 text-gis-accent'
                        : 'bg-editorial-accent/20 text-editorial-accent'
                      : isGisEnvironment
                      ? 'bg-gis-bg text-gis-muted'
                      : 'bg-editorial-bg text-editorial-muted'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Audit Metadata */}
        <div className={`p-4 border-t text-[11px] font-mono space-y-1.5 ${
          isGisEnvironment
            ? 'border-gis-divider bg-gis-bg text-gis-muted'
            : 'border-editorial-divider bg-editorial-bg text-editorial-muted'
        }`}>
          <div className="flex justify-between">
            <span>Study Region:</span>
            <span className={isGisEnvironment ? 'text-gis-text' : 'text-editorial-text'}>Gosaba, WB</span>
          </div>
          <div className="flex justify-between">
            <span>Grid Bounds:</span>
            <span className={isGisEnvironment ? 'text-gis-text' : 'text-editorial-text'}>EPSG:32645 (20m)</span>
          </div>
          <div className="flex justify-between">
            <span>Environment:</span>
            <span className="uppercase text-editorial-accent font-medium">{currentItem?.env}</span>
          </div>
          <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
            isGisEnvironment ? 'border-gis-divider' : 'border-editorial-divider'
          }`}>
            <span className="flex items-center gap-1 text-editorial-accent">
              <ShieldCheck className="w-3 h-3" />
              Manifest Boundary Active
            </span>
            <span>v0.4.0</span>
          </div>
        </div>
      </aside>

      {/* Main Scientific Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
        <div className="max-w-7xl mx-auto pb-16">
          {activeTab === 'overview' && <ResearchOverview manifest={APPLICATION_MANIFEST} />}
          {activeTab === 'sar_lab' && <SARDataLaboratory manifest={APPLICATION_MANIFEST} />}
          {activeTab === 'temporal' && <TemporalChangeObservatory manifest={APPLICATION_MANIFEST} />}
          {activeTab === 'polarimetry' && <PolarimetricInvestigation manifest={APPLICATION_MANIFEST} />}
          {activeTab === 'environmental' && <EnvironmentalContextLab manifest={APPLICATION_MANIFEST} />}
          {activeTab === 'evidence' && <EvidenceStudio manifest={APPLICATION_MANIFEST} />}
        </div>
      </main>
    </div>
  );
}
