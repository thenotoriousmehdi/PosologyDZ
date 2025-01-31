import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    console.log('ENV URL:', process.env.DATABASE_URL);
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, result });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;