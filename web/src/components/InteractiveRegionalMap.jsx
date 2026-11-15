import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function InteractiveRegionalMap({ selectedCoords, onCoordSelect }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletMap.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [21.9500, 88.8500],
      zoom: 11,
      minZoom: 10,
      maxZoom: 14,
      zoomControl: true,
      attributionControl: false
    });

    // Real high-resolution satellite imagery (Esri World Imagery)
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 17,
      attribution: 'Esri, Maxar, Earthstar Geographics'
    });
    satelliteLayer.addTo(map);

    // Bounding Box Polygon for Gosaba Study Window (EPSG:32645 Bounds)
    const aoiPolygon = L.polygon([
      [21.8000, 88.7000],
      [21.8000, 89.0000],
      [22.1000, 89.0000],
      [22.1000, 88.7000]
    ], {
      color: '#668C78',
      weight: 2,
      opacity: 0.95,
      fillColor: '#668C78',
      fillOpacity: 0.12,
      dashArray: '4, 6'
    }).addTo(map);

    aoiPolygon.bindPopup(`
      <div style="font-family: monospace; font-size: 11px; color: #111713; padding: 4px;">
        <strong>Gosaba Study Window (EPSG:32645)</strong><br />
        Lat: 21.80°N – 22.10°N<br />
        Lon: 88.70°E – 89.00°E<br />
        Resolution: 20m • 2,635,920 Pixels
      </div>
    `);

    // Key geographical landmarks in Gosaba Block
    const landmarks = [
      { name: "Gosaba Town (Settlement)", coords: [22.164, 88.808], type: "Settlement" },
      { name: "Raimangal River Estuary", coords: [21.880, 88.980], type: "Estuary Channel" },
      { name: "Bidya River Channel", coords: [22.020, 88.780], type: "Tidal Channel" },
      { name: "Sundarbans National Park Boundary", coords: [21.850, 88.880], type: "Protected Forest" }
    ];

    landmarks.forEach(lm => {
      const circle = L.circleMarker(lm.coords, {
        radius: 4.5,
        color: '#EAE8DE',
        fillColor: '#B18B59',
        fillOpacity: 0.95,
        weight: 1.5
      }).addTo(map);

      circle.bindTooltip(`${lm.name} (${lm.type})`, {
        permanent: false,
        direction: 'top',
        className: 'leaflet-custom-tooltip'
      });
    });

    // Click handler for pixel coordinate inspection within study window
    map.on('click', (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      if (lat >= 21.80 && lat <= 22.10 && lon >= 88.70 && lon <= 89.00) {
        if (onCoordSelect) onCoordSelect(lat, lon);
      }
    });

    leafletMap.current = map;

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Update selection marker when selectedCoords changes
  useEffect(() => {
    if (!leafletMap.current) return;
    if (markerLayer.current) {
      leafletMap.current.removeLayer(markerLayer.current);
      markerLayer.current = null;
    }

    if (selectedCoords) {
      markerLayer.current = L.circleMarker([selectedCoords.lat, selectedCoords.lon], {
        radius: 6,
        color: '#EAE8DE',
        fillColor: '#B18B59',
        fillOpacity: 1,
        weight: 2
      }).addTo(leafletMap.current);
    }
  }, [selectedCoords]);

  return (
    <div className="relative w-full h-[450px] rounded-lg overflow-hidden border border-gis-divider shadow-xl bg-gis-bg">
      <div ref={mapRef} className="w-full h-full" />
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-gis-bg/90 backdrop-blur-sm px-3.5 py-2 rounded border border-gis-divider text-xs font-mono">
        <span className="text-gis-accent font-bold block">GOSABA STUDY WINDOW</span>
        <span className="text-gis-muted text-[11px]">Click inside dashed bounding box to inspect 20m SAR cell</span>
      </div>
      {/* Coordinates readout */}
      <div className="absolute bottom-3 right-3 z-[400] bg-gis-bg/90 backdrop-blur-sm px-3 py-1.5 rounded border border-gis-divider text-[11px] font-mono text-gis-text">
        {selectedCoords ? (
          <span>Target: {selectedCoords.lat.toFixed(4)}°N, {selectedCoords.lon.toFixed(4)}°E</span>
        ) : (
          <span className="text-gis-muted">Target: None selected</span>
        )}
      </div>
    </div>
  );
}
