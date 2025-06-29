import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function TicketsDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [statut, setStatut] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
        setAdminResponse(res.data.adminResponse || "");
        setStatut(res.data.statut || "En attente");
      } catch (err) {
        console.error("Erreur récupération ticket :", err);
      }
    };
    fetchTicket();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/tickets/${id}`, {
        adminResponse,
        statut,
      });
      alert("Réponse et statut mis à jour !");
      navigate("/admin/tickets");
    } catch (err) {
      console.error("Erreur mise à jour ticket :", err);
    }
  };

  if (!ticket) return <p className="p-4">Chargement...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🎫 Détail du ticket #{ticket.id}</h2>

      <div className="space-y-2 bg-white p-4 rounded shadow">
        <p><strong>Type :</strong> {ticket.type}</p>
        <p><strong>Message :</strong> {ticket.message}</p>
        <p><strong>Statut actuel :</strong> {ticket.statut}</p>
        <p><strong>Date de création :</strong> {new Date(ticket.dateCreation).toLocaleString()}</p>
        <p><strong>Réponse client :</strong> {ticket.clientResponse || "Aucune"}</p>
      </div>

      <div className="mt-6 space-y-4">
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows="4"
          placeholder="Réponse de l'administrateur"
          value={adminResponse}
          onChange={(e) => setAdminResponse(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
        >
          <option value="En attente">En attente</option>
          <option value="En cours de traitement">En cours de traitement</option>
          <option value="Fermé">Fermé</option>
        </select>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleUpdate}
        >
          💾 Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
