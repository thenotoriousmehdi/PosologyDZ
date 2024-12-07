-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'admin';

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "antecedents" DROP NOT NULL,
ALTER COLUMN "etablissement" DROP NOT NULL,
ALTER COLUMN "medicin" DROP NOT NULL,
ALTER COLUMN "specialite" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MedicinePreparation" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "dci" TEXT NOT NULL,
    "indication" TEXT,
    "dosageInitial" DOUBLE PRECISION NOT NULL,
    "dosageAdapte" DOUBLE PRECISION,
    "modeEmploi" DOUBLE PRECISION NOT NULL,
    "voieAdministration" TEXT NOT NULL,
    "qsp" INTEGER NOT NULL,
    "excipient" TEXT,
    "preparationDate" TIMESTAMP(3) NOT NULL,
    "peremptionDate" TIMESTAMP(3) NOT NULL,
    "nombreGellules" INTEGER NOT NULL,
    "compriméEcrasé" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicinePreparation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicinePreparation" ADD CONSTRAINT "MedicinePreparation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
