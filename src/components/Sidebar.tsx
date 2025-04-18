
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, Home, Clipboard, Calendar, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-farmblue">KarangnongkoFarm</h2>
          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center p-4 border-b">
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-2">
            <img 
              src={user?.photoUrl || '/placeholder.svg'} 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="text-lg font-medium">{user?.name || user?.username}</h3>
          <p className="text-sm text-gray-500">{user?.username}</p>
        </div>
        
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-farmblue text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Home size={20} className="mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/daftar-peternakan" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-farmblue text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Clipboard size={20} className="mr-3" />
                <span>Daftar Peternakan</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/jadwal" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-farmblue text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Calendar size={20} className="mr-3" />
                <span>Jadwal</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="flex items-center p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
