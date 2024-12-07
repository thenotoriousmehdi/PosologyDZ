import React, { ChangeEvent, useState } from "react";
import meta from "../assets/meta.png";
import linkedin from "../assets/linkedin.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
//import SmoothAlert from "../Components/SmoothAlert"


interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
  }

const AddPatient: React.FC<PopupProps> = ({ isOpen, onClose }) => {
    

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50  bg-PrimaryBlack bg-opacity-55">
       <div className="flex flex-col bg-white rounded-[10px] shadow-lg  mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)]">

       <div
                className="bg-Backg border border-PrimaryBlack p-[10px] rounded-full hover:bg-black hover:border-black"
                onClick={onClose}
              >

                </div>










       </div>
      </div>
    );
  };

export default AddPatient;

