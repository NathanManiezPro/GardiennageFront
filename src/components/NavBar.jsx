import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{ padding: '1rem', background: '#f4f4f4' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        <li><Link to="/">🏠 Accueil</Link></li>
        <li><Link to="/cars">🚗 Voitures</Link></li>
        <li><Link to="/tickets">🎫 Tickets</Link></li>
        <li><Link to="/reservations">📅 Réservations</Link></li>
        <li><Link to="/subscriptions">🧾 Abonnements</Link></li>
        <li><Link to="/login">🔐 Connexion</Link></li>
        <li><Link to="/admin">🛠️ Admin</Link></li>
      </ul>
    </nav>
  );
}
