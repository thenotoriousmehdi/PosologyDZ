import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
// Replace
import axios from "axios";
import api from '../utils/axiosConfig';

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = [
    "src/assets/imgLogin1.png",
    "src/assets/imgLogin2.png",
    "src/assets/imgLogin3.png",
    "src/assets/imgLogin4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRememberMeChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setRememberMe(event.target.checked);
  };
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    

    try {
      const response = await api.post("http://localhost:3000/auth", {
        email,
        password,
      });

      const { accessToken } = response.data;

      if (accessToken) {
        localStorage.setItem("authToken", accessToken);
        navigate("/");
      } else {
        setError("No token received from server. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Error during login:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Use the error message from the server if available
          const errorMessage = error.response.data.error || 
            "Invalid credentials or something went wrong. Please try again.";
          
          console.log("Axios error response:", error.response);
          setError(errorMessage);
        } else if (error.request) {
          setError("No response received from the server. Please try again.");
        } else {
          setError("An error occurred during the request. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
      
  };

  return (
    <div className="flex h-screen bg-[url('src/assets/layer.svg')] bg-no-repeat bg-cover justify-center xl:bg-PrimaryBlack ">
      <div
        className="w-full xl:w-[48%] xl:m-0 m-8 flex flex-col justify-center bg-white px-[25px] sm:px-[50px] md:px-[107px] gap-[60px] xl:overflow-hidden xl:h-full z-20"
        style={{ boxShadow: "0px 4px 10px 0px rgba(29, 28, 28, 0.15)" }}
      >
        <div className="flex flex-col items-start justify-start ">
          <h1 className="font-poppins font-semibold mb-4 text-[24px] text-PrimaryBlack">
            Bienvenue! <span className="wave-emoji">👋</span>
          </h1>
          <p className="font-openSans font-regular text-[16px]  text-PrimaryBlack text-opacity-80 text-start">
            Connectez-vous à votre compte en remplissant le formulaire de
            connexion avec vos informations personnelles.
          </p>
        </div>

        {/* Form inputs */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[25px]">
            {/* Display error message */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <label>
                <input
                  className="sm:p-[20px] p-[15px] w-full rounded-[15px] text-[16px] font-openSans font-regular border border-BorderWithoutAction focus:border-green focus:outline-none"
                  type="email"
                  placeholder="Adresse email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>
            </div>

            <div>
              <div className="flex sm:p-[20px] p-[15px] w-full text-[16px]  rounded-[15px] font-openSans font-regular border border-BorderWithoutAction focus-within:border-green justify-between">
                <input
                  className="bg-transparent border-transparent"
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  minLength={8}
                  maxLength={20}
                  onChange={handlePasswordChange}
                  placeholder="Mot de passe"
                />
                <div className="mr-[8px] z-10">
                  <span onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="peer mr-2 h-4 w-4 text-black border-gray-300 rounded-lg focus:ring-black checked:bg-green"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <span className="text-gray-700 font-openSans peer-checked:text-black">
                  Se souvenir de moi
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full hover:bg-green/80 bg-green p-[12px] sm:p-[16px] text-white rounded-[30px] font-poppins text-[20px] font-medium"
            >
              Se connecter
            </button>
          </div>
        </form>

        <p className=" flex justify-center items-center font-openSans text-center text-[14px] text-PrimaryBlack/80">
          Ministère de la Santé <br />
          Centre Hospitalo-Universitaire de Béni Messous <br />
          Laboratoire de Biologie Médicale Mère-Enfant
        </p>
      </div>

      <div className="hidden xl:block xl:w-[52%] xl:relative ">
        <div className="absolute inset-0 flex justify-center items-center z-20">
          <img
            src="src/assets/logochu.png"
            alt="Logo Chu"
            className="w-[186px] h-[257px]"
          />
        </div>

        <div className="absolute inset-0 bg-[#0F5012] bg-opacity-50 z-10" />
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Login Image ${index + 1}`}
            className={`absolute inset-0 xl:object-cover xl:h-full xl:w-full xl:z-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
