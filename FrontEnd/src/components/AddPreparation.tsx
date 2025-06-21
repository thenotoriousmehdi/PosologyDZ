import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPreparationAdded?: (preparation: unknown) => void;
  onPreparationUpdated?: (preparation: unknown) => void;
  patientId: number;
  existingPreparation?: {
    id: number;
    medicinePreparations: Medicament[];
  };
}

interface Medicament {
  id: number;
  dci: string;
  nomCom: string;
  indication?: string;
  dosageInitial: number;
  dosageAdapte: number;
  modeEmploi: number;
  voieAdministration?: string;
  qsp: number;
  excipient?: string;
  preparationDate: string;
  peremptionDate: string;
  erreur: boolean;
  numLot?: string;
  erreurDescription?: string;
  actionsEntreprises?: string;
  consequences?: string;
  erreurCause?: string;
  erreurNature?: string;
  erreurEvitabilite?: string;
  dateSurvenue?: string | null;
}

const AddPreparation: React.FC<PopupProps> = ({
  onClose,
  onPreparationAdded,
  onPreparationUpdated,
  patientId,
  existingPreparation,
}) => {
  const [dciList, setDciList] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const initialMedicament: Medicament = {
    id: Date.now(),
    dci: "",
    nomCom: "",
    indication: "",
    dosageInitial: 0,
    dosageAdapte: 0,
    modeEmploi: 0,
    voieAdministration: "",
    qsp: 0,
    excipient: "",
    preparationDate: new Date().toISOString(),
    peremptionDate: new Date().toISOString(),
    erreur: false,
    numLot: "",
    erreurDescription: "",
    actionsEntreprises: "",
    consequences: "",
    erreurCause: "",
    erreurNature: "",
    erreurEvitabilite: "",
    dateSurvenue: null,
  };

  const [medicaments, setMedicaments] = useState<Medicament[]>([
    initialMedicament,
  ]);

  useEffect(() => {
    const fetchDciList = async () => {
      try {
        const response = await api.get("/medicine-preparations/dci");
        setDciList(response.data);
      } catch (error) {
        console.error("Error fetching DCI list:", error);
      }
    };

    fetchDciList();
  }, []);

  useEffect(() => {
    if (existingPreparation?.medicinePreparations) {
      setMedicaments(
        existingPreparation.medicinePreparations.map((prep) => ({
          ...prep,
          id: prep.id || Date.now(),
          preparationDate: prep.preparationDate
            ? new Date(prep.preparationDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          peremptionDate: prep.peremptionDate
            ? new Date(prep.peremptionDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          dateSurvenue: prep.dateSurvenue
            ? new Date(prep.dateSurvenue).toISOString().split("T")[0]
            : null,
        }))
      );
    }
  }, [existingPreparation]);

  const handleMedicamentChange = (
    id: number,
    field: keyof Medicament,
    value: string | number | boolean
  ) => {
    setMedicaments((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const handleAddMedicament = () => {
    setMedicaments((prev) => [
      ...prev,
      { ...initialMedicament, id: Date.now() },
    ]);
  };

  const handleDeleteMedicament = (id: number) => {
    setMedicaments((prev) => prev.filter((medicament) => medicament.id !== id));
  };

  const validateForm = () => {
    const invalidMedicament = medicaments.find(
      (med) =>
        !med.dci ||
        med.dosageInitial <= 0 ||
        med.dosageAdapte <= 0 ||
        !med.preparationDate ||
        !med.peremptionDate
    );

    if (invalidMedicament) {
      setFormError(
        "Veuillez remplir correctement tous les champs des médicaments."
      );
      return false;
    }
    if (existingPreparation) {
      if (medicaments.length === 0) {
        setFormError("Au moins un médicament est requis");
        return false;
      }
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmationModalOpen(false);
    setIsSubmitting(true);
    try {
      let response;
      const preparationData = {
        medicinePreparations: medicaments.map((med) => ({
          dci: med.dci,
          nomCom: med.nomCom,
          indication: med.indication || null,
          dosageInitial: Number(med.dosageInitial),
          dosageAdapte: Number(med.dosageAdapte),
          modeEmploi: Number(med.modeEmploi || 0),
          voieAdministration: med.voieAdministration || null,
          qsp: Number(med.qsp || 0),
          excipient: med.excipient || null,
          preparationDate: med.preparationDate,
          peremptionDate: med.peremptionDate,
          erreur: Boolean(med.erreur),
          numLot: med.numLot || null,
          erreurDescription: med.erreurDescription || null,
          actionsEntreprises: med.actionsEntreprises || null,
          consequences: med.consequences || null,
          erreurCause: med.erreurCause || null,
          erreurNature: med.erreurNature || null,
          erreurEvitabilite: med.erreurEvitabilite || null,
          dateSurvenue: med.dateSurvenue || null,
        })),
      };

      if (existingPreparation) {
        response = await api.put(
          `/medicine-preparations/${patientId}/${existingPreparation.id}`,
          preparationData
        );
        alert("Préparation mise à jour avec succès!");
      } else {
        response = await api.post(
          `/medicine-preparations/${patientId}`,
          preparationData
        );
        alert("Préparation ajoutée avec succès!");
      }

      if (existingPreparation && onPreparationUpdated) {
        onPreparationUpdated(response.data);
      } else if (onPreparationAdded) {
        onPreparationAdded(response.data);
      }

      onClose();
    } catch (error) {
      console.error("Error saving preparation:", error);
      setFormError(
        "Une erreur est survenue lors de l'enregistrement de la préparation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)]">
        {/* Title */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10"
          style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
        >
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            {existingPreparation
              ? "Modifier la préparation"
              : "Ajouter une préparation"}
          </h1>
          <div
            className="bg-[#FAFAFA] border border-green p-[4px] rounded-[10px] hover:bg-green"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="sm:size-10 size-6 text-green/65 hover:text-white"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col gap-[35px] h-[76%] p-12 overflow-y-auto">
          {formError && (
            <div className="text-delete text-center mb-4">{formError}</div>
          )}

          <div className="flex flex-col gap-[30px]">
            {medicaments.map((medicament, index) => (
              <div key={medicament.id}>
                {/* Medication Header */}
                <div className="flex justify-between gap-8 items-center">
                  <h1 className="font-poppins font-semibold text-[20px] text-green">
                    Medicament {index + 1}
                  </h1>
                  <button
                    type="button"
                    onClick={() => handleDeleteMedicament(medicament.id)}
                    className="text-delete bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="flex-1 border-t-[0.5px] border-[#E0E1E2] mb-4"></div>

                {/* Medication Form */}
                <div className="flex flex-col gap-[30px]">
                  {/* First Line */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        DCI
                        <span className="text-delete">*</span>
                      </h1>
                      <select
                        className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        required
                        name="dci"
                        value={medicament.dci}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "dci",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          DCI
                        </option>
                        {dciList.map((dci) => (
                          <option key={dci} value={dci}>
                            {dci}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Nom commercial
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="text"
                        placeholder="Nom commercial"
                        name="nomCom"
                        required
                        value={medicament.nomCom}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "nomCom",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Indication thérapeutique
                      </h1>
                      <textarea
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        placeholder="Indication thérapeutique"
                        name="indication"
                        value={medicament.indication}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "indication",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Second Line */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Dosage initial(mg)
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="number"
                        placeholder="Dosage initial"
                        required
                        name="dosageInitial"
                        value={medicament.dosageInitial}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "dosageInitial",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Dosage adapté(mg)
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="number"
                        placeholder="Dosage adapté"
                        required
                        name="dosageAdapte"
                        value={medicament.dosageAdapte}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "dosageAdapte",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Third Line */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Posologie, mode d'emploi (par jour)
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="number"
                        placeholder="Posologie, mode d'emploi"
                        required
                        name="modeEmploi"
                        value={medicament.modeEmploi}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "modeEmploi",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Voie d'administration
                      </h1>
                      <select
                        className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        name="voieAdministration"
                        value={medicament.voieAdministration}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "voieAdministration",
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          Voie d'administration
                        </option>
                        <option value="Orale">Orale</option>
                        <option value="Cutanée">Cutanée</option>
                      </select>
                    </div>
                  </div>

                  {/* Fourth Line */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        QSP (nombre de jours)
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="number"
                        placeholder="QSP
                        "
                        required
                        name="qsp"
                        value={medicament.qsp}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "qsp",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Excipient à effet notoire
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="text"
                        placeholder="Excipient à effet notoire"
                        name="excipient"
                        value={medicament.excipient}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "excipient",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Fifth Line */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Date de préparation
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="date"
                        placeholder="Date de préparation"
                        required
                        name="preparationDate"
                        value={medicament.preparationDate}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "preparationDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="flex flex-col justify-start gap-2 w-full">
                      <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                        Date de péremption
                        <span className="text-delete">*</span>
                      </h1>
                      <input
                        className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                        type="date"
                        placeholder="Date de péremption"
                        required
                        name="peremptionDate"
                        value={medicament.peremptionDate}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "peremptionDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-[30px]">
                    <div>
                      <input
                        type="checkbox"
                        id={`erreur-${medicament.id}`}
                        checked={medicament.erreur}
                        onChange={(e) =>
                          handleMedicamentChange(
                            medicament.id,
                            "erreur",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4 accent-green"
                      />
                      <label htmlFor={`erreur-${medicament.id}`}>
                        Déclarer comme erreur médicamenteuse
                      </label>
                    </div>
                  </div>
                </div>

                {medicament.erreur && (
                  <div className="flex flex-col gap-[30px]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* first*/}
                      <div className="flex flex-col justify-start gap-2 w-1/2">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Numéro de lot
                        </h1>
                        <label className="w-full">
                          <input
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            type="text"
                            placeholder=" Numéro de lot"
                            name="numLot"
                            value={medicament.numLot}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "numLot",
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* second*/}
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Description de l'erreur
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
                          <textarea
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            required
                            placeholder="Description de l'erreur"
                            name="descErreur"
                            value={medicament.erreurDescription}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "erreurDescription",
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* third*/}
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Actions entreprises
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
                          <textarea
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            placeholder="Actions entreprises"
                            name="actions"
                            required
                            value={medicament.actionsEntreprises}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "actionsEntreprises",
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* fourth*/}
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Consequences pour le patient
                          <span className="text-delete">*</span>
                        </h1>

                        <label className="w-full">
                          <select
                            className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            name="consequences"
                            value={medicament.consequences}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "consequences",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled selected>
                              Consequences
                            </option>
                            <option value="Aucune">Aucune</option>
                            <option value="Événement indésirable">
                              Événement indésirable
                            </option>
                            <option value="Autre">Autre</option>
                          </select>
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Cause de l'erreur
                          <span className="text-delete">*</span>
                        </h1>

                        <label className="w-full">
                          <select
                            className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            name="causes"
                            value={medicament.erreurCause}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "erreurCause",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled selected>
                              Cause
                            </option>
                            <option value="Omission">Omission</option>
                            <option value="Défaut d'informations">
                              Défaut d'informations
                            </option>
                            <option value="Défaut de présentation">
                              Défaut de présentation
                            </option>
                            <option value="Manque de lisibilité">
                              Manque de lisibilité
                            </option>
                            <option value="Autre">Autre</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* fifth*/}
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Nature de l'erreur
                          <span className="text-delete">*</span>
                        </h1>

                        <label className="w-full">
                          <select
                            className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            name="nature"
                            value={medicament.erreurNature}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "erreurNature",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled selected>
                              Nature
                            </option>
                            <option value="Risque d'erreur">
                              Risque d'erreur
                            </option>
                            <option value="Erreur potentielle">
                              Erreur potentielle
                            </option>
                            <option value="Erreur averée">Erreur averée</option>
                          </select>
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Évitabilité de l'erreur
                          <span className="text-delete">*</span>
                        </h1>

                        <label className="w-full">
                          <select
                            className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            name="evitabilite"
                            value={medicament.erreurEvitabilite}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "erreurEvitabilite",
                                e.target.value
                              )
                            }
                          >
                            <option value="" disabled selected>
                              Évitabilité
                            </option>
                            <option value="Oui">Oui</option>
                            <option value="Non">Non</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* sixth*/}

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Date de survenue
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
                          <input
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            type="date"
                            placeholder="Date de survenue"
                            required
                            name="dateSurv"
                            value={medicament.dateSurvenue ?? ""}
                            onChange={(e) =>
                              handleMedicamentChange(
                                medicament.id,
                                "dateSurvenue",
                                e.target.value
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddMedicament}
              className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-dark"
            >
              Ajouter une préparation
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div
          className="flex justify-end items-center h-[12%] border-b w-full rounded-b-[10px] bg-white px-[35px] py-[40px] z-10"
          style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}
        >
          <button
            className="bg-green py-4 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "En cours..." : "Enregistrer"}
          </button>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Attention – Note importante
            </h2>
            <div className="text-gray-700 space-y-3 leading-relaxed">
              <p>
                Ne reformulez jamais les formes suivantes sans avis
                pharmaceutique spécialisé :
              </p>
              <ul className="list-disc list-inside pl-4 text-left">
                <li>
                  Médicaments à libération prolongée (LP) ou libération
                  contrôlée
                </li>
                <li>Formes gastro-résistantes</li>
                <li>
                  Gélules contenant des granulés à libération modifiée
                </li>
                <li>
                  Comprimés pelliculés ou enrobés avec fonction de protection
                </li>
                <li>Formes à libération retardée</li>
              </ul>
              <p className="font-semibold pt-2">
                👉 Toute manipulation non appropriée de ces formes peut altérer
                la sécurité, l'efficacité ou provoquer une toxicité du
                traitement.
              </p>
            </div>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-poppins font-medium py-2 px-6 rounded-lg"
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="bg-green hover:bg-green/80 text-white font-poppins font-medium py-2 px-6 rounded-lg"
                onClick={handleConfirmSubmit}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPreparation;
