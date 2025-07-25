"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Area } from "@/lib/mapConfig";

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapMarkerProps {
  area: Area;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function MapMarker({ area, isSelected, onSelect }: MapMarkerProps) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!L) return null;

  const getMarkerColor = () => {
    if (isSelected) return "#ea580c"; // Orange for selected
    switch (area.primarySource) {
      case "Solar": return "#f59e0b"; // Amber
      case "Wind": return "#06b6d4"; // Cyan
      case "Hydro": return "#3b82f6"; // Blue
      case "Geothermal": return "#ef4444"; // Red
      default: return "#10b981"; // Emerald green
    }
  };

  const createCustomIcon = () => {
    const color = getMarkerColor();
    const size = isSelected ? 32 : 24;

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          transform: rotate(-45deg);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        ">
          <div style="
            color: white;
            font-size: ${size > 24 ? "14px" : "12px"};
            font-weight: bold;
            transform: rotate(45deg);
          ">
            ${area.primarySource.charAt(0)}
          </div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  };

  return (
    <Marker
      position={area.coordinates}
      icon={createCustomIcon()}
      eventHandlers={{
        click: () => onSelect(area.id),
      }}
    >
      <Popup closeButton={false} className="custom-popup">
        <div className="p-2 min-w-[150px]">
          <div className="font-semibold text-slate-800 mb-1">{area.name}</div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>
              Output: <span className="font-medium">{area.totalOutput}</span>
            </div>
            <div>
              Primary: <span className="font-medium">{area.primarySource}</span>
            </div>
            <div>
              Efficiency: <span className="font-medium">{area.efficiency}%</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}