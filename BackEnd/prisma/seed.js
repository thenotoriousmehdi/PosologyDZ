import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed data for users
  const pharmacist = await prisma.user.create({
    data: {
      email: "mehdi2@gmail.com",
      password: "mehdi123", 
      role: "pharmacist",
      firstName: "John",
      familyName: "Doe",
    },
  });

  const preparateur = await prisma.user.create({
    data: {
      email: "mehdi3@gmail.com",
      password: "mehdi123", 
      role: "preparateur",
      firstName: "Jane",
      familyName: "Smith",
    },
  });

  console.log("Users seeded:", { pharmacist, preparateur });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
