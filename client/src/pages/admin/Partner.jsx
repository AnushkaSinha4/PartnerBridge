import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import CreateUserModal from "../../components/CreateUserModal";

const Partner = () => {
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

      const res = await axios.get(
        "http://localhost:5000/api/v1/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const partners = res.data?.data?.users.filter(
        (user) => user.role === "partner"
      );

      setUsers(partners || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this partner?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      formData.role = "partner";

      await axios.post("http://localhost:5000/api/v1/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Creation failed");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen px-8 py-8">

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Partners</h1>
          <p className="text-gray-500 mt-1">
            Manage platform partners and their access
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-md"
        >
          + Add New Partner
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Search */}
        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <span className="text-sm text-gray-500">
            {filteredUsers.length} partners
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

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
                <tr key={user._id} className="hover:bg-gray-50">

                  <td className="px-6 py-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                      {user.firstName?.charAt(0)}
                    </div>

                    <div className="font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`flex items-center gap-2 text-sm font-medium ${
                        user.status === "active"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          user.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === user._id ? null : user._id
                        )
                      }
                      className="p-2 rounded-md hover:bg-gray-200"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === user._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 mt-2 w-32 bg-white border rounded-xl shadow-md z-50"
                      >
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} partners
        </div>

      </div>

      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateUser}
        defaultRole="partner"
      />

    </div>
  );
};

export default Partner;