// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar        from './components/NavBar';
import RequireAuth   from './components/RequireAuth';
import RequireAdmin  from './components/RequireAdmin';
import RequireClient from './components/RequireClient';

import Home          from './pages/Home';
import Cars          from './pages/Cars';
import Tickets       from './pages/Tickets';
import Reservations  from './pages/Reservations';
import Subscriptions from './pages/Subscriptions';
import Login         from './pages/Login';
import Profile       from './pages/Profile';

import Dashboard          from './pages/admin/Dashboard';
import UsersList          from './pages/admin/UsersList';
import CarsAdmin          from './pages/admin/CarsAdmin';
import TicketsAdmin       from './pages/admin/TicketsAdmin';
import TicketsDetailAdmin from './pages/admin/TicketsDetailAdmin';
import ReservationsAdmin  from './pages/admin/ReservationsAdmin';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated */}
          <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

          {/* Client */}
          <Route path="/cars"           element={<RequireClient><Cars /></RequireClient>} />
          <Route path="/tickets/create" element={<RequireClient><Tickets /></RequireClient>} />
          <Route path="/tickets"        element={<RequireClient><Tickets /></RequireClient>} />
          <Route path="/reservations"   element={<RequireClient><Reservations /></RequireClient>} />
          <Route path="/subscriptions"  element={<RequireClient><Subscriptions /></RequireClient>} />

          {/* Admin */}
          <Route path="/admin"               element={<RequireAdmin><Dashboard /></RequireAdmin>} />
          <Route path="/admin/users"         element={<RequireAdmin><UsersList /></RequireAdmin>} />
          <Route path="/admin/cars"          element={<RequireAdmin><CarsAdmin /></RequireAdmin>} />
          <Route path="/admin/tickets"       element={<RequireAdmin><TicketsAdmin /></RequireAdmin>} />
          <Route path="/admin/tickets/:id"   element={<RequireAdmin><TicketsDetailAdmin /></RequireAdmin>} />
          <Route path="/admin/reservations"  element={<RequireAdmin><ReservationsAdmin /></RequireAdmin>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
