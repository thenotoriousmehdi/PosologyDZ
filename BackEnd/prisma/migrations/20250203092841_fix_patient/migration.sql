-- DropForeignKey
ALTER TABLE "MedicinePreparation" DROP CONSTRAINT "MedicinePreparation_patient_id_fkey";

-- AddForeignKey
ALTER TABLE "MedicinePreparation" ADD CONSTRAINT "MedicinePreparation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
