/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number; // Patient ID to fetch data
}

const EditPatient: React.FC<PopupProps> = ({ isOpen, onClose, patientId }) => {
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
    specialite: "",
    service: "",
    grade: "",
  });

  const [, setLoading] = useState(true);
  const [, setError] = useState("");

  useEffect(() => {
    if (isOpen && patientId) {
      setLoading(true);
      api
        .get(`/patients/${patientId}`)
        .then((response) => {
          const data = response.data;
          setPersonalInfo({
            name: data.name || "",
            age: data.age || "",
            gender: data.gender || "",
            weight: data.weight || "",
            phoneNumber: data.phoneNumber || "",
            antecedents: data.antecedents || "",
          });
          setEtablissementInfo({
            etablissement: data.etablissement || "",
            service: data.service,
            medicin: data.medicin || "",
            specialite: data.specialite || "",
            grade: data.grade || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching patient data:", err);
          setError("Erreur lors du chargement des données.");
          setLoading(false);
        });
    }
  }, [isOpen, patientId]);

  // Handle input changes
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleEtablissementInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEtablissementInfo({
      ...etablissementInfo,
      [e.target.name]: e.target.value,
    });
  };
  

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    api
      .put(`/patients/${patientId}`, {
        ...personalInfo,
        ...etablissementInfo,
      })
      .then(() => {
        alert("Informations mises à jour avec succès!");
        onClose();
      })
      .catch((err) => {
        console.error("Error updating patient data:", err);
        setError("Erreur lors de la mise à jour des données.");
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)] overflow-y-auto">
        {/* Title */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10 sticky top-0"
          style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
        >
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            Modifier les nformations personnelles
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

        <div className="flex flex-col gap-[35px] h-[76%] p-12 overflow-y-auto">
       

          <div className="flex flex-col gap-[30px]">
            {/* Medication Form */}
            <div className="flex flex-col gap-[30px]">
              {/* First Line */}
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

              {/* Second Line */}
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
                      <option value="garçon">Garçon</option>
                      <option value="fille">Fille</option>
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

              {/* Third Line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
              {/* Fourth Line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Nom de l’établissement
                  </h1>

                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="text"
                      placeholder="Nom de l’établissement"
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

              {/* Fifth Line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
              </div>


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
                      <option value="MA">Maitre assistant(e)</option>
                      <option value="Assistant">Assistant(e)</option>
                      <option value="Resident">Resident(e)</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* Add Button */}
          </div>
        </div>
        <div
          className="flex justify-end items-center h-[12%] border-b w-full rounded-b-[10px] bg-white px-[35px] py-[40px] z-10"
          style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}
        >
          <button
            className="bg-green py-4 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80"
            onClick={handleSubmit}
            //disabled={isSubmitting}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;
