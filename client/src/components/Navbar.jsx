const Navbar = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      
      {/* Search */}
      <div className="w-1/3">
        <input
          type="text"
          placeholder="Search..."
          autoComplete="off" 
          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        
        <button className="text-gray-500 hover:text-gray-700 transition text-lg">
          🔔
        </button>

        <div className="flex items-center gap-3 cursor-pointer">
          <img src="https://i.pravatar.cc/40" alt="Admin Avatar" className="w-9 h-9 rounded-full border border-gray-200" />
          <span className="text-sm font-medium text-gray-700">
            Admin
          </span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;