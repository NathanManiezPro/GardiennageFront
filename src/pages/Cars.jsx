import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cars')
      .then((res) => {
        console.log('🚘 Données reçues :', res.data);
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des voitures :', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des voitures...</p>;

  return (
    <div>
      <h1>🚗 Liste des voitures</h1>
      <ul>
        {cars.map(car => (
          <li key={car.id}>
            {car.modele} — {car.plaqueImmatriculation}
          </li>
        ))}
      </ul>
    </div>
  );
}
