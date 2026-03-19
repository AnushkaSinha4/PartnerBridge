import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import CreateUserModal from "../../components/CreateUserModal";

const Client = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    fetchUsers();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/v1/admin/clients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // const clients = res.data?.data?.users.filter(
      //   (user) => user.role === "client"
      // );
      const clients = res.data?.data?.clients || res.data?.data || [];

  //     setUsers(clients || []);
  //   } catch (err) {
  //     console.log(err.response?.data || err.message);
  //   }
  // };

    setUsers(Array.isArray(clients) ? clients : []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      formData.role = "client";

      await axios.post("http://localhost:5000/api/v1/admin/create-client", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Creation failed");
    }
  };

  // const filteredUsers = users.filter((user) =>
  //   user.email?.toLowerCase().includes(search.toLowerCase())
  // );

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) =>
        user.email?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-8">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Clients</h1>
          <p className="text-gray-500 mt-1">
            Manage platform clients and their access
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium"
        >
          + Add New Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <span className="text-sm text-gray-500">
            {filteredUsers.length} clients
          </span>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-5">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-5">{user.email}</td>

                <td className="px-6 py-5">{user.role}</td>

                <td className="px-6 py-5">{user.status}</td>

                <td className="px-6 py-5 text-right">
                  <MoreHorizontal size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Modal */}
      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateUser}
        defaultRole="client"
      />

    </div>
  );
};

export default Client;