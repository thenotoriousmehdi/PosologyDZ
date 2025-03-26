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
  const { statut, numeroGellule, volumeExipient } = req.body;

  const validStatuts = ["A_faire", "En_Cours", "Termine"];
  if (!validStatuts.includes(statut)) {
    return res.status(400).json({ message: "Invalid statut value" });
  }

  try {
    // Define the update data
    let updateData = { statut };

    // If the status is "Terminé", validate and include the new fields
    if (statut === "Termine") {
      if (numeroGellule === undefined || volumeExipient === undefined) {
        return res.status(400).json({
          message: "Numero Gellule and Volume Exipient are required for 'Terminé' status",
        });
      }

      updateData.numeroGellule = parseInt(numeroGellule);
      updateData.volumeExipient = parseFloat(volumeExipient);
    }

    // Update the medicine preparation
    const updatedPreparation = await prisma.medicinePreparation.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedPreparation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating preparation status" });
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


export const updateMedicinePreparationsForPatient = async (req, res) => {
  try {
    const { patientId, preparationId } = req.params;
    const { medicinePreparations } = req.body;

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({ error: "Invalid patient ID" });
    }

    if (!medicinePreparations || !Array.isArray(medicinePreparations)) {
      return res.status(400).json({ error: "Invalid medicine preparations data" });
    }

    // Update existing preparation
    const updatedPreparation = await prisma.medicinePreparation.update({
      where: {
        id: parseInt(preparationId),
        patient_id: parseInt(patientId)
      },
      data: {
        dci: medicinePreparations[0].dci,
        nomCom: medicinePreparations[0].nomCom,
        indication: medicinePreparations[0].indication || null,
        dosageInitial: Number(medicinePreparations[0].dosageInitial),
        dosageAdapte: medicinePreparations[0].dosageAdapte ? Number(medicinePreparations[0].dosageAdapte) : null,
        modeEmploi: Number(medicinePreparations[0].modeEmploi),
        voieAdministration: medicinePreparations[0].voieAdministration || null,
        qsp: Number(medicinePreparations[0].qsp),
        excipient: medicinePreparations[0].excipient || null,
        preparationDate: new Date(medicinePreparations[0].preparationDate),
        peremptionDate: new Date(medicinePreparations[0].peremptionDate),
        erreur: medicinePreparations[0].erreur || false,
        numLot: medicinePreparations[0].numLot || null,
        erreurDescription: medicinePreparations[0].erreurDescription || null,
        actionsEntreprises: medicinePreparations[0].actionsEntreprises || null,
        consequences: medicinePreparations[0].consequences || null,
        erreurCause: medicinePreparations[0].erreurCause || null,
        erreurNature: medicinePreparations[0].erreurNature || null,
        erreurEvitabilite: medicinePreparations[0].erreurEvitabilite || null,
        dateSurvenue: medicinePreparations[0].dateSurvenue ? new Date(medicinePreparations[0].dateSurvenue) : null,
        numeroGellule: medicinePreparations[0].numeroGellule ? Number(medicinePreparations[0].numeroGellule) : null,
        volumeExipient: medicinePreparations[0].volumeExipient ? Number(medicinePreparations[0].volumeExipient) : null,
        nombreGellules: Number(medicinePreparations[0].qsp * medicinePreparations[0].modeEmploi),
        compriméEcrasé:
          medicinePreparations[0].dosageAdapte && 
          medicinePreparations[0].qsp && 
          medicinePreparations[0].modeEmploi && 
          medicinePreparations[0].dosageInitial
            ? parseFloat(((medicinePreparations[0].dosageAdapte * medicinePreparations[0].qsp * medicinePreparations[0].modeEmploi) / medicinePreparations[0].dosageInitial).toFixed(2))
            : null,
      }
    });

    res.status(200).json(updatedPreparation);
  } catch (error) {
    console.error("Error updating medicine preparation:", error);
    res.status(500).json({ error: "Could not update preparation", details: error.message });
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