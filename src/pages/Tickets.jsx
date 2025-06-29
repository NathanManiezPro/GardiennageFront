// src/pages/Tickets.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [voitures, setVoitures] = useState([]);
  const [type, setType] = useState("");
  const [abonnementAction, setAbonnementAction] = useState("");
  const [subscriptionChoice, setSubscriptionChoice] = useState("");
  const [voitureId, setVoitureId] = useState("");
  const [message, setMessage] = useState("");
  const [clientResponses, setClientResponses] = useState({});
  const [showPrecision, setShowPrecision] = useState({});
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchVoitures();
    fetchTickets();
  }, []);

  const fetchVoitures = async () => {
    try {
      const { data } = await api.get("/cars/my-cars");
      setVoitures(data);
    } catch {
      setError("Impossible de charger vos voitures.");
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/tickets");
      setTickets(data.filter((t) => t.clientId === user.id));
    } catch {
      setError("Impossible de charger vos tickets.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", {
        type,
        message,
        voitureId,
        clientId: user.id,
        abonnementAction,
        abonnementSouhaite:
          abonnementAction === "changement" ? subscriptionChoice : undefined,
      });
      setType("");
      setAbonnementAction("");
      setSubscriptionChoice("");
      setVoitureId("");
      setMessage("");
      fetchTickets();
    } catch {
      setError("Erreur lors de l'envoi du ticket.");
    }
  };

  const handlePrecision = async (ticketId) => {
    const resp = clientResponses[ticketId]?.trim();
    if (!resp) return;
    try {
      await api.put(`/tickets/${ticketId}/client-response`, {
        clientResponse: resp,
      });
      setClientResponses((prev) => ({ ...prev, [ticketId]: "" }));
      setShowPrecision((prev) => ({ ...prev, [ticketId]: false }));
      fetchTickets();
    } catch {
      setError("Erreur lors de l'envoi de votre précision.");
    }
  };

  const subscriptionOptions = [
    { value: "Gardiennage", label: "Gardiennage – 179 €/mois" },
    { value: "Réparation", label: "Réparation – 209 €/mois" },
    {
      value: "Gardiennage + Réparation",
      label: "Gardiennage + Réparation – 239 €/mois",
    },
  ];

  const renderBadge = (s) => {
    const status = s === "Fermé" ? "Résolu" : s;
    const base = "text-sm font-medium px-2 py-1 rounded-full";
    if (status === "Résolu") return <span className={`${base} bg-green-100 text-green-800`}>Résolu</span>;
    if (status === "En cours de traitement") return <span className={`${base} bg-yellow-100 text-yellow-800`}>En cours de traitement</span>;
    return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">📩 Tickets</h1>

      {/* Nouveau Ticket */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-12">
        <h2 className="text-2xl font-semibold mb-4">🆕 Nouveau Ticket</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div>
            <label className="block font-medium mb-1">Type de demande</label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setAbonnementAction("");
                setSubscriptionChoice("");
              }}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Sélectionnez</option>
              <option value="Abonnement">Abonnement</option>
              <option value="Réparation">Réparation</option>
              <option value="Question générale">Question générale</option>
            </select>
          </div>

          {/* Nature abonnement */}
          {type === "Abonnement" && (
            <div>
              <label className="block font-medium mb-1">Nature de la demande d’abonnement</label>
              <select
                value={abonnementAction}
                onChange={(e) => {
                  setAbonnementAction(e.target.value);
                  setSubscriptionChoice("");
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="question">Question sur l’abonnement</option>
                <option value="changement">Changement d’abonnement</option>
              </select>
              {abonnementAction === "question" && (
                <p className="text-xs text-gray-500">
                  Posez votre question sur votre abonnement actuel.
                </p>
              )}
            </div>
          )}

          {/* Choix nouvel abonnement */}
          {type === "Abonnement" && abonnementAction === "changement" && (
            <div>
              <label className="block font-medium mb-1">Abonnement souhaité</label>
              <select
                value={subscriptionChoice}
                onChange={(e) => setSubscriptionChoice(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
                required
              >
                <option value="">Sélectionnez votre abonnement</option>
                {subscriptionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Le tarif mensuel sera adapté selon l’abonnement.
              </p>
            </div>
          )}

          {/* Voiture */}
          <div>
            <label className="block font-medium mb-1">Voiture concernée</label>
            <select
              value={voitureId}
              onChange={(e) => setVoitureId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Sélectionnez une voiture</option>
              {voitures.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marque} {v.modele} ({v.plaqueImmatriculation})
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Décrivez votre demande..."
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Envoyer
          </button>
        </form>
      </div>

      {/* Historique des tickets */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">📜 Historique de vos tickets</h2>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-600">Vous n’avez encore aucun ticket.</p>
        ) : (
          <div className="space-y-6">
            {tickets
              .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
              .map((t) => {
                const isResolved = t.statut === "Fermé" || t.statut === "Résolu";
                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold">{t.type}</h3>
                      {renderBadge(t.statut)}
                    </div>

                    {t.abonnementAction === "changement" && (
                      <p className="text-sm text-indigo-600 mb-2">
                        Changement demandé → {t.abonnementSouhaite}
                      </p>
                    )}

                    <p className="text-gray-700 mb-2">{t.message}</p>

                    {t.adminResponse && (
                      <div className="bg-gray-50 p-3 rounded mb-4">
                        <strong>Réponse admin :</strong> {t.adminResponse}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mb-4">
                      Créé le {new Date(t.dateCreation).toLocaleString()}
                    </p>

                    {/* Message complémentaire */}
                    {t.clientResponse && (
                      <div className="mb-4">
                        <strong>Précision :</strong>
                        <p className="mt-1">{t.clientResponse}</p>
                      </div>
                    )}

                    {/* "+ Ajouter une précision" uniquement si pas encore de clientResponse ET pas résolu */}
                    {!t.clientResponse && !isResolved && (
                      !showPrecision[t.id] ? (
                        <button
                          onClick={() =>
                            setShowPrecision((prev) => ({ ...prev, [t.id]: true }))
                          }
                          className="text-blue-600 hover:underline text-sm mb-2"
                        >
                          + Ajouter une précision
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <textarea
                            rows="2"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Votre précision…"
                            value={clientResponses[t.id] || ""}
                            onChange={(e) =>
                              setClientResponses((prev) => ({
                                ...prev,
                                [t.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handlePrecision(t.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                          >
                            Envoyer ma précision
                          </button>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
