import { PrismaClient } from '../src/generated/prisma'
import monthlyAvgData from '../monthly_avg.json'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data (optional - be careful in production!)
  await prisma.provinceData.deleteMany()
  await prisma.energyType.deleteMany()
  await prisma.province.deleteMany()
  await prisma.island.deleteMany()

  // Insert Islands
  const islands = await prisma.island.createMany({
    data: [
      { islandName: 'Jawa' },
      { islandName: 'Sumatra' },
      { islandName: 'Sulawesi' },
      { islandName: 'Kalimantan' },
      { islandName: 'Papua' },
      { islandName: 'Maluku' },
      { islandName: 'Nusa Tenggara' },
    ],
  })

  // Insert Provinces with proper capitalization to match your JSON
  const provinces = await prisma.province.createMany({
    data: [
      // Java provinces
      { provinceName: 'DKI JAKARTA', islandName: 'Jawa', primarySource: null },
      { provinceName: 'JAWA BARAT', islandName: 'Jawa', primarySource: null },
      { provinceName: 'JAWA TENGAH', islandName: 'Jawa', primarySource: null },
      { provinceName: 'JAWA TIMUR', islandName: 'Jawa', primarySource: null },
      { provinceName: 'DI YOGYAKARTA', islandName: 'Jawa', primarySource: null },
      { provinceName: 'BANTEN', islandName: 'Jawa', primarySource: null },
      
      // Sumatra provinces
      { provinceName: 'SUMATERA UTARA', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'SUMATERA BARAT', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'SUMATERA SELATAN', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'RIAU', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'ACEH', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'JAMBI', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'BENGKULU', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'LAMPUNG', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'KEPULAUAN RIAU', islandName: 'Sumatra', primarySource: null },
      { provinceName: 'KEPULAUAN BANGKA BELITUNG', islandName: 'Sumatra', primarySource: null },
      
      // Sulawesi provinces
      { provinceName: 'SULAWESI UTARA', islandName: 'Sulawesi', primarySource: null },
      { provinceName: 'SULAWESI SELATAN', islandName: 'Sulawesi', primarySource: null },
      { provinceName: 'SULAWESI TENGAH', islandName: 'Sulawesi', primarySource: null },
      { provinceName: 'SULAWESI TENGGARA', islandName: 'Sulawesi', primarySource: null },
      { provinceName: 'SULAWESI BARAT', islandName: 'Sulawesi', primarySource: null },
      { provinceName: 'GORONTALO', islandName: 'Sulawesi', primarySource: null },
      
      // Kalimantan provinces
      { provinceName: 'KALIMANTAN BARAT', islandName: 'Kalimantan', primarySource: null },
      { provinceName: 'KALIMANTAN SELATAN', islandName: 'Kalimantan', primarySource: null },
      { provinceName: 'KALIMANTAN TENGAH', islandName: 'Kalimantan', primarySource: null },
      { provinceName: 'KALIMANTAN TIMUR', islandName: 'Kalimantan', primarySource: null },
      { provinceName: 'KALIMANTAN UTARA', islandName: 'Kalimantan', primarySource: null },
      
      // Papua provinces
      { provinceName: 'PAPUA', islandName: 'Papua', primarySource: null },
      { provinceName: 'PAPUA BARAT', islandName: 'Papua', primarySource: null },
      { provinceName: 'PAPUA BARAT DAYA', islandName: 'Papua', primarySource: null },
      { provinceName: 'PAPUA PEGUNUNGAN', islandName: 'Papua', primarySource: null },
      { provinceName: 'PAPUA SELATAN', islandName: 'Papua', primarySource: null },
      { provinceName: 'PAPUA TENGAH', islandName: 'Papua', primarySource: null },

      // Maluku provinces (from your JSON)
      { provinceName: 'MALUKU', islandName: 'Maluku', primarySource: null },
      { provinceName: 'MALUKU UTARA', islandName: 'Maluku', primarySource: null },

      // Nusa Tenggara provinces (from your JSON)
      { provinceName: 'NUSA TENGGARA BARAT', islandName: 'Nusa Tenggara', primarySource: null },
      { provinceName: 'NUSA TENGGARA TIMUR', islandName: 'Nusa Tenggara', primarySource: null },
      { provinceName: 'BALI', islandName: 'Nusa Tenggara', primarySource: null },
    ],
  })

  // Insert Energy Types
  const energyTypes = await prisma.energyType.createMany({
    data: [
      { energyID: 'WIND', energyName: 'Wind Energy' },
      { energyID: 'SOLAR', energyName: 'Solar Energy' },
      { energyID: 'HYDRO', energyName: 'Hydro Energy' },
    ],
  })

  console.log('✅ Base data inserted successfully!')

  // Insert your wind energy data from JSON
  let insertedCount = 0;
  let errorCount = 0;

  for (const data of monthlyAvgData) {
    try {
      await prisma.provinceData.create({
        data: {
          provinceName: data.Province,
          energyID: 'WIND',
          month: data.Month,
          output: data['Energy Production (kWH)'],
        },
      })
      insertedCount++;
    } catch (error) {
      console.log(`❌ Error inserting data for ${data.Province}, Month ${data.Month}:`, error);
      errorCount++;
    }
  }

  console.log(`✅ Wind energy data insertion complete!`);
  console.log(`📊 Successfully inserted: ${insertedCount} records`);
  console.log(`❌ Errors: ${errorCount} records`);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })