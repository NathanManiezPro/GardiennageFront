// src/pages/admin/TicketsDetailAdmin.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function TicketsDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [statut, setStatut] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/tickets/${id}`);
        setTicket(data);
        setAdminResponse(data.adminResponse || "");
        setStatut(data.statut === "Fermé" ? "Résolu" : data.statut);
        setIsEditing(!data.adminResponse);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le ticket.");
      }
    })();
  }, [id]);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!ticket) {
    return <div className="p-6">Chargement…</div>;
  }

  const badgeClasses = (s) => {
    const base = "ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    if (s === "Résolu") return `${base} bg-green-100 text-green-800`;
    if (s === "En cours de traitement") return `${base} bg-yellow-100 text-yellow-800`;
    if (s === "En attente") return `${base} bg-gray-100 text-gray-800`;
    return `${base} bg-gray-100 text-gray-800`;
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        adminResponse,
        statut: statut === "Résolu" ? "Fermé" : statut,
      };
      const { data: updated } = await api.put(`/tickets/${id}`, payload);
      setTicket(updated);
      setIsEditing(false);
      setSuccessMessage("✅ Modifications enregistrées !");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/tickets");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      {/* Retour */}
      <button
        onClick={() => navigate("/admin/tickets")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Retour à la liste des tickets
      </button>

      <h2 className="text-2xl font-bold mb-4">🎫 Détail du ticket #{ticket.id}</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {/* Infos générales */}
      <div className="space-y-2 bg-gray-50 p-4 rounded-lg mb-6">
        <p><strong>Client :</strong> {ticket.user.nom} (ID {ticket.user.id})</p>
        <p><strong>Email :</strong> {ticket.user.email}</p>
        <p><strong>Type :</strong> {ticket.type}</p>
        <p>
          <strong>Voiture :</strong> {ticket.car.marque} {ticket.car.modele} (
          {ticket.car.plaqueImmatriculation})
        </p>
        <p>
          <strong>Statut :</strong>
          <span className={badgeClasses(statut)}>{statut}</span>
        </p>
        <p><strong>Date de création :</strong> {new Date(ticket.dateCreation).toLocaleString()}</p>
      </div>

      {/* Message initial du client */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <strong>Message du client :</strong>
        <p className="mt-1">{ticket.message}</p>
      </div>

      {/* Précision client */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <strong>Précision client :</strong>
        <p className="mt-1">{ticket.clientResponse || "Aucune précision"}</p>
      </div>

      {/* Réponse admin */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <strong>Réponse de l’administrateur :</strong>
          {!isEditing && ticket.adminResponse && (
            <button
              className="text-indigo-600 hover:underline text-sm"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </button>
          )}
        </div>
        {isEditing ? (
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows="4"
            placeholder="Écrivez votre réponse ici…"
            value={adminResponse}
            onChange={(e) => setAdminResponse(e.target.value)}
          />
        ) : (
          <p className="mt-1">{ticket.adminResponse || "Aucune réponse"}</p>
        )}
      </div>

   {/* Changer le statut */}
<div className="bg-white p-4 rounded-lg shadow mb-6">
  <label htmlFor="statut" className="block font-medium mb-1">
    Changer le statut
  </label>
  <select
    id="statut"
    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    value={statut}
    onChange={(e) => setStatut(e.target.value)}
  >
    <option value="En attente">En attente</option>
    <option value="En cours de traitement">En cours de traitement</option>
    <option value="Résolu">Résolu</option>
  </select>
</div>


      {/* Enregistrer */}
      <button
        onClick={handleUpdate}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        💾 Enregistrer les modifications
      </button>
    </div>
  );
}
