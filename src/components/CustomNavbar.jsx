import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Menu, X } from 'lucide-react';

const CustomNavbar = () => {
  const { token, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#474E93] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <span className="text-2xl font-bold text-white hover:text-violet-200 transition-colors">
              Immense Learning
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
            >
              Home
            </Link>
            
            {token ? (
              <>
                <Link 
                  to={role === "student" ? "/studentdashboard" : "/teacherdashboard"}
                  className="px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/studentlogin"
                  className="px-4 py-2 text-white border border-white rounded-md hover:bg-violet-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/studentregister"
                  className="px-4 py-2 bg-white text-violet-700 rounded-md hover:bg-violet-100 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-violet-600 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            
            {token ? (
              <>
                <Link
                  to={role === "student" ? "/studentdashboard" : "/teacherdashboard"}
                  className="block px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full text-left px-3 py-2 text-white hover:bg-red-600 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/studentlogin"
                  className="block px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/studentregister"
                  className="block px-3 py-2 text-white hover:bg-violet-600 rounded-md transition-colors"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;