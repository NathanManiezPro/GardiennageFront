import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
    role: "client",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur récupération utilisateurs :", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, newUser);
      } else {
        await api.post("/users/register", newUser);
      }
      setNewUser({
        nom: "",
        email: "",
        telephone: "",
        password: "",
        role: "client",
      });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Erreur création/modification utilisateur :", err);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setNewUser({
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      password: "",
      role: user.role,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-3xl font-semibold mb-6">👥 Liste des utilisateurs</h2>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <h3 className="col-span-full text-xl font-medium mb-2">
            {editingId ? "✏️ Modifier l’utilisateur" : "➕ Ajouter un utilisateur"}
          </h3>

          <input
            className="border border-gray-300 rounded px-3 py-2"
            name="nom"
            placeholder="Nom"
            value={newUser.nom}
            onChange={handleChange}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleChange}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            name="telephone"
            placeholder="Téléphone"
            value={newUser.telephone}
            onChange={handleChange}
          />
          <input
            className="border border-gray-300 rounded px-3 py-2"
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={handleChange}
          />
          <select
            className="border border-gray-300 rounded px-3 py-2"
            name="role"
            value={newUser.role}
            onChange={handleChange}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {editingId ? "Mettre à jour" : "Créer"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => {
                  setEditingId(null);
                  setNewUser({
                    nom: "",
                    email: "",
                    telephone: "",
                    password: "",
                    role: "client",
                  });
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* TABLEAU */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Nom</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Téléphone</th>
                <th className="p-3 border">Rôle</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{u.id}</td>
                    <td className="p-3 border">{u.nom}</td>
                    <td className="p-3 border">{u.email}</td>
                    <td className="p-3 border">{u.telephone}</td>
                    <td className="p-3 border capitalize">{u.role}</td>
                    <td className="p-3 border flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              ⬅ Précédent
            </button>
            <span className="px-4 text-sm">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Suivant ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
