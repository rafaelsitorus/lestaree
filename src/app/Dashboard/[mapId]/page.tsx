'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Sun,
  Wind,
  Waves,
  Zap,
  Target,
  ArrowLeft,
  Activity,
  Sparkles,
  Recycle, // Icon for waste
  Leaf, // Icon for sustainability
  Lightbulb, // Icon for suggestions/analysis
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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
} from 'recharts';
import JakartaMap from '@/components/JakartaMap';

// Area-specific data
const areaData = {
  jelambar: {
    name: 'Jelambar, Jakarta',
    totalCapacity: '2,450 MW',
    currentOutput: '1,890 MW',
    efficiency: 77,
    carbonOffset: '3.2M tons',
    solarCapacity: '850 MW',
    windCapacity: '450 MW',
    hydroCapacity: '1,150 MW',
    avgSolarOutput: 94,
    avgWindOutput: 46,
    avgHydroOutput: 108,
    currentSolarOutput: 89,
    currentWindOutput: 42,
    currentHydroOutput: 115,
    // Sustainability Data
    sustainability: {
      solar: {
        wasteIssue: 'Primary waste: End-of-life **solar panels** containing materials like silicon, aluminum, glass, and trace amounts of heavy metals (cadmium, lead in older panels). Improper disposal can lead to environmental contamination.',
        suggestions: 'Implement **robust panel recycling programs** with specialized facilities that can recover valuable materials. Prioritize procurement of panels designed for **easier disassembly and reduced hazardous materials**. Research and adopt advanced recycling techniques to **maximize resource recovery**. Consider **repurposing functional components** into new applications.',
        sustainabilityAspects: 'Reduced e-waste, enhanced resource recovery, promotion of a circular economy, minimization of landfill burden, and mitigation of potential heavy metal leaching into soil and water.',
      },
      wind: {
        wasteIssue: 'Primary waste: **Wind turbine blades**, often made from complex composite materials (fiberglass, carbon fiber, resin) which are currently challenging and expensive to recycle at scale. Other components like nacelles and towers are largely recyclable metals.',
        suggestions: 'Invest significantly in R&D for **innovative blade recycling technologies** such as pyrolysis, solvolysis, or mechanical grinding to convert composites into new materials. Explore **repurposing older blades** for new structural uses like pedestrian bridges, bus stops, or even artistic installations. Advocate for **design for recyclability** in new turbine blade manufacturing to simplify end-of-life processing.',
        sustainabilityAspects: 'Minimizing landfill waste, fostering material innovation, creating new economic value from waste, reducing reliance on virgin materials, and contributing to a more sustainable industrial ecosystem.',
      },
      hydro: {
        wasteIssue: 'Primary waste: Primarily **sediment accumulation** in reservoirs over time, which can reduce water storage capacity and impact downstream ecosystems by altering natural sediment flows. Minimal operational waste compared to thermal or nuclear plants.',
        suggestions: 'Implement **optimized sediment management strategies** including periodic flushing, sluicing, or mechanical dredging to maintain reservoir volume and natural river functions. Conduct regular and thorough **environmental impact assessments** to monitor and mitigate effects on aquatic life and riverine habitats. Foster **community engagement** in watershed protection, reforestation efforts, and sustainable land use practices upstream to reduce erosion and sediment input.',
        sustainabilityAspects: 'Long-term reservoir viability, preservation of critical aquatic ecosystems, maintenance of water quality, protection of biodiversity, and enhancement of overall watershed health.',
      },
    },
  },
  // You can add more area data here with their specific sustainability info
};

// Renewable energy forecast data (same as before)
const solarForecastData = [
  { month: 'Jan', output: 85, efficiency: 78, peak: '12:00 PM', conditions: 'Sunny' },
  { month: 'Feb', output: 92, efficiency: 82, peak: '12:30 PM', conditions: 'Clear' },
  { month: 'Mar', output: 88, efficiency: 80, peak: '12:15 PM', conditions: 'Partly Cloudy' },
  { month: 'Apr', output: 95, efficiency: 85, peak: '11:45 AM', conditions: 'Sunny' },
  { month: 'May', output: 102, efficiency: 88, peak: '11:30 AM', conditions: 'Clear' },
  { month: 'Jun', output: 98, efficiency: 86, peak: '11:15 AM', conditions: 'Sunny' },
  { month: 'Jul', output: 105, efficiency: 90, peak: '11:00 AM', conditions: 'Clear' },
  { month: 'Aug', output: 108, efficiency: 92, peak: '11:15 AM', conditions: 'Sunny' },
  { month: 'Sep', output: 96, efficiency: 84, peak: '11:45 AM', conditions: 'Partly Cloudy' },
  { month: 'Oct', output: 90, efficiency: 81, peak: '12:00 PM', conditions: 'Cloudy' },
  { month: 'Nov', output: 87, efficiency: 79, peak: '12:15 PM', conditions: 'Overcast' },
  { month: 'Dec', output: 83, efficiency: 76, peak: '12:30 PM', conditions: 'Rainy' },
];

const windForecastData = [
  { month: 'Jan', output: 45, speed: 12, direction: 'NE', turbines: 15 },
  { month: 'Feb', output: 52, speed: 14, direction: 'N', turbines: 18 },
  { month: 'Mar', output: 48, speed: 13, direction: 'NW', turbines: 16 },
  { month: 'Apr', output: 55, speed: 15, direction: 'N', turbines: 20 },
  { month: 'May', output: 42, speed: 11, direction: 'SE', turbines: 14 },
  { month: 'Jun', output: 38, speed: 10, direction: 'S', turbines: 12 },
  { month: 'Jul', output: 41, speed: 11, direction: 'SE', turbines: 13 },
  { month: 'Aug', output: 44, speed: 12, direction: 'E', turbines: 15 },
  { month: 'Sep', output: 47, speed: 13, direction: 'NE', turbines: 16 },
  { month: 'Oct', output: 51, speed: 14, direction: 'N', turbines: 17 },
  { month: 'Nov', output: 49, speed: 13, direction: 'NW', turbines: 16 },
  { month: 'Dec', output: 46, speed: 12, direction: 'NE', turbines: 15 },
];

const hydroForecastData = [
  { month: 'Jan', output: 120, rainfall: 85, reservoir: '82%', flow: 'High' },
  { month: 'Feb', output: 135, rainfall: 95, reservoir: '88%', flow: 'Very High' },
  { month: 'Mar', output: 142, rainfall: 102, reservoir: '95%', flow: 'Peak' },
  { month: 'Apr', output: 118, rainfall: 82, reservoir: '85%', flow: 'High' },
  { month: 'May', output: 95, rainfall: 65, reservoir: '72%', flow: 'Medium' },
  { month: 'Jun', output: 78, rainfall: 52, reservoir: '65%', flow: 'Low' },
  { month: 'Jul', output: 72, rainfall: 48, reservoir: '58%', flow: 'Low' },
  { month: 'Aug', output: 68, rainfall: 45, reservoir: '52%', flow: 'Very Low' },
  { month: 'Sep', output: 85, rainfall: 58, reservoir: '62%', flow: 'Medium' },
  { month: 'Oct', output: 112, rainfall: 78, reservoir: '75%', flow: 'High' },
  { month: 'Nov', output: 128, rainfall: 88, reservoir: '82%', flow: 'High' },
  { month: 'Dec', output: 138, rainfall: 98, reservoir: '90%', flow: 'Very High' },
];

// Enhanced tooltip components with modern styling (unchanged)
const SolarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-orange/30 rounded-xl shadow-xl z-50 transform -translate-x-1/2 -translate-y-full mb-2">
        <p className="font-bold text-orange mb-2 flex items-center">
          <Sun className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-orange">
          <p>
            Output: <span className="font-semibold">{data.output} MW</span>
          </p>
          <p>
            Efficiency: <span className="font-semibold">{data.efficiency}%</span>
          </p>
          <p>
            Peak Time: <span className="font-medium">{data.peak}</span>
          </p>
          <p>
            Conditions: <span className="font-medium">{data.conditions}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const WindTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-blue/30 rounded-xl shadow-xl z-50 transform -translate-x-1/2 -translate-y-full mb-2">
        <p className="font-bold text-blue mb-2 flex items-center">
          <Wind className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-blue">
          <p>
            Output: <span className="font-semibold">{data.output} MW</span>
          </p>
          <p>
            Wind Speed: <span className="font-semibold">{data.speed} m/s</span>
          </p>
          <p>
            Direction: <span className="font-medium">{data.direction}</span>
          </p>
          <p>
            Active Turbines: <span className="font-medium">{data.turbines}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const HydroTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-emrald/30 rounded-xl shadow-xl z-50 transform -translate-x-1/2 -translate-y-full mb-2">
        <p className="font-bold text-[#03522D] mb-2 flex items-center">
          <Waves className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-[#197A56]">
          <p>
            Output: <span className="font-semibold">{data.output} MW</span>
          </p>
          <p>
            Rainfall: <span className="font-semibold">{data.rainfall} mm</span>
          </p>
          <p>
            Reservoir Level: <span className="font-medium">{data.reservoir}</span>
          </p>
          <p>
            Water Flow: <span className="font-medium">{data.flow}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState('jelambar');

  const data = areaData[selectedArea as keyof typeof areaData] || areaData.jelambar;

  // Calculate approximate height for forecast card based on content
  // Header: 60px (approx)
  // Content padding: 1rem (16px) top/bottom (1rem*2 = 32px)
  // Capacity/Avg Output section: 40px (approx)
  // Chart: 80px (h-20)
  // Card padding: 1rem (16px) top/bottom
  // Total approx: 60 + 32 + 40 + 80 = 212px. Let's use 210px for consistency.
  const forecastCardHeight = '210px'; // Tinggi yang akan menjadi acuan

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 p-4">
      {/* Compact Header */}
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
              {data.name}
            </h2>
          </div>
        </div>
        <button
          onClick={() => router.push('/')}
          className="group flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Map</span>
        </button>
      </div>

      {/* Compact Map */}
      <div className="mb-6">
        <div className="p-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
          <div className="bg-white rounded-lg overflow-hidden">
            <JakartaMap
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
                    <span className="text-xs font-medium">Solar</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">35%</span>
                </div>
                <Progress value={35} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
                    <span className="text-xs font-medium">Hydro</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">47%</span>
                </div>
                <Progress value={47} className="h-1.5" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
                    <span className="text-xs font-medium">Wind</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">18%</span>
                </div>
                <Progress value={18} className="h-1.5" />
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
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg group-hover:from-slate-100 group-hover:to-slate-200 transition-all duration-200">
                    <div className="text-xl font-black text-slate-800 mb-1">
                      {data.totalCapacity}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Total Capacity
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-100 rounded-lg group-hover:from-orange-100 group-hover:to-amber-200 transition-all duration-200">
                    <div className="text-xl font-black text-orange-600 mb-1">
                      1,128 MW
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Solar Output
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg group-hover:from-blue-100 group-hover:to-cyan-200 transition-all duration-200">
                    <div className="text-xl font-black text-blue-600 mb-1">
                      552 MW
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Wind Output
                    </div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-lg group-hover:from-emerald-100 group-hover:to-teal-200 transition-all duration-200">
                    <div className="text-xl font-black text-emerald-600 mb-1">
                      1,291 MW
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      Hydro Output
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Solar Energy Row with new Sustainability Card */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {/* Solar Forecast Card - Now sets the height */}
        <div className="col-span-3">
          <Card className="border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}> {/* Tinggi eksplisit */}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mr-2 shadow-md">
                  <Sun className="w-4 h-4 text-white" />
                </div>
                12 Months Solar Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.solarCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-orange-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.avgSolarOutput} MW
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={solarForecastData}>
                      <defs>
                        <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="output"
                        stroke="rgb(251 146 60)"
                        strokeWidth={2}
                        fill="url(#solarGradient)"
                        dot={{ fill: 'rgb(251 146 60)', strokeWidth: 1, r: 3 }}
                        activeDot={{
                          r: 5,
                          stroke: 'rgb(251 146 60)',
                          strokeWidth: 2,
                          fill: 'white',
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Solar Today Card - Adjusts to forecast card's height */}
        <div className="col-span-1">
          <Card className="border-0 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Solar Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pt-1">
              <div className="text-center">
                <div className="text-3xl font-black mb-1">
                  {data.currentSolarOutput}
                </div>
                <div className="text-sm font-medium opacity-90 mb-2">MW</div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">
                    {((data.currentSolarOutput / data.avgSolarOutput) * 100).toFixed(0)}% avg
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Solar Sustainability Card - Adjusts to forecast card's height, with scroll */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-orange-50/50 backdrop-blur-md shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mr-2 shadow-md">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                Solar Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent
              className="pt-1 text-sm text-slate-700 space-y-2"
              style={{
                height: `calc(${forecastCardHeight} - 60px - 20px)`, // header + padding content top/bottom + other paddings
                overflowY: 'auto'
              }}
            >
              <p className="flex items-start">
                <Recycle className="w-4 h-4 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Waste Issue: </span>
                {data.sustainability.solar.wasteIssue}
              </p>
              <p className="flex items-start">
                <Target className="w-4 h-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Suggestions: </span>
                {data.sustainability.solar.suggestions}
              </p>
              <p className="flex items-start">
                <Leaf className="w-4 h-4 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Aspects: </span>
                {data.sustainability.solar.sustainabilityAspects}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wind Energy Row with new Sustainability Card */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {/* Wind Forecast Card - Now sets the height */}
        <div className="col-span-3">
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}> {/* Tinggi eksplisit */}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-2 shadow-md">
                  <Wind className="w-4 h-4 text-white" />
                </div>
                12 Months Wind Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.windCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-blue-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.avgWindOutput} MW
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={windForecastData}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<WindTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="output"
                        stroke="rgb(59 130 246)"
                        strokeWidth={3}
                        dot={{ fill: 'rgb(59 130 246)', strokeWidth: 1, r: 3 }}
                        activeDot={{
                          r: 5,
                          stroke: 'rgb(59 130 246)',
                          strokeWidth: 2,
                          fill: 'white',
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Wind Today Card - Adjusts to forecast card's height */}
        <div className="col-span-1">
          <Card className="border-0 bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Wind Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pt-1">
              <div className="text-center">
                <div className="text-3xl font-black mb-1">
                  {data.currentWindOutput}
                </div>
                <div className="text-sm font-medium opacity-90 mb-2">MW</div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">
                    {((data.currentWindOutput / data.avgWindOutput) * 100).toFixed(0)}% avg
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Wind Sustainability Card - Adjusts to forecast card's height, with scroll */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50/50 backdrop-blur-md shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-2 shadow-md">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                Wind Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent
              className="pt-1 text-sm text-slate-700 space-y-2"
              style={{
                height: `calc(${forecastCardHeight} - 60px - 20px)`, // header + padding content top/bottom + other paddings
                overflowY: 'auto'
              }}
            >
              <p className="flex items-start">
                <Recycle className="w-4 h-4 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Waste Issue: </span>
                {data.sustainability.wind.wasteIssue}
              </p>
              <p className="flex items-start">
                <Target className="w-4 h-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Suggestions: </span>
                {data.sustainability.wind.suggestions}
              </p>
              <p className="flex items-start">
                <Leaf className="w-4 h-4 mr-2 mt-1 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Aspects: </span>
                {data.sustainability.wind.sustainabilityAspects}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hydro Energy Row with new Sustainability Card */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {/* Hydro Forecast Card - Now sets the height */}
        <div className="col-span-3">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}> {/* Tinggi eksplisit */}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-2 shadow-md">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                12 Months Hydro Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Capacity
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.hydroCapacity}
                      </div>
                    </div>
                    <div className="w-px h-6 bg-gradient-to-b from-emerald-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Avg Output
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {data.avgHydroOutput} MW
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hydroForecastData}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide />
                      <Tooltip content={<HydroTooltip />} />
                      <Bar dataKey="output" fill="rgb(16 185 129)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Hydro Today Card - Adjusts to forecast card's height */}
        <div className="col-span-1">
          <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-1">
              <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Hydro Today
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pt-1">
              <div className="text-center">
                <div className="text-3xl font-black mb-1">
                  {data.currentHydroOutput}
                </div>
                <div className="text-sm font-medium opacity-90 mb-2">MW</div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">
                    {((data.currentHydroOutput / data.avgHydroOutput) * 100).toFixed(0)}% avg
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Hydro Sustainability Card - Adjusts to forecast card's height, with scroll */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-emerald-50/50 backdrop-blur-md shadow-lg rounded-xl h-full overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-2 shadow-md">
                  <Lightbulb className="w-3 h-3 text-white" />
                </div>
                Hydro Sustainability
              </CardTitle>
            </CardHeader>
            <CardContent
              className="pt-1 text-sm text-slate-700 space-y-2"
              style={{
                height: `calc(${forecastCardHeight} - 60px - 20px)`, // header + padding content top/bottom + other paddings
                overflowY: 'auto'
              }}
            >
              <p className="flex items-start">
                <Recycle className="w-4 h-4 mr-2 mt-1 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Waste Issue: </span>
                {data.sustainability.hydro.wasteIssue}
              </p>
              <p className="flex items-start">
                <Target className="w-4 h-4 mr-2 mt-1 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Suggestions: </span>
                {data.sustainability.hydro.suggestions}
              </p>
              <p className="flex items-start">
                <Leaf className="w-4 h-4 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Aspects: </span>
                {data.sustainability.hydro.sustainabilityAspects}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}