import React, { useState } from "react";

interface PreparationFinishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (numeroGellule: number, volumeExipient: number) => void;
}

const PreparationFinishModal: React.FC<PreparationFinishModalProps> = ({
  isOpen,
  onClose,
  onValidate,
}) => {
  const [numeroGellule, setNumeroGellule] = useState("");
  const [volumeExipient, setVolumeExipient] = useState("");
  const [checklist, setChecklist] = useState({
    organoleptique: false,
    masseVolume: false,
    conditionnement: false,
  });

  const handleConfirm = () => {
    if (!numeroGellule || !volumeExipient) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const numeroGelluleNum = Number(numeroGellule);
    const volumeExipientNum = Number(volumeExipient);

    if (isNaN(numeroGelluleNum) || isNaN(volumeExipientNum)) {
      alert("Veuillez entrer des valeurs numériques valides.");
      return;
    }

    if (!checklist.organoleptique || !checklist.masseVolume || !checklist.conditionnement) {
      alert("Veuillez cocher tous les points de contrôle qualité.");
      return;
    }

    onValidate(numeroGelluleNum, volumeExipientNum);
  };

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Title */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10 sticky top-0"
          style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
        >
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            Finalisation de la Préparation
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

        {/* Content */}
        <div className="flex-1 p-[35px] space-y-8">
          {/* Section 1: Input Fields */}
          <div className="space-y-6">
            <h2 className="font-poppins font-semibold text-[20px] text-PrimaryBlack">
              Informations de Finalisation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Numéro de gélule utilisée
                  <span className="text-delete">*</span>
                </label>
                <input
                  type="number"
                  value={numeroGellule}
                  onChange={(e) => setNumeroGellule(e.target.value)}
                  className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                  placeholder="Numéro de gélule"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Volume de l'excipient ajouté (ml)
                  <span className="text-delete">*</span>
                </label>
                <input
                  type="number"
                  value={volumeExipient}
                  onChange={(e) => setVolumeExipient(e.target.value)}
                  className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                  placeholder="Volume en ml"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Quality Control Checklist */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="font-poppins font-semibold text-[20px] text-PrimaryBlack">
                ✅ Contrôle Qualité – Étapes obligatoires
              </h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-[10px]">
              <p className="font-poppins font-medium text-[14px] text-PrimaryBlack mb-4">
                Avant de libérer la préparation, veuillez vous assurer que chaque critère de qualité est conforme.
                Cochez les points suivants après vérification :
              </p>

              {/* Organoleptique Control */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="organoleptique"
                    checked={checklist.organoleptique}
                    onChange={() => handleChecklistChange('organoleptique')}
                    className="mt-1 w-5 h-5 text-green border-BorderWithoutAction rounded focus:ring-green focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor="organoleptique" className="font-poppins font-semibold text-[16px] text-PrimaryBlack cursor-pointer">
                      🔬 Contrôle organoleptique et visuel
                    </label>
                    <ul className="mt-2 space-y-1 text-[14px] text-PrimaryBlack/80">
                      <li>• Absence de particules visibles ou anomalies</li>
                      <li>• Couleur, texture, odeur et homogénéité conformes</li>
                      <li>• Absence de contamination croisée (plan de travail propre, ustensiles nettoyés)</li>
                    </ul>
                  </div>
                </div>

                {/* Mass/Volume Control */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="masseVolume"
                    checked={checklist.masseVolume}
                    onChange={() => handleChecklistChange('masseVolume')}
                    className="mt-1 w-5 h-5 text-green border-BorderWithoutAction rounded focus:ring-green focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor="masseVolume" className="font-poppins font-semibold text-[16px] text-PrimaryBlack cursor-pointer">
                      ⚖️ Contrôle de masse ou de volume
                    </label>
                    <ul className="mt-2 space-y-1 text-[14px] text-PrimaryBlack/80">
                      <li>• Masse/unité contrôlée si formes solides (±5 à 10 % selon pharmacopée)</li>
                      <li>• Volume total vérifié si préparation liquide</li>
                      <li>• Homogénéité du mélange assurée</li>
                    </ul>
                  </div>
                </div>

                {/* Packaging Control */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="conditionnement"
                    checked={checklist.conditionnement}
                    onChange={() => handleChecklistChange('conditionnement')}
                    className="mt-1 w-5 h-5 text-green border-BorderWithoutAction rounded focus:ring-green focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor="conditionnement" className="font-poppins font-semibold text-[16px] text-PrimaryBlack cursor-pointer">
                      🧴 Conditionnement
                    </label>
                    <ul className="mt-2 space-y-1 text-[14px] text-PrimaryBlack/80">
                      <li>• Récipient adapté et fermé hermétiquement</li>
                      <li>• Étiquetage complet (nom, posologie, date)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 p-3 bg-blue-50 rounded-[10px] border-l-4 border-blue-400">
                <p className="font-poppins font-medium text-[14px] text-blue-800">
                  💡 Note : Un double contrôle par un second préparateur est recommandé si possible.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex justify-end items-center h-[12%] border-t w-full rounded-b-[10px] bg-white px-[35px] py-[30px] z-10"
          style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}
        >
          <div className="flex gap-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-poppins font-medium py-3 px-6 rounded-[10px]"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="bg-green hover:bg-green/80 text-white font-poppins font-medium py-3 px-6 rounded-[10px]"
              onClick={handleConfirm}
            >
              Confirmer 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationFinishModal; 