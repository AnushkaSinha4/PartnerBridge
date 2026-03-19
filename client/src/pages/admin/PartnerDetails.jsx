import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PartnerDetails = () => {

  const { id } = useParams();
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    fetchPartner();
  }, []);

  const fetchPartner = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8000/api/v1/partners/admin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setPartner(res.data.data);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  if (!partner) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Partner Details</h1>

      {/* ================= COMPANY INFO ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Company Information</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <p><span className="font-medium text-gray-500">Company:</span> {partner.companyName}</p>
          <p><span className="font-medium text-gray-500">Business:</span> {partner.businessType}</p>
          <p><span className="font-medium text-gray-500">Website:</span> {partner.website || "-"}</p>
          <p><span className="font-medium text-gray-500">Revenue:</span> {partner.estimatedRevenue || "-"}</p>

        </div>
      </div>

      {/* ================= CONTACT ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Contact Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <p><span className="font-medium text-gray-500">Name:</span> {partner.contactName}</p>
          <p><span className="font-medium text-gray-500">Role:</span> {partner.contactRole}</p>
          <p><span className="font-medium text-gray-500">Email:</span> {partner.contactEmail}</p>
          <p><span className="font-medium text-gray-500">Phone:</span> {partner.contactPhone}</p>

        </div>
      </div>

      {/* ================= BUSINESS ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Business Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <p><span className="font-medium text-gray-500">GST:</span> {partner.gstNumber || "-"}</p>
          <p><span className="font-medium text-gray-500">PAN:</span> {partner.panNumber || "-"}</p>
          <p><span className="font-medium text-gray-500">Bank:</span> {partner.bankAccountNumber || "-"}</p>
          <p><span className="font-medium text-gray-500">IFSC:</span> {partner.ifscCode || "-"}</p>

        </div>
      </div>

      {/* ================= STATUS ================= */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Status</h2>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium
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

      </div>

      {/* ================= DOCUMENTS ================= */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-lg font-semibold mb-4">Documents</h2>

        <div className="flex gap-6">

          {partner.aadhaarFront && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Aadhaar Front</p>
              <img
                src={`http://localhost:5000/${partner.aadhaarFront}`}
                className="w-40 h-28 object-cover rounded border"
              />
            </div>
          )}

          {partner.aadhaarBack && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Aadhaar Back</p>
              <img
                src={`http://localhost:5000/${partner.aadhaarBack}`}
                className="w-40 h-28 object-cover rounded border"
              />
            </div>
          )}

          {partner.passportPhoto && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Photo</p>
              <img
                src={`http://localhost:5000/${partner.passportPhoto}`}
                className="w-28 h-28 object-cover rounded-full border"
              />
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default PartnerDetails;