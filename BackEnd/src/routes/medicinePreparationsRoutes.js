import express from "express";
import {
  getPreparationCounts,
  getMedicinePreparations,
  updateMedicinePreparationStatus,
  addPreparationToPatient,
} from "../controllers/medicinePreparationsController.js";

const router = express.Router();
router.get("/Count", getPreparationCounts);
router.get("/", getMedicinePreparations);
router.post("/:patientId", addPreparationToPatient);
router.patch("/:id/statut", updateMedicinePreparationStatus);

export default router;