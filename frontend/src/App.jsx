import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyAds from './pages/MyAds';
import PostAd from './pages/PostAd';
import AdminPanel from './pages/AdminPanel';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import { useAuth } from './context/AuthContext';
import React from 'react';

function PrivateRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();

  console.log("Current User:", user); 
  console.log("Is Admin Only Route:", adminOnly);

  if (loading) return <div className="text-center py-20">Loading Auth...</div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (adminOnly && user.role !== 'admin') {
    console.warn("Access Denied! User role is:", user.role);
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="checkout/success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
          <Route path="checkout/failed" element={<PrivateRoute><PaymentFailed /></PrivateRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="my-ads" element={<PrivateRoute><MyAds /></PrivateRoute>} />
          <Route path="post-ad" element={<PrivateRoute><PostAd /></PrivateRoute>} />
          <Route path="admin" element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
