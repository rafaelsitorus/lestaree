"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import MapMarker from "../components/MapMarker";
import { IslandConfig, getIslandConfig } from "@/lib/mapConfig";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface DynamicMapProps {
  mapId: string;
  selectedArea: string;
  onAreaSelect: (areaId: string) => void;
}

export default function DynamicMap({ mapId, selectedArea, onAreaSelect }: DynamicMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [islandConfig, setIslandConfig] = useState<IslandConfig | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Load island configuration
    const config = getIslandConfig(mapId);
    setIslandConfig(config);
  }, [mapId]);

  if (!isMounted || !islandConfig) {
    return (
      <Card className="h-96 flex items-center justify-center border-0 shadow-none bg-slate-50">
        <CardContent className="p-0">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-slate-200 flex items-center justify-center">
              <Navigation className="h-4 w-4 text-slate-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-400 font-medium">Loading</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-80 relative rounded-xl overflow-hidden border border-slate-200/50 bg-white shadow-sm">
      <MapContainer
        center={islandConfig.center}
        zoom={islandConfig.zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
          attribution=""
        />
        
        {/* Render minimalist markers for each area */}
        {islandConfig.areas.map((area) => (
          <MapMarker
            key={area.id}
            area={area}
            isSelected={selectedArea === area.id}
            onSelect={onAreaSelect}
          />
        ))}
      </MapContainer>
      
      {/* Minimal overlay info */}
      <div className="absolute top-3 left-3 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-slate-200/50">
          <p className="text-xs font-medium text-slate-600">{islandConfig.name}</p>
        </div>
      </div>
      
      {/* Minimal zoom controls */}
      <div className="absolute bottom-3 right-3 z-[1000] flex flex-col space-y-1">
        <button 
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-lg shadow-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomIn();
          }}
        >
          <span className="text-sm font-medium">+</span>
        </button>
        <button 
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-lg shadow-sm flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-800 transition-colors"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomOut();
          }}
        >
          <span className="text-sm font-medium">−</span>
        </button>
      </div>
    </div>
  );
}