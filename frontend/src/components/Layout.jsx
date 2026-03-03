import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import React from 'react';
import logo from "../assets/logo.png"; // Aapka logo

export default function Layout() {
  return (
    // 'flex-col' aur 'min-h-screen' footer ko bottom par push karne ke liye zaroori hain
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-900">
      
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      {/* 'flex-grow' ensures this takes up all available space */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {/* Agar logo image use karni hai: <img src={logo} alt="Zaytoo" className="h-8 w-auto" /> */}
                <h1 className="text-2xl font-black tracking-tighter text-black">ZAYTOO</h1>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The most trusted marketplace to buy and sell anything. Find amazing deals in your city today.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-6">
                Popular Categories
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-black hover:underline transition-all">Cars & Vehicles</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Properties</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Mobile Phones</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Electronics</a></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-6">
                Support
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-black hover:underline transition-all">Help Center</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Terms of Use</a></li>
                <li><a href="#" className="hover:text-black hover:underline transition-all">Safety Tips</a></li>
              </ul>
            </div>

            {/* Newsletter / Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-6">
                Contact Us
              </h3>
              <p className="text-sm text-slate-600">Questions or feedback? Reach out to our team.</p>
              <button className="w-full md:w-auto bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                Contact Support
              </button>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} <span className="font-bold text-black">ZAYTOO</span>. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-black transition-colors">Facebook</a>
              <a href="#" className="hover:text-black transition-colors">Twitter</a>
              <a href="#" className="hover:text-black transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}