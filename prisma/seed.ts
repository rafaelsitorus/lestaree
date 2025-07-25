import { PrismaClient } from '../src/generated/prisma'
import monthlyAvgData from '../monthly_avg.json'
import solarData from '../monthly_avg_solar.json'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data (optional - be careful in production!)
    console.log('🧹 Clearing existing data...');
    await prisma.provinceData.deleteMany()
    await prisma.energyType.deleteMany()
    await prisma.province.deleteMany()
    await prisma.island.deleteMany()

    // Insert Islands (Fixed: Sumatera not Sumatra)
    console.log('🏝️ Creating islands...');
    const islands = await prisma.island.createMany({
      data: [
        { islandName: 'Jawa' },
        { islandName: 'Sumatera' },  // Fixed: was 'Sumatra'
        { islandName: 'Sulawesi' },
        { islandName: 'Kalimantan' },
        { islandName: 'Papua' },
        { islandName: 'Maluku' },
        { islandName: 'Nusa Tenggara' },
      ],
    })

    // Insert Provinces with proper capitalization to match your JSON
    console.log('📍 Creating provinces...');
    const provinces = await prisma.province.createMany({
      data: [
        // Java provinces
        { provinceName: 'DKI JAKARTA', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA BARAT', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA TENGAH', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA TIMUR', islandName: 'Jawa', primarySource: null },
        { provinceName: 'DI YOGYAKARTA', islandName: 'Jawa', primarySource: null },
        { provinceName: 'BANTEN', islandName: 'Jawa', primarySource: null },
        
        // Sumatera provinces (Fixed: was 'Sumatera')
        { provinceName: 'SUMATERA UTARA', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'SUMATERA BARAT', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'SUMATERA SELATAN', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'RIAU', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'ACEH', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'JAMBI', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'BENGKULU', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'LAMPUNG', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'KEPULAUAN RIAU', islandName: 'Sumatera', primarySource: null },
        { provinceName: 'KEPULAUAN BANGKA BELITUNG', islandName: 'Sumatera', primarySource: null },
        
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

        // Maluku provinces
        { provinceName: 'MALUKU', islandName: 'Maluku', primarySource: null },
        { provinceName: 'MALUKU UTARA', islandName: 'Maluku', primarySource: null },

        // Nusa Tenggara provinces
        { provinceName: 'NUSA TENGGARA BARAT', islandName: 'Nusa Tenggara', primarySource: null },
        { provinceName: 'NUSA TENGGARA TIMUR', islandName: 'Nusa Tenggara', primarySource: null },
        { provinceName: 'BALI', islandName: 'Nusa Tenggara', primarySource: null },
      ],
    })

    // Insert Energy Types
    console.log('⚡ Creating energy types...');
    const energyTypes = await prisma.energyType.createMany({
      data: [
        { energyID: 'WIND', energyName: 'Wind Energy' },
        { energyID: 'SOLAR', energyName: 'Solar Energy' },
        { energyID: 'HYDRO', energyName: 'Hydro Energy' },
      ],
    })

    console.log('✅ Base data inserted successfully!')

    // Function to normalize province names (handle case differences)
    const normalizeProvinceName = (name: string): string => {
      const nameMap: Record<string, string> = {
        'Aceh': 'ACEH',
        'Bali': 'BALI',
        'Banten': 'BANTEN',
        'Bengkulu': 'BENGKULU',
        'DI Yogyakarta': 'DI YOGYAKARTA',
        'DKI Jakarta': 'DKI JAKARTA',
        'Gorontalo': 'GORONTALO',
        'Jambi': 'JAMBI',
        'Jawa Barat': 'JAWA BARAT',
        'Jawa Tengah': 'JAWA TENGAH',
        'Jawa Timur': 'JAWA TIMUR',
        'Kalimantan Barat': 'KALIMANTAN BARAT',
        'Kalimantan Selatan': 'KALIMANTAN SELATAN',
        'Kalimantan Tengah': 'KALIMANTAN TENGAH',
        'Kalimantan Timur': 'KALIMANTAN TIMUR',
        'Kalimantan Utara': 'KALIMANTAN UTARA',
        'Kepulauan Bangka Belitung': 'KEPULAUAN BANGKA BELITUNG',
        'Kepulauan Riau': 'KEPULAUAN RIAU',
        'Lampung': 'LAMPUNG',
        'Maluku': 'MALUKU',
        'Maluku Utara': 'MALUKU UTARA',
        'Nusa Tenggara Barat': 'NUSA TENGGARA BARAT',
        'Nusa Tenggara Timur': 'NUSA TENGGARA TIMUR',
        'Papua': 'PAPUA',
        'Papua Barat': 'PAPUA BARAT',
        'Papua Barat Daya': 'PAPUA BARAT DAYA',
        'Papua Pegunungan': 'PAPUA PEGUNUNGAN',
        'Papua Selatan': 'PAPUA SELATAN',
        'Papua Tengah': 'PAPUA TENGAH',
        'Riau': 'RIAU',
        'Sulawesi Barat': 'SULAWESI BARAT',
        'Sulawesi Selatan': 'SULAWESI SELATAN',
        'Sulawesi Tengah': 'SULAWESI TENGAH',
        'Sulawesi Tenggara': 'SULAWESI TENGGARA',
        'Sulawesi Utara': 'SULAWESI UTARA',
        'Sumatera Barat': 'SUMATERA BARAT',
        'Sumatera Selatan': 'SUMATERA SELATAN',
        'Sumatera Utara': 'SUMATERA UTARA',
      };
      
      return nameMap[name] || name.toUpperCase();
    };

    // Insert Wind Energy Data
    console.log('🌪️ Inserting wind energy data...');
    let windInsertedCount = 0;
    let windErrorCount = 0;

    for (const data of monthlyAvgData) {
      try {
        const normalizedProvince = normalizeProvinceName(data.Province);
        await prisma.provinceData.create({
          data: {
            provinceName: normalizedProvince,
            energyID: 'WIND',
            month: data.Month,
            output: data['Energy Production (kWH)'],
          },
        });
        windInsertedCount++;
      } catch (error) {
        console.log(`❌ Error inserting wind data for ${data.Province}, Month ${data.Month}:`, error);
        windErrorCount++;
      }
    }

    console.log(`✅ Wind energy data insertion complete!`);
    console.log(`📊 Successfully inserted: ${windInsertedCount} wind records`);
    console.log(`❌ Wind errors: ${windErrorCount} records`);

    // Insert Solar Energy Data
    console.log('☀️ Inserting solar energy data...');
    let solarInsertedCount = 0;
    let solarErrorCount = 0;

    for (const data of solarData) {
      try {
        const normalizedProvince = normalizeProvinceName(data.Province);
        await prisma.provinceData.create({
          data: {
            provinceName: normalizedProvince,
            energyID: 'SOLAR',
            month: data.Month,
            output: data['Energy production (kWh)'],
          },
        });
        solarInsertedCount++;
      } catch (error) {
        console.log(`❌ Error inserting solar data for ${data.Province}, Month ${data.Month}:`, error);
        solarErrorCount++;
      }
    }

    console.log(`✅ Solar energy data insertion complete!`);
    console.log(`📊 Successfully inserted: ${solarInsertedCount} solar records`);
    console.log(`❌ Solar errors: ${solarErrorCount} records`);

    // Summary
    console.log('\n🎉 SEED SUMMARY:');
    console.log(`Total Wind Records: ${windInsertedCount}`);
    console.log(`Total Solar Records: ${solarInsertedCount}`);
    console.log(`Total Records: ${windInsertedCount + solarInsertedCount}`);
    console.log(`Total Errors: ${windErrorCount + solarErrorCount}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log('🎯 Seeding completed successfully!');
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })