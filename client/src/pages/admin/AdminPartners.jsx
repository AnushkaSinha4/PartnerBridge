import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPartners = () => {
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: ""
  });

  const menuRef = useRef(null);

  /* ================= FETCH PARTNERS ================= */

  const fetchPartners = async () => {

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8000/api/v1/partners/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     setPartners(res.data.data || []);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* ================= CREATE PARTNER ================= */

  const createPartner = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/v1/admin/create-partner",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);
      setFormData({ email: "" });

      // fetchPartners();
    } catch (err) {
      alert(err.response?.data?.message || "Partner creation failed");
    }

  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
          `http://localhost:8000/api/v1/partners/admin/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPartners();

    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }

  };

  /* ================= EFFECT ================= */

  useEffect(() => {

    fetchPartners();

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
       setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  /* ================= SEARCH FILTER ================= */

  // const filteredPartners = Array.isArray(partners)
  //   ? partners.filter((partner) =>
  //       (partner.companyName || "")
  //         .toLowerCase()
  //         .includes(search.toLowerCase())
  //    )
  // : [];
  const filteredPartners = partners.filter((partner) =>
    (partner.companyName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (

    <div className="bg-gray-100 min-h-screen px-8 py-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            All Partners Applications
          </h1>

          <p className="text-gray-500 mt-1">
            Manage partner onboarding and approvals
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Create Partner
        </button>

      </div>

      {/* CARD */}
     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* SEARCH */}
        <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">

          <div className="relative w-96">

            <input
              type="text"
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />

            <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>

          </div>

          <span className="text-sm text-gray-500">
            {filteredPartners.length} partners
          </span>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm text-left">

            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">

              <tr>

                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Business Type</th>
                <th className="px-6 py-4">Contact Email</th>
                <th className="px-6 py-4">Preview</th> 
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {filteredPartners.map((partner) => (

                <tr key={partner._id} className="hover:bg-gray-50">

                  <td className="px-6 py-5 font-semibold text-gray-800">
                    {partner.companyName}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {partner.businessType}
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {partner.contactEmail}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => navigate(`/admin/partners/${partner._id}`)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      View
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium
                      ${
                        partner.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : partner.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right relative">

                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === partner._id
                            ? null
                            : partner._id
                        )
                      }
                      className="p-2 rounded-md hover:bg-gray-200"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {activeMenu === partner._id && (

                      <div
                        ref={menuRef}
                        className="absolute right-6 mt-2 w-40 bg-white border rounded-xl shadow-md z-50"
                      >

                        <button
                          onClick={() =>
                            updateStatus(partner._id, "approved")
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-green-50 text-sm text-green-600"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(partner._id, "rejected")
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(partner._id, "in_review")
                          }
                          className="block w-full text-left px-4 py-2 hover:bg-yellow-50 text-sm text-yellow-600"
                        >
                          In Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PARTNER MODAL */}

      {showModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">

          <div className="bg-white w-[420px] rounded-xl p-6 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Create Partner
            </h2>

            <form className="space-y-3" onSubmit={createPartner}>

              <input
                name="email"
                placeholder="Partner Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Create
                </button>

              </div>

            </form>
          </div>

        </div>

      )}

    </div>

  );

};

export default AdminPartners;
