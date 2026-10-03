import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Shop from './components/Shop'
import ProductDetails from './pages/ProductDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/product/:id" element={<ProductDetails />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App