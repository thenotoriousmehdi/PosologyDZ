import React, { useEffect, useState } from "react";
import axios from "axios";

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
    doctor: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch patient details when modal opens
  useEffect(() => {
    if (isOpen && patientId) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/patients/${patientId}`)
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
            doctor: data.doctor || "",
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
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleEtablissementInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEtablissementInfo({ ...etablissementInfo, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put(`http://localhost:3000/patients/${patientId}`, {
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
        <div className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10 sticky top-0">
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            Modifier les Informations
          </h1>
          <div className="bg-[#FAFAFA] border border-green p-[4px] rounded-[10px] hover:bg-green" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className="sm:size-10 size-6 text-green/65 hover:text-white" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[35px] h-[76%] p-12 overflow-y-auto">
          {error && <div className="text-delete text-center mb-4">{error}</div>}

          {/* Personal Info */}
          <div className="flex flex-col gap-[20px]">
            <label>Nom et Prénom<span className="text-delete">*</span></label>
            <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} required />

            <label>Age<span className="text-delete">*</span></label>
            <input type="number" name="age" value={personalInfo.age} onChange={handlePersonalInfoChange} required />

            <label>Sexe<span className="text-delete">*</span></label>
            <select name="gender" value={personalInfo.gender} onChange={handlePersonalInfoChange} required>
              <option value="">Sélectionner</option>
              <option value="garçon">Garçon</option>
              <option value="fille">Fille</option>
            </select>

            <label>Poids (kg)<span className="text-delete">*</span></label>
            <input type="number" name="weight" value={personalInfo.weight} onChange={handlePersonalInfoChange} required />

            <label>Numéro de téléphone<span className="text-delete">*</span></label>
            <input type="tel" name="phoneNumber" value={personalInfo.phoneNumber} onChange={handlePersonalInfoChange} required />

            <label>Antécédents Médicaux</label>
            <textarea name="antecedents" value={personalInfo.antecedents} onChange={handlePersonalInfoChange} />
          </div>

          {/* Establishment Info */}
          <div className="flex flex-col gap-[20px]">
            <label>Nom de l’établissement</label>
            <input type="text" name="etablissement" value={etablissementInfo.etablissement} onChange={handleEtablissementInfoChange} />

            <label>Nom du médecin traitant</label>
            <input type="text" name="doctor" value={etablissementInfo.doctor} onChange={handleEtablissementInfoChange} />
          </div>

          {/* Submit Button */}
          <button type="submit" className="bg-green text-white py-3 px-6 rounded-md">{loading ? "Enregistrement..." : "Enregistrer"}</button>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;
