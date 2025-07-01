// src/pages/Profile.jsx
import { useState } from 'react';
import api from '../api/axios';

// Regex côté front (même pattern)
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]                 = useState('');
  const [error, setError]                     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('La confirmation ne correspond pas.');
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError('Le mot de passe doit comporter 8 caractères, 1 chiffre et 1 caractère spécial.');
      return;
    }

    try {
      const res = await api.patch('/users/me/password', {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">🛡️ Mon Profil</h1>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="current" className="block text-sm font-medium text-gray-700">
              Ancien mot de passe
            </label>
            <input
              id="current"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="new" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              id="new"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
              Confirmer le nouveau
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}
