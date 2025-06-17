import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', alignItems: 'center' }}>
        {/* Toujours visible */}
        <li><Link to="/">🏠 Accueil</Link></li>

        {/* Si connecté */}
        {user && user.role === 'client' && (
          <>
            <li><Link to="/cars">🚗 Voitures</Link></li>
            <li><Link to="/tickets">🎫 Tickets</Link></li>
            <li><Link to="/reservations">📅 Réservations</Link></li>
            <li><Link to="/subscriptions">🧾 Abonnements</Link></li>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <li><Link to="/admin">🛠️ Admin</Link></li>
            <li><Link to="/admin/users">👥 Utilisateurs</Link></li>
            <li><Link to="/admin/cars">🚗 Voitures Admin</Link></li>
            <li><Link to="/admin/tickets">📋 Tickets Admin</Link></li>
          </>
        )}

        {/* Auth */}
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
