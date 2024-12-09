import express from "express";
import {
  getMedicinePreparations,
  updateMedicinePreparationStatus,
} from "../controllers/medicinePreparationsController.js";

const router = express.Router();

router.get("/", getMedicinePreparations);
router.patch("/:id/statut", updateMedicinePreparationStatus);

export default router;