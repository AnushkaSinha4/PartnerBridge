
import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function PartnerDashboard() {

  const [leads, setLeads] = useState([]);

  /* FETCH LEADS */
  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads");
      setLeads(res.data?.data || []);
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  /* CALCULATIONS */

  const totalLeads = leads.length;

  const activeDeals = leads.filter(
    (l) => l.status === "qualified" || l.status === "proposal"
  ).length;

  const closedDeals = leads.filter(
    (l) => l.status === "won"
  ).length;

  const totalCommission = leads
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.dealValue || 0) * 0.1, 0); // 10%

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Partner Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your partnership performance
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Leads</p>
          <h2 className="text-2xl font-bold mt-2">{totalLeads}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Deals</p>
          <h2 className="text-2xl font-bold mt-2">{activeDeals}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Closed Deals</p>
          <h2 className="text-2xl font-bold mt-2">{closedDeals}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Commission</p>
          <h2 className="text-2xl font-bold mt-2">
            ₹{totalCommission}
          </h2>
        </div>

      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Leads
        </h2>

        <table className="w-full text-sm">

          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Company</th>
              <th className="text-left py-2">Deal Value</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Commission</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {leads.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.slice(0, 5).map((lead) => (
                <tr key={lead._id}>
                  <td className="py-3">{lead.company}</td>
                  <td>₹{lead.dealValue || 0}</td>

                  <td
                    className={
                      lead.status === "won"
                        ? "text-green-600"
                        : lead.status === "proposal"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }
                  >
                    {lead.status}
                  </td>

                  <td>
                    ₹
                    {lead.status === "won"
                      ? (lead.dealValue || 0) * 0.1
                      : 0}
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
