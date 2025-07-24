"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface MapProps {
  selectedArea: string;
  onAreaSelect: (areaId: string) => void;
}

// Island configurations with center coordinates and areas
const islandConfigs = {
  jawa: {
    center: [-7.5, 110.0] as [number, number],
    zoom: 8,
    name: "Java",
    areas: [
      {
        id: "jakarta",
        name: "Jakarta",
        coordinates: [-6.2, 106.816] as [number, number],
        totalOutput: "1,250 MW",
        primarySource: "Solar",
        efficiency: 87,
      },
      {
        id: "surabaya",
        name: "Surabaya",
        coordinates: [-7.25, 112.75] as [number, number],
        totalOutput: "980 MW",
        primarySource: "Wind",
        efficiency: 92,
      },
      {
        id: "bandung",
        name: "Bandung",
        coordinates: [-6.9, 107.6] as [number, number],
        totalOutput: "750 MW",
        primarySource: "Hydro",
        efficiency: 89,
      },
      {
        id: "semarang",
        name: "Semarang",
        coordinates: [-6.97, 110.42] as [number, number],
        totalOutput: "560 MW",
        primarySource: "Solar",
        efficiency: 84,
      },
    ],
  },
  sumatra: {
    center: [-0.5, 101.5] as [number, number],
    zoom: 7,
    name: "Sumatra",
    areas: [
      {
        id: "medan",
        name: "Medan",
        coordinates: [3.58, 98.65] as [number, number],
        totalOutput: "890 MW",
        primarySource: "Hydro",
        efficiency: 91,
      },
      {
        id: "palembang",
        name: "Palembang",
        coordinates: [-2.91, 104.7] as [number, number],
        totalOutput: "670 MW",
        primarySource: "Solar",
        efficiency: 85,
      },
      {
        id: "pekanbaru",
        name: "Pekanbaru",
        coordinates: [0.53, 101.45] as [number, number],
        totalOutput: "520 MW",
        primarySource: "Wind",
        efficiency: 88,
      },
      {
        id: "lampung",
        name: "Bandar Lampung",
        coordinates: [-5.45, 105.27] as [number, number],
        totalOutput: "430 MW",
        primarySource: "Geothermal",
        efficiency: 93,
      },
    ],
  },
  sulawesi: {
    center: [-2.5, 120.0] as [number, number],
    zoom: 7,
    name: "Sulawesi",
    areas: [
      {
        id: "makassar",
        name: "Makassar",
        coordinates: [-5.14, 119.43] as [number, number],
        totalOutput: "720 MW",
        primarySource: "Wind",
        efficiency: 86,
      },
      {
        id: "manado",
        name: "Manado",
        coordinates: [1.48, 124.85] as [number, number],
        totalOutput: "450 MW",
        primarySource: "Geothermal",
        efficiency: 93,
      },
      {
        id: "kendari",
        name: "Kendari",
        coordinates: [-3.95, 122.5] as [number, number],
        totalOutput: "380 MW",
        primarySource: "Hydro",
        efficiency: 89,
      },
      {
        id: "palu",
        name: "Palu",
        coordinates: [-0.9, 119.87] as [number, number],
        totalOutput: "290 MW",
        primarySource: "Solar",
        efficiency: 82,
      },
    ],
  },
  kalimantan: {
    center: [-1.0, 114.0] as [number, number],
    zoom: 6,
    name: "Kalimantan",
    areas: [
      {
        id: "banjarmasin",
        name: "Banjarmasin",
        coordinates: [-3.32, 114.59] as [number, number],
        totalOutput: "640 MW",
        primarySource: "Solar",
        efficiency: 87,
      },
      {
        id: "balikpapan",
        name: "Balikpapan",
        coordinates: [-1.27, 116.83] as [number, number],
        totalOutput: "580 MW",
        primarySource: "Wind",
        efficiency: 90,
      },
      {
        id: "pontianak",
        name: "Pontianak",
        coordinates: [-0.03, 109.32] as [number, number],
        totalOutput: "420 MW",
        primarySource: "Hydro",
        efficiency: 84,
      },
      {
        id: "samarinda",
        name: "Samarinda",
        coordinates: [-0.5, 117.15] as [number, number],
        totalOutput: "350 MW",
        primarySource: "Solar",
        efficiency: 85,
      },
    ],
  },
};

// Custom marker component
const CustomMarker = ({
  area,
  isSelected,
  onSelect,
}: {
  area: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
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
              Efficiency:{" "}
              <span className="font-medium">{area.efficiency}%</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default function JakartaMap({
  selectedArea,
  onAreaSelect,
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  
  // Get mapId from route parameter, default to 'jawa' if not found
  const mapId = (params?.mapId as string) || 'jawa';
  const currentConfig = islandConfigs[mapId as keyof typeof islandConfigs] || islandConfigs.jawa;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                {currentConfig.name} Energy Map
              </h3>
            </div>
          </div>
          <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center">
            <div className="text-slate-500">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 0.5rem;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 1px solid #e2e8f0;
        }

        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e2e8f0;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .leaflet-control-zoom a {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          color: #64748b !important;
          font-size: 16px !important;
        }

        .leaflet-control-zoom a:hover {
          background: #f8fafc !important;
          color: #334155 !important;
        }
      `}</style>

      <Card className="border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                {currentConfig.name} Energy Map
              </h3>
            </div>
            <div className="text-sm text-slate-600">
              Click a marker to view details
            </div>
          </div>

          {/* Map Container */}
          <div className="relative h-86 rounded-lg overflow-hidden border-2 border-green-200">
            <MapContainer
              center={currentConfig.center}
              zoom={currentConfig.zoom}
              scrollWheelZoom={false}
              zoomControl={true}
              attributionControl={false}
              className="h-full w-full"
              key={mapId} // Force re-render when mapId changes
            >
              {/* Minimalist tile layer - using CartoDB Positron for clean look */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {/* Energy facility markers */}
              {currentConfig.areas.map((area) => (
                <CustomMarker
                  key={area.id}
                  area={area}
                  isSelected={selectedArea === area.id}
                  onSelect={onAreaSelect}
                />
              ))}
            </MapContainer>
          </div>

        </CardContent>
      </Card>
    </>
  );
}