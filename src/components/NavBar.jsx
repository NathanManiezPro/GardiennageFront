// src/components/NavBar.jsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  // 1️⃣ on stocke user dans un state
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user') || 'null')
  )

  // 2️⃣ et on le recalcule à chaque changement de route
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'))
  }, [location])

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [newNotifications, setNewNotifications] = useState([])

  // 3️⃣ chargement des notifications dès qu’on connaît l’utilisateur
  useEffect(() => {
    if (user) loadNotifs()
  }, [user])

  const loadNotifs = async () => {
    try {
      const res = await api.get('/notifications')
      const sorted = res.data.sort(
        (a, b) => new Date(b.dateEnvoi) - new Date(a.dateEnvoi)
      )
      setUnreadCount(sorted.filter(n => !n.statutLecture).length)
      const top5 = sorted.slice(0, 5)
      setNotifications(top5)
      const fresh = top5.filter(n => !n.statutLecture).map(n => n._id)
      setNewNotifications(fresh)
      setTimeout(() => setNewNotifications([]), 10000)
    } catch (err) {
      console.error('Erreur chargement notifications :', err)
    }
  }

  // 4️⃣ fermeture du dropdown si on clique à l’extérieur
  useEffect(() => {
    const onClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const toggleDropdown = () => {
    setDropdownOpen(o => !o)
    if (!dropdownOpen) markAllRead()
  }

  const markAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.statutLecture)
          .map(n => api.put(`/notifications/${n._id}/read`))
      )
      loadNotifs()
    } catch (err) {
      console.error('Erreur marquage lu :', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)        // on vide aussi le state
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 relative">
      <div className="flex items-center">
        {/* Home */}
        <Link to="/" className="text-xl font-bold">🏠 Accueil</Link>

        {/* Menu mobile */}
        <button
          className="md:hidden ml-auto text-2xl"
          onClick={() => setMenuOpen(o => !o)}
        >
          ☰
        </button>

        {/* Liens */}
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

        {/* Actions à droite */}
        {user ? (
          <div className="ml-auto flex items-center gap-4 relative">
            {/* Cloche */}
            <button onClick={toggleDropdown} className="relative text-2xl">
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
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

            {/* Profil & Déconnexion */}
            <Link to="/profile" className="hover:underline">⚙️ Profil</Link>
            <button onClick={handleLogout} className="hover:underline">
              🚪 Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/login" className="ml-auto hover:underline">
            🔐 Connexion
          </Link>
        )}
      </div>
    </nav>
  )
}
