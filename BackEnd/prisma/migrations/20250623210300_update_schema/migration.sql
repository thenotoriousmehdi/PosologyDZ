/*
  Warnings:

  - You are about to drop the column `numeroGellues` on the `MedicinePreparation` table. All the data in the column will be lost.
  - You are about to drop the column `volumeEXipient` on the `MedicinePreparation` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Grade" ADD VALUE 'Mc';
ALTER TYPE "Grade" ADD VALUE 'Gen';

-- AlterTable
ALTER TABLE "MedicinePreparation" DROP COLUMN "numeroGellues",
DROP COLUMN "volumeEXipient",
ADD COLUMN     "numeroGellule" INTEGER,
ADD COLUMN     "volumeExipient" REAL;

-- CreateTable
CREATE TABLE "Medicaments" (
    "id" BIGINT NOT NULL,
    "Principe_actif" TEXT,
    "Forme_galenique" TEXT,
    "Classe_ATC" TEXT,
    "Libelle_ATC3" TEXT,
    "Libelle_ATC4" TEXT,
    "Source_modalites" TEXT,
    "Autre_source" TEXT,
    "Alternatives_galeniques" TEXT,
    "Informations_RCP" TEXT,
    "Reponses_laboratoires" TEXT,

    CONSTRAINT "Medicaments_pkey" PRIMARY KEY ("id")
);
