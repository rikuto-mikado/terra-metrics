-- CreateTable
CREATE TABLE "metrics" (
    "id" SERIAL NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "soil_moisture" DOUBLE PRECISION NOT NULL,
    "vpd" DOUBLE PRECISION,
    "time_slot" TEXT,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "metrics_captured_at_idx" ON "metrics"("captured_at");
