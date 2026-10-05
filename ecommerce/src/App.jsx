import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Shop from "./components/Shop";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import SignIn from "./pages/SignIn";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminLayout from "./pages/admin/adminLayout";
import AdminProductForm from "./pages/admin/AdminProductForm";


function AppContent() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar cart={cart} />}

      <Routes>

        {/* Customer routes */}
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/shop"
          element={
            <Shop
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/wishlist"
          element={
            <Wishlist
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          }
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />


        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  Admin Dashboard
                </h1>

                <p className="text-gray-600">
                  Welcome to store admin
                </p>
              </div>
            }
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="products/new"
            element={<AdminProductForm />}
          />

        </Route>

      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;