
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { GITHUB_CLIENT_ID } from '../constants';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vote', path: '/vote' },
    { name: 'Gift', path: '/gift' },
    { name: 'Rate Us', path: '/rate' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const handleGithubLogin = () => {
    const redirectUri = window.location.origin + window.location.pathname;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <nav className="fixed w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-[#39FF14]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-mono neon-text tracking-tighter">ORYN_SERVER</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-mono transition-colors ${
                  location.pathname === link.path ? 'neon-text' : 'text-gray-300 hover:text-[#39FF14]'
                }`}
              >
                {link.name.toUpperCase()}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full border border-[#39FF14]" />
                <button 
                  onClick={logout}
                  className="font-mono text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGithubLogin}
                className="px-4 py-2 neon-button font-mono text-sm font-bold uppercase"
              >
                Login GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#39FF14]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050505] border-b border-[#39FF14]/20 px-4 pt-2 pb-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block font-mono text-lg ${
                location.pathname === link.path ? 'neon-text' : 'text-gray-300'
              }`}
            >
              {link.name.toUpperCase()}
            </Link>
          ))}
          {user ? (
            <button 
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full text-left font-mono text-lg text-red-500"
            >
              LOGOUT
            </button>
          ) : (
            <button 
              onClick={handleGithubLogin}
              className="w-full px-4 py-3 neon-button font-mono text-center font-bold"
            >
              Login GitHub
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
