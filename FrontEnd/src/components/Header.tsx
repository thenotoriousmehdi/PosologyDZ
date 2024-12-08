import React from "react";
interface HeaderProps {
  title: string;
  description: string;
  patient: string;
}

const Header: React.FC<HeaderProps> = ({ title,patient, description }) => {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      <div className="flex justify-between items-start w-full">
        <div className="flex flex-col items-start justify-start flex-grow">
          <h1 className="font-poppins font-bold mb-2 text-[24px] xl:text-[32px] text-PrimaryBlack">
            {title} <span className="font-poppins font-bold mb-2 text-[24px] xl:text-[24px] text-green"> {patient} </span>
          </h1>
          <p className="font-openSans font-normal text-[16px] text-PrimaryBlack text-opacity-70 text-start">
            {description}
          </p>
        </div>
      </div>
      <div>
        <hr className="border-t-1 border-PrimaryBlack border-opacity-20 w-full" />
      </div>
    </div>
  );
};

export default Header;
