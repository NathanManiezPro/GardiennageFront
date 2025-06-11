import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Cars from './pages/Cars';
import Tickets from './pages/Tickets';
import Reservations from './pages/Reservations';
import Subscriptions from './pages/Subscriptions';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/UsersList';
import CarsAdmin from './pages/admin/CarsAdmin';
import TicketsAdmin from './pages/admin/TicketsAdmin';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">🏠 Accueil</Link></li>
          <li><Link to="/cars">🚗 Voitures</Link></li>
          <li><Link to="/tickets">🎫 Tickets</Link></li>
          <li><Link to="/reservations">📅 Réservations</Link></li>
          <li><Link to="/subscriptions">🧾 Abonnements</Link></li>
          <li><Link to="/login">🔐 Connexion</Link></li>
          <li><Link to="/register">📝 Inscription</Link></li>
          <li><Link to="/admin">🛠️ Admin</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin panel */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/cars" element={<CarsAdmin />} />
        <Route path="/admin/tickets" element={<TicketsAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
