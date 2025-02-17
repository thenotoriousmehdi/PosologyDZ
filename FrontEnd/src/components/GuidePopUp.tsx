interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidePopUp: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)] overflow-y-auto">
        {/* Title */}
        <div
          className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10 sticky top-0"
          style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
        >
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            Guide
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

        <div className="container mx-auto py-8 px-6 md:px-12">
          <h2 className="text-3xl font-bold text-PrimaryBlack mb-6 leading-tight">
            Comment Choisir le Numéro de Gélule pour une Préparation Galénique ?
          </h2>

          <ol className="list-decimal pl-6 space-y-6 text-lg leading-relaxed">
            <li>
              <strong className="font-semibold">Mesurez le Volume du Principe Actif (PA) :</strong>
              <ul className="list-inside list-disc pl-6 text-md">
                <li>Utilisez un tube gradué pour mesurer le volume apparent de la poudre.</li>
              </ul>
            </li>

            <li>
              <strong className="font-semibold">Calculez le Volume par Gélule :</strong>
              <ul className="list-inside list-disc pl-6 text-md">
                <li>Divisez le volume total par le nombre de gélules.</li>
                <li>Exemple : 10 mL pour 20 gélules = 0,5 mL par gélule.</li>
              </ul>
            </li>

            <li>
              <strong className="font-semibold">Choisissez le Numéro de Gélule :</strong>
              <ul className="list-inside list-disc pl-6 text-md">
                <li>Consultez un tableau de référence pour trouver la gélule correspondant au volume calculé.</li>
                <li>Exemple : 0,5 mL → Gélule numéro 1.</li>
              </ul>
            </li>

            <li>
              <strong className="font-semibold">Ajustez et Vérifiez :</strong>
              <ul className="list-inside list-disc pl-6 text-md">
                <li>Ajustez la densité de la poudre si nécessaire.</li>
                <li>Testez le remplissage sur un échantillon pour valider.</li>
              </ul>
            </li>
          </ol>

          <hr className="border-t-2 border-gray-300 my-6" />

          <h3 className="text-2xl font-semibold text-PrimaryBlack mb-4">Outils Requis</h3>
          <ul className="list-disc pl-6 text-lg space-y-2 mb-6">
            <li>Tube gradué</li>
            <li>Entonnoir</li>
            <li>Tableau des gélules</li>
            <li>Balance (facultatif)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-PrimaryBlack mb-4">Exemple</h3>
          <ul className="list-disc pl-6 text-lg space-y-2 mb-6">
            <li><strong>Volume total :</strong> 15 mL</li>
            <li><strong>Nombre de gélules :</strong> 30</li>
            <li><strong>Volume par gélule :</strong> 0,5 mL</li>
            <li><strong>Gélule choisie :</strong> Numéro 1</li>
          </ul>

          <p className="text-md font-semibold text-PrimaryBlack">
            Ce guide simplifie la sélection de la gélule adaptée à vos préparations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidePopUp;
