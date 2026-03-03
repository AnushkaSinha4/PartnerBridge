

import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, change, color }) => {
  const iconBg = {
    blue:   "bg-blue-100 text-blue-600",
    green:  "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red:    "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  }[color] || "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{value ?? 0}</h3>
        {change !== undefined && (
          <p className={`flex items-center gap-0.5 text-xs font-semibold mt-0.5 ${change > 0 ? "text-green-600" : "text-red-500"}`}>
            {change > 0
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(change)}%
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;