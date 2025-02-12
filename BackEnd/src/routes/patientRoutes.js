import express from "express";
import {
  createPatient,
  getPatient,
  getPatients,
  deletePatient,
  updatePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/", createPatient);
router.put("/:id", updatePatient);
router.get("/:id", getPatient);
router.get("/", getPatients);
router.delete("/:id", deletePatient);

export default router;