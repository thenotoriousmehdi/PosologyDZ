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

  const handleOpenEditPopup = () => setIsEditOpen(true);
  const handleCloseEditPopup = () => setIsEditOpen(false);

  const handleOpenAddPrepPopup = () => setIsAddPrepOpen(true);
  const handleCloseAddPrepPopup = () => setIsAddPrepOpen(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/patients/${id}`);
        setPatient(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors de la récupération du patient.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleDeletePreparation = async (prepId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette préparation ?")) return;

    try {
      await axios.delete(`http://localhost:3000/medicine-preparations/${prepId}`);

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

  if (loading) return <p>Recherche en cours...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patient) return <p>Aucun patient trouvé</p>;


  const handleDownloadPDF = (preparation: MedicinePreparation) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const addInlinePair = (
      leftText: string, 
      leftValue: string, 
      rightText: string, 
      rightValue: string, 
      y: number,
      leftStart: number = 10,
      rightStart: number = pageWidth / 2
    ) => {
      doc.text(`${leftText}: ${leftValue}`, leftStart, y);
      doc.text(`${rightText}: ${rightValue}`, rightStart, y);
    };
    const title1 = "Ministère de la Santé";
    const title2 = "Centre Hospitalo-Universitaire de Béni Messous";
    const title3 = "Laboratoire de Biologie Médicale Mère-Enfant";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    const textWidth1 = doc.getTextWidth(title1);
    const textWidth2 = doc.getTextWidth(title2);
    const textWidth3 = doc.getTextWidth(title3);
    const xTitle1 = (pageWidth - textWidth1) / 2;
    const xTitle2 = (pageWidth - textWidth2) / 2;
    const xTitle3 = (pageWidth - textWidth3) / 2;
    doc.text(title1, xTitle1, 20);
    doc.text(title2, xTitle2, 30);
    doc.text(title3, xTitle3, 40);
    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Informations du prescrepteur", 10, 60);
    doc.setFontSize(12);
    doc.setFont("poppins", "normal");
    addInlinePair("Nom et prénom:", patient.medicin || 'N/A', "Specialite:", patient.specialite || 'N/A', 70);
    addInlinePair("Lieu d’exercice:", patient.etablissement || 'N/A', "Service:", patient.service || 'N/A', 80);
    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Produit Concerné", 10, 90);
    addInlinePair("DCI:", preparation.dci || 'N/A', "Nom commercial:", preparation.nomCom || 'N/A', 100);
    addInlinePair("Voie d’administration:", preparation.voieAdministration || 'N/A', " Form galinique:", 'Gellule', 110);
    addInlinePair("Dosage initial:", String(preparation.dosageInitial) || 'N/A', "Numéro de lot:", preparation.numLot || 'N/A' , 120);

    
    //doc.text(`Nom et prenom: ${patient.medicin}`, 10, 70);
    // doc.text(`DCI: ${preparation.dci}`, 10, 80);
    // doc.text(`Nombre de Gélules: ${preparation.nombreGellules}`, 10, 90);
    // doc.text(`Excepient à effet notoire: ${preparation.excipient}`, 10, 100);
    // doc.text(`Dosage Adapté: ${preparation.dosageAdapte} mg`, 10, 110);
    // doc.text(`Posologie, mode d'emploi: ${preparation.modeEmploi} par jour`, 10, 120);
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

            <button
              className="hover:scale-110 transition-transform"
              aria-label="Modifier les infos personnelles"
              onClick={handleOpenEditPopup}
            >
              <RiEdit2Fill style={{ color: "#0F5012", fontSize: "20px" }} />
            </button>
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

                     
                    </div>
<div className="flex flex-col justify-end items-end gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="hover:scale-110 transition-transform"
                        aria-label="Modifier la preparation"
                      >
                        <RiEdit2Fill
                          style={{ color: "#0F5012", fontSize: "20px" }}
                        />
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
                        <div className="flex items-center gap-2 bg-green border border-green p-[12px] sm:p-[15px] h-full rounded-[10px] hover:bg-green/10 hover:text-green group cursor-pointer"
                        onClick={handleDownloadPDF}>
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
