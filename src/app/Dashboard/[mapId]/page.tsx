"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DynamicMap from "@/components/DynamicMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getIslandConfig, IslandConfig } from "@/lib/mapConfig";
import {
  Sun,
  Wind,
  Waves,
  Zap,
  Target,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";

// Types for database data
interface ProvinceData {
  id: number;
  provinceName: string;
  energyID: string;
  month: number;
  output: number;
  province: {
    provinceName: string;
    islandName: string;
    primarySource: string | null;
  };
  energyType: {
    energyID: string;
    energyName: string;
  };
}

// Types for tooltip props
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month: string;
      solarOutput: number;
      windOutput: number;
      hydroOutput: number;
      totalOutput: number;
    };
  }>;
  label?: string;
}

// Month names for display
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Dummy solar data (kWH) - will be replaced with real data later
const dummySolarData = [
  1200, 1350, 1500, 1600, 1450, 1300, 1200, 1250, 1400, 1550, 1650, 1400,
];

// Dummy hydro data (kWH) - will be replaced with real data later
const dummyHydroData = [
  1800, 1900, 1700, 1400, 1200, 1100, 1000, 1050, 1300, 1600, 1750, 1850,
];

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [islandConfig, setIslandConfig] = useState<IslandConfig | null>(null);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Get mapId from route parameter
  const mapId = (params?.mapId as string) || "jawa";

  // Load island configuration and data
  useEffect(() => {
    const loadIslandData = async () => {
      try {
        setLoading(true);

        // Get island configuration
        const config = getIslandConfig(mapId);
        setIslandConfig(config);

        if (!config) {
          console.error(`Island config not found for: ${mapId}`);
          return;
        }

        console.log(`🔍 Loading data for island: ${mapId}`);

        // Fetch province data from database API
        const response = await fetch(`/api/province-data/${mapId}`);

        if (response.ok) {
          const data = await response.json();
          setProvinceData(data);
          console.log(`✅ Loaded ${data.length} records for ${mapId}`);
        } else {
          const errorText = await response.text();
          console.error(
            "Failed to fetch province data:",
            response.status,
            errorText
          );

          // Try to parse as JSON for better error message
          try {
            const errorJson = JSON.parse(errorText);
            console.error("API Error:", errorJson);
          } catch {
            console.error("Raw error response:", errorText);
          }
        }
      } catch (error) {
        console.error("Error loading island data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIslandData();
  }, [mapId]);

  // Function to get province name from selected area
  const getProvinceFromArea = (areaId: string) => {
    if (!islandConfig) return null;
    const area = islandConfig.areas.find((area) => area.id === areaId);
    return area?.provinceName || null;
  };

  // Process energy data using database data
    const processEnergyData = (selectedArea?: string) => {
    let targetProvince = null;

    if (selectedArea) {
      targetProvince = getProvinceFromArea(selectedArea); 
    }

    const monthlyData = monthNames.map((month, index) => {
      const monthNumber = index + 1;

      // Get real wind data from database
      let windOutput = 0;
      if (targetProvince) {
        // Use database data for specific province
        const monthData = provinceData.filter(
          (item: ProvinceData) =>
            item.provinceName === targetProvince &&
            item.month === monthNumber &&
            item.energyID === "WIND"
        );
        windOutput =
          monthData.length > 0
            ? Math.round(
                monthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / monthData.length
              )
            : 0;
      } else {
        // Use all provinces in island from database
        const islandProvinces = getIslandProvinces(mapId);
        const monthData = provinceData.filter(
          (item: ProvinceData) =>
            islandProvinces.includes(item.provinceName) &&
            item.month === monthNumber &&
            item.energyID === "WIND"
        );
        windOutput =
          monthData.length > 0
            ? Math.round(
                monthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / monthData.length
              )
            : 0;
      }

      // Get real solar and hydro data from database
      let solarOutput = 0;
      let hydroOutput = 0;

      if (targetProvince) {
        // Use database data for specific province
        const solarMonthData = provinceData.filter(
          (item: ProvinceData) =>
            item.provinceName === targetProvince &&
            item.month === monthNumber &&
            item.energyID === "SOLAR"
        );
        solarOutput =
          solarMonthData.length > 0
            ? Math.round(
                solarMonthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / solarMonthData.length
              )
            : 0;

        const hydroMonthData = provinceData.filter(
          (item: ProvinceData) =>
            item.provinceName === targetProvince &&
            item.month === monthNumber &&
            item.energyID === "HYDRO"
        );
        hydroOutput =
          hydroMonthData.length > 0
            ? Math.round(
                hydroMonthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / hydroMonthData.length
              )
            : 0;
      } else {
        // Use all provinces in island from database
        const islandProvinces = getIslandProvinces(mapId);
        const solarMonthData = provinceData.filter(
          (item: ProvinceData) =>
            islandProvinces.includes(item.provinceName) &&
            item.month === monthNumber &&
            item.energyID === "SOLAR"
        );
        solarOutput =
          solarMonthData.length > 0
            ? Math.round(
                solarMonthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / solarMonthData.length
              )
            : 0;

        const hydroMonthData = provinceData.filter(
          (item: ProvinceData) =>
            islandProvinces.includes(item.provinceName) &&
            item.month === monthNumber &&
            item.energyID === "HYDRO"
        );
        hydroOutput =
          hydroMonthData.length > 0
            ? Math.round(
                hydroMonthData.reduce(
                  (sum: number, item: ProvinceData) => sum + item.output,
                  0
                ) / hydroMonthData.length
              )
            : 0;
      }

      return {
        month,
        solarOutput,
        windOutput,
        hydroOutput,
        totalOutput: solarOutput + windOutput + hydroOutput,
      };
    });

    return monthlyData;
  };


  // Helper function to get provinces for an island (matching your seed data)
  const getIslandProvinces = (mapId: string): string[] => {
    const islandToProvinces: Record<string, string[]> = {
      jawa: [
        "DKI JAKARTA",
        "JAWA BARAT",
        "JAWA TENGAH",
        "JAWA TIMUR",
        "DI YOGYAKARTA",
        "BANTEN",
      ],
      sumatra: [
        "SUMATERA UTARA",
        "SUMATERA BARAT",
        "SUMATERA SELATAN",
        "RIAU",
        "ACEH",
        "JAMBI",
        "BENGKULU",
        "LAMPUNG",
        "KEPULAUAN RIAU",
        "KEPULAUAN BANGKA BELITUNG",
      ],
      sulawesi: [
        "SULAWESI UTARA",
        "SULAWESI SELATAN",
        "SULAWESI TENGAH",
        "SULAWESI TENGGARA",
        "SULAWESI BARAT",
        "GORONTALO",
      ],
      kalimantan: [
        "KALIMANTAN BARAT",
        "KALIMANTAN SELATAN",
        "KALIMANTAN TENGAH",
        "KALIMANTAN TIMUR",
        "KALIMANTAN UTARA",
      ],
      papua: [
        "PAPUA",
        "PAPUA BARAT",
        "PAPUA BARAT DAYA",
        "PAPUA PEGUNUNGAN",
        "PAPUA SELATAN",
        "PAPUA TENGAH",
      ],
    };
    return islandToProvinces[mapId.toLowerCase()] || [];
  };

  // Get area-specific data
  const getAreaData = (selectedArea?: string) => {
    const energyData = processEnergyData(selectedArea);
    const totalAnnual = energyData.reduce(
      (sum, month) => sum + month.totalOutput,
      0
    );

    const avgSolar = Math.round(
      energyData.reduce((sum, month) => sum + month.solarOutput, 0) / 12
    );
    const avgWind = Math.round(
      energyData.reduce((sum, month) => sum + month.windOutput, 0) / 12
    );
    const avgHydro = Math.round(
      energyData.reduce((sum, month) => sum + month.hydroOutput, 0) / 12
    );

    // Get area name
    let areaName =
      islandConfig?.name || mapId.charAt(0).toUpperCase() + mapId.slice(1);
    if (selectedArea && islandConfig) {
      const area = islandConfig.areas.find((area) => area.id === selectedArea);
      areaName = area ? area.name : areaName;
    }

    return {
      name: areaName,
      totalCapacity: `${Math.round(totalAnnual * 1.2).toLocaleString(
        "en-US"
      )} kWH`,
      currentOutput: `${Math.round(totalAnnual * 0.8).toLocaleString(
        "en-US"
      )} kWH`,
      efficiency: 85,
      carbonOffset: "4.2M tons",
      solarCapacity: `${(avgSolar * 10).toLocaleString("en-US")} kWH`,
      windCapacity: `${(avgWind * 15).toLocaleString("en-US")} kWH`,
      hydroCapacity: `${(avgHydro * 8).toLocaleString("en-US")} kWH`,
      avgSolarOutput: avgSolar,
      avgWindOutput: avgWind,
      avgHydroOutput: avgHydro,
      currentSolarOutput: Math.round(avgSolar * 1.05),
      currentWindOutput: Math.round(avgWind * 0.95),
      currentHydroOutput: Math.round(avgHydro * 1.1),
    };
  };

  // Get processed data
  const energyData = processEnergyData(selectedArea);
  const areaData = getAreaData(selectedArea);

  // Enhanced tooltip components with proper typing
  const SolarTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-orange/30 rounded-xl shadow-xl z-50">
          <p className="font-bold text-orange mb-2 flex items-center">
            <Sun className="w-4 h-4 mr-2" />
            {label}
          </p>
          <div className="space-y-1 text-sm text-orange">
            <p>
              Solar Output:{" "}
              <span className="font-semibold">
                {data.solarOutput.toLocaleString("en-US")} kWH
              </span>
            </p>
            <p>
              Efficiency: <span className="font-semibold">85%</span>
            </p>
            <p>
              Status: <span className="font-medium">Dummy Data</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const WindTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const province = selectedArea ? getProvinceFromArea(selectedArea) : null;

      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-blue/30 rounded-xl shadow-xl z-50">
          <p className="font-bold text-blue mb-2 flex items-center">
            <Wind className="w-4 h-4 mr-2" />
            {label}
          </p>
          <div className="space-y-1 text-sm text-blue">
            <p>
              Wind Output:{" "}
              <span className="font-semibold">
                {data.windOutput.toLocaleString("en-US")} kWH
              </span>
            </p>
            {province && (
              <p>
                Province: <span className="font-medium">{province}</span>
              </p>
            )}
            <p>
              Source: <span className="font-medium">Database Data</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const HydroTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border border-emerald/30 rounded-xl shadow-xl z-50">
          <p className="font-bold text-[#03522D] mb-2 flex items-center">
            <Waves className="w-4 h-4 mr-2" />
            {label}
          </p>
          <div className="space-y-1 text-sm text-[#197A56]">
            <p>
              Hydro Output:{" "}
              <span className="font-semibold">
                {data.hydroOutput.toLocaleString("en-US")} kWH
              </span>
            </p>
            <p>
              Reservoir Level: <span className="font-medium">85%</span>
            </p>
            <p>
              Status: <span className="font-medium">Dummy Data</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
          <p className="mt-4 text-lg font-medium text-slate-600">
            Loading {mapId} data...
          </p>
        </div>
      </div>
    );
  }

  if (!islandConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-orange-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Island Not Found
          </h2>
          <p className="text-slate-600 mb-4">
            The island &quot;{mapId}&quot; could not be found.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              RENEWABLE ENERGY FORECAST
            </p>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {areaData.name}
            </h2>
            {selectedArea && (
              <p className="text-xs text-green-600 font-medium">
                Selected Area:{" "}
                {selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {selectedArea && (
            <button
              onClick={() => setSelectedArea("")}
              className="text-xs font-medium text-slate-600 hover:text-slate-800 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/50"
            >
              Clear Selection
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="group flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Map</span>
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mb-6">
        <div className="p-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
          <div className="bg-white rounded-lg overflow-hidden">
            <DynamicMap
              mapId={mapId}
              selectedArea={selectedArea}
              onAreaSelect={setSelectedArea}
            />
          </div>
        </div>
      </div>

      {/* Compact Bottom Row */}
      <div className="grid grid-cols-6 gap-4 pb-4">
        {/* Compact Energy Mix */}
        <div className="col-span-2">
          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-2 shadow-md">
                  <Target className="w-3 h-3 text-white" />
                </div>
                Energy Mix
                {selectedArea && (
                  <span className="text-xs text-green-600 ml-2">
                    ({selectedArea})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
                    <span className="text-xs font-medium">Solar (Dummy)</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">32%</span>
                </div>
                <Progress value={32} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                    <span className="text-xs font-medium">Hydro (Dummy)</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">38%</span>
                </div>
                <Progress value={38} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                    <span className="text-xs font-medium">Wind (Real)</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">30%</span>
                </div>
                <Progress value={30} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compact Summary */}
        <div className="col-span-4">
          <Card className="border-0 bg-white/70 backdrop-blur-md shadow-lg rounded-xl overflow-hidden h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                12-Month Energy Forecast Summary
                {selectedArea && (
                  <span className="text-xs text-green-600 ml-2">
                    - {selectedArea}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg group-hover:from-slate-100 group-hover:to-slate-200 transition-all duration-200">
                    <div className="text-xl font-black text-slate-800 mb-1">
                      {areaData.totalCapacity}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Total Capacity
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg group-hover:from-orange-100 group-hover:to-amber-200 transition-all duration-200">
                    <div className="text-xl font-black text-orange-600 mb-1">
                      {energyData
                        .reduce((sum, month) => sum + month.solarOutput, 0)
                        .toLocaleString("en-US")}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Solar Output (Dummy)
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg group-hover:from-blue-100 group-hover:to-cyan-200 transition-all duration-200">
                    <div className="text-xl font-black text-blue-600 mb-1">
                      {energyData
                        .reduce((sum, month) => sum + month.windOutput, 0)
                        .toLocaleString("en-US")}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Wind Output (Real)
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-200">
                    <div className="text-xl font-black text-emerald-600 mb-1">
                      {energyData
                        .reduce((sum, month) => sum + month.hydroOutput, 0)
                        .toLocaleString("en-US")}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Hydro Output (Dummy)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Solar Energy Row with Dummy Data */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        <div className="col-span-4">
          <Card className="border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mr-2 shadow-md">
                  <Sun className="w-4 h-4 text-white" />
                </div>
                12 Months Solar Forecast (Dummy Data)
                {selectedArea && (
                  <span className="text-sm text-green-600 ml-2">
                    - {selectedArea}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.solarCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-orange-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.avgSolarOutput.toLocaleString("en-US")} kWH
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={energyData} key={selectedArea}>
                      <defs>
                        <linearGradient
                          id="solarGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="rgb(251 146 60)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="rgb(251 146 60)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<SolarTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="solarOutput"
                        stroke="rgb(251 146 60)"
                        strokeWidth={2}
                        fill="url(#solarGradient)"
                        dot={{ fill: "rgb(251 146 60)", strokeWidth: 1, r: 3 }}
                        activeDot={{
                          r: 5,
                          stroke: "rgb(251 146 60)",
                          strokeWidth: 2,
                          fill: "white",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wind Energy Row with Real Data */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        <div className="col-span-4">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-2 shadow-md">
                  <Wind className="w-4 h-4 text-white" />
                </div>
                12 Months Wind Forecast (Real Data)
                {selectedArea && (
                  <span className="text-sm text-green-600 ml-2">
                    - {selectedArea}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.windCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-blue-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.avgWindOutput.toLocaleString("en-US")} kWH
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData} key={selectedArea}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<WindTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="windOutput"
                        stroke="rgb(59 130 246)"
                        strokeWidth={3}
                        dot={{ fill: "rgb(59 130 246)", strokeWidth: 1, r: 3 }}
                        activeDot={{
                          r: 5,
                          stroke: "rgb(59 130 246)",
                          strokeWidth: 2,
                          fill: "white",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hydro Energy Row with Dummy Data */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="col-span-4">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-2 shadow-md">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                12 Months Hydro Forecast (Dummy Data)
                {selectedArea && (
                  <span className="text-sm text-green-600 ml-2">
                    - {selectedArea}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.hydroCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-emerald-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {areaData.avgHydroOutput.toLocaleString("en-US")} kWH
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData} key={selectedArea}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<HydroTooltip />} />
                      <Bar
                        dataKey="hydroOutput"
                        fill="rgb(16 185 129)"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
