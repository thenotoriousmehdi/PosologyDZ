import React, { useState, useEffect } from "react";
import api from "../utils/axiosConfig";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded?: (patient: unknown) => void;
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

const AddPatient: React.FC<PopupProps> = ({ onClose, onPatientAdded }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [dciList, setDciList] = useState<string[]>([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    phoneNumber: "",
    antecedents: "",
  });

  const [etablissementInfo, setEtablissementInfo] = useState({
    etablissement: "",
    medicin: "",
    service: "",
    specialite: "",
    grade: "",
  });

  const [medicaments, setMedicaments] = useState<Medicament[]>([
    {
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
    },
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

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleEtablissementInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEtablissementInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
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
      {
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
        preparationDate: "",
        peremptionDate: "",
        erreur: false,
        numLot: "",
        erreurDescription: "",
        actionsEntreprises: "",
        consequences: "",
        erreurCause: "",
        erreurNature: "",
        erreurEvitabilite: "",
        dateSurvenue: "null",
      },
    ]);
  };

 
  const handleDeleteMedicament = (id: number) => {
    setMedicaments((prev) => prev.filter((medicament) => medicament.id !== id));
  };


  const validateForm = () => {
    if (
      !personalInfo.name ||
      !personalInfo.age ||
      !personalInfo.gender ||
      !personalInfo.weight ||
      !personalInfo.phoneNumber
    ) {
      setFormError(
        "Veuillez remplir tous les champs obligatoires dans les informations personnelles."
      );
      return false;
    }

   
    if (step >= 2 && !etablissementInfo.grade) {
      setFormError("Veuillez sélectionner un grade.");
      return false;
    }

    
    if (step === 3) {
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
    }

    setFormError(null);
    return true;
  };

 
  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsConfirmationModalOpen(false);
    setIsSubmitting(true);
    try {
      const response = await api.post("/patients", {
        ...personalInfo,
        ...etablissementInfo,
        age: Number(personalInfo.age),
        weight: Number(personalInfo.weight),
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
          preparationDate: new Date(med.preparationDate),
          peremptionDate: new Date(med.peremptionDate),
          erreur: Boolean(med.erreur),
          numLot: med.numLot || null,
          erreurDescription: med.erreurDescription || null,
          actionsEntreprises: med.actionsEntreprises || null,
          consequences: med.consequences || null,
          erreurCause: med.erreurCause || null,
          erreurNature: med.erreurNature || null,
          erreurEvitabilite: med.erreurEvitabilite || null,
          dateSurvenue: med.dateSurvenue ? new Date(med.dateSurvenue) : null,
        })),
      });

      alert("Patient ajouté avec succès!");
      onPatientAdded?.(response.data);

      
      onClose();
    } catch (error) {
      console.error("Error adding patient:", error);
      setFormError("Une erreur est survenue lors de l'ajout du patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateForm()) {
      if (step < 3) {
        setStep(step + 1);
        setProgress(progress + 33);
      } else if (step == 3) {
        handleSubmit();
      }
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 33);
    }
  };

  const getHeaderText = () => {
    switch (step) {
      case 1:
        return "Informations personnelles";
      case 2:
        return "Informations de l'établissement";
      case 3:
        return "Médicaments";
      default:
        return "";
    }
  };

   
  <button
    className={`${
      step === 1 ? "ml-auto" : ""
    } bg-green py-4 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80 ${
      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
    }`}
    onClick={nextStep}
    disabled={isSubmitting}
  >
    {isSubmitting ? "En cours..." : step === 3 ? "Enregistrer" : "Suivant"}
  </button>;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)]">
        {/* Title */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10"
          style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
        >
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            Ajouter un patient
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

        {/* Progress Bar */}
        <div className="h-[3px] w-full bg-gray-200">
          <div
            className="h-full bg-green rounded-r-[10px]"
            style={{
              width: `${progress}%`,
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
        
   
       

        {/* Step Content */}
        <div className="flex flex-col gap-[35px] h-[76%] p-12 overflow-y-auto">
        {formError && (
            <div className="text-delete text-center mb-4">{formError}</div>
          )}
          {/* Header */}
          <div className="flex justify-between gap-8 items-center">
            <h1 className="font-poppins font-semibold text-[16px] text-green">
              {getHeaderText()}
            </h1>
            <div className="flex-1 border-t-[0.5px] border-[#E0E1E2]"></div>
            <h1 className="font-openSans font-normal text-[16px] text-PrimaryBlack/60">
              {step}/3
            </h1>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-[30px]">
              {/* first line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Nom et Prénom
                    <span className="text-delete">*</span>
                  </h1>

                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="text"
                      name="name"
                      placeholder="Nom et prénom du patient"
                      pattern="^[a-zA-ZÀ-ÿ]+(?:[ '-][a-zA-ZÀ-ÿ]+)*$"
                      required
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Age
                    <span className="text-delete">*</span>
                  </h1>
                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="number"
                      name="age"
                      placeholder="Age"
                      pattern="^(?:1[01][0-9]|[1-9][0-9]?)$"
                      required
                      value={personalInfo.age}
                      onChange={handlePersonalInfoChange}
                    />
                  </label>
                </div>
              </div>
              {/* second line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Sexe
                    <span className="text-delete">*</span>
                  </h1>

                  <label className="w-full">
                    <select
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      required
                      name="gender"
                      value={personalInfo.gender}
                      onChange={handlePersonalInfoChange}
                    >
                      <option value="" disabled selected>
                        Sexe
                      </option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Poids(kg)
                    <span className="text-delete">*</span>
                  </h1>
                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="number"
                      placeholder="Poids"
                      pattern="^(?:[1-9][0-9]{0,2}|300)$"
                      required
                      name="weight"
                      value={personalInfo.weight}
                      onChange={handlePersonalInfoChange}
                    />
                  </label>
                </div>
              </div>
              {/* Third line */}

              <div className="flex flex-col justify-start gap-2 md:w-1/2">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Numéro de téléphone
                  <span className="text-delete">*</span>
                </h1>

                <label className="w-full">
                  <input
                    className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    type="tel"
                    placeholder="Numéro de téléphone"
                    pattern="^0[5-9][0-9]{8}$"
                    required
                    name="phoneNumber"
                    value={personalInfo.phoneNumber}
                    onChange={handlePersonalInfoChange}
                  />
                </label>
              </div>

              {/* fourth */}
              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Antécédents Médicaux
                </h1>

                <label className="w-full">
                  <textarea
                    className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    placeholder="Citez les Antécédents Médicaux du patient"
                    name="antecedents"
                    value={personalInfo.antecedents}
                    onChange={handlePersonalInfoChange}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Step 2 (Empty for now, to be added) */}
          {step === 2 && (
            <div className="flex flex-col gap-[30px]">
              {/* first line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Nom de l'établissement
                  </h1>

                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="text"
                      placeholder="Nom de l'établissement"
                      pattern="^[a-zA-ZÀ-ÿ]+(?:[ '-][a-zA-ZÀ-ÿ]+)*$"
                      name="etablissement"
                      value={etablissementInfo.etablissement}
                      onChange={handleEtablissementInfoChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Service
                    <span className="text-delete">*</span>
                  </h1>

                  <label className="w-full">
                    <select
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      name="service"
                      required
                      value={etablissementInfo.service}
                      onChange={handleEtablissementInfoChange}
                    >
                      <option value="" disabled selected>
                        Service
                      </option>
                      <option value="urgences">Urgences</option>
                      <option value="medecine_interne">Médecine interne</option>
                      <option value="pediatrie">Pédiatrie</option>
                      <option value="gynecologie_obstetrique">
                        Gynécologie et obstétrique
                      </option>
                      <option value="cardiologie">Cardiologie</option>
                      <option value="neurologie">Neurologie</option>
                      <option value="pneumologie">Pneumologie</option>
                      <option value="gastro_enterologie">
                        Gastro-entérologie
                      </option>
                      <option value="dermatologie">Dermatologie</option>
                      <option value="psychiatrie">Psychiatrie</option>
                      <option value="chirurgie_generale">
                        Chirurgie générale
                      </option>
                      <option value="chirurgie_orthopedique">
                        Chirurgie orthopédique
                      </option>
                      <option value="chirurgie_cardiaque">
                        Chirurgie cardiaque
                      </option>
                      <option value="chirurgie_plastique">
                        Chirurgie plastique et reconstructrice
                      </option>
                      <option value="chirurgie_pediatrique">
                        Chirurgie pédiatrique
                      </option>
                      <option value="radiologie_imagerie">
                        Radiologie et imagerie médicale
                      </option>
                      <option value="laboratoire_analyses">
                        Laboratoire d'analyses
                      </option>
                      <option value="pharmacie_hospitaliere">
                        Pharmacie hospitalière
                      </option>
                      <option value="rehabilitation_physiotherapie">
                        Réhabilitation et physiothérapie
                      </option>
                      <option value="oncologie">Oncologie</option>
                      <option value="nephrologie">Néphrologie</option>
                      <option value="urologie">Urologie</option>
                      <option value="orl">ORL (Oto-Rhino-Laryngologie)</option>
                      <option value="ophtalmologie">Ophtalmologie</option>
                      <option value="anesthesie_reanimation">
                        Anesthésie-réanimation
                      </option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Nom du médecin traitant
                  </h1>

                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="text"
                      placeholder="Nom du médecin traitant"
                      pattern="^[a-zA-ZÀ-ÿ]+(?:[ '-][a-zA-ZÀ-ÿ]+)*$"
                      name="medicin"
                      value={etablissementInfo.medicin}
                      onChange={handleEtablissementInfoChange}
                    />
                  </label>
                </div>

                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Spécialité
                  </h1>

                  <label className="w-full">
                    <select
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      name="specialite"
                      value={etablissementInfo.specialite}
                      onChange={handleEtablissementInfoChange}
                    >
                      <option value="" disabled selected>
                        Spécialité
                      </option>
                      <option value="generaliste">Médecin généraliste</option>
                      <option value="pediatre">Pédiatre</option>
                      <option value="gynecologue">
                        Gynécologue/Obstétricien
                      </option>
                      <option value="cardiologue">Cardiologue</option>
                      <option value="dermatologue">Dermatologue</option>
                      <option value="ophtalmologue">Ophtalmologue</option>
                      <option value="orl">
                        ORL (Oto-Rhino-Laryngologiste)
                      </option>
                      <option value="endocrinologue">Endocrinologue</option>
                      <option value="orthopediste">Orthopédiste</option>
                      <option value="gastro">Gastro-entérologue</option>
                      <option value="psychiatre">Psychiatre</option>
                      <option value="neurologue">Neurologue</option>
                      <option value="pneumologue">Pneumologue</option>
                      <option value="urologue">Urologue</option>
                      <option value="rhumatologue">Rhumatologue</option>
                      <option value="hematologue">Hématologue</option>
                      <option value="oncologue">Oncologue</option>
                      <option value="nephrologue">Néphrologue</option>
                      <option value="chirurgien">Chirurgien</option>
                      <option value="allergologue">Allergologue</option>
                      <option value="medecin_sport">Médecin du sport</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* second line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Grade
                    <span className="text-delete">*</span>
                  </h1>

                  <label className="w-full">
                    <select
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      required
                      name="grade"
                      value={etablissementInfo.grade}
                      onChange={handleEtablissementInfoChange}
                    >
                      <option value="" disabled selected>
                        Grade
                      </option>
                      <option value="Ma">Maitre assistant(e)</option>
                      <option value="Assistant">Assistant(e)</option>
                      <option value="Resident">Resident(e)</option>
                      <option value="Gen">Généraliste</option>
                      <option value="Mc">Maître de conférences</option>
                      <option value="Specialist">Spécialiste</option>
                      <option value="Professor">Professeur</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 (Empty for now, to be added) */}
          {step === 3 && (
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
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      {/* First Line */}
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
                      {/* First Line */}

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
                    {/* second line */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Dosage initial(mg)
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
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
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Dosage adapté(mg)
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
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
                        </label>
                      </div>
                    </div>
                    {/* third line */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Posologie, mode d'emploi (par jour)
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
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
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Voie d'administration
                        </h1>

                        <label className="w-full">
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
                            <option value="" disabled selected>
                              Voie d'administration
                            </option>
                            <option value="Orale">Orale</option>
                            <option value="Cutanée">Cutanée</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    {/* fourth line */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          QSP (nombre de jours)
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
                          <input
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            type="number"
                            placeholder="QSP"
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
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Excipient à effet notoire
                        </h1>
                        <label className="w-full">
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
                        </label>
                      </div>
                    </div>

                    {/* fidth line */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Date de préparation
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
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
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Date de péremption
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
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
                        </label>
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
                              <option value="Risque d'erreur">Risque d'erreur</option>
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

                  {/* Add more lines for additional fields */}
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
          )}
        </div>

        {/* Buttons */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-b-[10px] bg-white px-[35px] py-[40px] z-10"
          style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}
        >
         
          {step > 1 && (
            <button
              className="bg-none text-PrimaryBlack/70 hover:text-PrimaryBlack rounded-[10px] font-poppins font-medium text-[16px]"
              onClick={previousStep}
            >
              Retour
            </button>
          )}

  
          <button
            className={`${
              step === 1 ? "ml-auto" : ""
            } bg-green py-4 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80`}
            onClick={nextStep}
          >
            {step === 3 ? "Enregistrer" : "Suivant"}
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

export default AddPatient;
