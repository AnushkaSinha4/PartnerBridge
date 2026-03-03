
import { Plus } from "lucide-react";

const Header = ({ title, onAddProject, onAddTask }) => {
  return (
    <div className="flex items-center justify-between py-5 mb-2">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Assign Task
        </button>

        <button
          onClick={onAddProject}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>

        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=1f2937&color=fff&size=36"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;