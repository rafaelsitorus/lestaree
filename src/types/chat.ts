// src/types/chat.ts
export interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export interface EnergyData {
  name: string;
  totalCapacity: string;
  currentOutput: string;
  efficiency: number;
  carbonOffset: string;
  solarCapacity: string;
  windCapacity: string;
  hydroCapacity: string;
  avgSolarOutput: number;
  avgWindOutput: number;
  avgHydroOutput: number;
  currentSolarOutput: number;
  currentWindOutput: number;
  currentHydroOutput: number;
}

export interface GeminiApiRequest {
  message: string;
  energyType: 'solar' | 'wind' | 'hydro';
  energyData: EnergyData;
  useContext: boolean;
}

export interface GeminiApiResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  error?: string;
}