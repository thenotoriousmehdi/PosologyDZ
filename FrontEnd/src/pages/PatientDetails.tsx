import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

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

  if (loading) return <p>Loading patient data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!patient) return <p>No patient found</p>;

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px]">
        <div>
          <Header
            title="Patient Details"
            description="Detailed information and history of the selected patient"
          />
        </div>

        <div className="flex justify-between items-center">
          <button className="flex items-center text-green-600 hover:text-green-800">
            <FiArrowLeft size={20} />
            <span className="ml-2">Back</span>
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Weight:</strong> {patient.weight} kg</p>
          <p><strong>Phone:</strong> {patient.phoneNumber}</p>
          <p><strong>Grade:</strong> {patient.grade}</p>
          <p><strong>Antecedents:</strong> {patient.antecedents || "N/A"}</p>
          <p><strong>Hospital:</strong> {patient.etablissement || "N/A"}</p>
          <p><strong>Doctor:</strong> {patient.medicin || "N/A"}</p>
          <p><strong>Speciality:</strong> {patient.specialite || "N/A"}</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Medicine Preparations</h2>
          {patient.medicinePreparations.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2 border">DCI</th>
                  <th className="p-2 border">Dosage Initial</th>
                  <th className="p-2 border">Dosage Adapted</th>
                  <th className="p-2 border">Mode Emploi</th>
                  <th className="p-2 border">QSP</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {patient.medicinePreparations.map((prep) => (
                  <tr key={prep.id} className="text-center">
                    <td className="p-2 border">{prep.dci}</td>
                    <td className="p-2 border">{prep.dosageInitial}</td>
                    <td className="p-2 border">{prep.dosageAdapte || "N/A"}</td>
                    <td className="p-2 border">{prep.modeEmploi}</td>
                    <td className="p-2 border">{prep.qsp}</td>
                    <td className="p-2 border">{prep.statut}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medicine preparations found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
