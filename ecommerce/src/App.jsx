import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/Home'
import Shop from './components/Shop'
import ProductDetails from './pages/ProductDetails'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import SignIn from './pages/SignIn'

function App() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  return (
    <BrowserRouter>
    <Navbar cart={cart}/>
      <Routes>

        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />

        <Route path="/shop" element={<Shop  cart={cart} setCart={setCart}/>} />

        <Route path="/product/:id" element={<ProductDetails cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/wishlist" element={<Wishlist setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/signin" element={<SignIn />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App