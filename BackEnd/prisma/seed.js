import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert 10 patients into the Patient table

const medicines = await prisma.medicinePreparation.createMany({
  data: [
    {
      patient_id: 6, // Refers to John Doe
      dci: "Aspirin",
      indication: "Pain relief",
      dosageInitial: 500,
      dosageAdapte: null,
      modeEmploi: 1,
      voieAdministration: "Oral",
      qsp: 10,
      excipient: "Lactose",
      preparationDate: new Date("2024-12-01"),
      peremptionDate: new Date("2025-12-01"),
      statut: "A_faire",
      nombreGellules: 20,
      compriméEcrasé: 10,
    },
    {
      patient_id: 7, // Refers to Jane Smith
      dci: "Ibuprofen",
      indication: "Inflammation",
      dosageInitial: 200,
      dosageAdapte: 400,
      modeEmploi: 1,
      voieAdministration: "Oral",
      qsp: 5,
      excipient: null,
      preparationDate: new Date("2024-12-02"),
      peremptionDate: new Date("2025-06-02"),
      statut: "En_Cours",
      nombreGellules: 10,
      compriméEcrasé: 0,
    },
    {
      patient_id: 8, // Refers to Alice Johnson
      dci: "Paracetamol",
      indication: "Fever",
      dosageInitial: 1000,
      dosageAdapte: 500,
      modeEmploi: 1,
      voieAdministration: "Oral",
      qsp: 7,
      excipient: "Sorbitol",
      preparationDate: new Date("2024-12-03"),
      peremptionDate: new Date("2025-06-03"),
      statut: "Termine",
      nombreGellules: 30,
      compriméEcrasé: 15,
    },
  ],
});

console.log(`${medicines.count} medicines inserted.`);
}

// Call the main function
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
