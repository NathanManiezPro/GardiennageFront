import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">🏠 Accueil</Link>
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      <ul className={`mt-3 md:mt-0 md:flex gap-4 ${menuOpen ? 'block' : 'hidden'} md:block`}>
        {/* Si connecté en tant que client */}
        {user?.role === 'client' && (
          <>
            <li><Link to="/cars">🚗 Voitures</Link></li>
            <li><Link to="/tickets">🎫 Tickets</Link></li>
            <li><Link to="/reservations">📅 Réservations</Link></li>
            <li><Link to="/subscriptions">🧾 Abonnements</Link></li>
          </>
        )}

        {/* Si connecté en tant qu'admin */}
        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin">🛠️ Admin</Link></li>
            <li><Link to="/admin/users">👥 Utilisateurs</Link></li>
            <li><Link to="/admin/cars">🚗 Voitures Admin</Link></li>
            <li><Link to="/admin/tickets">📋 Tickets Admin</Link></li>
            <li><Link to="/admin/reservations">📅 Réservations Admin</Link></li>
          </>
        )}

        {/* Lien de connexion/déconnexion */}
        {!user && <li><Link to="/login">🔐 Connexion</Link></li>}
        {user && (
          <li>
            <button onClick={handleLogout}>🚪 Déconnexion</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
