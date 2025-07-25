import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// Map route params to database island names (matching your seed data)
const ISLAND_NAME_MAP: Record<string, string> = {
  'jawa': 'Jawa',
  'sumatra': 'Sumatra', 
  'sulawesi': 'Sulawesi',
  'kalimantan': 'Kalimantan',
  'papua': 'Papua',
  'maluku': 'Maluku',
  'nusa-tenggara': 'Nusa Tenggara'
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mapId: string }> }
) {
  try {
    // Await the params since they're now a Promise in newer Next.js versions
    const { mapId } = await params;
    const islandName = ISLAND_NAME_MAP[mapId.toLowerCase()];

    console.log(`🔍 API called with mapId: ${mapId}, mapped to: ${islandName}`);

    if (!islandName) {
      return NextResponse.json(
        { error: 'Invalid island ID', mapId, available: Object.keys(ISLAND_NAME_MAP) },
        { status: 400 }
      );
    }

    // Fetch all province data for the island
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

    console.log(`✅ Found ${provinceData.length} records for ${islandName}`);

    return NextResponse.json(provinceData);

  } catch (error) {
    console.error('Error fetching province data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch province data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}