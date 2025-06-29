// src/pages/admin/TicketsAdmin.jsx
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
        const { data: tData } = await api.get("/tickets");
        const { data: uData } = await api.get("/users");
        setTickets(tData);
        setUsers(uData);
      } catch (err) {
        console.error("Erreur chargement admin tickets :", err);
      }
    };
    fetchAll();
  }, []);

  const getUser = (id) => users.find((u) => u.id === id) || {};

  // Renvoie classes Tailwind pour chaque statut (après transformation)
  const badgeClasses = (status) => {
    switch (status) {
      case "En attente":
        return "bg-gray-100 text-gray-800";
      case "En cours de traitement":
        return "bg-yellow-100 text-yellow-800";
      case "Réponse client":
        return "bg-green-100 text-green-800";
      case "Résolu":
        return "bg-green-100 text-green-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Transforme "Fermé" en "Résolu" pour l'affichage
  const displayStatus = (raw) => (raw === "Fermé" ? "Résolu" : raw);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📋 Tickets Clients</h2>
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "ID",
                "Client (Nom)",
                "Client ID",
                "Email",
                "Type",
                "Statut",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((t) => {
              const user = getUser(t.clientId);
              const statutAffiche = displayStatus(t.statut);
              return (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {t.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.nom || "Inconnu"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.id ?? "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.email || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {t.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClasses(
                        statutAffiche
                      )}`}
                    >
                      {statutAffiche}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => navigate(`/admin/tickets/${t.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Détails →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
