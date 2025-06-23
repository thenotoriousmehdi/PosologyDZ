/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { TbFileDownload } from "react-icons/tb";
import jsPDF from "jspdf";
import api from "../utils/axiosConfig";

interface MedicinePreparation {
  id: number;
  dci: string;
  dosageInitial: number;
  dosageAdapte: number;
  nombreGellules: number;
  compriméEcrasé: number;
  nomCom: string;
  indication?: string;
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
  numeroGellule?: number | null;
  volumeExipient?: number | null;
  statut: string;
  patient: Patient;
  onDelete: (id: number) => void;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  weight: number;
  phoneNumber: string;
  antecedents?: string;
  etablissement?: string;
  medicin?: string;
  specialite?: string;
  service: string;
  grade: string;
  medicinePreparations: MedicinePreparation[];
}

interface Medicament {
  id: number;
  Principe_actif?: string;
  Forme_galenique?: string;
  Classe_ATC?: string;
  Libelle_ATC3?: string;
  Libelle_ATC4?: string;
  Source_modalites?: string;
  Autre_source?: string;
  Alternatives_galeniques?: string;
  Informations_RCP?: string;
  Reponses_laboratoires?: string;
}

const PreparationDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [, setPatient] = useState<Patient | null>(null);
  const [preparation, setPreparation] = useState<MedicinePreparation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [medicament, setMedicament] = useState<Medicament | null>(null);

  useEffect(() => {
    const fetchPreparation = async () => {
      try {
        const response = await api.get<MedicinePreparation>(
          `/medicine-preparations/${id}`
        );
        setPreparation(response.data);
        setPatient(response.data.patient);
        // Fetch medicament info by DCI
        if (response.data.dci) {
          try {
            const medResp = await api.get(`/medicine-preparations/medicament?dci=${encodeURIComponent(response.data.dci)}`);
            setMedicament(medResp.data);
          } catch (medErr: any) {
            setMedicament(null);
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Erreur lors de la récupération de la preparation."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPreparation();
  }, [id]);

  if (loading) return <p>Recherche en cours...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!preparation) return <p>Aucune preparation trouvé</p>;
  if (!id) return <p>Invalid ID</p>;

  const handleDownloadPDF = (preparation: MedicinePreparation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 10;
    const addInlinePair = (
      leftText: string,
      leftValue: string,
      rightText: string,
      rightValue: string,
      y: number,
      leftStart: number = 10,
      rightStart: number = pageWidth / 2
    ) => {
      doc.setFont("poppins", "bold");
      doc.text(leftText + ":", leftStart, y);
      doc.setFont("poppins", "normal");
      doc.text(leftValue, leftStart + doc.getTextWidth(leftText + ": ") + 2, y);

      doc.setFont("poppins", "bold");
      doc.text(rightText + ":", rightStart, y);
      doc.setFont("poppins", "normal");
      doc.text(
        rightValue,
        rightStart + doc.getTextWidth(rightText + ": ") + 2,
        y
      );
    };

    const title1 =
      "Centre Hospitalo-Universitaire de Béni Messous, ISSAD HASSANI";
    const title2 = "Laboratoire Central de Biologie Médicale Mère et Enfant";
    const title3 = "P' F. Djennane";
    doc.setFontSize(14);

    doc.text(title1, (pageWidth - doc.getTextWidth(title1)) / 2, 20);
    doc.text(title2, (pageWidth - doc.getTextWidth(title2)) / 2, 30);
    doc.text(title3, (pageWidth - doc.getTextWidth(title3)) / 2, 40);

    doc.setFontSize(8);
    const title4 =
      "Fiche inspirée de l'ANSM et adaptée au préparatoire du Laboratoire Central de Biologie Médicale Mère et Enfant. CHU Béni Messous";
    doc.text(
      title4,
      (pageWidth - doc.getTextWidth(title4)) / 2,
      pageHeight - bottomMargin
    );

    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Informations du prescripteur", 10, 60);
    doc.setFontSize(11);
    doc.setFont("poppins", "normal");

    addInlinePair(
      "Nom et prénom",
      preparation.patient?.medicin || "N/A",
      "Spécialité",
      preparation.patient?.specialite || "N/A",
      70
    );

    addInlinePair(
      "Lieu d'exercice",
      preparation.patient?.etablissement || "N/A",
      "Service",
      preparation.patient?.service || "N/A",
      80
    );

    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Produit Concerné", 10, 100);
    doc.setFontSize(11);
    doc.setFont("poppins", "normal");

    addInlinePair(
      "DCI",
      preparation.dci || "N/A",
      "Nom commercial",
      preparation.nomCom || "N/A",
      110
    );

    addInlinePair(
      "Voie d'administration",
      preparation.voieAdministration || "N/A",
      "Forme galénique",
      "Gellule",
      120
    );

    addInlinePair(
      "Dosage initial",
      String(preparation.dosageInitial) || "N/A",
      "Numéro de lot",
      preparation.numLot || "N/A",
      130
    );

    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Description de l'erreur médicamenteuse", 10, 150);
    doc.setFontSize(11);
    doc.setFont("poppins", "normal");

    doc.setFont("poppins", "bold");
    doc.text("Description de l'erreur:", 10, 160);
    doc.setFont("poppins", "normal");
    doc.text(preparation.erreurDescription || "N/A", 50, 160);
    doc.setFont("poppins", "bold");
    doc.text("Actions entreprises:", 10, 170);
    doc.setFont("poppins", "normal");
    doc.text(preparation.actionsEntreprises || "N/A", 50, 170);

    addInlinePair(
      "Conséquences pour le patient",
      preparation.consequences || "N/A",
      "Cause de l'erreur",
      preparation.erreurCause || "N/A",
      180
    );
    addInlinePair(
      "Nature de l'erreur",
      preparation.erreurNature || "N/A",
      "Évitabilité de l'erreur",
      preparation.erreurEvitabilite || "N/A",
      190
    );

    doc.setFont("poppins", "bold");
    doc.text("Date de survenue:", 10, 200);
    doc.setFont("poppins", "normal");
    doc.text(
      preparation.dateSurvenue
        ? new Date(preparation.dateSurvenue).toLocaleDateString("fr-FR")
        : "N/A",
      40,
      200
    );

    doc.text(`Signature du notificateur`, 140, 230);

    doc.save(`Preparation_${id}.pdf`);
  };

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px] overflow-y-auto">
        <div>
          <Header
            title={`Détails preparation / #${preparation.id}`}
            description="Informations détaillées de la preparation sélectionnée."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            className="flex items-center text-green-600 hover:text-green-800"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft size={20} />
            <span className="ml-2">Retour</span>
          </button>
        </div>
        <div className="flex flex-col justify-start gap-6 ">
          {/* Patient Section */}
          <div className="flex flex-col bg-white border-2 border-green-100 rounded-xl shadow-sm p-6 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-700 text-2xl">🧑‍⚕️</span>
              <h1 className="font-bold text-2xl font-poppins text-green-900">Patient</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div><span className="font-medium text-gray-500">ID:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.id || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Nom et Prénom:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.name || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Contact:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.phoneNumber || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Âge:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.age || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Sexe:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.gender || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Poids:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.weight || "N/A"} kg</span></div>
              <div><span className="font-medium text-gray-500">Grade:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.grade || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Service:</span> <span className="font-semibold text-PrimaryBlack">{preparation.patient?.service || "N/A"}</span></div>
            </div>
          </div>

          {/* Preparation Section */}
          <div className="flex flex-col bg-white border-2 border-green-50 rounded-xl shadow-sm p-6 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-700 text-2xl">🧪</span>
              <h1 className="font-bold text-2xl font-poppins text-green-900">Préparation</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div><span className="font-medium text-gray-500">Id:</span> <span className="font-semibold text-PrimaryBlack">{preparation.id}</span></div>
              <div><span className="font-medium text-gray-500">DCI:</span> <span className="font-semibold text-PrimaryBlack">{preparation.dci}</span></div>
              <div><span className="font-medium text-gray-500">Nom commercial:</span> <span className="font-semibold text-PrimaryBlack">{preparation.nomCom}</span></div>
              <div><span className="font-medium text-gray-500">Indication thérapeutique:</span> <span className="font-semibold text-PrimaryBlack">{preparation.indication || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Dosage Initial (mg):</span> <span className="font-semibold text-PrimaryBlack">{preparation.dosageInitial}</span></div>
              <div><span className="font-medium text-gray-500">Dosage Adapté (mg):</span> <span className="font-semibold text-PrimaryBlack">{preparation.dosageAdapte || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Mode d'Emploi (par jour):</span> <span className="font-semibold text-PrimaryBlack">{preparation.modeEmploi}</span></div>
              <div><span className="font-medium text-gray-500">Voie d'Administration:</span> <span className="font-semibold text-PrimaryBlack">{preparation.voieAdministration || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">QSP (nombre de jours):</span> <span className="font-semibold text-PrimaryBlack">{preparation.qsp}</span></div>
              <div><span className="font-medium text-gray-500">Excipient à effet notoire:</span> <span className="font-semibold text-PrimaryBlack">{preparation.excipient || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Date de Préparation:</span> <span className="font-semibold text-PrimaryBlack">{new Date(preparation.preparationDate).toLocaleDateString()}</span></div>
              <div><span className="font-medium text-gray-500">Date de Péremption:</span> <span className="font-semibold text-PrimaryBlack">{new Date(preparation.peremptionDate).toLocaleDateString()}</span></div>
              <div><span className="font-medium text-gray-500">Statut:</span> <span className="font-semibold text-PrimaryBlack">{preparation.statut}</span></div>
              <div><span className="font-medium text-gray-500">Nombre de Gélules:</span> <span className="font-semibold text-PrimaryBlack">{preparation.nombreGellules}</span></div>
              <div><span className="font-medium text-gray-500">Comprimés à Écraser:</span> <span className="font-semibold text-PrimaryBlack">{preparation.compriméEcrasé.toFixed(2)}</span></div>
              <div><span className="font-medium text-gray-500">Numéro de Gellule:</span> <span className="font-semibold text-PrimaryBlack">{preparation.numeroGellule || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Volume de l'excipient ajouté (ml):</span> <span className="font-semibold text-PrimaryBlack">{preparation.volumeExipient?.toFixed(2) || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Erreur médicamenteuse?</span> <span className="font-semibold text-PrimaryBlack">{preparation.erreur ? "Oui" : "Non"}</span></div>
            </div>
            {preparation.erreur && (
              <div className="flex flex-col items-end mt-4">
                <div
                  className="flex items-center gap-2 bg-green border border-green p-[12px] sm:p-[15px] rounded-[10px] hover:bg-green/10 hover:text-green group cursor-pointer shadow"
                  onClick={() => handleDownloadPDF(preparation)}
                >
                  <TbFileDownload className="text-white text-[20px] group-hover:text-green" />
                  <p className="text-white hover:text-green"> Fiche d'EM</p>
                </div>
              </div>
            )}
          </div>

          {/* Medicament Info Section */}
          {medicament && (
            <div className="flex flex-col bg-blue-50 border-2 border-blue-200 rounded-xl shadow p-6 mb-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-blue-700 text-2xl">💊</span>
                <h1 className="font-bold text-2xl font-poppins text-blue-900">Médicament (Liste nationale des médicaments concernant l'écrasement des comprimés et l'ouverture)</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div><span className="font-medium text-gray-500">Principe actif:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Principe_actif || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Forme galénique:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Forme_galenique || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Classe ATC:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Classe_ATC || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Libellé ATC3:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Libelle_ATC3 || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Libellé ATC4:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Libelle_ATC4 || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Source modalités:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Source_modalites || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Autre source:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Autre_source || 'N/A'}</span></div>
                <div><span className="font-medium text-gray-500">Alternatives galéniques:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Alternatives_galeniques || 'N/A'}</span></div>
                <div className="md:col-span-2"><span className="font-medium text-gray-500">Informations RCP:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Informations_RCP || 'N/A'}</span></div>
                <div className="md:col-span-2"><span className="font-medium text-gray-500">Réponses laboratoires:</span> <span className="font-semibold text-PrimaryBlack">{medicament.Reponses_laboratoires || 'N/A'}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreparationDetails;
