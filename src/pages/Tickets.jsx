import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tickets() {
  const [voitures, setVoitures] = useState([]);
  const [selectedVoiture, setSelectedVoiture] = useState("");
  const [raison, setRaison] = useState("Abonnement");
  const [typeDemande, setTypeDemande] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) return;

    const fetchVoitures = async () => {
      const res = await api.get("/cars");
      const userCars = res.data.filter((car) => car.clientId === user.id);
      setVoitures(userCars);
    };

    const fetchTickets = async () => {
      const res = await api.get("/tickets");
      const userTickets = res.data.filter((t) => t.car.clientId === user.id);
      setTickets(userTickets.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)));
    };

    fetchVoitures();
    fetchTickets();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVoiture || !raison || !message) return;

    await api.post("/tickets", {
      type: raison === "Abonnement" ? `${raison} - ${typeDemande}` : raison,
      dateCreation: new Date(),
      statut: "non résolu",
      voitureId: selectedVoiture
    });

    setMessage("");
    setSelectedVoiture("");
    setTypeDemande("");
    // Refresh tickets
    const res = await api.get("/tickets");
    const userTickets = res.data.filter((t) => t.car.clientId === user.id);
    setTickets(userTickets.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mes tickets</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Raison :</label>
          <select
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option>Abonnement</option>
            <option>Maintenance</option>
            <option>Facturation</option>
            <option>Autre</option>
          </select>
        </div>

        {raison === "Abonnement" && (
          <div>
            <label className="block font-semibold mb-1">Type de demande :</label>
            <select
              value={typeDemande}
              onChange={(e) => setTypeDemande(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Choisir une option</option>
              <option value="Changement d'abonnement">Changement d'abonnement</option>
              <option value="Question sur mon abonnement">Question sur mon abonnement</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1">Voiture concernée :</label>
          <select
            value={selectedVoiture}
            onChange={(e) => setSelectedVoiture(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Choisir une voiture</option>
            {voitures.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marque} {v.modele} ({v.plaqueImmatriculation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Message :</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={4}
            placeholder="Décrivez votre problème"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Envoyer le ticket
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historique</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">Aucun ticket pour le moment.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="p-4 border rounded shadow-sm">
                <div className="font-semibold">{t.type}</div>
                <div className="text-sm text-gray-500">État : {t.statut}</div>
                <div className="text-sm text-gray-500">
                  Date : {new Date(t.dateCreation).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
