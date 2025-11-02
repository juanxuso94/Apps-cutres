import React, { useState } from 'react';
import { LeafIcon } from './icons/LeafIcon';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary-50 p-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center items-center mb-6">
          <LeafIcon className="h-12 w-12 text-primary" />
          <h1 className="ml-3 text-4xl font-bold text-primary-800">Gestor de Gastos</h1>
        </div>
        <p className="text-gray-600 mb-8">Controla tus finanzas, de forma sencilla.</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">¡Bienvenido!</h2>
          <p className="text-gray-500 mb-6">Introduce tu email para continuar.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-500 outline-none transition duration-200"
              required
            />
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Continuar
            </button>
          </form>
        </div>
        <p className="text-xs text-gray-400 mt-8">
            Esto es una demo. Tu email se guarda localmente en tu dispositivo.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;