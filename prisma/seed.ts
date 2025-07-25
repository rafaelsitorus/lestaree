import { PrismaClient } from '../src/generated/prisma'
import monthlyAvgData from '../monthly_avg.json'
import solarData from '../monthly_avg_solar.json'
import hydroData from '../monthly_avg_hydro.json'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    await prisma.$disconnect()
    await prisma.$connect()
    
    console.log('Clearing existing data');
    
    await prisma.$executeRaw`TRUNCATE TABLE "province_data" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "energy_types" CASCADE`;  
    await prisma.$executeRaw`TRUNCATE TABLE "provinces" CASCADE`;
    await prisma.$executeRaw`TRUNCATE TABLE "islands" CASCADE`;

    // Island
    const islands = await prisma.island.createMany({
      data: [
        { islandName: 'Jawa' },
        { islandName: 'Sumatera' },
        { islandName: 'Sulawesi' },
        { islandName: 'Kalimantan' },
        { islandName: 'Papua' },
        { islandName: 'Maluku' },
        { islandName: 'Nusa Tenggara' },
      ],
    })

    // Province
    const provinces = await prisma.province.createMany({
      data: [
        // Java provinces
        { provinceName: 'DKI JAKARTA', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA BARAT', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA TENGAH', islandName: 'Jawa', primarySource: null },
        { provinceName: 'JAWA TIMUR', islandName: 'Jawa', primarySource: null },
        { provinceName: 'DI YOGYAKARTA', islandName: 'Jawa', primarySource: null },
        { provinceName: 'BANTEN', islandName: 'Jawa', primarySource: null },
        
        // Sumatera provinces
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

    // Energy
    const energyTypes = await prisma.energyType.createMany({
      data: [
        { energyID: 'WIND', energyName: 'Wind Energy' },
        { energyID: 'SOLAR', energyName: 'Solar Energy' },
        { energyID: 'HYDRO', energyName: 'Hydro Energy' },
      ],
    })

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

    // Wind Energy
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
        console.log(`Error inserting wind data for ${data.Province}, Month ${data.Month}:`, error);
        windErrorCount++;
      }
    }

    // Solar Energy
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

    // Hydro Energy
    let hydroInsertedCount = 0;
    let hydroErrorCount = 0;

    for (const data of hydroData) {
      try {
        const normalizedProvince = normalizeProvinceName(data.Prov);
        await prisma.provinceData.create({
          data: {
            provinceName: normalizedProvince,
            energyID: 'HYDRO',
            month: data.month,
            output: data['energy (kWh)'],
          },
        });
        hydroInsertedCount++;
      } catch (error) {
        console.log(`❌ Error inserting hydro data for ${data.Prov}, Month ${data.month}:`, error);
        hydroErrorCount++;
      }
    }


    // Summary
    console.log(`Total Wind Records: ${windInsertedCount}`);
    console.log(`Total Solar Records: ${solarInsertedCount}`);
    console.log(`Total Hydro Records: ${hydroInsertedCount}`);
    console.log(`Total Records: ${windInsertedCount + solarInsertedCount + hydroInsertedCount}`);
    console.log(`Total Errors: ${windErrorCount + solarErrorCount + hydroErrorCount}`);

  } catch (error) {
    console.error('❌ Error cok: ', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    console.log('🎯 Seeding completed successfully!');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })