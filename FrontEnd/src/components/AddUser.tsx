import React, { useState, useEffect } from "react";
import axios from "axios";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: (patient: unknown) => void;
  initialUser?: {
    id?: number;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
  };
}

const AddUser: React.FC<PopupProps> = ({ 
  onClose, 
  onUserAdded, 
  initialUser 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmedPasword: '',
    phoneNumber: '',
  });

  // Populate form with initial user data if editing
  useEffect(() => {
    if (initialUser) {
      setPersonalInfo({
        name: initialUser.name,
        email: initialUser.email,
        role: initialUser.role,
        phoneNumber: initialUser.phoneNumber,
        password: '',
        confirmedPasword: '',
      });
    }
  }, [initialUser]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    if (!personalInfo.name || !personalInfo.email || !personalInfo.role) {
      setFormError('Veuillez remplir tous les champs obligatoires dans les informations personnelles.');
      return false;
    }

    if (personalInfo.password && personalInfo.password !== personalInfo.confirmedPasword) {
      setFormError('Les mots de passe ne correspondent pas.');
      return false;
    }

    setFormError(null);
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Determine if it's an update or create operation
      const submitData = { 
        ...personalInfo,
        // Only include password if it's not empty
        ...(personalInfo.password ? { password: personalInfo.password } : {})
      };

      let response;
      if (initialUser?.id) {
        // Update existing user
        response = await axios.put(`http://localhost:3000/users/${initialUser.id}`, submitData);
        alert('Utilisateur mis à jour avec succès!');
      } else {
        // Create new user
        response = await axios.post('http://localhost:3000/users', submitData);
        alert('Utilisateur ajouté avec succès!');
      }

      if (response.status === 200 || response.status === 201) {
        onUserAdded?.(response.data.user || response.data.updatedUser);
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error);
      setFormError(error.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-PrimaryBlack bg-opacity-55">
      <div className="flex flex-col bg-white rounded-[10px] shadow-lg mx-[20px] my-[20px] w-full h-[calc(100vh-150px)] md:mx-[50px] md:my-[40px] xl:mx-[250px] xl:my-[50px] xl:w-[calc(100%-200px)] xl:h-[calc(100vh-150px)]">
        {/* Title */}
        <div className="flex justify-between items-center h-[12%] border-b w-full rounded-t-[10px] bg-white px-[35px] py-[30px] z-10" style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.05)" }}>
          <h1 className="font-poppins font-bold text-[24px] text-PrimaryBlack">
            {initialUser?.id ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
          </h1>
          <div className="bg-[#FAFAFA] border border-green p-[4px] rounded-[10px] hover:bg-green" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className="sm:size-10 size-6 text-green/65 hover:text-white" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex flex-col gap-[35px] h-[76%] p-12 overflow-y-auto">
          {/* Form Content */}
          <div className="flex flex-col gap-[30px]">
            {/* Name and Email */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">Nom et Prénom <span className="text-delete">*</span></h1>
                <label className="w-full">
                  <input 
                    className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    type="text" 
                    name="name" 
                    placeholder="Nom et prénom du patient" 
                    required 
                    value={personalInfo.name} 
                    onChange={handlePersonalInfoChange} 
                  />
                </label>
              </div>

              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">Email <span className="text-delete">*</span></h1>
                <label className="w-full">
                  <input 
                    className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    type="email" 
                    name="email" 
                    placeholder="email" 
                    required 
                    value={personalInfo.email} 
                    onChange={handlePersonalInfoChange} 
                  />
                </label>
              </div>
            </div>

            {/* Phone and Role */}
            <div className="flex flex-col justify-start gap-2 md:w-1/2">
              <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">Numéro de téléphone</h1>
              <label className="w-full">
                <input 
                  className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                  type="tel" 
                  placeholder="Numéro de téléphone" 
                  required 
                  name="phoneNumber" 
                  value={personalInfo.phoneNumber} 
                  onChange={handlePersonalInfoChange} 
                />
              </label>
            </div>

            <div className="flex flex-col justify-start gap-2 w-full">
              <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">Role <span className="text-delete">*</span></h1>
              <label className="w-full">
                <select 
                  className="sm:p-[20px] p-[15px] text-PrimaryBlack/90 w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                  required 
                  name="role" 
                  value={personalInfo.role} 
                  onChange={handlePersonalInfoChange}
                >
                  <option value="" disabled>Role</option>
                  <option value="pharmacist">Pharmacien</option>
                  <option value="preparateur">Préparateur</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </div>

            {/* Password and Confirm Password */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Mot de passe {!initialUser?.id && <span className="text-delete">*</span>}
                </h1>
                <label className="w-full">
                  <input 
                    className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    type="password" 
                    name="password" 
                    placeholder="Mot de passe" 
                    required={!initialUser?.id}
                    value={personalInfo.password} 
                    onChange={handlePersonalInfoChange} 
                  />
                </label>
              </div>

              <div className="flex flex-col justify-start gap-2 w-full">
                <h1 className="font-poppins font-medium text-[16px] text-PrimaryBlack">
                  Confirmer le mot de passe {!initialUser?.id && <span className="text-delete">*</span>}
                </h1>
                <label className="w-full">
                  <input 
                    className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                    type="password" 
                    name="confirmedPasword" 
                    placeholder="Confirmer mot de passe" 
                    required={!initialUser?.id}
                    value={personalInfo.confirmedPasword} 
                    onChange={handlePersonalInfoChange} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {formError && (
          <div className="text-delete text-center mb-4">{formError}</div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end items-center h-[12%] border-b w-full rounded-b-[10px] bg-white px-[35px] py-[40px] z-10" style={{ boxShadow: "0px 4px 10px 4px rgba(29, 28, 28, 0.10)" }}>
          <button
            className="bg-green py-4 px-8 xl:px-10 text-white rounded-[10px] font-poppins font-medium text-[16px] hover:bg-green/80"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "En cours..." : (initialUser?.id ? "Mettre à jour" : "Enregistrer")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;