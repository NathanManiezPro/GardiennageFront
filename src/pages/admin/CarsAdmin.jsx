import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CarsAdmin() {
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [error, setError] = useState(null);
  const [carIdEnEdition, setCarIdEnEdition] = useState(null);

  // ta liste complète de marques & modèles
  const voituresDeLuxe = [
    { marque: "Ferrari", models: ["488", "F8 Tributo", "Portofino", "LaFerrari", "Roma", "SF90 Stradale"] },
    { marque: "Lamborghini", models: ["Aventador", "Huracán", "Urus", "Sián", "Centenario"] },
    { marque: "Porsche", models: ["911", "Cayenne", "Panamera", "Taycan", "Macan", "918 Spyder"] },
    { marque: "Aston Martin", models: ["DB11", "Vantage", "DBS Superleggera", "DBX", "Rapide AMR"] },
    { marque: "Bentley", models: ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Continental GT Speed"] },
    { marque: "Rolls-Royce", models: ["Phantom", "Cullinan", "Wraith", "Dawn", "Ghost"] },
    { marque: "Maserati", models: ["GranTurismo", "Quattroporte", "Levante", "Ghibli", "Alfieri"] },
    { marque: "McLaren", models: ["720S", "P1", "570S", "Artura", "Speedtail"] },
    { marque: "Bugatti", models: ["Chiron", "Veyron", "Divo", "Centodieci", "La Voiture Noire"] },
    { marque: "Pagani", models: ["Huayra", "Huayra Roadster", "Zonda", "Huayra BC"] },
    { marque: "Koenigsegg", models: ["Agera RS", "Regera", "Jesko", "Gemera"] },
    { marque: "BMW", models: ["M8", "X7", "i8", "M4", "750Li"] },
    { marque: "Mercedes-Benz", models: ["S-Class", "Maybach", "AMG GT", "E-Class", "G-Class", "A-Class"] },
    { marque: "Audi", models: ["R8", "A8", "RS7", "Q8", "S7"] },
    { marque: "Jaguar", models: ["F-Type", "XJ", "I-PACE", "F-PACE", "XE"] }
  ];

  // options d'abonnement pour la voiture
  const abonnementsOptions = [
    "Gardiennage + Réparation",
    "Gardiennage bâché + Réparation",
    "Gardiennage bulle + Réparation",
  ];

  const [newCar, setNewCar] = useState({
    marque: "",
    modele: "",
    annee: 2000,
    plaqueImmatriculation: "",
    dateEntree: "",
    statut: "gardiennage",
    clientId: "",
    abonnementType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "plaqueImmatriculation") {
      v = value
        .replace(/[^A-Z0-9]/gi, "")
        .toUpperCase()
        .slice(0, 7)
        .replace(/^(.{2})(.{3})/, "$1-$2-");
    }
    setNewCar((prev) => ({ ...prev, [name]: v }));

    if (name === "marque") {
      setNewCar((prev) => ({ ...prev, modele: "" }));
      const found = voituresDeLuxe.find((c) => c.marque === value);
      setModeles(found ? found.models : []);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/users");
      setClients(res.data.filter((u) => u.role === "client"));
    } catch (err) {
      console.error("Erreur récupération clients :", err);
      setError("Erreur récupération clients");
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Erreur récupération voitures :", err);
      setError("Erreur récupération voitures");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...newCar,
      annee: parseInt(newCar.annee),
      clientId: parseInt(newCar.clientId),
      abonnementType: newCar.abonnementType || undefined,
    };

    try {
      if (carIdEnEdition) {
        await api.put(`/cars/${carIdEnEdition}`, payload);
      } else {
        await api.post("/cars", payload);
      }
      resetForm();
      fetchCars();
    } catch (err) {
      console.error("Erreur voiture :", err);
      setError("Erreur lors de l'enregistrement");
    }
  };

  const resetForm = () => {
    setNewCar({
      marque: "",
      modele: "",
      annee: 2000,
      plaqueImmatriculation: "",
      dateEntree: "",
      statut: "gardiennage",
      clientId: "",
      abonnementType: "",
    });
    setModeles([]);
    setCarIdEnEdition(null);
    setError(null);
  };

  const handleEdit = (car) => {
    setCarIdEnEdition(car.id);
    setNewCar({
      marque: car.marque,
      modele: car.modele,
      annee: car.annee,
      plaqueImmatriculation: car.plaqueImmatriculation,
      dateEntree: car.dateEntree.split("T")[0],
      statut: car.statut,
      clientId: car.clientId.toString(),
      abonnementType: car.abonnements?.[0]?.type || "",
    });
    setModeles(voituresDeLuxe.find((v) => v.marque === car.marque)?.models || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette voiture ?")) return;
    await api.delete(`/cars/${id}`);
    fetchCars();
  };

  useEffect(() => {
    fetchClients();
    fetchCars();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6">
          {carIdEnEdition ? "Modifier une voiture" : "Ajouter une voiture"}
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <select
            name="marque"
            value={newCar.marque}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">Sélectionner une marque</option>
            {voituresDeLuxe.map((v) => (
              <option key={v.marque} value={v.marque}>{v.marque}</option>
            ))}
          </select>

          <select
            name="modele"
            value={newCar.modele}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="">Sélectionner un modèle</option>
            {modeles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input
            type="number"
            name="annee"
            placeholder="Année"
            value={newCar.annee}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            name="plaqueImmatriculation"
            placeholder="Plaque d'immatriculation"
            value={newCar.plaqueImmatriculation}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            type="date"
            name="dateEntree"
            value={newCar.dateEntree}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <select
            name="statut"
            value={newCar.statut}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="gardiennage">Gardiennage</option>
            <option value="reparation">Réparation</option>
          </select>

          <select
            name="clientId"
            value={newCar.clientId}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="">Sélectionner un client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom} – {c.email}
              </option>
            ))}
          </select>

          <select
            name="abonnementType"
            value={newCar.abonnementType}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">Sélectionner un abonnement</option>
            {abonnementsOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <div className="flex gap-4 col-span-2">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {carIdEnEdition ? "Mettre à jour la voiture" : "Ajouter la voiture"}
            </button>
            {carIdEnEdition && (
              <button
                type="button"
                onClick={resetForm} 
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <h3 className="text-xl font-semibold mb-2">Voitures enregistrées</h3>
        <ul className="space-y-2">
          {cars.map((car) => (
            <li key={car.id} className="border p-6 rounded bg-gray-50">
              <div className="flex justify-between">
                <strong>{car.marque} {car.modele} ({car.annee})</strong>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(car)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(car.id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
                    Supprimer
                  </button>
                </div>
              </div>
              <p><strong>Plaque :</strong> {car.plaqueImmatriculation}</p>
              <p><strong>Entrée :</strong> {new Date(car.dateEntree).toLocaleDateString()}</p>
              <p><strong>Statut :</strong> {car.statut}</p>
              <p><strong>Client :</strong> {car.clientId}</p>
              <p><strong>Abonnement :</strong> {car.abonnements?.[0]?.type || "—"}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
