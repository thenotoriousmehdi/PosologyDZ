/*
  Warnings:

  - Made the column `dosageAdapte` on table `MedicinePreparation` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `grade` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('Ma', 'Assistant', 'Resident');

-- AlterTable
ALTER TABLE "MedicinePreparation" ALTER COLUMN "dosageAdapte" SET NOT NULL,
ALTER COLUMN "voieAdministration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "grade",
ADD COLUMN     "grade" "Grade" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "familyName" DROP NOT NULL;
