import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import AddPatient from "../components/AddPatient";
interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  gender: string;
  age: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => setIsOpen(false);
  const userRole = localStorage.getItem("userRole");
  const canAddUser = userRole === "admin" || userRole === "pharmacist";
  useEffect(() => {
    axios
      .get("http://localhost:3000/patients")
      .then((response) => {
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(() => {
        console.log("Error fetching patients");
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(lowerCaseQuery) ||
      patient.id.toString().includes(lowerCaseQuery) 
    );

    setFilteredPatients(filtered);
};


  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/patients/${id}`)
      .then(() => {
        setPatients((prevPatients) =>
          prevPatients.filter((patient) => patient.id !== id)
        );
        setFilteredPatients((prevPatients) =>
          prevPatients.filter((patient) => patient.id !== id)
        );
      })
      .catch(() => {
        console.log("Error deleting patient");
      });
  };

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
      {isOpen && <AddPatient isOpen={isOpen} onClose={handleClosePopup} />}
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px]">
        <div>
          <Header
            title="Patients"
            description="Accédez aux informations de vos patients et réalisez diverses actions."
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex items-center border border-green/30 focus:border-green/100 focus:outline-none rounded-[10px] px-4 py-5 bg-white w-[400px]">
            <FiSearch style={{ color: "#0F5012", fontSize: "25px" }} />
            <input
              type="text"
              placeholder="Rechercher.."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="ml-3 w-full font-openSans text-[20px] focus:border-green/100 focus:outline-none  outline-none text-sm text-PrimaryBlack placeholder-PrimaryBlack/50"
            />
          </div>

          {canAddUser && (
            <button
              className="bg-green py-5 px-4 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80"
              onClick={handleOpenPopup}
            >
              Ajouter un patient
            </button>
          )}
        </div>

        <div className="flex-grow overflow-y-auto mb-28 xl:mb-2">
          <div className="flex flex-col gap-[20px]">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient: Patient) => (
                <PatientCard
                  key={patient.id}
                  id={patient.id}
                  name={patient.name}
                  phoneNumber={patient.phoneNumber}
                  gender={patient.gender}
                  age={patient.age}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 font-poppins text-[18px]">
                Aucun patient trouvé
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
