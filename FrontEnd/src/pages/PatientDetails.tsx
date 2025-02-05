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
interface MedicinePreparation {
  id: number;
  dci: string;
  indication?: string;
  dosageInitial: number;
  dosageAdapte?: number;
  modeEmploi: number;
  voieAdministration?: string;
  qsp: number;
  excipient?: string;
  preparationDate: string;
  peremptionDate: string;
  statut: string;
  nombreGellules: number;
  compriméEcrasé: number;
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
  grade: string;
  medicinePreparations: MedicinePreparation[];
}

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:3000/patients/${id}`);
        if (!response.ok) throw new Error("Patient not found");
        const data: Patient = await response.json();
        setPatient(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <p>Recherche en cours...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patient) return <p>Aucun patient trouvé</p>;

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
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
          <div className="flex flex-col gap-2 bg-white border border-green/10  shadow-md rounded-lg p-6">
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Nom:</strong> {patient.name}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Age:</strong> {patient.age}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Sexe:</strong> {patient.gender}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Poids:</strong> {patient.weight} kg
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Numéro du parent:</strong> {patient.phoneNumber}
            </p>

            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Antecedents:</strong> {patient.antecedents || "N/A"}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Nom de l’établissement:</strong>{" "}
              {patient.etablissement || "N/A"}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Nom du médecin traitant:</strong>{" "}
              {patient.medicin || "N/A"}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Spécialité:</strong> {patient.specialite || "N/A"}
            </p>
            <p>
              <strong className="font-bold font-poppins text-PrimaryBlack/80">Grade:</strong> {patient.grade}
            </p>
          </div>
        </div>


        <div className="flex flex-col justify-start gap-4 mb-4">
      <h1 className="text-2xl text-PrimaryBlack font-bold">Préparations</h1>
     
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
                <div className="flex flex-col gap-3 bg-white border-2 border-green-50 shadow-lg hover:shadow-green-100 transition-shadow rounded-xl p-6 h-full">
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">DCI:</span> {prep.dci}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Indication thérapeutique:</span> {prep.indication || "N/A"}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Dosage Initial (mg):</span> {prep.dosageInitial}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Dosage Adapté (mg):</span> {prep.dosageAdapte || "N/A"}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Mode d'Emploi (par jour):</span> {prep.modeEmploi}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Voie d'Administration:</span> {prep.voieAdministration || "N/A"}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">QSP (nombre de jours):</span> {prep.qsp}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Excipient à effet notoire:</span> {prep.excipient || "N/A"}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Date de Préparation:</span> {new Date(prep.preparationDate).toLocaleDateString()}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Date de Péremption:</span> {new Date(prep.peremptionDate).toLocaleDateString()}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Statut:</span> {prep.statut}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Nombre de Gélules:</span> {prep.nombreGellules}</p>
                  <p><span className="font-bold font-poppins text-PrimaryBlack/80">Comprimés à Écraser:</span> {prep.compriméEcrasé}</p>
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
