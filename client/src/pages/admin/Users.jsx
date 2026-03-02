import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import CreateUserModal from "../../components/CreateUserModal";

const Users = () => {
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

      setUsers(res.data?.data?.users || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/v1/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "User creation failed");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
  const colors = {
    super_admin: "bg-purple-50 text-purple-700 border border-purple-200",
    admin: "bg-blue-50 text-blue-700 border border-blue-200",
    employee: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    client: "bg-amber-50 text-amber-700 border border-amber-200",
    partner: "bg-pink-50 text-pink-700 border border-pink-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[role] || "bg-gray-100 text-gray-600"}`}>
      {role}
    </span>
  );
};

  const statusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      inactive: "bg-red-100 text-red-700",
      suspended: "bg-yellow-100 text-yellow-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

 return (
  <div className="bg-gray-100 min-h-screen px-8 py-8">
    
    {/* Header */}
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
        <p className="text-gray-500 mt-1">
          Manage platform users and permissions
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-md transition"
      >
        + Add New User
      </button>
    </div>

    {/* Card Container */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      {/* Search Bar */}
      <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <span className="text-sm text-gray-500">
          {filteredUsers.length} users
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
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
              <tr key={user._id} className="hover:bg-gray-50 transition">

                {/* USER COLUMN */}
                <td className="px-6 py-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                    {user.firstName?.charAt(0)}
                  </div>

                  <div>
                    <div className="font-semibold text-gray-800">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-5 text-gray-600">
                  {user.email}
                </td>

                {/* ROLE */}
                <td className="px-6 py-5">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {user.role}
                  </span>
                </td>

                {/* STATUS */}
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

                {/* ACTIONS */}
                <td className="px-6 py-5 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === user._id ? null : user._id
                      )
                    }
                    className="p-2 rounded-md hover:bg-gray-200 transition"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeMenu === user._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-6 mt-2 w-32 bg-white border rounded-xl shadow-md z-50"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      >
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

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>

    <CreateUserModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleCreateUser}
    />
  </div>
);
};

export default Users;