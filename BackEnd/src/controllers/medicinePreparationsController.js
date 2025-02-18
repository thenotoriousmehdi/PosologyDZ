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
      nomCom: prep.nomCom,
      indication: prep.indication || null,
      dosageInitial: Number(prep.dosageInitial),
      dosageAdapte: prep.dosageAdapte ? Number(prep.dosageAdapte) : null,
      modeEmploi: Number(prep.modeEmploi),
      voieAdministration: prep.voieAdministration || null,
      qsp: Number(prep.qsp),
      excipient: prep.excipient || null,
      preparationDate: new Date(prep.preparationDate),
      peremptionDate: new Date(prep.peremptionDate),
      erreur: prep.erreur || false,
      numLot: prep.numLot || null,
      erreurDescription: prep.erreurDescription || null,
      actionsEntreprises: prep.actionsEntreprises || null,
      consequences: prep.consequences || null,
      erreurCause: prep.erreurCause || null,
      erreurNature: prep.erreurNature || null,
      erreurEvitabilite: prep.erreurEvitabilite || null,
      dateSurvenue: prep.dateSurvenue ? new Date(prep.dateSurvenue) : null,
      statut: "A_faire",
      nombreGellules: Number(prep.qsp * prep.modeEmploi),
      compriméEcrasé:
        prep.dosageAdapte && prep.qsp && prep.modeEmploi && prep.dosageInitial
          ? parseFloat(((prep.dosageAdapte * prep.qsp * prep.modeEmploi) / prep.dosageInitial).toFixed(2))
          : null,
    }));

    await prisma.medicinePreparation.createMany({ data: preparationsData });

    res.status(201).json({ message: "Preparations added successfully" });
  } catch (error) {
    console.error("Error adding preparation to patient:", error);
    res.status(500).json({ error: "Could not add preparation to patient", details: error.message });
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
  const data = req.body;

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

    const updatedPreparation = await prisma.medicinePreparation.update({
      where: { id: preparationId },
      data: {
        dci: data.dci || existingPreparation.dci,
        nomCom: data.nomCom || existingPreparation.nomCom,
        indication: data.indication ?? existingPreparation.indication,
        dosageInitial: data.dosageInitial !== undefined ? parseFloat(data.dosageInitial) : existingPreparation.dosageInitial,
        dosageAdapte: data.dosageAdapte !== undefined ? parseFloat(data.dosageAdapte) : existingPreparation.dosageAdapte,
        modeEmploi: data.modeEmploi !== undefined ? parseFloat(data.modeEmploi) : existingPreparation.modeEmploi,
        voieAdministration: data.voieAdministration ?? existingPreparation.voieAdministration,
        qsp: data.qsp !== undefined ? parseInt(data.qsp, 10) : existingPreparation.qsp,
        excipient: data.excipient ?? existingPreparation.excipient,
        preparationDate: data.preparationDate ? new Date(data.preparationDate) : existingPreparation.preparationDate,
        peremptionDate: data.peremptionDate ? new Date(data.peremptionDate) : existingPreparation.peremptionDate,
        erreur: data.erreur !== undefined ? Boolean(data.erreur) : existingPreparation.erreur,
        numLot: data.numLot ?? existingPreparation.numLot,
        erreurDescription: data.erreurDescription ?? existingPreparation.erreurDescription,
        actionsEntreprises: data.actionsEntreprises ?? existingPreparation.actionsEntreprises,
        consequences: data.consequences ?? existingPreparation.consequences,
        erreurCause: data.erreurCause ?? existingPreparation.erreurCause,
        erreurNature: data.erreurNature ?? existingPreparation.erreurNature,
        erreurEvitabilite: data.erreurEvitabilite ?? existingPreparation.erreurEvitabilite,
        dateSurvenue: data.dateSurvenue ? new Date(data.dateSurvenue) : existingPreparation.dateSurvenue,
        statut: data.statut ?? existingPreparation.statut,
        nombreGellules: data.nombreGellules !== undefined ? parseInt(data.nombreGellules, 10) : existingPreparation.nombreGellules,
        compriméEcrasé: data.compriméEcrasé !== undefined ? parseFloat(data.compriméEcrasé) : existingPreparation.compriméEcrasé,
      },
    });

    res.status(200).json({ message: "Preparation updated successfully", updatedPreparation });
  } catch (error) {
    console.error("Error updating medicine preparation:", error);
    res.status(500).json({ message: "Error updating preparation", error: error.message });
  }
};



export const getMedicinePreparationById = async (req, res) => {
  const { id } = req.params;

  try {
    const preparation = await prisma.medicinePreparation.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        patient: true,
      },
    });

    if (!preparation) {
      return res.status(404).json({ message: "Medicine preparation not found" });
    }

    res.status(200).json(preparation);
  } catch (error) {
    console.error("Error fetching medicine preparation by ID:", error);
    res.status(500).json({ message: "Error retrieving medicine preparation." });
  }
};