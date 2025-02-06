import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FiSearch } from "react-icons/fi";
import AddUser from "../components/AddUser";
import UserCard from "../components/UserCard";
interface User {
  id: string;
  name: string;
  email: string;
  role : string;
  phoneNumber: string;

}

const Users: React.FC = () => {

  const [users, setUsers] = useState<User[]>([]); 
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); 
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPopup = () => setIsOpen(true);
  const handleClosePopup = () => setIsOpen(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users") 
      .then((response) => {
        setUsers(response.data); 
        setFilteredUsers(response.data); 
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
    setFilteredUsers(filtered); 
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/users/${id}`) 
      .then(() => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== id)); 
      })
      .catch(() => {
        console.log("Error deleting user");
      });
  };

  return (
    <div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
         {isOpen && <AddUser isOpen={isOpen} onClose={handleClosePopup} />} 
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

          <button className="bg-green py-5 px-4 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80" 
          onClick={handleOpenPopup}>
            Ajouter un utilisateur
          </button>
        </div>

        <div className="flex-grow overflow-y-auto mb-28 xl:mb-2">
          <div className="flex flex-col gap-[20px]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: User) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  email = {user.email}
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
