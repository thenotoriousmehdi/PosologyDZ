import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const JWT_SECRET = "mehdi123";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

  
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" });
    }


    const accessToken = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        familyName: user.familyName
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

  
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      accessToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: "Something went wrong",
      details: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
};