import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DetailsPatient() {

return (

<div className="flex w-full bg-white bg-no-repeat bg-cover pr-[35px] gap-[35px] h-screen">
      <div className="z-10">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-grow gap-[25px] w-full pt-[35px]">
        <div>
          <Header
            title="Patients/"
            patient="Abdelhakim DJEBAR"
            description="Accédez aux informations de vos patients et réalisez diverses actions."
          />
        </div>
      </div>
    </div>
  );
}