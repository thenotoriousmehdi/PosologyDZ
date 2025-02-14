import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPatient = async (req, res) => {
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
      service,
      medicinePreparations = [],
    } = req.body;

    if (!name || !age || !gender || !weight || !phoneNumber || !grade) {
      return res.status(400).json({
        error: "Missing required fields",
        requiredFields: [
          "name",
          "age",
          "gender",
          "weight",
          "phoneNumber",
          "grade",
        ],
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
        service,
        grade,
        medicinePreparations: {
          create: medicinePreparations.map((prep) => {
            const nombreGellules = Number(prep.qsp * prep.modeEmploi);
            const compriméEcrasé = Number(
              (prep.dosageAdapte * prep.qsp * prep.modeEmploi) /
                prep.dosageInitial
            );

            return {
              dci: prep.dci,
              nomCom: prep.nomCom,
              indication: prep.indication || null,
              dosageInitial: Number(prep.dosageInitial),
              dosageAdapte: Number(prep.dosageAdapte),
              modeEmploi: Number(prep.modeEmploi || 0),
              voieAdministration: prep.voieAdministration || null,
              qsp: Number(prep.qsp || 0),
              excipient: prep.excipient || null,
              preparationDate: new Date(prep.preparationDate),
              peremptionDate: new Date(prep.peremptionDate),
              erreur: Boolean(prep.erreur),
              numLot: prep.numLot || null,
              erreurDescription: prep.erreurDescription || null,
              actionsEntreprises: prep.actionsEntreprises || null,
              consequences: prep.consequences || null,
              erreurCause: prep.erreurCause || null,
              erreurNature: prep.erreurNature || null,
              erreurEvitabilite: prep.erreurEvitabilite || null,
              dateSurvenue: prep.dateSurvenue
                ? new Date(prep.dateSurvenue)
                : null,
              statut: "A_faire",
              nombreGellules,
              compriméEcrasé,
            };
          }),
        },
      },
      include: {
        medicinePreparations: true,
      },
    });

    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Detailed error creating patient:", error);
    res.status(500).json({
      error: "Could not create patient",
      details: error.message,
      fullError: error,
    });
  }
};

export const getPatient = async (req, res) => {
  const patientId = parseInt(req.params.id);

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        medicinePreparations: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPatients = async (req, res) => {
  try {
    console.log("Attempting to fetch patients...");

    const patientCount = await prisma.patient.count();
    console.log(`Total patient count: ${patientCount}`);

    const patients = await prisma.patient.findMany({
      include: {
        medicinePreparations: true,
      },
    });

    console.log("Patients fetched:", JSON.stringify(patients, null, 2));

    return patients.length > 0
      ? res.json(patients)
      : res.status(404).json({ error: "No patients found" });
  } catch (error) {
    console.error("Detailed Patients fetch error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
      stack: error.stack,
    });
  }
};

export const deletePatient = async (req, res) => {
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
};

export const updatePatient = async (req, res) => {
  const patientId = parseInt(req.params.id);

  try {
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!existingPatient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const {
      name,
      age,
      gender,
      weight,
      phoneNumber,
      grade,
      antecedents,
      etablissement,
      service,
      medicin,
      specialite,
    } = req.body;

    // Update the patient
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        name: name ?? existingPatient.name,
        age: age !== undefined ? Number(age) : existingPatient.age,
        gender: gender ?? existingPatient.gender,
        weight: weight !== undefined ? Number(weight) : existingPatient.weight,
        phoneNumber: phoneNumber ?? existingPatient.phoneNumber,
        grade: grade ?? existingPatient.grade,
        antecedents: antecedents ?? existingPatient.antecedents,
        etablissement: etablissement ?? existingPatient.etablissement,
        service: service ?? existingPatient.service,
        medicin: medicin ?? existingPatient.medicin,
        specialite: specialite ?? existingPatient.specialite,
      },
    });

    res
      .status(200)
      .json({ message: "Patient updated successfully", updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
