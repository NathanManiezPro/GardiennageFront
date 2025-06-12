import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

import Home from './pages/Home';
import Cars from './pages/Cars';
import Tickets from './pages/Tickets';
import Reservations from './pages/Reservations';
import Subscriptions from './pages/Subscriptions';
import Login from './pages/Login';

import Dashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/UsersList';
import CarsAdmin from './pages/admin/CarsAdmin';
import TicketsAdmin from './pages/admin/TicketsAdmin';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/login" element={<Login />} />

          {/* Admin panel */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/cars" element={<CarsAdmin />} />
          <Route path="/admin/tickets" element={<TicketsAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
