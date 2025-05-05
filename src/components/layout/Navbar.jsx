import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-indigo-600 font-bold text-2xl">Quiz</span>
              <span className="text-gray-800 font-bold text-2xl">Maker</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                isActive 
                  ? "px-3 py-2 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50" 
                  : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }
            >
              Главная
            </NavLink>
            <NavLink 
              to="/tests" 
              className={({ isActive }) => 
                isActive 
                  ? "px-3 py-2 rounded-md text-sm font-medium text-indigo-600 bg-indigo-50" 
                  : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }
            >
              Все тесты
            </NavLink>
            <NavLink 
              to="/tests/create" 
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
            >
              Создать тест
            </NavLink>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Открыть меню</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => 
                isActive 
                  ? "block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50" 
                  : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </NavLink>
            <NavLink 
              to="/tests" 
              className={({ isActive }) => 
                isActive 
                  ? "block px-3 py-2 rounded-md text-base font-medium text-indigo-600 bg-indigo-50" 
                  : "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Все тесты
            </NavLink>
            <NavLink 
              to="/tests/create" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Создать тест
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;