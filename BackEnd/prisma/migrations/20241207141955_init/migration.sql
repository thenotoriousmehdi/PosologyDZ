/*
  Warnings:

  - Added the required column `statut` to the `MedicinePreparation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('A_faire', 'En_Cours', 'Termine');

-- AlterTable
ALTER TABLE "MedicinePreparation" ADD COLUMN     "statut" "Statut" NOT NULL;
