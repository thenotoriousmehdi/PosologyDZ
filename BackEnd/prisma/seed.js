import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert 5 patients into the Patient table
  await prisma.patient.createMany({
    data: [
      {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        weight: 75.5,
        phoneNumber: '123-456-7890',
        antecedents: 'No previous medical conditions.',
        etablissement: 'General Hospital',
        medicin: 'Medicine A',
        specialite: 'Cardiology',
        grade: 'A',
      },
      {
        name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        weight: 65.2,
        phoneNumber: '234-567-8901',
        antecedents: 'Hypertension.',
        etablissement: 'City Clinic',
        medicin: 'Medicine B',
        specialite: 'Endocrinology',
        grade: 'B',
      },
      {
        name: 'Michael Brown',
        age: 50,
        gender: 'Male',
        weight: 85.3,
        phoneNumber: '345-678-9012',
        antecedents: 'Diabetes, Asthma.',
        etablissement: 'Sunnydale Hospital',
        medicin: 'Medicine C',
        specialite: 'Pulmonology',
        grade: 'C',
      },
      {
        name: 'Emily White',
        age: 28,
        gender: 'Female',
        weight: 58.7,
        phoneNumber: '456-789-0123',
        antecedents: 'No known conditions.',
        etablissement: 'Hope Medical Center',
        medicin: 'Medicine D',
        specialite: 'Dermatology',
        grade: 'A',
      },
      {
        name: 'David Lee',
        age: 38,
        gender: 'Male',
        weight: 78.1,
        phoneNumber: '567-890-1234',
        antecedents: 'Previous surgeries.',
        etablissement: 'Greenfield Clinic',
        medicin: 'Medicine E',
        specialite: 'Orthopedics',
        grade: 'B',
      }
    ]
  });

  console.log('5 patients have been added to the database');
}

// Call the main function
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
