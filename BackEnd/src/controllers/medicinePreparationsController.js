import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMedicinePreparations = async (req, res) => {
  try {
    const preparations = await prisma.medicinePreparation.findMany({
      include: {
        patient: true,
      },
    });

    res.status(200).json(preparations);
  } catch (error) {
    console.error("Error fetching medicine preparations:", error);
    res.status(500).json({ message: "Error retrieving medicine preparations." });
  }
};

export const updateMedicinePreparationStatus = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  
  const validStatuts = ["A_faire", "En_Cours", "Termine"];
  if (!validStatuts.includes(statut)) {
    return res.status(400).json({ message: "Invalid statut value" });
  }

  try {
   
    const updatedPreparation = await prisma.medicinePreparation.update({
      where: { id: parseInt(id) },
      data: {
        statut: statut,
      },
    });

    res.status(200).json(updatedPreparation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating statut" });
  }
};

export const getPreparationCounts = async (req, res) => {
  try {
   
    const counts = await prisma.medicinePreparation.groupBy({
      by: ["statut"],  
      _count: {         
        statut: true,
      },
    });

   
    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching preparation counts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPreparationToPatient = async (req, res) => {
  try {
    const { patientId } = req.params; 
    const { medicinePreparations } = req.body; 

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ error: "Invalid or missing patient ID" });
    }

    if (!medicinePreparations || !Array.isArray(medicinePreparations) || medicinePreparations.length === 0) {
      return res.status(400).json({ error: "medicinePreparations must be a non-empty array" });
    }

    
    const patient_id = parseInt(patientId, 10);

   
    const preparationsData = medicinePreparations.map((prep) => ({
      patient_id, 
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
      statut: "A_faire",
      nombreGellules: Number(prep.qsp * prep.modeEmploi),
      compriméEcrasé : parseFloat(((prep.dosageAdapte * prep.qsp * prep.modeEmploi) / prep.dosageInitial).toFixed(2)),


    }));

    const newPreparations = await prisma.medicinePreparation.createMany({
      data: preparationsData,
    });

    res.status(201).json({ message: "Preparations added successfully", newPreparations });
  } catch (error) {
    console.error("Error adding preparation to patient:", error);
    res.status(500).json({
      error: "Could not add preparation to patient",
      details: error.message,
      fullError: error,
    });
  }
};


export const deleteMedicinePreparation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID de préparation invalide" });
    }

    const existingPreparation = await prisma.medicinePreparation.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingPreparation) {
      return res.status(404).json({ message: "Préparation non trouvée" });
    }

    await prisma.medicinePreparation.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: "Préparation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


export const updateMedicinePreparation = async (req, res) => {
  const { id } = req.params;
  const {
    dci,
    indication,
    dosageInitial,
    dosageAdapte,
    modeEmploi,
    voieAdministration,
    qsp,
    excipient,
    preparationDate,
    peremptionDate,
    statut,
  } = req.body;

  try {
    
    const preparationId = parseInt(id, 10);
    if (isNaN(preparationId)) {
      return res.status(400).json({ message: "Invalid preparation ID" });
    }

   
    const existingPreparation = await prisma.medicinePreparation.findUnique({
      where: { id: preparationId },
    });

    if (!existingPreparation) {
      return res.status(404).json({ message: "Preparation not found" });
    }

   
    const validStatuts = ["A_faire", "En_Cours", "Termine"];
    if (statut && !validStatuts.includes(statut)) {
      return res.status(400).json({ message: "Invalid statut value" });
    }

  
    const updatedPreparation = await prisma.medicinePreparation.update({
      where: { id: preparationId },
      data: {
        dci,
        indication,
        dosageInitial: dosageInitial ? Number(dosageInitial) : undefined,
        dosageAdapte: dosageAdapte ? Number(dosageAdapte) : undefined,
        modeEmploi: modeEmploi ? Number(modeEmploi) : undefined,
        voieAdministration,
        qsp: qsp ? Number(qsp) : undefined,
        excipient,
        preparationDate: preparationDate ? new Date(preparationDate) : undefined,
        peremptionDate: peremptionDate ? new Date(peremptionDate) : undefined,
        statut,
        nombreGellules: qsp && modeEmploi ? Number(qsp * modeEmploi) : undefined,
        compriméEcrasé:
          dosageAdapte && qsp && modeEmploi && dosageInitial
            ? parseFloat(((dosageAdapte * qsp * modeEmploi) / dosageInitial).toFixed(2))
            : undefined,
      },
    });

    res.status(200).json({ message: "Preparation updated successfully", updatedPreparation });
  } catch (error) {
    console.error("Error updating medicine preparation:", error);
    res.status(500).json({ message: "Error updating preparation", error: error.message });
  }
};