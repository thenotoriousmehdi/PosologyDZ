import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientCard from "../components/PatientCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import AddPatient from "../components/AddPatient";
import UserCard from "../components/UserCard";
interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;

}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => setIsOpen(false);
  useEffect(() => {
    axios
      .get("http://localhost:3000/users") 
      .then((response) => {
        setUsers(response.data); 
        setFilteredPatients(response.data); 
      })
      .catch(() => {
        console.log("Error fetching patients");
      });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query); 
    const lowerCaseQuery = query.toLowerCase(); 
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredPatients(filtered); 
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/users/${id}`) 
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        setFilteredPatients(prevUsers => prevUsers.filter(user => user.id !== id)); 
      })
      .catch(() => {
        console.log("Error deleting user");
      });
  };

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
        {/* {isOpen && <AddPatient isOpen={isOpen} onClose={handleClosePopup} />} */}
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px]">
        <div>
          <Header
            title="Utilisateurs"
            description="Accédez aux informations des utilisateurs et réalisez diverses actions."
          />
        </div>

        <div className="flex justify-between">
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

          <button className="bg-green py-5 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80" 
          onClick={handleOpenPopup}>
            Ajouter un patient
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col gap-[20px]">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((user: User) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  phoneNumber={user.phoneNumber}
                  role={user.role}
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

export default Users;
