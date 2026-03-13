import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import CreateUserModal from "../../components/CreateUserModal";

const Employee = () => {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const employees = res.data?.data?.users.filter(
        (user) => user.role === "employee"
      );

      setUsers(employees || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Delete this employee?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/v1/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleCreateUser = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      formData.role = "employee";

      await axios.post("http://localhost:5000/api/v1/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
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

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Employees</h1>
          <p className="text-gray-500 mt-1">
            Manage company employees and their platform access
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-md"
        >
          + Add New Employee
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <span className="text-sm text-gray-500">
            {filteredUsers.length} employees
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

                <td className="px-6 py-5 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === user._id ? null : user._id)
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {activeMenu === user._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-6 mt-2 w-32 bg-white border rounded-xl shadow-md"
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

      <CreateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateUser}
        defaultRole="employee"
      />

    </div>
  );
};

export default Employee;