import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Shop from './components/Shop'
import ProductDetails from './pages/ProductDetails'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/product/:id" element={<ProductDetails />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App