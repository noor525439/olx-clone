import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import React from 'react';
export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6">
        <Outlet />
      </main>
    <footer className="border-t bg-slate-50 text-slate-600">
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Brand Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-black">Bazaar</h2>
        <p className="text-sm leading-relaxed">
          The best marketplace to buy and sell anything. From cars to mobiles, 
          find amazing deals in your city.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4 uppercase text-xs tracking-wider">
          Popular Categories
        </h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-gray-600 transition">Cars & Vehicles</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Properties</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Mobile Phones</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Electronics</a></li>
        </ul>
      </div>

      {/* Support Section */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4 uppercase text-xs tracking-wider">
          Support
        </h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-gray-600 transition">Help Center</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Terms of Use</a></li>
          <li><a href="#" className="hover:text-gray-600 transition">Safety Tips</a></li>
        </ul>
      </div>

      {/* Newsletter / Contact */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4 uppercase text-xs tracking-wider">
          Contact Us
        </h3>
        <p className="text-sm mb-4">Questions or feedback? We'd love to hear from you.</p>
        <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-600 transition w-full md:w-auto">
          Contact Support
        </button>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs">
        © {new Date().getFullYear()} Bazaar. Built with <span className="text-red-500">❤️</span> using MERN Stack.
      </p>
      
      {/* Social Icons Placeholder */}
      <div className="flex space-x-6">
        <a href="#" className="hover:text-slate-600"><span className="sr-only">Facebook</span>FB</a>
        <a href="#" className="hover:text-slate-600"><span className="sr-only">Twitter</span>TW</a>
        <a href="#" className="hover:text-slate-600"><span className="sr-only">Instagram</span>IG</a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}

