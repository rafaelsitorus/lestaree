import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

// Map route params to database island names (matching your seed data)
const ISLAND_NAME_MAP: Record<string, string> = {
  'jawa': 'Jawa',
  'sumatera': 'Sumatera', 
  'sulawesi': 'Sulawesi',
  'kalimantan': 'Kalimantan',
  'papua': 'Papua',
  'maluku': 'Maluku',
  'nusa-tenggara': 'Nusa Tenggara'
};

// Fallback mock data when database fails
const getMockData = (islandName: string) => {
  const baseData = [];
  const provinces = {
    'Jawa': ['DKI JAKARTA', 'JAWA BARAT', 'JAWA TENGAH', 'JAWA TIMUR', 'DI YOGYAKARTA', 'BANTEN'],
    'Sumatera': ['SUMATERA UTARA', 'SUMATERA BARAT', 'SUMATERA SELATAN', 'RIAU', 'ACEH'],
    'Sulawesi': ['SULAWESI UTARA', 'SULAWESI SELATAN', 'SULAWESI TENGAH'],
    'Kalimantan': ['KALIMANTAN BARAT', 'KALIMANTAN SELATAN', 'KALIMANTAN TENGAH'],
    'Papua': ['PAPUA', 'PAPUA BARAT']
  };

  const energyTypes = ['SOLAR', 'WIND', 'HYDRO'];
  const islandProvinces = provinces[islandName as keyof typeof provinces] || provinces.Jawa;

  let id = 1;
  for (const provinceName of islandProvinces) {
    for (const energyID of energyTypes) {
      for (let month = 1; month <= 12; month++) {
        // Generate realistic output values
        let output = 50;
        if (energyID === 'SOLAR') output = Math.floor(Math.random() * 40) + 30; // 30-70
        if (energyID === 'WIND') output = Math.floor(Math.random() * 60) + 20; // 20-80
        if (energyID === 'HYDRO') output = Math.floor(Math.random() * 80) + 40; // 40-120

        baseData.push({
          id: id++,
          provinceName,
          energyID,
          month,
          output,
          province: {
            provinceName,
            islandName,
            primarySource: energyID
          },
          energyType: {
            energyID,
            energyName: energyID.charAt(0) + energyID.slice(1).toLowerCase()
          }
        });
      }
    }
  }

  return baseData;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  let islandName: string | undefined;
  let prisma: PrismaClient | undefined;
  
  try {
    // Await the params since they're now a Promise in newer Next.js versions
    const { mapId } = await params;
    islandName = ISLAND_NAME_MAP[mapId.toLowerCase()];

    console.log(`🔍 API called with mapId: ${mapId}, mapped to: ${islandName}`);

    if (!islandName) {
      return NextResponse.json(
        { error: 'Invalid island ID', mapId, available: Object.keys(ISLAND_NAME_MAP) },
        { status: 400 }
      );
    }

    // Try database first
    try {
      prisma = new PrismaClient({
        log: ['error'],
      });

      const provinceData = await prisma.provinceData.findMany({
        where: {
          province: {
            islandName: islandName
          }
        },
        include: {
          province: {
            select: {
              provinceName: true,
              islandName: true,
              primarySource: true
            }
          },
          energyType: {
            select: {
              energyID: true,
              energyName: true
            }
          }
        },
        orderBy: [
          { provinceName: 'asc' },
          { energyID: 'asc' },
          { month: 'asc' }
        ]
      });

      console.log(`✅ Found ${provinceData.length} records for ${islandName} from database`);
      return NextResponse.json(provinceData);

    } catch (dbError) {
      console.log(`⚠️ Database error for ${islandName}, using fallback data:`, dbError);
      
      // Use mock data as fallback
      const mockData = getMockData(islandName);
      console.log(`✅ Generated ${mockData.length} mock records for ${islandName}`);
      
      return NextResponse.json(mockData);
    }

  } catch (error) {
    console.error('Error in API route:', error);
    
    // Last resort: return basic mock data
    if (islandName) {
      const mockData = getMockData(islandName);
      console.log(`🔄 Fallback: Generated ${mockData.length} mock records for ${islandName}`);
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch province data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    // Always disconnect the client when done
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.log('🔄 Disconnect error (safe to ignore):', disconnectError);
      }
    }
  }
}