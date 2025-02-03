import express from "express";
import {
  getPreparationCounts,
  getMedicinePreparations,
  updateMedicinePreparationStatus,
} from "../controllers/medicinePreparationsController.js";

const router = express.Router();
router.get("/Count", getPreparationCounts);
router.get("/", getMedicinePreparations);
router.patch("/:id/statut", updateMedicinePreparationStatus);

export default router;