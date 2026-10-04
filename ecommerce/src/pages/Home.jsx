import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Benefits from '../components/Benefits'
import FeaturedProducts from '../components/FeaturedProducts'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <Benefits />
      <FeaturedProducts />
    </>
  )
}

export default Home