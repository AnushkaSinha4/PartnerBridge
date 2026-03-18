import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/partnerBridgeLogo.jpeg";

export default function PartnerOnboarding() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    businessType: "",
    employeeCount: "",
    yearOfEstablishment: "",
    website: "",
    linkedinUrl: "",
    portfolioUrl: "",
    estimatedRevenue: "",
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    preferredContactMethod: "",
    gstNumber: "",
    panNumber: "",
    bankAccountNumber: "",
    ifscCode: "",
    aadhaarFront: null,
    aadhaarBack: null,
    passportPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // ✅ file handling
    if (files) {
      setForm({
        ...form,
        [name]: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // ✅ IMPORTANT: formData for file upload
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await api.post("/partners/onboarding", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/partner/awaiting-approval");

    } catch (error) {
      console.log("Onboarding error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Onboarding failed");
    }
  };

  const inputStyle =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none";

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">

      <div className="bg-white w-full max-w-5xl rounded-xl shadow-sm border p-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">

          <img
            src={logo}
            alt="Partner Bridge"
            className="w-10 h-10 object-contain"
          />

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Partner Onboarding
            </h1>

            <p className="text-sm text-gray-500">
              Tell us about your company — this helps us match the right opportunities.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Company Info */}
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Company Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="text-sm text-gray-600">Company Name</label>
                <input
                  name="companyName"
                  onChange={handleChange}
                  required
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Business Type</label>
                <select
                  name="businessType"
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option>Agency</option>
                  <option>Consultancy</option>
                  <option>Startup</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Employee Count</label>
                <select
                  name="employeeCount"
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option>1-10</option>
                  <option>10-50</option>
                  <option>50-100</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Year of Establishment
                </label>
                <input
                  name="yearOfEstablishment"
                  type="number"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Company Website
                </label>
                <input
                  name="website"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  LinkedIn URL
                </label>
                <input
                  name="linkedinUrl"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Portfolio / Case Studies
                </label>
                <input
                  name="portfolioUrl"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Estimated Annual Revenue
                </label>
                <select
                  name="estimatedRevenue"
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select</option>
                  <option>Below $100k</option>
                  <option>$100k-$500k</option>
                  <option>$500k+</option>
                </select>
              </div>

            </div>

          </div>

          {/* Contact Info */}
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Primary Contact
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="text-sm text-gray-600">Contact Name</label>
                <input
                  name="contactName"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Role</label>
                <input
                  name="contactRole"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Contact Email</label>
                <input
                  name="contactEmail"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Contact Phone</label>
                <input
                  name="contactPhone"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Preferred Contact Method
                </label>
                <select
                  name="preferredContactMethod"
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </div>

            </div>

          </div>

          {/* BUSINESS DETAILS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Business Details
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <input name="gstNumber" placeholder="GST Number" onChange={handleChange} className={inputStyle} />
              <input name="panNumber" placeholder="PAN Number" onChange={handleChange} className={inputStyle} />
              <input name="bankAccountNumber" placeholder="Bank Account" onChange={handleChange} className={inputStyle} />
              <input name="ifscCode" placeholder="IFSC Code" onChange={handleChange} className={inputStyle} />

            </div>
          </div>

           {/* DOCUMENT UPLOAD */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Document Upload
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <input type="file" name="aadhaarFront" onChange={handleChange} />
              <input type="file" name="aadhaarBack" onChange={handleChange} />
              <input type="file" name="passportPhoto" onChange={handleChange} />

            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
            >
              Submit Application
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}