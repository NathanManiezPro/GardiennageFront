import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/cars/my-cars");
        setCars(response.data);
      } catch (err) {
        console.error("Erreur requête :", err);
        if (err.response?.status === 401) {
          setError("Utilisateur non authentifié.");
        } else {
          setError("Impossible de charger les voitures.");
        }
      }
    };
    fetchCars();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold flex items-center">
          <span className="mr-2">🚗</span>
          <p>Mes voitures</p>
        </h2>
      </header>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
          {error}
        </div>
      )}

      {!error && cars.length === 0 ? (
        <div className="text-gray-600">Aucune voiture enregistrée.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">
                {car.marque} {car.modele}{" "}
                <span className="text-gray-500">({car.annee})</span>
              </h3>
              <p className="text-gray-700">
                <strong>Immat. :</strong> {car.plaqueImmatriculation}
              </p>
              <p className="mt-1 text-gray-700">
                <strong>Date entrée :</strong>{" "}
                {new Date(car.dateEntree).toLocaleDateString()}
              </p>
              <div className="mt-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                    car.statut === "actif"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {car.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
