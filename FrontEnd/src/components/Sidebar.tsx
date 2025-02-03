import { useEffect, useState } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { FaChildren } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logochu.png";
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
          <img src={logo} alt="chu logo" className="w-[45px] h-[61px]" />
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
              Logout
            </p>
          </div>
        </div>

        {/* Divider */}
      </div>
    </>
  );
};

export default Sidebar;
