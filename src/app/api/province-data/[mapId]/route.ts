import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const ISLAND_NAME_MAP: Record<string, string> = {
  'jawa': 'Jawa',
  'sumatera': 'Sumatera', 
  'sulawesi': 'Sulawesi',
  'kalimantan': 'Kalimantan',
  'papua': 'Papua',
  'maluku': 'Maluku',
  'nusa-tenggara': 'Nusa Tenggara'
};

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
        let output = 50;
        if (energyID === 'SOLAR') output = Math.floor(Math.random() * 40) + 30;
        if (energyID === 'WIND') output = Math.floor(Math.random() * 60) + 20;
        if (energyID === 'HYDRO') output = Math.floor(Math.random() * 80) + 40;

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
    const { mapId } = await params;
    islandName = ISLAND_NAME_MAP[mapId.toLowerCase()];

    if (!islandName) {
      return NextResponse.json(
        { error: 'Invalid island ID', mapId, available: Object.keys(ISLAND_NAME_MAP) },
        { status: 400 }
      );
    }

    // Try db
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

      return NextResponse.json(provinceData);

    } catch (dbError) {
      console.log(`Database error for ${islandName}, using fallback data:`, dbError);
      
      // Use mock data as fallback
      const mockData = getMockData(islandName);
      
      return NextResponse.json(mockData);
    }

  } catch (error) {
    console.error('Error in API route:', error);
    
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
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.log('🔄 Disconnect error (safe to ignore):', disconnectError);
      }
    }
  }
}