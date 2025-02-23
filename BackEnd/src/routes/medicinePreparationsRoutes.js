import express from "express";
import {
  getPreparationCounts,
  getMedicinePreparations,
  updateMedicinePreparationStatus,
  addPreparationToPatient,
  deleteMedicinePreparation,
  getMedicinePreparationById,
  updateMedicinePreparationsForPatient
  
} from "../controllers/medicinePreparationsController.js";

const router = express.Router();
router.get("/Count", getPreparationCounts);
router.get("/", getMedicinePreparations);
router.post("/:patientId", addPreparationToPatient);
router.patch("/:id/statut", updateMedicinePreparationStatus);
router.delete("/:id", deleteMedicinePreparation);
router.get("/:id", getMedicinePreparationById);
router.put('/:patientId/:preparationId', updateMedicinePreparationsForPatient);

export default router;