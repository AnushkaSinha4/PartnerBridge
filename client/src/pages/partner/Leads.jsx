import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_STYLES = {
  new: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  qualified: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  proposal: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  won: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  lost: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const STATUS_DOT = {
  new: "bg-blue-500",
  qualified: "bg-violet-500",
  proposal: "bg-amber-500",
  won: "bg-emerald-500",
  lost: "bg-red-500",
};

export default function Leads() {

  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    requirement: "",
    dealValue: "",
  });

  /* ================= FETCH LEADS ================= */
  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data?.data || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ================= CREATE LEAD ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/leads", form);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        requirement: "",
        dealValue: "",
      });
      fetchLeads();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating lead");
    }
  };

  /* ================= STATUS UPDATE ================= */
  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/leads/${id}/status`, { status });
      fetchLeads();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200";

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-indigo-600 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        <p className="text-sm text-gray-500 ml-4">
          Manage and track all your potential deals
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-700">Create New Lead</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email Address
              </label>
              <input
                placeholder="e.g. rahul@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Phone Number
              </label>
              <input
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Company
              </label>
              <input
                placeholder="e.g. TechCorp Pvt Ltd"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Requirement
              </label>
              <input
                placeholder="Describe what the client needs..."
                value={form.requirement}
                onChange={(e) => setForm({ ...form, requirement: e.target.value })}
                className={inputStyle}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Deal Value (₹)
              </label>
              <input
                placeholder="e.g. 500000"
                type="number"
                value={form.dealValue}
                onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
                className={inputStyle}
              />
            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Lead
            </button>
          </div>

        </form>
      </div>

      {/* ================= LEADS TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-700">All Leads</h2>
          </div>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {leads.length} total
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No leads yet</p>
            <p className="text-xs text-gray-400 mt-1">Create your first lead using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Value</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {lead.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{lead.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{lead.company || "—"}</td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-gray-600 text-xs">{lead.email || "—"}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{lead.phone || ""}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        ₹{Number(lead.dealValue || 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="relative inline-flex items-center">
                        <span className={`absolute left-2 w-1.5 h-1.5 rounded-full ${STATUS_DOT[lead.status] || "bg-gray-400"}`} />
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`pl-5 pr-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 outline-none appearance-none ${STATUS_STYLES[lead.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          <option value="new">New</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal</option>
                          <option value="won">Won</option>
                          <option value="lost">Lost</option>
                        </select>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
}