// src/pages/admin/ReservationsAdmin.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState([]);
  const [updateComment, setUpdateComment] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const { data } = await api.get("/reservations");
      setReservations(data.sort((a, b) => new Date(b.dateHeure) - new Date(a.dateHeure)));
    } catch {
      setError("Impossible de charger les réservations.");
    }
  }

  async function handleDecision(id, statut) {
    try {
      await api.put(`/reservations/${id}`, {
        statut,
        commentaire: updateComment[id] || "",
      });
      fetchReservations();
    } catch {
      setError("Erreur lors de la mise à jour.");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📋 Gestion des réservations</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["ID","Client ID","Voiture","Date","Statut","Commentaire","Actions"].map(col => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-4 text-sm text-gray-800">{r.id}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{r.clientId}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{r.car.marque} {r.car.modele}</td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {new Date(r.dateHeure).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 inline-block text-xs font-medium rounded-full ${
                    r.statut === "Accepté" ? "bg-green-100 text-green-800" :
                    r.statut === "Refusé" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {r.statut}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <textarea
                    rows="2"
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="Commentaire…"
                    value={updateComment[r.id] || ""}
                    onChange={(e) =>
                      setUpdateComment((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                  />
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleDecision(r.id, "Accepté")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleDecision(r.id, "Refusé")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Refuser
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}
