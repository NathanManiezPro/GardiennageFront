// src/components/NavBar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [menuOpen, setMenuOpen]             = useState(false);
  const [notifications, setNotifications]   = useState([]);
  const [unreadCount, setUnreadCount]       = useState(0);
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) loadNotifs();
  }, [user]);

  const loadNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      const sorted = res.data
        .sort((a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi));
      setUnreadCount(sorted.filter(n => !n.statutLecture).length);
      const top5 = sorted.slice(0, 5);
      setNotifications(top5);
      // affiner les « nouvelles » pour 10s
      const freshIds = top5.filter(n => !n.statutLecture).map(n => n._id);
      setNewNotifications(freshIds);
      setTimeout(() => setNewNotifications([]), 10000);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(o => !o);
    if (!dropdownOpen) markAllRead();
  };

  const markAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.statutLecture)
          .map(n => api.put(`/notifications/${n._id}/read`))
      );
      loadNotifs();
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 relative">
      <div className="flex items-center">
        {/* Home link */}
        <Link to="/" className="text-xl font-bold">🏠 Accueil</Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-auto text-2xl"
          onClick={() => setMenuOpen(o => !o)}
        >
          ☰
        </button>

        {/* Main nav links */}
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

        {/* Right side actions */}
        {user ? (
          <div className="ml-auto flex items-center gap-4 relative">
            {/* Notification bell */}
            <button
              onClick={toggleDropdown}
              className="relative focus:outline-none text-2xl"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50"
              >
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-600">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n._id}
                        className="flex items-start px-4 py-3 border-b last:border-none"
                      >
                        {/* Pastille grise pendant 10s */}
                        {newNotifications.includes(n._id) && (
                          <span className="inline-block mt-3 w-2 h-2 bg-gray-400 rounded-full mr-3" />
                        )}
                        <div>
                          <p className="text-sm">{n.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(n.dateEnvoi).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Profile & Logout */}
            <Link to="/profile" className="hover:underline">⚙️ Profil</Link>
            <button onClick={handleLogout} className="hover:underline">🚪 Déconnexion</button>
          </div>
        ) : (
          <Link to="/login" className="ml-auto hover:underline">🔐 Connexion</Link>
        )}
      </div>
    </nav>
  );
}
