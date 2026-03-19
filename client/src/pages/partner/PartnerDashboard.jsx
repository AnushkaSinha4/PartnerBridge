import React, { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_BADGE = {
  won: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  proposal: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  qualified: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  new: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  lost: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

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
  const closedDeals = leads.filter((l) => l.status === "won").length;
  const totalCommission = leads
    .filter((l) => l.status === "won")
    .reduce((sum, l) => sum + (l.dealValue || 0) * 0.1, 0);

  const metrics = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "text-blue-600 bg-blue-50",
      trend: null,
    },
    {
      label: "Active Deals",
      value: activeDeals,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "text-violet-600 bg-violet-50",
      trend: null,
    },
    {
      label: "Closed Deals",
      value: closedDeals,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-emerald-600 bg-emerald-50",
      trend: null,
    },
    {
      label: "Total Commission",
      value: `₹${Number(totalCommission).toLocaleString("en-IN")}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-amber-600 bg-amber-50",
      trend: null,
    },
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* ================= PAGE HEADER ================= */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-7 bg-indigo-600 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500 ml-4">
          Overview of your partnership performance
        </p>
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${m.color}`}>
              {m.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RECENT LEADS TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-sm font-semibold text-gray-700">Recent Leads</h2>
          </div>
          {leads.length > 5 && (
            <span className="text-xs text-indigo-600 font-medium">
              Showing 5 of {leads.length}
            </span>
          )}
        </div>

        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">No leads found</p>
            <p className="text-xs text-gray-400 mt-1">Go to Leads to create your first lead</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Value</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors duration-150">

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {lead.company?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-gray-800">{lead.company || "—"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹{Number(lead.dealValue || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[lead.status] || "bg-gray-100 text-gray-600"}`}>
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-700">
                      ₹{lead.status === "won"
                        ? Number((lead.dealValue || 0) * 0.1).toLocaleString("en-IN")
                        : "0"}
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