import { useEffect, useState } from "react";
import api from "../../services/api";

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
      await api.post("/leads", form); //  FIXED HERE

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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Leads</h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border mb-8 grid grid-cols-2 gap-4"
      >

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Requirement"
          value={form.requirement}
          onChange={(e) => setForm({ ...form, requirement: e.target.value })}
          className="border p-2 rounded col-span-2"
        />

        <input
          placeholder="Deal Value"
          type="number"
          value={form.dealValue}
          onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
          className="border p-2 rounded"
        />

        <button className="col-span-2 bg-indigo-600 text-white py-2 rounded">
          Create Lead
        </button>

      </form>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        {leads.length === 0 ? (
          <p>No leads found</p>
        ) : (
          <table className="w-full text-sm">

            <thead className="border-b text-gray-500">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Company</th>
                <th className="text-left py-2">Deal Value</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {leads.map((lead) => (
                <tr key={lead._id}>

                  <td className="py-3">{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>₹{lead.dealValue}</td>

                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead._id, e.target.value)
                      }
                      className="border p-1 rounded"
                    >
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}