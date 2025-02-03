import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import PreparationCard from "../components/PreparationCard";
import GuidePopUp from "../components/GuidePopUp";

interface Preparation {
  id: string;
  dci: string;
  dosageInitial: number;
  excipient: string;
  modeEmploi: string;
  dosageAdapte: number;
  nombreGellules: number;
  compriméEcrasé: number;
  statut: "A_faire" | "En_Cours" | "Termine";
}

interface StatutCount {
  statut: string;
  _count: {
    statut: number;
  };
}

const Preparations: React.FC = () => {
  const [preparations, setPreparations] = useState<Preparation[]>([]);
  const [filteredPreparations, setFilteredPreparations] = useState<
    Preparation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusCounts, setStatusCounts] = useState<StatutCount[]>([]); 
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => setIsOpen(false);
  useEffect(() => {
    // Fetch preparations
    axios
      .get("http://localhost:3000/medicine-preparations")
      .then((response) => {
        setPreparations(response.data);
        setFilteredPreparations(response.data);
      })
      .catch(() => {
        console.log("Error fetching preparations");
      });

    // Fetch counts for each statut
    axios
      .get("http://localhost:3000/medicine-preparations/Count")
      .then((response) => {
        setStatusCounts(response.data);
      })
      .catch(() => {
        console.log("Error fetching statut counts");
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterPreparations(query, selectedStatus);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    filterPreparations(searchQuery, status);
  };

  const filterPreparations = (query: string, status: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = preparations.filter((prep) => {
      const matchesSearch = prep.dci.toLowerCase().includes(lowerCaseQuery);
      const matchesStatus = status ? prep.statut === status : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredPreparations(filtered);
  };

  // Function to get the count for each statut
  const getCountForStatus = (statut: string) => {
    const count = statusCounts.find((item) => item.statut === statut);
    return count ? count._count.statut : 0;
  };

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
      {isOpen && <GuidePopUp isOpen={isOpen} onClose={handleClosePopup} />} 
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px]">
        <div>
          <Header
            title="Préparations"
            description="Accédez à l'historique des préparations."
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-green/30 focus:border-green/100 focus:outline-none rounded-[10px] px-4 py-5 bg-white w-[400px]">
              <FiSearch style={{ color: "#0F5012", fontSize: "25px" }} />
              <input
                type="text"
                placeholder="Rechercher.."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="ml-3 w-full font-openSans text-[20px] focus:border-green/100 focus:outline-none outline-none text-sm text-PrimaryBlack placeholder-PrimaryBlack/50"
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

            <button className="bg-green py-5 px-6 xl:px-5 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80" 
          onClick={handleOpenPopup}>
            Guide
          </button>
          </div>

          {/* Display the count for each statut */}
          <div className="flex items-center gap-8 text-lg font-semibold font-poppins text-PrimaryBlack">
            <div className="flex items-center gap-2">
              <span className="text-[#F9A825]">A faire:</span>
              <span className="text-PrimaryBlack">
                {getCountForStatus("A_faire")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1E88E5]">En cours:</span>
              <span className="text-PrimaryBlack">
                {getCountForStatus("En_Cours")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#43A047]">Terminé:</span>
              <span className="text-PrimaryBlack">
                {getCountForStatus("Termine")}
              </span>
            </div>
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
                  excipient={prep.excipient}
                  modeEmploi={prep.modeEmploi}
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
