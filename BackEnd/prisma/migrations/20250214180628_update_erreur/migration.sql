-- AlterTable
ALTER TABLE "MedicinePreparation" ADD COLUMN     "actionsEntreprises" TEXT,
ADD COLUMN     "consequences" TEXT,
ADD COLUMN     "dateSurvenue" TIMESTAMP(3),
ADD COLUMN     "erreur" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "erreurCause" TEXT,
ADD COLUMN     "erreurDescription" TEXT,
ADD COLUMN     "erreurEvitabilite" TEXT,
ADD COLUMN     "erreurNature" TEXT,
ADD COLUMN     "nomCom" TEXT NOT NULL DEFAULT 'test',
ADD COLUMN     "numLot" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "service" TEXT NOT NULL DEFAULT 'test';
