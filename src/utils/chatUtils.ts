import { EnergyData } from '@/types/chat';

export const formatEnergyContext = (energyType: string, data: EnergyData) => {
  const contexts = {
    solar: {
      capacity: data.solarCapacity,
      currentOutput: data.currentSolarOutput,
      avgOutput: data.avgSolarOutput,
      wasteTypes: ['Silicon wafers', 'Aluminum frames', 'Glass panels', 'Heavy metals (Cd, Pb)'],
      sustainability: ['Panel recycling', 'Material recovery', 'Circular economy', 'E-waste reduction']
    },
    wind: {
      capacity: data.windCapacity,
      currentOutput: data.currentWindOutput,
      avgOutput: data.avgWindOutput,
      wasteTypes: ['Composite blades', 'Steel towers', 'Copper wiring', 'Rare earth magnets'],
      sustainability: ['Blade recycling R&D', 'Repurposing initiatives', 'Material innovation', 'Composite processing']
    },
    hydro: {
      capacity: data.hydroCapacity,
      currentOutput: data.currentHydroOutput,
      avgOutput: data.avgHydroOutput,
      wasteTypes: ['Sediment accumulation', 'Debris collection', 'Maintenance waste'],
      sustainability: ['Sediment management', 'Ecosystem preservation', 'Water quality', 'Biodiversity protection']
    }
  };

  return contexts[energyType as keyof typeof contexts];
};

export const generateSustainabilityPrompts = (energyType: string) => {
  const prompts = {
    solar: [
      "Bagaimana cara optimal mengelola limbah panel surya end-of-life?",
      "Strategi terbaik untuk meningkatkan efisiensi daur ulang panel surya?",
      "Dampak environmental dari heavy metals dalam panel surya lama?",
      "Teknologi terbaru untuk material recovery dari panel surya bekas?"
    ],
    wind: [
      "Solusi inovatif untuk daur ulang blade turbin angin composite?",
      "Bagaimana mengurangi environmental impact dari wind farm?",
      "Strategi repurposing blade turbin angin yang sudah tidak terpakai?",
      "Teknologi pyrolysis untuk blade composite - apakah feasible?"
    ],
    hydro: [
      "Metode terbaik untuk sediment management di reservoir hidroelektrik?",
      "Bagaimana meminimalkan dampak ekosistem dari dam hidroelektrik?",
      "Strategi watershed management untuk sustainability jangka panjang?",
      "Teknologi fish ladder dan wildlife corridor - effectiveness?"
    ]
  };

  return prompts[energyType as keyof typeof prompts] || [];
};

export const validateApiKey = (apiKey?: string): boolean => {
  return !!(apiKey && apiKey.length > 10);
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export class ChatError extends Error {
  constructor(
    message: string,
    public code: 'API_ERROR' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT'
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export const handleApiError = (error: any): ChatError => {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return new ChatError('API rate limit exceeded. Please try again later.', 'RATE_LIMIT');
  }
  
  if (error.code === 'INVALID_API_KEY') {
    return new ChatError('Invalid API key. Please check your configuration.', 'API_ERROR');
  }
  
  if (error.name === 'NetworkError') {
    return new ChatError('Network error. Please check your connection.', 'NETWORK_ERROR');
  }
  
  return new ChatError('An unexpected error occurred. Please try again.', 'API_ERROR');
};