import { useState } from "react";
import { X } from "lucide-react";

const CreateUserModal = ({ isOpen, onClose, onSubmit, defaultRole = "employee" }) => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: defaultRole,
    password: "Default@123"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      role: defaultRole
    });
  };

  const roleName =
    defaultRole.charAt(0).toUpperCase() + defaultRole.slice(1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Create New {roleName}
          </h3>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4"
        >

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>

            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>

            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>

            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Hidden Role */}
          <input type="hidden" value={defaultRole} />

          {/* Password Info */}
          <p className="text-xs text-gray-500">
            Default password: <b>Default@123</b>
          </p>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Create {roleName}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;