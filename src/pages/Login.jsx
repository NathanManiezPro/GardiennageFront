import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    try {
      const res = await api.post('/users/login', { email, password });
      const { user } = res.data;

      if (!user) {
        alert('Erreur de connexion');
        return;
      }

      // Redirection selon le rôle
      if (user.role === 'admin') {
      localStorage.setItem("user", JSON.stringify(user));
      navigate('/admin');
      } else {
      localStorage.setItem("user", JSON.stringify(user));
      navigate('/cars');
      }

    } catch (err) {
      console.error('Erreur connexion :', err);
      alert('Identifiants incorrects');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>🔐 Connexion</h2>
      <input
        type="email"
        placeholder="Adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}
