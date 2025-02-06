import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">Page non trouvée</h2>
      <p className="text-gray-600 mt-4">
      Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-green text-white text-lg font-medium rounded-lg shadow hover:bg-green/80 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
