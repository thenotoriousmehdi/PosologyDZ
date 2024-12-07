import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import PreparationCard from "../components/PreparationCard";

interface Preparation {
  id: string;
  dci: string;
  dosageInitial: number;
  dosageAdapte: number;
  nombreGellules: number;
  compriméEcrasé: number;
  statut: "A_faire" | "En_Cours" | "Termine";
}

const Preparations: React.FC = () => {
  const [preparations, setPreparations] = useState<Preparation[]>([]); 
  const [filteredPreparations, setFilteredPreparations] = useState<Preparation[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for the selected status filter

  useEffect(() => {
    axios
      .get("http://localhost:3000/medicine-preparations") 
      .then((response) => {
        setPreparations(response.data); 
        setFilteredPreparations(response.data); 
      })
      .catch(() => {
        console.log("Error fetching preparations");
      });
  }, []);

  // Handle search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query); 
    filterPreparations(query, selectedStatus); // Call the filter function with search query and status
  };

  // Handle status change in the select dropdown
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status); 
    filterPreparations(searchQuery, status); // Call the filter function with search query and status
  };

  // Function to filter preparations based on search and status
  const filterPreparations = (query: string, status: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = preparations.filter((prep) => {
      const matchesSearch = prep.dci.toLowerCase().includes(lowerCaseQuery);
      const matchesStatus = status ? prep.statut === status : true; // Only filter by status if one is selected
      return matchesSearch && matchesStatus;
    });
    setFilteredPreparations(filtered); // Update filtered preparations state
  };

  return (
    <div className="flex w-full bg-Backg bg-no-repeat bg-cover px-[35px] py-[30px] xl:gap-[50px] h-screen">
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full">
        <div>
          <Header
            title="Préparations"
            description="Accédez à l'historique des préparations."
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-green/30 rounded-[10px] px-4 py-5 bg-white w-[400px]">
            <FiSearch style={{ color: "#0F5012", fontSize: "25px" }} />
            <input
              type="text"
              placeholder="Rechercher.."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="ml-3 w-full font-openSans text-[20px] outline-none text-sm text-PrimaryBlack placeholder-PrimaryBlack/50"
            />
          </div>
          <div>
            <select
              className="border border-green/30 rounded-[10px] px-4 font-poppins font-medium hover:bg-green/10 text-[16px] py-5 h-full text-green bg-white cursor-pointer focus:outline-green"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="">Tout</option>
              <option value="A_faire">A faire</option>
              <option value="En_Cours">En cours</option>
              <option value="Termine">Terminé</option>
            </select>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col gap-[20px]">
            {filteredPreparations.length > 0 ? (
              filteredPreparations.map((prep: Preparation) => (
                <PreparationCard
                  key={prep.id}
                  id={prep.id}
                  dci={prep.dci}
                  dosageInitial={prep.dosageInitial}
                  dosageAdapte={prep.dosageAdapte}
                  nombreGellules={prep.nombreGellules}
                  compriméEcrasé={prep.compriméEcrasé} 
                  statut={prep.statut}
                />
              ))
            ) : (
              <div className="text-center text-gray-500 font-poppins text-[18px]">
                Aucune préparation trouvée
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preparations;