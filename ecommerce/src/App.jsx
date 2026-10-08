import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Shop from "./components/Shop";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import FeaturedProducts from "./pages/FeaturedProducts";
import Checkout from "./pages/Checkout";

import { AuthProvider } from "./context/AuthContext";

import { getCart, saveCart } from "./services/cartService";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminLayout from "./pages/admin/adminLayout";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import OrderDetails from "./pages/admin/OrderDetails";


function AppContent() {
  // Load cart from localStorage when the application starts
  const [cart, setCart] = useState(() => getCart());

  const [wishlist, setWishlist] = useState([]);

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  // Keep localStorage synchronized with React cart state
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  return (
    <>
      {!isAdminPage && <Navbar cart={cart} />}

      <main className={!isAdminPage ? "pt-[145px]" : ""}>

      <Routes>

        {/* ================= CUSTOMER ROUTES ================= */}

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
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/featured-products"
          element={
            <FeaturedProducts
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================= ADMIN ROUTES ================= */}

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

          <Route
            path="products/edit/:id"
            element={<AdminProductForm />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

        <Route
        path="orders/:id"
        element={<OrderDetails />}
        />

        </Route>

      </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;