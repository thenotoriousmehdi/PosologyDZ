/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { TbFileDownload } from "react-icons/tb";
//import axios from "axios";
import jsPDF from "jspdf";
import axios from "axios";
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

const PreparationDetails: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [preparation, setPreparation] = useState<MedicinePreparation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreparation = async () => {
      try {
        const response = await axios.get<MedicinePreparation>(
          `http://localhost:3000/medicine-preparations/${id}`
        );
        setPreparation(response.data);
        setPatient(response.data.patient);
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
      "Lieu d’exercice",
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
      "Voie d’administration",
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
    doc.text("Description de l’erreur médicamenteuse", 10, 150);
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
      "Cause de l’erreur",
      preparation.erreurCause || "N/A",
      180
    );
    addInlinePair(
      "Nature de l’erreur",
      preparation.erreurNature || "N/A",
      "Évitabilité de l’erreur",
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

        <div className="flex flex-col justify-start gap-4">
          <div className="flex justify-between items-start bg-white border-2 border-green-50 hover:shadow-green-100 transition-shadow rounded-xl p-6 h-full mb-2">
            <div className=" flex flex-col gap-3">
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Id:
                </span>{" "}
                {preparation.id}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  DCI:
                </span>{" "}
                {preparation.dci}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Nom commercial:
                </span>{" "}
                {preparation.nomCom}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Indication thérapeutique:
                </span>{" "}
                {preparation.indication || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Dosage Initial (mg):
                </span>{" "}
                {preparation.dosageInitial}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Dosage Adapté (mg):
                </span>{" "}
                {preparation.dosageAdapte || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Mode d'Emploi (par jour):
                </span>{" "}
                {preparation.modeEmploi}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Voie d'Administration:
                </span>{" "}
                {preparation.voieAdministration || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  QSP (nombre de jours):
                </span>{" "}
                {preparation.qsp}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Excipient à effet notoire:
                </span>{" "}
                {preparation.excipient || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Date de Préparation:
                </span>{" "}
                {new Date(preparation.preparationDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Date de Péremption:
                </span>{" "}
                {new Date(preparation.peremptionDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Statut:
                </span>{" "}
                {preparation.statut}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Nombre de Gélules:
                </span>{" "}
                {preparation.nombreGellules}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Comprimés à Écraser:
                </span>{" "}
                {preparation.compriméEcrasé.toFixed(2)}
              </p>

              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Erreur médicamenteuse?
                </span>{" "}
                {preparation.erreur ? "Oui" : "Non"}
              </p>
            </div>
            <div className="flex flex-col justify-end items-end gap-4">
              {preparation.erreur && (
                <div
                  className="flex items-center gap-2 bg-green border border-green p-[12px] sm:p-[15px] h-full rounded-[10px] hover:bg-green/10 hover:text-green group cursor-pointer"
                  onClick={() => handleDownloadPDF(preparation)}
                >
                  <TbFileDownload className="text-white text-[20px] group-hover:text-green" />
                  <p className="text-white hover:text-green"> Fiche d'EM</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-start gap-4 mb-4">
          <div className="flex justify-between items-start bg-white border-2 border-green-50 hover:shadow-green-100 transition-shadow rounded-xl p-6 h-full mb-2">
            <div className=" flex flex-col gap-3">
              <h1 className="font-bold text-2xl font-poppins text-PrimaryBlack">
                Patient
              </h1>

              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  ID
                </span>{" "}
                {preparation.patient?.id || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Nom et Prénom
                </span>{" "}
                {preparation.patient?.name || "N/A"}
              </p>
              <p>
                <span className="font-bold font-poppins text-PrimaryBlack/80">
                  Contact
                </span>{" "}
                {preparation.patient?.phoneNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationDetails;
