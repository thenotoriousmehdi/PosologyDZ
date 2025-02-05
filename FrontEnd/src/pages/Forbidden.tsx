import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">Accès refusé</h2>
      <p className="text-gray-600 mt-4">
        Vous n’avez pas l’autorisation d’accéder à cette page.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Forbidden;
