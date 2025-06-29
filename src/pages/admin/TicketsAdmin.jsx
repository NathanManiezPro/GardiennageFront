import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function TicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const ticketsRes = await api.get("/tickets");
        const usersRes = await api.get("/users");
        setTickets(ticketsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Erreur chargement admin tickets :", err);
      }
    };
    fetchAll();
  }, []);

  const getUserName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.nom : "Inconnu";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📋 Tickets Clients</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Client</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{t.id}</td>
              <td className="p-2 border">{getUserName(t.clientId)}</td>
              <td className="p-2 border">{t.type}</td>
              <td className="p-2 border">{t.statut}</td>
              <td className="p-2 border">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate(`/admin/tickets/${t.id}`)}
                >
                  Détails ➔
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
