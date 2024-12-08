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

app.get('/patient/:id', async (req, res) => {
  const patientId = parseInt(req.params.id);

  try {
    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId, 
      },
    });

    if (patient) {
      res.json(patient); 
    } else {
      res.status(404).json({ error: 'Patient not found' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});

app.get('/patients', async (req, res) => { 
  try {
    const patients = await prisma.patient.findMany(); 

    if (patients.length > 0) {
      res.json(patients); 
    } else {
      res.status(404).json({ error: 'No patients found' }); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); 
  }
});
 
app.delete('/patients/:id', async (req, res) => {
  const patientId = parseInt(req.params.id);

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    await prisma.patient.delete({
      where: { id: patientId },
    });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/medicine-preparations', async (req, res) => {
  try {
   
    const preparations = await prisma.medicinePreparation.findMany({
      include: {
        patient: true, 
      },
    });

   
    res.status(200).json(preparations);
  } catch (error) {
    console.error('Error fetching medicine preparations:', error);
    res.status(500).json({ message: "Error retrieving medicine preparations." });
  }
});

app.patch("/medicine-preparations/:id/statut", async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  // Validate statut
  const validStatuts = ["A_faire", "En_Cours", "Termine"];
  if (!validStatuts.includes(statut)) {
    return res.status(400).json({ message: "Invalid statut value" });
  }

  try {
    // Update the statut in the database
    const updatedPreparation = await prisma.medicinePreparation.update({
      where: { id: parseInt(id) },
      data: {
        statut: statut, // Directly use the statut value
      },
    });

    // Respond with the updated preparation data
    res.status(200).json(updatedPreparation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating statut" });
  }
});

app.post('/patients', async (req, res) => {
  try {
    const { 
      name, 
      age, 
      gender, 
      weight, 
      phoneNumber, 
      grade,
      antecedents = null, 
      etablissement = null, 
      medicin = null, 
      specialite = null,
      medicinePreparations = [] 
    } = req.body

    
    if (!name || !age || !gender || !weight || !phoneNumber || !grade) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        requiredFields: ['name', 'age', 'gender', 'weight', 'phoneNumber', 'grade']
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        name,
        age: Number(age),
        gender,
        weight: Number(weight),
        phoneNumber,
        antecedents,
        etablissement,
        medicin,
        specialite,
        grade,
        medicinePreparations: {
          create: medicinePreparations.map(prep => {
            const nombreGellules = Number(prep.qsp*prep.modeEmploi) ;
            const compriméEcrasé = Number( (prep.dosageAdapte*prep.qsp*prep.modeEmploi)/prep.dosageInitial);

            return {
              dci: prep.dci,
              indication: prep.indication || null,
              dosageInitial: Number(prep.dosageInitial),
              dosageAdapte: Number(prep.dosageAdapte),
              modeEmploi: Number(prep.modeEmploi || 0),
              voieAdministration: prep.voieAdministration || null,
              qsp: Number(prep.qsp || 0),
              excipient: prep.excipient || null,
              preparationDate: new Date(prep.preparationDate),
              peremptionDate: new Date(prep.peremptionDate),
              statut: 'A_faire', 
              nombreGellules,
              compriméEcrasé 
            };
          })
        }
      },
      include: {
        medicinePreparations: true
      }
    })

    res.status(201).json(newPatient)
  } catch (error) {
    console.error('Detailed error creating patient:', error)
    res.status(500).json({ 
      error: 'Could not create patient', 
      details: error.message,
      fullError: error
    })
  }
})

// app.get('/download-pdf/:patientId/:medicinePreparationId', async (req, res) => {
//   const { patientId, medicinePreparationId } = req.params;

//   try {
//     // Fetch patient and medicine preparation details from the database
//     const patient = await prisma.patient.findUnique({
//       where: { id: patientId },
//       include: {
//         medicinePreparations: {
//           where: { id: medicinePreparationId },
//         },
//       },
//     });

//     // If patient or medicine preparation not found, return an error
//     if (!patient || patient.medicinePreparations.length === 0) {
//       return res.status(404).json({ error: 'Patient or medicine preparation not found' });
//     }

//     // Extract medicine preparation data
//     const medicinePreparation = patient.medicinePreparations[0];

//     // Create a PDF document
//     const doc = new PDFDocument();

//     // Set PDF response headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=medicine_preparation_${medicinePreparationId}.pdf`);

//     // Pipe the PDF to the response
//     doc.pipe(res);

//     // Add content to the PDF
//     doc.fontSize(20).text('Medicine Preparation Details', { align: 'center' });
//     doc.moveDown();

//     doc.fontSize(12).text(`Patient: ${patient.name}`);
//     doc.text(`Age: ${patient.age}`);
//     doc.text(`Gender: ${patient.gender}`);
//     doc.text(`Phone Number: ${patient.phoneNumber}`);
//     doc.text(`Grade: ${patient.grade}`);
//     doc.text(`Weight: ${patient.weight} kg`);
//     doc.moveDown();

//     doc.text('Medicine Preparation Details:');
//     doc.text(`DCI: ${medicinePreparation.dci}`);
//     doc.text(`Indication: ${medicinePreparation.indication || 'N/A'}`);
//     doc.text(`Dosage Initial: ${medicinePreparation.dosageInitial}`);
//     doc.text(`Dosage Adapté: ${medicinePreparation.dosageAdapte}`);
//     doc.text(`Mode Emploi: ${medicinePreparation.modeEmploi}`);
//     doc.text(`QSP: ${medicinePreparation.qsp}`);
//     doc.text(`Excipient: ${medicinePreparation.excipient}`);
//     doc.text(`Preparation Date: ${new Date(medicinePreparation.preparationDate).toLocaleDateString()}`);
//     doc.text(`Peremption Date: ${new Date(medicinePreparation.peremptionDate).toLocaleDateString()}`);
//     doc.text(`Statut: ${medicinePreparation.statut}`);
//     doc.text(`Nombre Gellules: ${medicinePreparation.nombreGellules}`);
//     doc.text(`Comprimé Ecrasé: ${medicinePreparation.compriméEcrasé}`);
//     doc.moveDown();

//     // End the document
//     doc.end();
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
//   }
// });




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