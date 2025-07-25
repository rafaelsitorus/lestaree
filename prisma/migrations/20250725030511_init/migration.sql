-- CreateTable
CREATE TABLE "islands" (
    "id" SERIAL NOT NULL,
    "islandName" TEXT NOT NULL,

    CONSTRAINT "islands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "provinceName" TEXT NOT NULL,
    "islandName" TEXT NOT NULL,
    "primarySource" TEXT,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "energy_types" (
    "id" SERIAL NOT NULL,
    "energyID" TEXT NOT NULL,
    "energyName" TEXT NOT NULL,

    CONSTRAINT "energy_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "province_data" (
    "id" SERIAL NOT NULL,
    "provinceName" TEXT NOT NULL,
    "energyID" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "output" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "province_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "islands_islandName_key" ON "islands"("islandName");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_provinceName_key" ON "provinces"("provinceName");

-- CreateIndex
CREATE UNIQUE INDEX "energy_types_energyID_key" ON "energy_types"("energyID");

-- CreateIndex
CREATE UNIQUE INDEX "province_data_provinceName_energyID_month_key" ON "province_data"("provinceName", "energyID", "month");

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_islandName_fkey" FOREIGN KEY ("islandName") REFERENCES "islands"("islandName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "province_data" ADD CONSTRAINT "province_data_provinceName_fkey" FOREIGN KEY ("provinceName") REFERENCES "provinces"("provinceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "province_data" ADD CONSTRAINT "province_data_energyID_fkey" FOREIGN KEY ("energyID") REFERENCES "energy_types"("energyID") ON DELETE RESTRICT ON UPDATE CASCADE;
