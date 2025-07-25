export interface Area {
  id: string;
  name: string;
  coordinates: [number, number];
  totalOutput: string;
  primarySource: string;
  efficiency: number;
  provinceName?: string;
}

export interface IslandConfig {
  center: [number, number];
  zoom: number;
  name: string;
  areas: Area[];
}

export const islandConfigs: Record<string, IslandConfig> = {
  jawa: {
    center: [-7.5, 110.0],
    zoom: 8,
    name: "Java",
    areas: [
      {
        id: "jakarta",
        name: "Jakarta",
        coordinates: [-6.2, 106.816],
        totalOutput: "1,250 MW",
        primarySource: "Solar",
        efficiency: 87,
        provinceName: "DKI JAKARTA"
      },
      {
        id: "surabaya",
        name: "Surabaya",
        coordinates: [-7.25, 112.75],
        totalOutput: "980 MW",
        primarySource: "Wind",
        efficiency: 92,
        provinceName: "JAWA TIMUR"
      },
      {
        id: "bandung",
        name: "Bandung",
        coordinates: [-6.9, 107.6],
        totalOutput: "750 MW",
        primarySource: "Hydro",
        efficiency: 89,
        provinceName: "JAWA BARAT"
      },
      {
        id: "semarang",
        name: "Semarang",
        coordinates: [-6.97, 110.42],
        totalOutput: "560 MW",
        primarySource: "Solar",
        efficiency: 84,
        provinceName: "JAWA TENGAH"
      },
    ],
  },
  sumatera: {
    center: [-0.5, 101.5],
    zoom: 7,
    name: "Sumatera",
    areas: [
      {
        id: "medan",
        name: "Medan",
        coordinates: [3.58, 98.65],
        totalOutput: "890 MW",
        primarySource: "Hydro",
        efficiency: 91,
        provinceName: "SUMATERA UTARA"
      },
      {
        id: "palembang",
        name: "Palembang",
        coordinates: [-2.91, 104.7],
        totalOutput: "670 MW",
        primarySource: "Solar",
        efficiency: 85,
        provinceName: "SUMATERA SELATAN"
      },
      {
        id: "pekanbaru",
        name: "Pekanbaru",
        coordinates: [0.53, 101.45],
        totalOutput: "520 MW",
        primarySource: "Wind",
        efficiency: 88,
        provinceName: "RIAU"
      },
      {
        id: "lampung",
        name: "Bandar Lampung",
        coordinates: [-5.45, 105.27],
        totalOutput: "430 MW",
        primarySource: "Geothermal",
        efficiency: 93,
        provinceName: "LAMPUNG"
      },
    ],
  },
  sulawesi: {
    center: [-2.5, 120.0],
    zoom: 7,
    name: "Sulawesi",
    areas: [
      {
        id: "makassar",
        name: "Makassar",
        coordinates: [-5.14, 119.43],
        totalOutput: "720 MW",
        primarySource: "Wind",
        efficiency: 86,
        provinceName: "SULAWESI SELATAN"
      },
      {
        id: "manado",
        name: "Manado",
        coordinates: [1.48, 124.85],
        totalOutput: "450 MW",
        primarySource: "Geothermal",
        efficiency: 93,
        provinceName: "SULAWESI UTARA"
      },
      {
        id: "kendari",
        name: "Kendari",
        coordinates: [-3.95, 122.5],
        totalOutput: "380 MW",
        primarySource: "Hydro",
        efficiency: 89,
        provinceName: "SULAWESI TENGGARA"
      },
      {
        id: "palu",
        name: "Palu",
        coordinates: [-0.9, 119.87],
        totalOutput: "290 MW",
        primarySource: "Solar",
        efficiency: 82,
        provinceName: "SULAWESI TENGAH"
      },
    ],
  },
  kalimantan: {
    center: [-1.0, 114.0],
    zoom: 6,
    name: "Kalimantan",
    areas: [
      {
        id: "banjarmasin",
        name: "Banjarmasin",
        coordinates: [-3.32, 114.59],
        totalOutput: "640 MW",
        primarySource: "Solar",
        efficiency: 87,
        provinceName: "KALIMANTAN SELATAN"
      },
      {
        id: "balikpapan",
        name: "Balikpapan",
        coordinates: [-1.27, 116.83],
        totalOutput: "580 MW",
        primarySource: "Wind",
        efficiency: 90,
        provinceName: "KALIMANTAN TIMUR"
      },
      {
        id: "pontianak",
        name: "Pontianak",
        coordinates: [-0.03, 109.32],
        totalOutput: "420 MW",
        primarySource: "Hydro",
        efficiency: 84,
        provinceName: "KALIMANTAN BARAT"
      },
      {
        id: "samarinda",
        name: "Samarinda",
        coordinates: [-0.5, 117.15],
        totalOutput: "350 MW",
        primarySource: "Solar",
        efficiency: 85,
        provinceName: "KALIMANTAN TIMUR"
      },
    ],
  },
  papua: {
    center: [-4.0, 138.0],
    zoom: 6,
    name: "Papua",
    areas: [
      {
        id: "jayapura",
        name: "Jayapura",
        coordinates: [-2.53, 140.7],
        totalOutput: "320 MW",
        primarySource: "Hydro",
        efficiency: 91,
        provinceName: "PAPUA"
      },
      {
        id: "sorong",
        name: "Sorong",
        coordinates: [-0.86, 131.25],
        totalOutput: "280 MW",
        primarySource: "Solar",
        efficiency: 87,
        provinceName: "PAPUA BARAT"
      },
      {
        id: "merauke",
        name: "Merauke",
        coordinates: [-8.5, 140.4],
        totalOutput: "180 MW",
        primarySource: "Wind",
        efficiency: 84,
        provinceName: "PAPUA SELATAN"
      },
    ],
  },
};

export const getIslandConfig = (mapId: string): IslandConfig | null => {
  return islandConfigs[mapId.toLowerCase()] || null;
};

export const getAllIslands = (): string[] => {
  return Object.keys(islandConfigs);
};