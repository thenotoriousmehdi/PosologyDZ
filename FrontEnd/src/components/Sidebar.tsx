import { useEffect, useState } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaChildren } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/pharmacyLogo.svg";
import { CgPill } from "react-icons/cg";

const Sidebar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menuItems = [
    { name: "Patients", icon: <FaChildren />, path: "/" },
    { name: "Préparations", icon: <CgPill />, path: "/Preparations" },
    ...(userRole === "admin" ? [{ name: "Utilisateurs", icon: <FiUser />, path: "/Users" }] : []), 
  ];

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) {
      setActiveSection(currentItem.name);
    }
  }, [location.pathname, menuItems]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/Login', { replace: true });
  };

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden w-52 h-full bg-green xl:flex flex-col rounded-none">
        {/* Logo */}
        <div className="flex justify-center mb-6 mt-6">
          <img src={logo} alt="chu logo" className="w-[50px] h-[50px]" />
        </div>
        {/* Divider */}
        <div className="border-t border-gray-600 mb-4"></div>
        {/* Menu Items */}
        <ul className="space-y-2 flex-grow">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setActiveSection(item.name)}
                className={`flex items-center cursor-pointer py-2 px-4 rounded-none ${
                  activeSection === item.name
                    ? "bg-white/80 text-PrimaryBlack"
                    : "text-white hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-3 text-2xl">{item.icon}</span>
                <span
                  className={`flex flex-col justify-center font-poppins font-medium text-[16px] leading-[40px] ${
                    activeSection === item.name ? "text-green" : "text-white"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Section */}
        <div className="border-t border-gray-600 "></div>
        <div
          className="flex items-center rounded-none hover:bg-white/10 py-2 px-4 cursor-pointer "
          onClick={handleLogout}
        >
          <span className="mr-3 text-2xl text-white">
            <FiLogOut />
          </span>
          <div className="text-white">
            <p className="flex flex-col justify-center font-poppins font-medium text-[16px] leading-[40px]">
             Déconnexion
            </p>
          </div>
        </div>

        {/* Divider */}
      </div>
      {/* Sidebar for mobile screens */}
      <div className="fixed bottom-0 left-0 right-0 xl:hidden">
        <div className="bg-green rounded-[15px] mx-auto my-6 shadow-lg max-w-[400px]">
          <div className="flex justify-around py-5">
            {menuItems.map((item) => (
              <Link
                to={item.path}
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`flex flex-col items-center ${
                  activeSection === item.name ? "text-white" : "text-white"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-[10px] mb-1 ${
                    activeSection === item.name
                      ? "bg-white text-PrimaryBlack"
                      : ""
                  }`}
                >
                  {item.icon}
                </span>   
              </Link>
            ))}
            {/* Added Logout Button for Mobile */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-white"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-[10px] mb-1">
                <FiLogOut />
              </span>
            </button>
          </div>
        </div>
      </div> 
    </>
  );
};

export default Sidebar;
