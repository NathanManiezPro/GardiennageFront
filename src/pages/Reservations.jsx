// src/pages/Reservations.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reservations() {
  const [voitures, setVoitures] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [voitureId, setVoitureId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  // Charge voitures + réservations une seule fois au montage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    async function loadData() {
      try {
        const { data: cars } = await api.get("/cars/my-cars");
        setVoitures(cars);
      } catch {
        setError("Impossible de charger vos voitures.");
      }

      try {
        const { data: allRes } = await api.get("/reservations");
        if (user) {
          const filtered = allRes
            .filter((r) => r.clientId === user.id)
            .sort((a, b) => new Date(b.dateHeure) - new Date(a.dateHeure));
          setReservations(filtered);
        }
      } catch {
        setError("Impossible de charger vos réservations.");
      }
    }

    loadData();
  }, []); // plus aucune dépendance manquante

  // Envoi d’une nouvelle réservation
  async function handleSubmit(e) {
    e.preventDefault();
    if (!voitureId || !date || !time) {
      setError("Tous les champs sont requis.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const dateHeure = new Date(`${date}T${time}`);
      await api.post("/reservations", {
        voitureId,
        clientId: user.id,
        dateHeure,
      });
      // reset du formulaire
      setVoitureId("");
      setDate("");
      setTime("");
      // recharge l’historique
      const { data: allRes } = await api.get("/reservations");
      const filtered = allRes
        .filter((r) => r.clientId === user.id)
        .sort((a, b) => new Date(b.dateHeure) - new Date(a.dateHeure));
      setReservations(filtered);
    } catch {
      setError("Erreur lors de l'envoi de la réservation.");
    }
  }

  // Extrait la logique de style du badge pour éviter le nested ternary
  function getStatusClasses(statut) {
    if (statut === "Accepté") return "bg-green-100 text-green-800";
    if (statut === "Refusé") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">📅 Réservation</h1>

      {/* Formulaire */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4">🆕 Nouvelle réservation</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="voiture" className="block font-medium mb-1">
              Voiture
            </label>
            <select
              id="voiture"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={voitureId}
              onChange={(e) => setVoitureId(e.target.value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block font-medium mb-1">
                Heure
              </label>
              <input
                id="time"
                type="time"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Envoyer la demande
          </button>
        </form>
      </div>

      {/* Historique */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📜 Historique de vos réservations</h2>
        {reservations.length === 0 ? (
          <p className="text-center text-gray-600">Aucune réservation.</p>
        ) : (
          <ul className="space-y-6">
            {reservations.map((r) => (
              <li
                key={r.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-semibold">
                    {new Date(r.dateHeure).toLocaleDateString()} à{" "}
                    {new Date(r.dateHeure).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <span
                    className={`px-2 inline-block text-xs font-medium rounded-full ${getStatusClasses(
                      r.statut
                    )}`}
                  >
                    {r.statut}
                  </span>
                </div>
                {r.commentaire && (
                  <p className="text-gray-700 mb-2">
                    <strong>Commentaire :</strong> {r.commentaire}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
