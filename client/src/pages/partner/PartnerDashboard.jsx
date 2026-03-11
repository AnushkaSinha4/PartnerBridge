import React from "react";

export default function PartnerDashboard() {

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
          <h2 className="text-2xl font-bold mt-2">12</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Active Deals</p>
          <h2 className="text-2xl font-bold mt-2">5</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Closed Deals</p>
          <h2 className="text-2xl font-bold mt-2">7</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-gray-500 text-sm">Total Commission</p>
          <h2 className="text-2xl font-bold mt-2">$3200</h2>
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

            <tr>
              <td className="py-3">ABC Corp</td>
              <td>$5000</td>
              <td className="text-yellow-600">Negotiation</td>
              <td>$500</td>
            </tr>

            <tr>
              <td className="py-3">XYZ Tech</td>
              <td>$8000</td>
              <td className="text-green-600">Closed</td>
              <td>$800</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}