import express from "express";
import {
  updateUser,
  createUser,
  getUser,
  getUsers,
  deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUser);
router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser); 
export default router;