import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import cors from 'cors';
const app = express();
const PORT = 3000;
const prisma = new PrismaClient();
const JWT_SECRET = "your_jwt_secret";
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" });
    }


    const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

 
    res.json({ accessToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

 



async function main() {
  app.listen(PORT, () => { console.info('Server running at http://localhost:3000');
  });
}

main()
.then(async () =>
{
await prisma.$disconnect();
})
.catch(async (e) => { console. error(e);
await prisma.$disconnect();
process. exit(1);
});