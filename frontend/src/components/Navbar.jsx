import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import React from 'react';
import logo from "../assets/logo.png"
import { useCart } from '../context/CartContext.jsx';

// Navigation links styling logic
const navClass = ({ isActive }) => `
  relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-xl
  ${isActive 
    ? 'bg-black text-white shadow-md shadow-slate-200 scale-105' 
    : 'text-slate-600 hover:bg-slate-100 hover:text-black'
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate();

  const { isGridView, toggleGrid } = useCart();


  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link to="/" className="group flex items-center gap-2">
           
             <img src={logo} alt=" " className="w-36 h-36">
            </img>

          </Link>

       

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navClass} end>Home</NavLink>
            <NavLink to="/products" className={navClass}>Browse</NavLink>
            {user && <NavLink to="/post-ad" className={navClass}>Post Ad</NavLink>}
            {user && <NavLink to="/my-ads" className={navClass}>My Ads</NavLink>}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="ml-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-100 transition-colors">
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Search Button (Icon version) */}
          <button
            onClick={() => navigate('/products')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:bg-slate-50 hover:text-black sm:w-auto sm:px-4 sm:gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline font-bold text-sm">Search</span>
          </button>

          {/* Vertical Divider */}
          <div className="mx-1 h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Auth Section */}
          {!user ? (
            <Link 
              className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-6 text-sm font-bold text-white shadow-lg transition-all hover:bg-slate-700 active:scale-95" 
              to="/login"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/profile" 
                className="hidden sm:flex items-center gap-2 group"
              >
                <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-100 overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-black">{user.name}</span>
              </Link>
              
              <button
                onClick={logout}
                className="h-10 px-4 rounded-xl border border-slate-200 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
              >
                Logout
              </button>
                 <button 
            onClick={toggleGrid}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm text-slate-600 transition-all hover:bg-slate-50 active:scale-90"
            title="Toggle Layout"
          >
            {isGridView ? (
              /* Icon for 1 Column (Single Row) */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              /* Icon for 2 Columns (Grid) */
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}