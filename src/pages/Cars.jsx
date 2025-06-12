import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modele, setModele] = useState('');
  const [plaque, setPlaque] = useState('');

  useEffect(() => {
    api.get('/cars')
      .then((res) => {
        setCars(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement voitures :', err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cars', {
        modele,
        plaqueImmatriculation: plaque
      });
      setCars([...cars, res.data]); // Ajoute la nouvelle voiture à la liste
      setModele('');
      setPlaque('');
    } catch (err) {
      console.error('Erreur ajout voiture :', err);
    }
  };

  return (
    <div>
      <h1>🚗 Liste des voitures</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Modèle"
          value={modele}
          onChange={(e) => setModele(e.target.value)}
        />
        <input
          type="text"
          placeholder="Plaque"
          value={plaque}
          onChange={(e) => setPlaque(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              {car.modele} — {car.plaqueImmatriculation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
