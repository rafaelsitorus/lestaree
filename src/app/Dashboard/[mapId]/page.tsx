'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Sun,
  Wind,
  Waves,
  Zap,
  Target,
  ArrowLeft,
  Activity,
  Sparkles,
  Recycle,
  Leaf,
  Lightbulb,
  Send,
  MessageCircle,
  Loader2,
  RefreshCw,
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

// Area-specific data (tetap sama seperti sebelumnya)
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
    sustainability: {
      solar: {
        wasteIssue: 'Primary waste: End-of-life **solar panels** containing materials like silicon, aluminum, glass, and trace amounts of heavy metals (cadmium, lead in older panels). Improper disposal can lead to environmental contamination.',
        suggestions: 'Implement **robust panel recycling programs** with specialized facilities that can recover valuable materials. Prioritize procurement of panels designed for **easier disassembly and reduced hazardous materials**.',
        sustainabilityAspects: 'Reduced e-waste, enhanced resource recovery, promotion of a circular economy, minimization of landfill burden, and mitigation of potential heavy metal leaching.',
      },
      wind: {
        wasteIssue: 'Primary waste: **Wind turbine blades**, often made from complex composite materials (fiberglass, carbon fiber, resin) which are currently challenging and expensive to recycle at scale.',
        suggestions: 'Invest significantly in R&D for **innovative blade recycling technologies** such as pyrolysis, solvolysis, or mechanical grinding to convert composites into new materials.',
        sustainabilityAspects: 'Minimizing landfill waste, fostering material innovation, creating new economic value from waste, reducing reliance on virgin materials.',
      },
      hydro: {
        wasteIssue: 'Primary waste: Primarily **sediment accumulation** in reservoirs over time, which can reduce water storage capacity and impact downstream ecosystems.',
        suggestions: 'Implement **optimized sediment management strategies** including periodic flushing, sluicing, or mechanical dredging to maintain reservoir volume.',
        sustainabilityAspects: 'Long-term reservoir viability, preservation of critical aquatic ecosystems, maintenance of water quality, protection of biodiversity.',
      },
    },
  },
};

// Forecast data (tetap sama)
const solarForecastData = [
  { month: 'Jan', output: 85, efficiency: 78, peak: '12:00 PM', conditions: 'Sunny' },
  { month: 'Feb', output: 92, efficiency: 82, peak: '12:30 PM', conditions: 'Clear' },
  // ... data lainnya
];

const windForecastData = [
  { month: 'Jan', output: 45, speed: 12, direction: 'NE', turbines: 15 },
  { month: 'Feb', output: 52, speed: 14, direction: 'N', turbines: 18 },
  // ... data lainnya
];

const hydroForecastData = [
  { month: 'Jan', output: 120, rainfall: 85, reservoir: '82%', flow: 'High' },
  { month: 'Feb', output: 135, rainfall: 95, reservoir: '88%', flow: 'Very High' },
  // ... data lainnya
];

// Tooltip components (tetap sama)
const SolarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-orange/30 rounded-xl shadow-xl z-50">
        <p className="font-bold text-orange mb-2 flex items-center">
          <Sun className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-orange">
          <p>Output: <span className="font-semibold">{data.output} MW</span></p>
          <p>Efficiency: <span className="font-semibold">{data.efficiency}%</span></p>
          <p>Peak Time: <span className="font-medium">{data.peak}</span></p>
          <p>Conditions: <span className="font-medium">{data.conditions}</span></p>
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
      <div className="bg-white/95 backdrop-blur-md p-4 border border-blue/30 rounded-xl shadow-xl z-50">
        <p className="font-bold text-blue mb-2 flex items-center">
          <Wind className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-blue">
          <p>Output: <span className="font-semibold">{data.output} MW</span></p>
          <p>Wind Speed: <span className="font-semibold">{data.speed} m/s</span></p>
          <p>Direction: <span className="font-medium">{data.direction}</span></p>
          <p>Active Turbines: <span className="font-medium">{data.turbines}</span></p>
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
      <div className="bg-white/95 backdrop-blur-md p-4 border border-emerald/30 rounded-xl shadow-xl z-50">
        <p className="font-bold text-[#03522D] mb-2 flex items-center">
          <Waves className="w-4 h-4 mr-2" />
          {label}
        </p>
        <div className="space-y-1 text-sm text-[#197A56]">
          <p>Output: <span className="font-semibold">{data.output} MW</span></p>
          <p>Rainfall: <span className="font-semibold">{data.rainfall} mm</span></p>
          <p>Reservoir Level: <span className="font-medium">{data.reservoir}</span></p>
          <p>Water Flow: <span className="font-medium">{data.flow}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const router = useRouter();
  const [selectedArea, setSelectedArea] = useState('jelambar');
  const [chatMessages, setChatMessages] = useState<{[key: string]: Array<{type: 'user' | 'ai', message: string, timestamp: string}>}>({
    solar: [],
    wind: [],
    hydro: []
  });
  const [currentInput, setCurrentInput] = useState<{[key: string]: string}>({
    solar: '',
    wind: '',
    hydro: ''
  });
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    solar: false,
    wind: false,
    hydro: false
  });
  const [hasInitialAnalysis, setHasInitialAnalysis] = useState<{[key: string]: boolean}>({
    solar: false,
    wind: false,
    hydro: false
  });

  const data = areaData[selectedArea as keyof typeof areaData] || areaData.jelambar;

  // Function untuk memanggil Gemini API
  const callGeminiAPI = async (energyType: 'solar' | 'wind' | 'hydro', message: string = '', useContext: boolean = true) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          energyType,
          energyData: data,
          useContext
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        success: false,
        message: 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.'
      };
    }
  };

  // Function untuk generate initial AI analysis
  const generateInitialAnalysis = async (energyType: 'solar' | 'wind' | 'hydro') => {
    if (hasInitialAnalysis[energyType]) return;

    setIsLoading(prev => ({ ...prev, [energyType]: true }));

    try {
      const result = await callGeminiAPI(energyType, '', true);
      
      if (result.success) {
        setChatMessages(prev => ({
          ...prev,
          [energyType]: [{
            type: 'ai',
            message: result.message,
            timestamp: new Date().toISOString()
          }]
        }));

        setHasInitialAnalysis(prev => ({ ...prev, [energyType]: true }));
      }
    } catch (error) {
      console.error('Error generating initial analysis:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [energyType]: false }));
    }
  };

  // Function untuk handle user messages
  const handleSendMessage = async (energyType: 'solar' | 'wind' | 'hydro') => {
    const message = currentInput[energyType].trim();
    if (!message || isLoading[energyType]) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      message,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => ({
      ...prev,
      [energyType]: [...prev[energyType], userMessage]
    }));

    // Clear input
    setCurrentInput(prev => ({
      ...prev,
      [energyType]: ''
    }));

    // Set loading state
    setIsLoading(prev => ({ ...prev, [energyType]: true }));

    try {
      const result = await callGeminiAPI(energyType, message, true);
      
      if (result.success) {
        const aiMessage = {
          type: 'ai' as const,
          message: result.message,
          timestamp: new Date().toISOString()
        };

        setChatMessages(prev => ({
          ...prev,
          [energyType]: [...prev[energyType], aiMessage]
        }));

        // Auto-scroll to show latest message
        setTimeout(() => {
          const analysisContainer = document.querySelector(`[data-scroll-${energyType}]`);
          if (analysisContainer) {
            analysisContainer.scrollTop = analysisContainer.scrollHeight;
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setChatMessages(prev => ({
        ...prev,
        [energyType]: [...prev[energyType], {
          type: 'ai',
          message: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
          timestamp: new Date().toISOString()
        }]
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [energyType]: false }));
    }
  };

  // Generate initial analysis on component mount
  useEffect(() => {
    generateInitialAnalysis('solar');
    generateInitialAnalysis('wind');
    generateInitialAnalysis('hydro');
  }, [selectedArea]);

  const forecastCardHeight = '280px';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30 p-4">
      {/* Header - tetap sama */}
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

      {/* Map - tetap sama */}
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

      {/* Energy Mix & Summary - tetap sama */}
      <div className="grid grid-cols-6 gap-4 pb-4">
        <div className="col-span-2">
          {/* Energy Mix Card - tetap sama */}
        </div>
        <div className="col-span-4">
          {/* Summary Card - tetap sama */}
        </div>
      </div>

      {/* Solar Energy Row dengan AI Integration */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-2">
          {/* Solar Forecast Card - tetap sama */}
          <Card className="border-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mr-2 shadow-md">
                  <Sun className="w-4 h-4 text-white" />
                </div>
                12 Months Solar Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Capacity</div>
                      <div className="text-base font-bold text-slate-800">{data.solarCapacity}</div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-orange-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Avg Output</div>
                      <div className="text-base font-bold text-slate-800">{data.avgSolarOutput} MW</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={solarForecastData}>
                      <defs>
                        <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="rgb(251 146 60)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="rgb(251 146 60)" stopOpacity={0.1} />
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

        {/* Solar Sustainability Card dengan AI Integration */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-orange-50/50 backdrop-blur-md shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg mr-2 shadow-md">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  Solar Sustainability
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => generateInitialAnalysis('solar')}
                  disabled={isLoading.solar}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading.solar ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 text-sm text-slate-700 h-full flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
                {/* Left Column - AI Analysis */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Analysis</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-32" data-scroll-solar>
                    {isLoading.solar && chatMessages.solar.length === 0 && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                        <span className="ml-2 text-xs text-slate-600">Generating analysis...</span>
                      </div>
                    )}
                    
                    {chatMessages.solar.filter(msg => msg.type === 'ai').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-orange-50 text-orange-800 border border-orange-200">
                        <div className="flex items-start">
                          <Sparkles className="w-3 h-3 mr-2 mt-1 text-orange-600 flex-shrink-0" />
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - AI Chat */}
                <div className="border-l pl-3 flex flex-col">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Chat</span>
                  </div>
                  
                  {/* User Messages */}
                  <div className="space-y-2 mb-3 max-h-20 overflow-y-auto flex-1">
                    {chatMessages.solar.filter(msg => msg.type === 'user').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-orange-100 text-orange-800">
                        <span className="font-medium">You:</span> {msg.message}
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      value={currentInput.solar}
                      onChange={(e) => setCurrentInput(prev => ({ ...prev, solar: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('solar')}
                      placeholder="Ask about solar sustainability..."
                      disabled={isLoading.solar}
                      className="flex-1 px-2 py-1 text-xs border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage('solar')}
                      disabled={isLoading.solar || !currentInput.solar.trim()}
                      className="px-2 py-1 h-auto bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                    >
                      {isLoading.solar ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wind Energy Row dengan AI Integration */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="col-span-2">
          {/* Wind Forecast Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-2 shadow-md">
                  <Wind className="w-4 h-4 text-white" />
                </div>
                12 Months Wind Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Capacity</div>
                      <div className="text-base font-bold text-slate-800">{data.windCapacity}</div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-blue-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Avg Output</div>
                      <div className="text-base font-bold text-slate-800">{data.avgWindOutput} MW</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 relative">
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

        {/* Wind Sustainability Card dengan AI Integration */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-blue-50/50 backdrop-blur-md shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg mr-2 shadow-md">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  Wind Sustainability
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => generateInitialAnalysis('wind')}
                  disabled={isLoading.wind}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading.wind ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 text-sm text-slate-700 h-full flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
                {/* Left Column - AI Analysis */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Analysis</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-32" data-scroll-wind>
                    {isLoading.wind && chatMessages.wind.length === 0 && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="ml-2 text-xs text-slate-600">Generating analysis...</span>
                      </div>
                    )}
                    
                    {chatMessages.wind.filter(msg => msg.type === 'ai').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                        <div className="flex items-start">
                          <Sparkles className="w-3 h-3 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - AI Chat */}
                <div className="border-l pl-3 flex flex-col">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Chat</span>
                  </div>
                  
                  <div className="space-y-2 mb-3 max-h-20 overflow-y-auto flex-1">
                    {chatMessages.wind.filter(msg => msg.type === 'user').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-blue-100 text-blue-800">
                        <span className="font-medium">You:</span> {msg.message}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      value={currentInput.wind}
                      onChange={(e) => setCurrentInput(prev => ({ ...prev, wind: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('wind')}
                      placeholder="Ask about wind sustainability..."
                      disabled={isLoading.wind}
                      className="flex-1 px-2 py-1 text-xs border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage('wind')}
                      disabled={isLoading.wind || !currentInput.wind.trim()}
                      className="px-2 py-1 h-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isLoading.wind ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hydro Energy Row dengan AI Integration */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          {/* Hydro Forecast Card */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-2 shadow-md">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                12 Months Hydro Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Capacity</div>
                      <div className="text-base font-bold text-slate-800">{data.hydroCapacity}</div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-emerald-200 to-transparent"></div>
                    <div className="text-center">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">Avg Output</div>
                      <div className="text-base font-bold text-slate-800">{data.avgHydroOutput} MW</div>
                    </div>
                  </div>
                </div>
                <div className="h-32 relative">
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

        {/* Hydro Sustainability Card dengan AI Integration */}
        <div className="col-span-2">
          <Card className="border-0 bg-gradient-to-br from-slate-50 to-emerald-50/50 backdrop-blur-md shadow-lg rounded-xl overflow-hidden"
                style={{ height: forecastCardHeight }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-2 shadow-md">
                    <Lightbulb className="w-3 h-3 text-white" />
                  </div>
                  Hydro Sustainability
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => generateInitialAnalysis('hydro')}
                  disabled={isLoading.hydro}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading.hydro ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1 text-sm text-slate-700 h-full flex flex-col">
              <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
                {/* Left Column - AI Analysis */}
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Lightbulb className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Analysis</span>
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-32" data-scroll-hydro>
                    {isLoading.hydro && chatMessages.hydro.length === 0 && (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span className="ml-2 text-xs text-slate-600">Generating analysis...</span>
                      </div>
                    )}
                    
                    {chatMessages.hydro.filter(msg => msg.type === 'ai').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <div className="flex items-start">
                          <Sparkles className="w-3 h-3 mr-2 mt-1 text-emerald-600 flex-shrink-0" />
                          <div className="whitespace-pre-wrap">{msg.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - AI Chat */}
                <div className="border-l pl-3 flex flex-col">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="w-4 h-4 mr-2 text-emerald-600" />
                    <span className="font-semibold text-slate-800 text-xs">AI Chat</span>
                  </div>
                  
                  <div className="space-y-2 mb-3 max-h-20 overflow-y-auto flex-1">
                    {chatMessages.hydro.filter(msg => msg.type === 'user').map((msg, index) => (
                      <div key={index} className="text-xs p-2 rounded-lg bg-emerald-100 text-emerald-800">
                        <span className="font-medium">You:</span> {msg.message}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      value={currentInput.hydro}
                      onChange={(e) => setCurrentInput(prev => ({ ...prev, hydro: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('hydro')}
                      placeholder="Ask about hydro sustainability..."
                      disabled={isLoading.hydro}
                      className="flex-1 px-2 py-1 text-xs border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleSendMessage('hydro')}
                      disabled={isLoading.hydro || !currentInput.hydro.trim()}
                      className="px-2 py-1 h-auto bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {isLoading.hydro ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}