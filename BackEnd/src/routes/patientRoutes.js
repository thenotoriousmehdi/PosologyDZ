import express from "express";
import {
  createPatient,
  getPatient,
  getPatients,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post("/", createPatient);
router.get("/:id", getPatient);
router.get("/", getPatients);
router.delete("/:id", deletePatient);

export default router;