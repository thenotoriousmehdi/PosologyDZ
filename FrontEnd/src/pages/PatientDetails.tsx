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
      "Lieu d’exercice",
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

        <div className="flex flex-col justify-start gap-4">
          <h1 className="text-2xl text-PrimaryBlack font-bold ">
            Informations personnelles
          </h1>

          <div className="flex justify-between items-start bg-white border-2 border-green-50 hover:shadow-green-100 transition-shadow rounded-xl p-6 h-full mb-2">
            <div className=" flex flex-col gap-3">
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Id:
                </strong>{" "}
                {patient.id}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Nom:
                </strong>{" "}
                {patient.name}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Age:
                </strong>{" "}
                {patient.age}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Sexe:
                </strong>{" "}
                {patient.gender}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Poids:
                </strong>{" "}
                {patient.weight} kg
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Numéro du parent:
                </strong>{" "}
                {patient.phoneNumber}
              </p>

              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Antecedents:
                </strong>{" "}
                {patient.antecedents || "N/A"}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Nom de l’établissement:
                </strong>{" "}
                {patient.etablissement || "N/A"}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Service:
                </strong>{" "}
                {patient.service}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Nom du médecin traitant:
                </strong>{" "}
                {patient.medicin || "N/A"}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Spécialité:
                </strong>{" "}
                {patient.specialite || "N/A"}
              </p>
              <p>
                <strong className="font-bold font-poppins text-PrimaryBlack/80">
                  Grade:
                </strong>{" "}
                {patient.grade}
              </p>
            </div>
            {canEditPatient && (
           <button
           className="hover:scale-110 transition-transform text-blue-500 hover:text-blue-700"

           aria-label="Modifier les infos personnelles"
           
           onClick={handleOpenEditPopup}
         >
           <RiEdit2Fill style={{ fontSize: "20px" }} />
         </button>
          )}
            
          </div>
        </div>

        <div className="flex flex-col justify-start gap-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-PrimaryBlack font-bold">
              Préparations
            </h1>

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
                  <div className="flex justify-between items-start bg-white border-2 border-green-50 hover:shadow-green-100 transition-shadow rounded-xl p-6 h-full mb-2">
                    <div className=" flex flex-col gap-3">
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Id:
                        </span>{" "}
                        {prep.id}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          DCI:
                        </span>{" "}
                        {prep.dci}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Nom commercial:
                        </span>{" "}
                        {prep.nomCom}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Indication thérapeutique:
                        </span>{" "}
                        {prep.indication || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Dosage Initial (mg):
                        </span>{" "}
                        {prep.dosageInitial}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Dosage Adapté (mg):
                        </span>{" "}
                        {prep.dosageAdapte || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Mode d'Emploi (par jour):
                        </span>{" "}
                        {prep.modeEmploi}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Voie d'Administration:
                        </span>{" "}
                        {prep.voieAdministration || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          QSP (nombre de jours):
                        </span>{" "}
                        {prep.qsp}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Excipient à effet notoire:
                        </span>{" "}
                        {prep.excipient || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Date de Préparation:
                        </span>{" "}
                        {new Date(prep.preparationDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Date de Péremption:
                        </span>{" "}
                        {new Date(prep.peremptionDate).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Statut:
                        </span>{" "}
                        {prep.statut}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Nombre de Gélules:
                        </span>{" "}
                        {prep.nombreGellules}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Comprimés à Écraser:
                        </span>{" "}
                        {prep.compriméEcrasé.toFixed(2)}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Numéro de Gellule:
                        </span>{" "}
                        {prep.numeroGellule || "N/A"}
                      </p>
                      <p>
                        <span className="font-bold font-poppins text-PrimaryBlack/80">
                          Volume de l'excipient ajouté (ml):
                        </span>{" "}
                        {prep.volumeExipient?.toFixed(2) || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col justify-end items-end gap-4">
                      <div className="flex items-center gap-2">
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
                          <MdDelete
                            style={{ color: "#FF3A3A", fontSize: "20px" }}
                          />
                        </button>
                      </div>

                      {prep.erreur && (
                        <div
                          className="flex items-center gap-2 bg-green border border-green p-[12px] sm:p-[15px] h-full rounded-[10px] hover:bg-green/10 hover:text-green group cursor-pointer"
                          onClick={() => handleDownloadPDF(prep)}
                        >
                          <TbFileDownload className="text-white text-[20px] group-hover:text-green" />
                          <p className="text-white hover:text-green">
                            {" "}
                            Fiche d'EM
                          </p>
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
