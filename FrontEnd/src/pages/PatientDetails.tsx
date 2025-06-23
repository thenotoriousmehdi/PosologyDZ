/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import AddPreparation from "../components/AddPreparation";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import EditPatient from "../components/EditPatient";
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
  statut: string;
  numeroGellule?: number | null;
  volumeExipient?: number | null;
  onDelete: (id: string) => void;
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

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddPrepOpen, setIsAddPrepOpen] = useState(false);
    const [selectedPreparation, setSelectedPreparation] = useState<MedicinePreparation | null>(null); 
    const userRole = localStorage.getItem("userRole");
    const canEditPatient = userRole === "admin" || userRole === "pharmacist";

  const handleOpenEditPopup = () => setIsEditOpen(true);
    const handleCloseEditPopup = () => setIsEditOpen(false);
  
    const handleOpenAddPrepPopup = () => {
      setSelectedPreparation(null); 
      setIsAddPrepOpen(true);
    };
  
    const handleCloseAddPrepPopup = () => {
      setSelectedPreparation(null); 
      setIsAddPrepOpen(false);
    };
  
    const handleOpenModifyPrepPopup = (preparation: MedicinePreparation) => {
      setSelectedPreparation(preparation); 
      setIsAddPrepOpen(true);
    };
  
    const navigate = useNavigate();
    useEffect(() => {
      const fetchPatient = async () => {
        try {
          const response = await api.get(`/patients/${id}`);
          setPatient(response.data);
        } catch (err: any) {
          setError(
            err.response?.data?.message ||
              "Erreur lors de la récupération du patient."
          );
        } finally {
          setLoading(false);
        }
      };
  
      fetchPatient();
    }, [id]);
  
    const handleDeletePreparation = async (prepId: number) => {
      if (
        !window.confirm("Êtes-vous sûr de vouloir supprimer cette préparation ?")
      )
        return;
  
      try {
        await api.delete(`/medicine-preparations/${prepId}`);
        setPatient((prevPatient) =>
          prevPatient
            ? {
                ...prevPatient,
                medicinePreparations: prevPatient.medicinePreparations.filter(
                  (prep) => prep.id !== prepId
                ),
              }
            : null
        );
      } catch (error) {
        alert("Erreur lors de la suppression de la préparation.");
      }
    };
  
    const handlePreparationAdded = (newPreparation: any) => {
      setPatient((prevPatient) =>
        prevPatient
          ? {
              ...prevPatient,
              medicinePreparations: [
                ...prevPatient.medicinePreparations,
                newPreparation,
              ],
            }
          : null
      );
    };
  
    const handlePreparationUpdated = (updatedPreparation: any) => {
      setPatient((prevPatient) =>
        prevPatient
          ? {
              ...prevPatient,
              medicinePreparations: prevPatient.medicinePreparations.map((prep) =>
                prep.id === updatedPreparation.id ? updatedPreparation : prep
              ),
            }
          : null
      );
    };

  if (loading) return <p>Recherche en cours...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patient) return <p>Aucun patient trouvé</p>;

  
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
    const title2 =
      "Laboratoire Central de Biologie Médicale Mère et Enfant";
    const title3 = "P' F. Djennane";
    doc.setFontSize(14);
  
    doc.text(title1, (pageWidth - doc.getTextWidth(title1)) / 2, 20);
    doc.text(title2, (pageWidth - doc.getTextWidth(title2)) / 2, 30);
    doc.text(title3, (pageWidth - doc.getTextWidth(title3)) / 2, 40);

    doc.setFontSize(8);
    const title4 = ("Fiche inspirée de l'ANSM et adaptée au préparatoire du Laboratoire Central de Biologie Médicale Mère et Enfant. CHU Béni Messous");
    doc.text(title4, (pageWidth - doc.getTextWidth(title4)) / 2, pageHeight - bottomMargin);

    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Informations du prescripteur", 10, 60);
    doc.setFontSize(11);
    doc.setFont("poppins", "normal");

    addInlinePair(
      "Nom et prénom",
      patient.medicin || "N/A",
      "Spécialité",
      patient.specialite || "N/A",
      70
    );
    addInlinePair(
      "Lieu d'exercice",
      patient.etablissement || "N/A",
      "Service",
      patient.service || "N/A",
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
      {isEditOpen && (
        <EditPatient
          patientId={patient.id}
          isOpen={isEditOpen}
          onClose={handleCloseEditPopup}
        />
      )}
      {isAddPrepOpen && (
       <AddPreparation
        patientId={patient.id}
        isOpen={isAddPrepOpen}
        onClose={handleCloseAddPrepPopup}
        onPreparationAdded={handlePreparationAdded}
        onPreparationUpdated={handlePreparationUpdated}
        existingPreparation={
          selectedPreparation
            ? {
                id: selectedPreparation.id,
                medicinePreparations: [selectedPreparation],
              }
            : undefined
        }
      />
      )}
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px] overflow-y-auto">
        <div>
          <Header
            title={`Détails patient / ${patient.name}`}
            description="Informations détaillées et historique du patient sélectionné."
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

        <div className="flex flex-col justify-start gap-6">
          {/* Patient Info Section */}
          <div className="flex flex-col bg-white border-2 border-green-100 rounded-xl shadow-sm p-6 mb-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-700 text-2xl">🧑‍⚕️</span>
              <h1 className="font-bold text-2xl font-poppins text-green-900">Informations personnelles</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div><span className="font-medium text-gray-500">Id:</span> <span className="font-semibold text-PrimaryBlack">{patient.id}</span></div>
              <div><span className="font-medium text-gray-500">Nom:</span> <span className="font-semibold text-PrimaryBlack">{patient.name}</span></div>
              <div><span className="font-medium text-gray-500">Age:</span> <span className="font-semibold text-PrimaryBlack">{patient.age}</span></div>
              <div><span className="font-medium text-gray-500">Sexe:</span> <span className="font-semibold text-PrimaryBlack">{patient.gender}</span></div>
              <div><span className="font-medium text-gray-500">Poids:</span> <span className="font-semibold text-PrimaryBlack">{patient.weight} kg</span></div>
              <div><span className="font-medium text-gray-500">Numéro du parent:</span> <span className="font-semibold text-PrimaryBlack">{patient.phoneNumber}</span></div>
              <div><span className="font-medium text-gray-500">Antécédents:</span> <span className="font-semibold text-PrimaryBlack">{patient.antecedents || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Nom de l'établissement:</span> <span className="font-semibold text-PrimaryBlack">{patient.etablissement || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Service:</span> <span className="font-semibold text-PrimaryBlack">{patient.service}</span></div>
              <div><span className="font-medium text-gray-500">Nom du médecin traitant:</span> <span className="font-semibold text-PrimaryBlack">{patient.medicin || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Spécialité:</span> <span className="font-semibold text-PrimaryBlack">{patient.specialite || "N/A"}</span></div>
              <div><span className="font-medium text-gray-500">Grade:</span> <span className="font-semibold text-PrimaryBlack">{patient.grade}</span></div>
            </div>
            {canEditPatient && (
           <button
                className="hover:scale-110 transition-transform text-blue-500 hover:text-blue-700 mt-4 self-end"
           aria-label="Modifier les infos personnelles"
           onClick={handleOpenEditPopup}
         >
           <RiEdit2Fill style={{ fontSize: "20px" }} />
         </button>
          )}
        </div>

          {/* Preparation Section */}
          <div className="flex flex-col gap-4 mb-4">
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-green-700 text-2xl">🧪</span>
                <h1 className="text-2xl text-green-900 font-bold font-poppins">Préparations</h1>
              </div>
            <button
              className="bg-green py-4 px-4 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80"
              onClick={handleOpenAddPrepPopup}
            >
              Ajouter
            </button>
          </div>

          {patient.medicinePreparations.length > 0 ? (
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              modules={[Navigation, Pagination]}
              className="custom-swiper w-full"
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 2,
                },
              }}
            >
              {patient.medicinePreparations.map((prep) => (
                <SwiperSlide key={prep.id}>
                    <div className="flex flex-col bg-white border-2 border-green-50 rounded-xl shadow-sm p-6 h-full mb-2">
                      <div className="grid grid-cols-1 gap-y-2">
                        <div><span className="font-medium text-gray-500">Id:</span> <span className="font-semibold text-PrimaryBlack">{prep.id}</span></div>
                        <div><span className="font-medium text-gray-500">DCI:</span> <span className="font-semibold text-PrimaryBlack">{prep.dci}</span></div>
                        <div><span className="font-medium text-gray-500">Nom commercial:</span> <span className="font-semibold text-PrimaryBlack">{prep.nomCom}</span></div>
                        <div><span className="font-medium text-gray-500">Indication thérapeutique:</span> <span className="font-semibold text-PrimaryBlack">{prep.indication || "N/A"}</span></div>
                        <div><span className="font-medium text-gray-500">Dosage Initial (mg):</span> <span className="font-semibold text-PrimaryBlack">{prep.dosageInitial}</span></div>
                        <div><span className="font-medium text-gray-500">Dosage Adapté (mg):</span> <span className="font-semibold text-PrimaryBlack">{prep.dosageAdapte || "N/A"}</span></div>
                        <div><span className="font-medium text-gray-500">Mode d'Emploi (par jour):</span> <span className="font-semibold text-PrimaryBlack">{prep.modeEmploi}</span></div>
                        <div><span className="font-medium text-gray-500">Voie d'Administration:</span> <span className="font-semibold text-PrimaryBlack">{prep.voieAdministration || "N/A"}</span></div>
                        <div><span className="font-medium text-gray-500">QSP (nombre de jours):</span> <span className="font-semibold text-PrimaryBlack">{prep.qsp}</span></div>
                        <div><span className="font-medium text-gray-500">Excipient à effet notoire:</span> <span className="font-semibold text-PrimaryBlack">{prep.excipient || "N/A"}</span></div>
                        <div><span className="font-medium text-gray-500">Date de Préparation:</span> <span className="font-semibold text-PrimaryBlack">{new Date(prep.preparationDate).toLocaleDateString()}</span></div>
                        <div><span className="font-medium text-gray-500">Date de Péremption:</span> <span className="font-semibold text-PrimaryBlack">{new Date(prep.peremptionDate).toLocaleDateString()}</span></div>
                        <div><span className="font-medium text-gray-500">Statut:</span> <span className="font-semibold text-PrimaryBlack">{prep.statut}</span></div>
                        <div><span className="font-medium text-gray-500">Nombre de Gélules:</span> <span className="font-semibold text-PrimaryBlack">{prep.nombreGellules}</span></div>
                        <div><span className="font-medium text-gray-500">Comprimés à Écraser:</span> <span className="font-semibold text-PrimaryBlack">{prep.compriméEcrasé.toFixed(2)}</span></div>
                        <div><span className="font-medium text-gray-500">Numéro de Gellule:</span> <span className="font-semibold text-PrimaryBlack">{prep.numeroGellule || "N/A"}</span></div>
                        <div><span className="font-medium text-gray-500">Volume de l'excipient ajouté (ml):</span> <span className="font-semibold text-PrimaryBlack">{prep.volumeExipient?.toFixed(2) || "N/A"}</span></div>
                    </div>
                      <div className="flex flex-row justify-end items-center gap-4 mt-4">
                      <button
              onClick={() => handleOpenModifyPrepPopup(prep)}
              className="text-blue-500 hover:text-blue-700"
              title="Modifier la préparation"
            >
              <RiEdit2Fill size={20} />
            </button> 
                        <button
                          onClick={() => handleDeletePreparation(prep.id)}
                          className="hover:scale-110 transition-transform"
                          aria-label="Supprimer la préparation"
                        >
                          <MdDelete style={{ color: "#FF3A3A", fontSize: "20px" }} />
                        </button>
                      {prep.erreur && (
                        <div
                            className="flex items-center gap-2 bg-green border border-green p-[12px] sm:p-[15px] rounded-[10px] hover:bg-green/10 hover:text-green group cursor-pointer shadow"
                          onClick={() => handleDownloadPDF(prep)}
                        >
                          <TbFileDownload className="text-white text-[20px] group-hover:text-green" />
                            <p className="text-white hover:text-green"> Fiche d'EM</p>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p>Aucune préparation trouvée.</p>
          )}
          </div>
        </div>
      </div>
      <style>{`
  .custom-swiper .swiper-button-next,
  .custom-swiper .swiper-button-prev {
    color: #16a34a;
    background: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .custom-swiper .swiper-button-next:hover,
  .custom-swiper .swiper-button-prev:hover {
    color: #15803d;
    transform: scale(1.1);
  }

  .custom-swiper .swiper-button-next::after,
  .custom-swiper .swiper-button-prev::after {
    font-size: 1.2rem;
    font-weight: bold;
  }

  .custom-swiper .swiper-pagination-bullet {
    background: #d1fae5;
    opacity: 1;
  }

  .custom-swiper .swiper-pagination-bullet-active {
    background: #16a34a;
  }
`}</style>
    </div>
  );
};

export default PatientDetails;
