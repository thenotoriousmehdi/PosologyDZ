import React, { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import AddUser from "../components/AddUser";

interface UserCardProps {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ 
  id, 
  name, 
  email, 
  phoneNumber, 
  role, 
  onDelete, 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Supprimer") {
      const confirmDelete = window.confirm(
        "etes-vous sure de vouloir supprimer cet utilisateur ?"
      );
      if (confirmDelete) {
        onDelete(id);
      }
    } else if (option === "Modifier") {
      setIsUpdateModalOpen(true);
    }
    setIsDropdownOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex flex-col lg:flex-row justify-between items-center p-[25px] w-full h-auto lg:h-[110px] rounded-[10px] border-[0.5px] border-green/30 bg-[#FEFEFE] hover:bg-green/10 gap-2 md:gap-10 xl:gap-16" 
        style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 w-full">
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-semibold text-[16px] text-PrimaryBlack">
              {name}
            </h1>
          </div>
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              {email}
            </h1>
          </div>
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              {phoneNumber || "N/A"}
            </h1>
          </div>
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              {role}
            </h1>
          </div>
        </div>
        {/* Action buttons */}
        <div className="mt-4 md:mt-0 flex gap-4 flex-shrink-0">
          <div className="relative">
            <div 
              className="bg-[#FAFAFA] border border-green p-[12px] sm:p-[15px] rounded-[10px] hover:bg-green/10 group" 
              onClick={toggleDropdown}
            >
              <IoEllipsisVertical style={{ color: "#0F5012", fontSize: "20px" }} />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[150px] bg-white border border-gray-300 shadow-lg z-10 rounded-[10px]">
                <ul className="flex flex-col p-2 space-y-2">
                  <li 
                    className="cursor-pointer hover:bg-BorderWithoutAction/30 px-3 py-2 hover:rounded-[10px]"
                    onClick={() => handleOptionClick("Modifier")}
                  >
                    Modifier
                  </li>
                  <li 
                    className="cursor-pointer hover:bg-BorderWithoutAction/30 px-3 py-2 hover:rounded-[10px]"
                    onClick={() => handleOptionClick("Supprimer")}
                  >
                    Supprimer
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <AddUser 
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          initialUser={{
            id: parseInt(id),
            name,
            email,
            role,
            phoneNumber
          }}
        />
      )}
    </div>
  );
};

export default UserCard;