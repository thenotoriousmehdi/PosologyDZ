import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import patientRoutes from "./routes/PatientRoutes.js"
import medicinePreparationsRoutes from "./routes/medicinePreparationsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js"
import testRoutes from "./routes/testRoutes.js";

const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use("/patients", patientRoutes);
app.use("/medicine-preparations", medicinePreparationsRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/api", testRoutes);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

async function main() {
  app.listen(PORT, () => {
    console.info("Server running at http://localhost:3000");
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });