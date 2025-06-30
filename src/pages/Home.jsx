// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Home() {
  const [stats, setStats] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.role === 'client') {
          // stats pour le client
          const [carsRes, ticketsRes, reservationsRes] = await Promise.all([
            api.get('/cars/my-cars'),
            api.get('/tickets'),
            api.get('/reservations')
          ]);
          const myTickets = ticketsRes.data.filter(t => t.clientId === user.id);
          const open = myTickets.filter(t => t.statut !== 'Fermé').length;
          setStats({
            cars: carsRes.data.length,
            ticketsOpen: open,
            ticketsClosed: myTickets.length - open,
            reservations: reservationsRes.data.filter(r => r.clientId === user.id).length
          });
        } else {
          // stats pour l'admin (globales)
          const [usersRes, carsRes, ticketsRes, reservationsRes] = await Promise.all([
            api.get('/users'),
            api.get('/cars'),
            api.get('/tickets'),
            api.get('/reservations')
          ]);
          setStats({
            users: usersRes.data.length,
            cars: carsRes.data.length,
            tickets: ticketsRes.data.length,
            reservations: reservationsRes.data.length
          });
        }
      } catch (err) {
        console.error('Erreur chargement stats :', err);
      }
    };
    fetchStats();
  }, [user.role, user.id]);

  // Petite carte générique
  const StatCard = ({ icon, label, value }) => (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-semibold">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-4">🏠 Accueil</h1>
      <p className="text-center text-gray-600 mb-8">
        Bienvenue, <span className="font-medium">{user.nom}</span> !
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {user.role === 'client' ? (
          <>
            <StatCard icon="🚗" label="Vos voitures" value={stats.cars ?? '–'} />
            <StatCard icon="🆕" label="Tickets ouverts" value={stats.ticketsOpen ?? '–'} />
            <StatCard icon="✅" label="Tickets résolus" value={stats.ticketsClosed ?? '–'} />
            <StatCard icon="📅" label="Réservations" value={stats.reservations ?? '–'} />
          </>
        ) : (
          <>
            <StatCard icon="👥" label="Utilisateurs" value={stats.users ?? '–'} />
            <StatCard icon="🚘" label="Voitures totales" value={stats.cars ?? '–'} />
            <StatCard icon="🎫" label="Tickets totaux" value={stats.tickets ?? '–'} />
            <StatCard icon="📆" label="Réservations totales" value={stats.reservations ?? '–'} />
          </>
        )}
      </div>
    </div>
  );
}
