// src/components/NavBar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="flex items-center">
        {/* Logo / Accueil */}
        <Link to="/" className="text-xl font-bold">🏠 Accueil</Link>

        {/* Menu client/admin */}
        <ul className={`ml-6 flex-1 md:flex gap-4 ${menuOpen ? 'block' : 'hidden'} md:block`}>
          {user?.role === 'client' && (
            <>
              <li><Link to="/cars">🚗 Voitures</Link></li>
              <li><Link to="/tickets">🎫 Tickets</Link></li>
              <li><Link to="/reservations">📅 Réservations</Link></li>
              <li><Link to="/subscriptions">🧾 Abonnements</Link></li>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <li><Link to="/admin">🛠️ Admin</Link></li>
              <li><Link to="/admin/users">👥 Utilisateurs</Link></li>
              <li><Link to="/admin/cars">🚗 Voitures Admin</Link></li>
              <li><Link to="/admin/tickets">📋 Tickets Admin</Link></li>
              <li><Link to="/admin/reservations">📅 Réservations Admin</Link></li>
            </>
          )}
        </ul>

        {/* Burger mobile */}
        <button
          className="md:hidden ml-auto text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Profil et Déconnexion */}
        {user && (
          <div className="ml-auto flex items-center gap-4">
            <Link to="/profile" className="hover:underline">⚙️ Profil</Link>
            <button onClick={handleLogout} className="hover:underline">🚪 Déconnexion</button>
          </div>
        )}
        {!user && (
          <div className="ml-auto">
            <Link to="/login" className="hover:underline">🔐 Connexion</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
