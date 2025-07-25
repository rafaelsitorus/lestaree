// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json(
        { 
          success: false, 
          error: 'API key not configured',
          message: 'Gemini API key not found. Please check environment configuration.'
        },
        { status: 500 }
      );
    }

    const { message, energyType, energyData, useContext = false } = await request.json();

    console.log('API Request received:', { energyType, useContext, hasMessage: !!message });

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';

    if (useContext && energyData) {
      // Predefined prompt dengan context data energi
      prompt = generateContextualPrompt(energyType, energyData, message);
    } else {
      // Regular chat tanpa context khusus
      prompt = `Sebagai ahli energi terbarukan, tolong jawab pertanyaan berikut dengan informatif dan praktis: ${message}`;
    }

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API response received successfully');

    return NextResponse.json({
      success: true,
      message: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // More detailed error handling
    let errorMessage = 'Maaf, terjadi kesalahan dalam menghasilkan respons AI.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid API key. Please check your Gemini API key configuration.';
        statusCode = 401;
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        errorMessage = 'API quota exceeded. Please try again later.';
        statusCode = 429;
      } else if (error.message.includes('SAFETY')) {
        errorMessage = 'Content filtered by safety settings. Please rephrase your question.';
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: errorMessage
      },
      { status: statusCode }
    );
  }
}

function generateContextualPrompt(energyType: string, energyData: any, userMessage: string = '') {
  // Use the actual calculated data from dashboard
  const baseContext = {
    solar: {
      capacity: energyData.solarCapacity || '560 kWH',
      currentOutput: energyData.currentSolarOutput || energyData.avgSolarOutput || 56,
      avgOutput: energyData.avgSolarOutput || 56,
      efficiency: energyData.efficiency || 85,
    },
    wind: {
      capacity: energyData.windCapacity || '450 kWH',
      currentOutput: energyData.currentWindOutput || energyData.avgWindOutput || 42,
      avgOutput: energyData.avgWindOutput || 46,
      efficiency: energyData.efficiency || 85,
    },
    hydro: {
      capacity: energyData.hydroCapacity || '1,150 kWH',
      currentOutput: energyData.currentHydroOutput || energyData.avgHydroOutput || 115,
      avgOutput: energyData.avgHydroOutput || 108,
      efficiency: energyData.efficiency || 85,
    }
  };

  const context = baseContext[energyType as keyof typeof baseContext];
  
  let contextualPrompt = '';

  switch (energyType) {
    case 'solar':
      contextualPrompt = `
Anda adalah ahli teknologi panel surya dan sustainability. Berdasarkan data berikut:

📊 DATA PANEL SURYA:
- Kapasitas Total: ${context.capacity}
- Output Saat Ini: ${context.currentOutput} MW
- Rata-rata Output: ${context.avgOutput} MW  
- Efisiensi Sistem: ${context.efficiency}%

🔍 FOKUS ANALISIS:
1. **Durability & Lifespan**: Estimasi umur panel dengan output ${context.currentOutput} MW
2. **Degradasi Performance**: Tingkat penurunan efisiensi per tahun
3. **Waste Management**: Penanganan limbah panel surya (silicon, aluminum, heavy metals)
4. **Maintenance Schedule**: Jadwal perawatan optimal
5. **Sustainability Impact**: Dampak lingkungan dan solusi berkelanjutan
6. **Economic Analysis**: Analisis biaya operasional dan ROI

${userMessage ? `PERTANYAAN SPESIFIK USER: ${userMessage}` : ''}

Berikan analisis mendalam, praktis, dan actionable dengan data konkret. Gunakan format yang mudah dipahami dengan bullet points dan rekomendasi spesifik.`;
      break;

    case 'wind':
      contextualPrompt = `
Anda adalah ahli teknologi turbin angin dan sustainability. Berdasarkan data berikut:

📊 DATA TURBIN ANGIN:
- Kapasitas Total: ${context.capacity}
- Output Saat Ini: ${context.currentOutput} MW
- Rata-rata Output: ${context.avgOutput} MW
- Efisiensi Sistem: ${context.efficiency}%

🔍 FOKUS ANALISIS:
1. **Turbine Lifespan**: Estimasi umur turbin dengan output ${context.currentOutput} MW
2. **Blade Degradation**: Analisis keausan blade dan performance
3. **Composite Waste**: Penanganan limbah blade fiberglass/carbon fiber
4. **Maintenance Cycles**: Jadwal maintenance predictive dan preventive
5. **Environmental Impact**: Dampak pada ekosistem dan mitigasi
6. **Recycling Innovation**: Teknologi daur ulang blade dan komponen

${userMessage ? `PERTANYAAN SPESIFIK USER: ${userMessage}` : ''}

Berikan insight teknis mendalam dengan fokus pada sustainability dan inovasi penanganan limbah turbin angin.`;
      break;

    case 'hydro':
      contextualPrompt = `
Anda adalah ahli hidroelektrik dan pengelolaan sumber daya air. Berdasarkan data berikut:

📊 DATA HIDROELEKTRIK:
- Kapasitas Total: ${context.capacity}
- Output Saat Ini: ${context.currentOutput} MW
- Rata-rata Output: ${context.avgOutput} MW
- Efisiensi Sistem: ${context.efficiency}%

🔍 FOKUS ANALISIS:
1. **Infrastructure Longevity**: Estimasi umur infrastruktur dengan output ${context.currentOutput} MW
2. **Sediment Management**: Strategi pengelolaan sedimentasi reservoir
3. **Ecosystem Impact**: Dampak pada ekosistem sungai dan mitigasi
4. **Water Quality**: Monitoring kualitas air dan dampak downstream
5. **Seasonal Variations**: Adaptasi terhadap variasi musiman
6. **Environmental Sustainability**: Program konservasi watershed

${userMessage ? `PERTANYAAN SPESIFIK USER: ${userMessage}` : ''}

Berikan analisis komprehensif dengan fokus pada sustainability jangka panjang dan pengelolaan ekosistem air.`;
      break;

    default:
      contextualPrompt = `Sebagai ahli energi terbarukan, analisis data energi yang diberikan dan berikan insight tentang sustainability dan pengelolaan limbah. ${userMessage}`;
  }

  return contextualPrompt;
}