import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import Benefits from '../components/Benefits'
import FeaturedProducts from '../components/FeaturedProducts'
import PromoBanner from '../components/PromoBanner'

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Benefits />
      <FeaturedProducts />
      <PromoBanner />
    </>
  )
}

export default Home