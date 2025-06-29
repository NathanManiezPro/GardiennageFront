// src/pages/Tickets.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [voitureId, setVoitureId] = useState("");
  const [clientResponse, setClientResponse] = useState({});
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTickets();
    fetchVoitures();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets");
      const clientTickets = res.data.filter((t) => t.clientId === user.id);
      setTickets(clientTickets);
    } catch (err) {
      console.error("Erreur récupération tickets :", err);
    }
  };

  const fetchVoitures = async () => {
    try {
      const res = await api.get("/cars");
      const cars = res.data.filter((c) => c.clientId === user.id);
      setVoitures(cars);
    } catch (err) {
      console.error("Erreur récupération voitures :", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
  await api.post('/tickets', {
    type,
    message,
    voitureId,
    clientId: user.id,
  });
  setType('');
  setMessage('');
  setVoitureId('');
  fetchTickets(); // recharge l'historique
} catch (err) {
  console.error("Erreur création ticket :", err);
  setError("Erreur création ticket");
}

  };

  const handleClientResponse = async (ticketId) => {
    try {
      await api.put(`/tickets/${ticketId}/client-response`, {
        response: clientResponse[ticketId],
      });
      setClientResponse({ ...clientResponse, [ticketId]: "" });
      fetchTickets();
    } catch (err) {
      console.error("Erreur envoi réponse client :", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🎫 Vos Tickets</h2>

      {/* Création Ticket */}
      <form onSubmit={handleCreate} className="space-y-4 mb-8">
        <div>
          <label className="block font-medium">Type de demande</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border px-3 py-2 w-full"
            required
          >
            <option value="">Sélectionner</option>
            <option value="Abonnement">Abonnement</option>
            <option value="Réparation">Réparation</option>
            <option value="Question générale">Question générale</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Voiture concernée</label>
          <select
            value={voitureId}
            onChange={(e) => setVoitureId(e.target.value)}
            className="border px-3 py-2 w-full"
            required
          >
            <option value="">Sélectionner une voiture</option>
            {voitures.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marque} {v.modele} ({v.plaqueImmatriculation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Message</label>
          <textarea
            className="border px-3 py-2 w-full"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {/* Liste des tickets */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p>Vous n’avez encore aucun ticket.</p>
        ) : (
          tickets
            .sort(
              (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
            )
            .map((t) => (
              <div
                key={t.id}
                className="border rounded-lg p-4 bg-white shadow-md"
              >
                <div className="mb-2">
                  <strong>{t.type}</strong> –{" "}
                  <span className="italic text-sm">{t.statut}</span>
                </div>
                <div className="mb-2">
                  <p className="text-gray-700">{t.message}</p>
                </div>
                {t.adminResponse && (
                  <div className="mb-2 bg-gray-50 p-2 rounded">
                    <strong>Réponse admin :</strong> {t.adminResponse}
                  </div>
                )}

                {/* Réponse client */}
                {t.statut !== "Fermé" && (
                  <div className="mt-2">
                    <textarea
                      rows="2"
                      className="border w-full px-2 py-1 mb-2"
                      placeholder="Votre réponse..."
                      value={clientResponse[t.id] || ""}
                      onChange={(e) =>
                        setClientResponse({
                          ...clientResponse,
                          [t.id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleClientResponse(t.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Envoyer réponse
                    </button>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
