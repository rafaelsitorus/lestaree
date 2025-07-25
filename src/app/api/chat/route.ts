// src/app/api/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback analysis generator for when API quota is exceeded
function generateFallbackAnalysis(energyType: string, energyData: any): string {
  const context = {
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

  const data = context[energyType as keyof typeof context];

  switch (energyType) {
    case 'solar':
      return `## 🌞 Analisis Sustainability Panel Surya

**📊 STATUS OPERASIONAL:**
- Kapasitas Total: ${data.capacity}
- Output Saat Ini: ${data.currentOutput} MW
- Rata-rata Output: ${data.avgOutput} MW
- Efisiensi Sistem: ${data.efficiency}%

**🔍 ANALISIS KEBERLANGSUNGAN:**

**1. Durability & Lifespan**
Dengan output stabil ${data.currentOutput} MW, panel surya ini memiliki proyeksi umur operasional 20-25 tahun. Tingkat degradasi normal sekitar 0.5-0.8% per tahun.

**2. Waste Management Challenges**
- **Limbah Utama:** Panel akhir masa pakai mengandung silikon, aluminium, kaca, dan jejak logam berat
- **Volume Limbah:** Diperkirakan ${Math.round(data.avgOutput * 0.1)} ton material per tahun memerlukan pengelolaan khusus

**3. Solusi Berkelanjutan**
- Implementasi program **daur ulang panel** dengan fasilitas khusus recovery material
- Prioritas pengadaan panel yang dirancang untuk **pembongkaran mudah**
- Kemitraan dengan manufaktur untuk **take-back program**

**🌱 REKOMENDASI ACTIONABLE:**
- Monitoring degradasi bulanan untuk optimasi replacement timing
- Investasi teknologi recycling silicon dan rare metals
- Pengembangan second-life applications untuk panel degraded`;

    case 'wind':
      return `## 💨 Analisis Sustainability Turbin Angin

**📊 STATUS OPERASIONAL:**
- Kapasitas Total: ${data.capacity}
- Output Saat Ini: ${data.currentOutput} MW
- Rata-rata Output: ${data.avgOutput} MW
- Efisiensi Sistem: ${data.efficiency}%

**🔍 ANALISIS KEBERLANGSUNGAN:**

**1. Turbine Lifespan Assessment**
Dengan performa ${data.currentOutput} MW, estimasi umur operasional 20-25 tahun dengan maintenance reguler setiap 6 bulan.

**2. Blade Waste Management Crisis**
- **Limbah Utama:** Blade fiberglass/carbon fiber (${Math.round(data.avgOutput * 0.15)} ton/tahun)
- **Challenge:** Material komposit sulit didaur ulang dengan teknologi konvensional
- **Environmental Impact:** Potensi 2,500 ton blade waste dalam 20 tahun

**3. Innovative Recycling Solutions**
- **Mechanical Grinding:** Konversi blade menjadi cement filler dan composite pellets
- **Pyrolysis Technology:** Recovery fiber dan resin untuk aplikasi baru
- **Chemical Recycling:** Solvolysis untuk decompose composite materials

**🌱 BREAKTHROUGH SOLUTIONS:**
- Pilot project blade-to-building materials (concrete additive)
- Partnership dengan startup recycling blade composite
- R&D modular blade design untuk easier disassembly
- Investment dalam pyrolysis facilities untuk regional scale

**📈 SUSTAINABILITY METRICS:**
- Target 85% blade material recovery by 2030
- Reduced landfill waste: ${Math.round(data.avgOutput * 12)} ton/decade`;

    case 'hydro':
      return `## 🌊 Analisis Sustainability Hidroelektrik

**📊 STATUS OPERASIONAL:**
- Kapasitas Total: ${data.capacity}
- Output Saat Ini: ${data.currentOutput} MW
- Rata-rata Output: ${data.avgOutput} MW
- Efisiensi Sistem: ${data.efficiency}%

**🔍 ANALISIS KEBERLANGSUNGAN:**

**1. Infrastructure Longevity**
Dengan output ${data.currentOutput} MW, infrastruktur dapat beroperasi 50-100 tahun dengan maintenance proper. ROI jangka panjang sangat menguntungkan.

**2. Sediment Management Strategy**
- **Challenge:** Akumulasi ${Math.round(data.avgOutput * 100)} m³ sedimen/tahun
- **Impact:** Reduksi kapasitas reservoir 2-3% per dekade
- **Downstream Effect:** Alterasi ekosistem sungai dan nutrient flow

**3. Ecosystem Preservation Solutions**
- **Fish Ladder Installation:** Restoration migrasi ikan natural
- **Selective Withdrawal:** Teknologi pengambilan air berlapis untuk maintain temperature
- **Sediment Flushing:** Periodic controlled release untuk river health

**🌿 ENVIRONMENTAL STEWARDSHIP:**

**Water Quality Management:**
- Real-time monitoring dissolved oxygen dan temperature
- Automated aeration systems untuk maintain aquatic life
- Nutrient management untuk prevent eutrophication

**Watershed Conservation:**
- Reforestation program: 500 hectare/tahun
- Soil erosion control dengan terracing systems
- Community-based river guardian programs

**📊 SUSTAINABILITY TARGETS:**
- Maintain 95% original reservoir capacity
- Zero net biodiversity loss dalam watershed area
- 100% sustainable sediment management by 2028

**🔄 CIRCULAR ECONOMY INTEGRATION:**
- Sedimen recovery untuk agricultural soil enhancement
- Biomass management untuk renewable energy integration`;

    default:
      return `## 🔋 Analisis Energi Terbarukan

Sistem energi dengan kapasitas ${data.capacity} menunjukkan performa stabil. Fokus sustainability mencakup lifecycle management, waste reduction, dan ecosystem preservation.

**Key Recommendations:**
- Implementasi circular economy principles
- Investment dalam recycling technologies
- Community-based environmental stewardship
- Long-term sustainability monitoring`;
  }
}

export async function POST(request: NextRequest) {
  let energyType: string = '';
  let energyData: any = null;
  let useContext: boolean = false;

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

    const { message, energyType: reqEnergyType, energyData: reqEnergyData, useContext: reqUseContext = false } = await request.json();
    
    // Set variables in outer scope
    energyType = reqEnergyType || '';
    energyData = reqEnergyData || null;
    useContext = reqUseContext || false;

    console.log('API Request received:', { energyType, useContext, hasMessage: !!message });

    // Validate energyData when useContext is true
    if (useContext && !energyData) {
      console.warn('Missing energyData for contextual request');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing energy data',
          message: 'Data energi tidak tersedia untuk analisis kontekstual.'
        },
        { status: 400 }
      );
    }

    // Check if energyData has meaningful values
    if (useContext && energyData) {
      const hasValidOutputs = energyData.avgSolarOutput > 0 || 
                             energyData.avgWindOutput > 0 || 
                             energyData.avgHydroOutput > 0;
      
      if (!hasValidOutputs) {
        console.warn('EnergyData has no valid outputs');
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid energy data',
            message: 'Data energi masih kosong atau sedang dimuat.'
          },
          { status: 400 }
        );
      }
    }

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
    
    // Check if this is a quota exceeded error
    const isQuotaError = error instanceof Error && 
      (error.message.includes('QUOTA_EXCEEDED') || 
       error.message.includes('429') || 
       error.message.includes('Too Many Requests'));
    
    if (isQuotaError && useContext && energyData) {
      console.log('🔄 API quota exceeded, using fallback analysis for', energyType);
      
      // Use fallback analysis when quota is exceeded
      const fallbackAnalysis = generateFallbackAnalysis(energyType, energyData);
      
      return NextResponse.json({
        success: true,
        message: fallbackAnalysis + '\n\n---\n*Analisis ini dibuat menggunakan sistem fallback karena kuota API harian telah tercapai.*',
        timestamp: new Date().toISOString(),
        isFallback: true
      });
    }
    
    // More detailed error handling for other errors
    let errorMessage = 'Maaf, terjadi kesalahan dalam menghasilkan respons AI.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        errorMessage = 'Invalid API key. Please check your Gemini API key configuration.';
        statusCode = 401;
      } else if (isQuotaError) {
        errorMessage = 'Kuota API harian telah habis. Sistem akan menggunakan analisis default sementara.';
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
        message: errorMessage,
        isQuotaExceeded: isQuotaError
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