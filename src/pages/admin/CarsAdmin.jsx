import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CarsAdmin() {
  const [clients, setClients] = useState([]);
  const [cars, setCars] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [error, setError] = useState(null);
  const [carIdEnEdition, setCarIdEnEdition] = useState(null);

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

  const [newCar, setNewCar] = useState({
    marque: "",
    modele: "",
    annee: 2000,
    plaqueImmatriculation: "",
    dateEntree: "",
    statut: "gardiennage",
    clientId: "",
  });

  const [marques] = useState(voituresDeLuxe.map(car => car.marque));

  const formatPlaque = (value) => {
    let formattedValue = value.replace(/[^A-Z0-9]/g, "").toUpperCase();
    formattedValue = formattedValue.substring(0, 2) + (formattedValue.length > 2 ? '-' : '') + formattedValue.substring(2, 5) + (formattedValue.length > 5 ? '-' : '') + formattedValue.substring(5, 7);
    return formattedValue.substring(0, 10);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "plaqueImmatriculation") {
      setNewCar({ ...newCar, [name]: formatPlaque(value) });
    } else {
      setNewCar({ ...newCar, [name]: value });
    }

    if (name === "marque") {
      setNewCar((prev) => ({ ...prev, modele: "" }));
      const marqueSelectionnee = voituresDeLuxe.find((car) => car.marque === value);
      setModeles(marqueSelectionnee ? marqueSelectionnee.models : []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plaqueRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
    if (!plaqueRegex.test(newCar.plaqueImmatriculation)) {
      setError("La plaque d'immatriculation doit suivre le format AA-123-AA.");
      return;
    }

    const carPayload = {
      ...newCar,
      annee: parseInt(newCar.annee),
      clientId: parseInt(newCar.clientId),
    };

    try {
      if (carIdEnEdition) {
        await api.put(`/cars/${carIdEnEdition}`, carPayload);
      } else {
        await api.post("/cars", carPayload);
      }

      resetForm();
      fetchCars();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la voiture : ", err);
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
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
    });
    setModeles([]);
    setCarIdEnEdition(null);
    setError(null);
  };

  const fetchClients = async () => {
    try {
      const res = await api.get("/users");
      const onlyClients = res.data.filter((u) => u.role === "client");
      setClients(onlyClients);
    } catch (err) {
      console.error("Erreur récupération des clients : ", err);
      setError("Erreur lors de la récupération des clients.");
    }
  };

  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Erreur récupération des voitures : ", err);
      setError("Erreur lors de la récupération des voitures.");
    }
  };

  const handleDelete = async (carId) => {
    try {
      await api.delete(`/cars/${carId}`);
      fetchCars();
    } catch (err) {
      console.error("Erreur lors de la suppression de la voiture : ", err);
      setError("Erreur lors de la suppression de la voiture.");
    }
  };

  const handleEdit = (car) => {
    setNewCar({
      marque: car.marque,
      modele: car.modele,
      annee: car.annee,
      plaqueImmatriculation: car.plaqueImmatriculation,
      dateEntree: car.dateEntree.split("T")[0],
      statut: car.statut,
      clientId: car.clientId.toString(), // repasse en string pour le select
    });
    const modeleList = voituresDeLuxe.find(v => v.marque === car.marque)?.models || [];
    setModeles(modeleList);
    setCarIdEnEdition(car.id);
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
          <select name="marque" value={newCar.marque} onChange={handleChange} className="border px-3 py-2 rounded w-full" required>
            <option value="">Sélectionner une marque</option>
            {marques.map((marque) => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>

          <select name="modele" value={newCar.modele} onChange={handleChange} className="border px-3 py-2 rounded" required>
            <option value="">Sélectionner un modèle</option>
            {modeles.map((modele) => (
              <option key={modele} value={modele}>{modele}</option>
            ))}
          </select>

          <input type="number" name="annee" placeholder="Année" value={newCar.annee} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <input type="text" name="plaqueImmatriculation" placeholder="Plaque d'immatriculation" value={newCar.plaqueImmatriculation} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <input type="date" name="dateEntree" value={newCar.dateEntree} onChange={handleChange} className="border px-3 py-2 rounded" required />
          <select name="statut" value={newCar.statut} onChange={handleChange} className="border px-3 py-2 rounded" required>
            <option value="gardiennage">Gardiennage</option>
            <option value="reparation">Réparation</option>
          </select>
          <select name="clientId" value={newCar.clientId} onChange={handleChange} className="border px-3 py-2 rounded" required>
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nom} - {client.email}
              </option>
            ))}
          </select>

          <div className="flex gap-4 col-span-2">
            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              {carIdEnEdition ? "Mettre à jour la voiture" : "Ajouter la voiture"}
            </button>

            {carIdEnEdition && (
              <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                Annuler la modification
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
                  <button onClick={() => handleEdit(car)} className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">Modifier</button>
                  <button onClick={() => handleDelete(car.id)} className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">Supprimer</button>
                </div>
              </div>
              <p><strong>Plaque d'immatriculation :</strong> {car.plaqueImmatriculation}</p>
              <p><strong>Date d'entrée :</strong> {new Date(car.dateEntree).toLocaleDateString()}</p>
              <p><strong>Statut :</strong> {car.statut}</p>
              <p><strong>Client :</strong> {car.clientId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
