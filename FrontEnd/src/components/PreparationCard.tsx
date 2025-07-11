import React, { useState } from "react";
import { TbFileDownload } from "react-icons/tb";
import jsPDF from "jspdf";
import { TbEyeFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import PreparationFinishModal from "./PreparationFinishModal";

interface PreparationCardProps {
  name: string;
  id: string;
  dci: string;
  dosageInitial: number;
  dosageAdapte: number;
  excipient: string;
  modeEmploi: string;
  nombreGellules: number;
  compriméEcrasé: number;
  erreur: boolean;
  statut: "A_faire" | "En_Cours" | "Termine";
}

enum Statut {
  A_Faire = "A_faire",
  En_Cours = "En_Cours",
  Termine = "Termine",
}

const statutMapping: { [key in Statut]: string } = {
  [Statut.A_Faire]: "A faire",
  [Statut.En_Cours]: "En cours",
  [Statut.Termine]: "Termine",
};

const PreparationCard: React.FC<PreparationCardProps> = ({
  name,
  id,
  dci,
  dosageInitial,
  dosageAdapte,
  excipient,
  modeEmploi,
  nombreGellules,
  compriméEcrasé,
  erreur,
  statut,
}) => {
  const [currentStatut, setCurrentStatut] = useState<Statut>(statut as Statut);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const navigate = useNavigate();

  const handleStatutChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatut = event.target.value as Statut;
  
    if (newStatut === Statut.Termine) {
      setShowFinishModal(true);
      event.target.value = currentStatut; // Prevent immediate change
        return;
    }
  
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir changer le statut en "${statutMapping[newStatut]}" ?`
    );
  
    if (!confirmed) {
      event.target.value = currentStatut; // Reset selection
      return;
    }
  
    try {
      await api.patch(`/medicine-preparations/${id}/statut`, { statut: newStatut });
      setCurrentStatut(newStatut);
      alert("Statut mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      alert("Échec de la mise à jour du statut");
    }
  };

  const handleFinishValidate = async (numeroGellule: number, volumeExipient: number) => {
    const updateData = {
      statut: Statut.Termine,
      numeroGellule,
      volumeExipient,
    };
    try {
      await api.patch(`/medicine-preparations/${id}/statut`, updateData);
      setCurrentStatut(Statut.Termine);
      setShowFinishModal(false);
      alert("Statut mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      alert("Échec de la mise à jour du statut");
    }
  };
  
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title1 = "Ministère de la Santé";
    const title2 = "Centre Hospitalo-Universitaire de Béni Messous";
    const title3 = "Laboratoire de Biologie Médicale Mère-Enfant";
    const titleFontSize = 16;
    doc.setFontSize(titleFontSize);
    const textWidth1 = doc.getTextWidth(title1);
    const textWidth2 = doc.getTextWidth(title2);
    const textWidth3 = doc.getTextWidth(title3);
    const xTitle1 = (pageWidth - textWidth1) / 2;
    const xTitle2 = (pageWidth - textWidth2) / 2;
    const xTitle3 = (pageWidth - textWidth3) / 2;
    doc.text(title1, xTitle1, 20);
    doc.text(title2, xTitle2, 30);
    doc.text(title3, xTitle3, 40);
    doc.setFontSize(14);
    doc.setFont("poppins", "bold");
    doc.text("Fiche de Préparation Médicamenteuse", 10, 60);
    doc.setFontSize(12);
    doc.setFont("poppins", "normal");
    doc.text(`Nom et Prénom: ${name}`, 10, 70);
    doc.text(`DCI: ${dci}`, 10, 80);
    doc.text(`Nombre de Gélules: ${nombreGellules}`, 10, 90);
    doc.text(`Excepient à effet notoire: ${excipient}`, 10, 100);
    doc.text(`Dosage Adapté: ${dosageAdapte} mg`, 10, 110);
    doc.text(`Posologie, mode d'emploi: ${modeEmploi} par jour`, 10, 120);
    doc.save(`Preparation_${id}.pdf`);
  };

  return (
    <div className="relative">
      <div
        className="flex flex-col xl:flex-row justify-between items-center p-[25px] w-full h-auto xl:h-[110px] rounded-[10px] border-[0.5px] border-green/30 bg-[#FEFEFE] hover:bg-green/10 gap-2 md:gap-10 xl:gap-16"
        style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 w-full">
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-semibold text-[16px] text-PrimaryBlack">
              {dci}
            </h1>
          </div>
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              {dosageInitial}mg -- {dosageAdapte}mg
            </h1>
          </div>
          <div className="text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[200px]">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              {nombreGellules} gel/{compriméEcrasé.toFixed(2) || "N/A"} comp
            </h1>
          </div>
          <div className="hidden text-center md:text-left flex-grow sm:flex-grow-0 w-full sm:w-[100px]  xl:flex items-center ">
            <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
              #{id}
            </h1>
            
            <div className="w-8 ml-10">
              {erreur && <span className="text-delete">EM</span>}
            </div>
          </div>

          <h1 className="xl:hidden font-poppins font-medium text-[16px] text-PrimaryBlack">
              #{id}
            </h1>
            <div className="xl:hidden w-8">
              {erreur && <span className="text-delete">EM</span>}
            </div>




        </div>

        {/* Action buttons */}
        <div className="mt-4 md:mt-0 flex gap-4 flex-shrink-0 justify-center items-center">
          

          <div
            className="bg-[#FAFAFA] border border-green p-[12px] sm:p-[15px] rounded-[10px] hover:bg-green/10 group"
            onClick={() => navigate(`/preparation/${id}`)}
          >
            <TbEyeFilled style={{ color: "#0F5012", fontSize: "20px" }} />
          </div>

          <div
            className="bg-[#FAFAFA] border border-green p-[12px] sm:p-[15px] h-full rounded-[10px] hover:bg-green/10 group cursor-pointer"
            onClick={handleDownloadPDF}
          >
            <TbFileDownload style={{ color: "#0F5012", fontSize: "20px" }} />
          </div>

          {/* Statut Dropdown */}
          <div>
            <select
              className={`
    rounded-[10px] px-4 py-4 h-full text-PrimaryBlack 
    cursor-pointer  
    ${
      currentStatut === Statut.A_Faire
        ? "bg-[#F9A825] hover:bg-[#F9A825]/80"
        : currentStatut === Statut.En_Cours
        ? "bg-[#1E88E5] hover:bg-[#1E88E5]/80"
        : currentStatut === Statut.Termine
        ? "bg-[#43A047] hover:bg-[#43A047]/80"
        : "bg-white"
    }
  `}
              value={currentStatut}
              onChange={handleStatutChange}
            >
              <option value={Statut.A_Faire}>
                {statutMapping[Statut.A_Faire]}
              </option>
              <option value={Statut.En_Cours}>
                {statutMapping[Statut.En_Cours]}
              </option>
              <option value={Statut.Termine}>
                {statutMapping[Statut.Termine]}
              </option>
            </select>
          </div>
        </div>
      </div>
      {/* Modal for finishing preparation */}
      <PreparationFinishModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        onValidate={handleFinishValidate}
      />
    </div>
  );
};

export default PreparationCard;
