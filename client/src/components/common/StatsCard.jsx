

import React from "react";

const colorMap = {
  blue:   { bg: "bg-blue-100",   text: "text-blue-600",   border: "border-blue-200" },
  green:  { bg: "bg-green-100",  text: "text-green-600",  border: "border-green-200" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600", border: "border-yellow-200" },
  red:    { bg: "bg-red-100",    text: "text-red-600",    border: "border-red-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
};

const StatsCard = ({ title, value, icon: Icon, color = "blue", sub }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.border} border`}>
        {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? 0}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export default StatsCard;