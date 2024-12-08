import React, { useState } from "react";
import axios from "axios";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPatient: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [medicaments, setMedicaments] = useState([
    { id: Date.now(), fields: {} },
  ]);

  // Function to add a new medicament
  const handleAddMedicament = () => {
    setMedicaments((prev) => [
      ...prev,
      { id: Date.now(), fields: {} }, // Add a new medicament with a unique ID
    ]);
  };

  // Function to delete a specific medicament by ID
  const handleDeleteMedicament = (id) => {
    setMedicaments((prev) => prev.filter((medicament) => medicament.id !== id));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      setProgress(progress + 33);
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
        return "Informations de l’établissement";
      case 3:
        return "Médicaments";
      default:
        return "";
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
                      placeholder="Nom et prénom du patient"
                      pattern="^[a-zA-ZÀ-ÿ]+(?:[ '-][a-zA-ZÀ-ÿ]+)*$"
                      required
                      // value={email}
                      // onChange={handleEmailChange}
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
                      placeholder="Age"
                      pattern="^(?:1[01][0-9]|[1-9][0-9]?)$"
                      required
                      // value={email}
                      // onChange={handleEmailChange}
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
                      // value={email}
                      // onChange={handleEmailChange}
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
                    // value={email}
                    // onChange={handleEmailChange}
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

                    // value={email}
                    // onChange={handleEmailChange}
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
                    Nom de l’établissement
                  </h1>

                  <label className="w-full">
                    <input
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      type="text"
                      placeholder="Nom de l’établissement"
                      pattern="^[a-zA-ZÀ-ÿ]+(?:[ '-][a-zA-ZÀ-ÿ]+)*$"

                      // value={email}
                      // onChange={handleEmailChange}
                    />
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

                      // value={email}
                      // onChange={handleEmailChange}
                    />
                  </label>
                </div>
              </div>

              {/* second line */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Spécialité
                  </h1>

                  <label className="w-full">
                    <select className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none">
                      <option value="" disabled selected>
                        Spécialité
                      </option>
                      <option value="garçon">Garçon</option>
                      <option value="fille">Fille</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col justify-start gap-2 w-full">
                  <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                    Grade
                    <span className="text-delete">*</span>
                  </h1>

                  <label className="w-full">
                    <select
                      className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                      required
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
                        <input
                          className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                          type="text"
                          placeholder="DCI"
                          required
                        />
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Indication thérapeutique
                        </h1>
                        <input
                          className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                          type="text"
                          placeholder="Indication thérapeutique"
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
                            // value={email}
                            // onChange={handleEmailChange}
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
                            // value={email}
                            // onChange={handleEmailChange}
                          />
                        </label>
                      </div>
                    </div>
                    {/* third line */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Posologie, mode d’emploi (par jour)
                          <span className="text-delete">*</span>
                        </h1>
                        <label className="w-full">
                          <input
                            className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                            type="number"
                            placeholder="Posologie, mode d’emploi"
                            required
                            // value={email}
                            // onChange={handleEmailChange}
                          />
                        </label>
                      </div>

                      <div className="flex flex-col justify-start gap-2 w-full">
                        <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                          Voie d’administration
                        </h1>

                        <label className="w-full">
                          <select className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none">
                            <option value="" disabled selected>
                              Voie d’administration
                            </option>
                            <option value="Orale">Orale</option>
                            <option value="Assistant">Assistant(e)</option>
                            <option value="Resident">Resident(e)</option>
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
                            // value={email}
                            // onChange={handleEmailChange}
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

                            // value={email}
                            // onChange={handleEmailChange}
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
                            // value={email}
                            // onChange={handleEmailChange}
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
                            // value={email}
                            // onChange={handleEmailChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* Add more lines for additional fields */}
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAddMedicament}
                className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-dark"
              >
                Ajouter une une préparation
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-b-[10px] bg-white px-[35px] py-[40px] z-10"
          style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}
        >
          {/* Conditionally render the "Retour" button */}
          {step > 1 && (
            <button
              className="bg-none text-PrimaryBlack/70 hover:text-PrimaryBlack rounded-[10px] font-poppins font-medium text-[16px]"
              onClick={previousStep}
            >
              Retour
            </button>
          )}

          {/* Change button text based on the step */}
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
    </div>
  );
};

export default AddPatient;
