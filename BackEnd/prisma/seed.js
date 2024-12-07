import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert 10 patients into the Patient table
  await prisma.patient.createMany({
    data: [
      {
        name: 'Mohamed Ahmed',
        age: 12,
        gender: 'garçon',
        phoneNumber: '0560123456',
        weight: 32,
        antecedents: 'No known conditions.',
        etablissement: 'Clinique Al Salam',
        medicin: 'Dr. Karim',
        specialite: 'Pediatrics',
        grade: 'Assistant',
      },
      {
        name: 'Fatima Zahra',
        age: 8,
        gender: 'fille',
        phoneNumber: '0560987654',
        weight: 25,
        antecedents: 'Asthma.',
        etablissement: 'Hopital Ibn Sina',
        medicin: 'Dr. Leila',
        specialite: 'Respiratory Care',
        grade: 'Professor',
      },
      {
        name: 'Ali Hussein',
        age: 14,
        gender: 'garçon',
        phoneNumber: '0560567890',
        weight: 45,
        antecedents: 'No known conditions.',
        etablissement: 'Hospital El Chifa',
        medicin: 'Dr. Samir',
        specialite: 'Orthopedics',
        grade: 'Specialist',
      },
      {
        name: 'Sarah Khaled',
        age: 10,
        gender: 'fille',
        phoneNumber: '0560789123',
        weight: 30,
        antecedents: 'Allergy to dust.',
        etablissement: 'Clinique Nour',
        medicin: 'Dr. Amina',
        specialite: 'Allergy',
        grade: 'Associate Professor',
      },
      {
        name: 'Youssef Omar',
        age: 6,
        gender: 'garçon',
        phoneNumber: '0560112233',
        weight: 20,
        antecedents: 'No known conditions.',
        etablissement: 'Hopital Rahma',
        medicin: 'Dr. Khaled',
        specialite: 'Nutrition',
        grade: 'Assistant',
      },
      {
        name: 'Huda Abderrahmane',
        age: 15,
        gender: 'fille',
        phoneNumber: '0560678901',
        weight: 40,
        antecedents: 'Hypertension.',
        etablissement: 'Clinique Annasr',
        medicin: 'Dr. Nadia',
        specialite: 'Cardiology',
        grade: 'Professor',
      },
      {
        name: 'Omar Karim',
        age: 13,
        gender: 'garçon',
        phoneNumber: '0560345678',
        weight: 38,
        antecedents: 'No known conditions.',
        etablissement: 'Hopital Essalem',
        medicin: 'Dr. Yasmine',
        specialite: 'Bone Health',
        grade: 'Specialist',
      },
      {
        name: 'Layla Mustafa',
        age: 5,
        gender: 'fille',
        phoneNumber: '0560432190',
        weight: 18,
        antecedents: 'No known conditions.',
        etablissement: 'Clinique Al Hayat',
        medicin: 'Dr. Aisha',
        specialite: 'General Medicine',
        grade: 'Assistant',
      },
      {
        name: 'Hamza Youssef',
        age: 9,
        gender: 'garçon',
        phoneNumber: '0560654321',
        weight: 28,
        antecedents: 'Frequent colds.',
        etablissement: 'Hopital El Nour',
        medicin: 'Dr. Omar',
        specialite: 'Immunology',
        grade: 'Associate Professor',
      },
      {
        name: 'Zina Mohamed',
        age: 4,
        gender: 'fille',
        phoneNumber: '0560789432',
        weight: 16,
        antecedents: 'No known conditions.',
        etablissement: 'Clinique Al Wafa',
        medicin: 'Dr. Lila',
        specialite: 'Digestive Health',
        grade: 'Professor',
      },
    ]
  });

  console.log('10 patients have been added to the database');
}

// Call the main function
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
