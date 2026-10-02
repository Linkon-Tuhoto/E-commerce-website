import { Search, User, Heart, ShoppingCart, Menu, Truck } from "lucide-react";

function Navbar() {
  return (
    <header className="w-full">

      {/* Top bar */}
      <div className="bg-black text-white px-8 py-2 text-sm flex justify-between">
        <div className="flex items-center gap-2">
            <Truck size={16} className="inline-block mr-2 text-yellow-400" />
             <p> Free delivery in Nairobi on orders over KSh 5,000</p>
        </div>
        <div className="flex gap-6">
          <span>Track Order</span>
          <span>Help</span>
          <span>0712 345 678</span>
        </div>
      </div>

      {/* Main navbar */}
      <div className="px-8 py-4 flex items-center gap-8 border-b">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
            M
          </div>

          <span className="text-2xl font-bold tracking-wide">
            MAMBOGA
          </span>
        </div>

        {/* Search */}
        <div className="flex flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Search products, categories and brands..."
            className="w-full border border-gray-300 rounded-l-lg px-4 py-3 outline-none focus:border-yellow-500"
          />

          <button className="bg-yellow-500 px-6 rounded-r-lg">
            <Search size={20} />
          </button>
        </div>

        {/* Account */}
        <div className="flex items-center gap-2 cursor-pointer">
          <User size={25} />

          <div>
            <p className="font-semibold text-sm">Account</p>
            <p className="text-xs text-gray-500">Sign in</p>
          </div>
        </div>

        {/* Wishlist */}
        <Heart size={25} className="cursor-pointer" />

        {/* Cart */}
        <div className="flex items-center gap-2 cursor-pointer">
          <ShoppingCart size={25} />

          <div>
            <p className="font-semibold text-sm">Cart</p>
            <p className="text-xs text-gray-500">0 items</p>
          </div>
        </div>

      </div>

      {/* Category navigation */}
      <nav className="px-8 py-3 border-b flex items-center gap-8 text-sm">

        <button className="flex items-center gap-2 font-semibold">
          <Menu size={18} />
          All Categories
        </button>

        <a href="#">Clothing</a>
        <a href="#">Shoes</a>
        <a href="#">Kitchen</a>
        <a href="#">Household</a>
        <a href="#">New Arrivals</a>

        <a
          href="#"
          className="ml-auto text-yellow-600 font-semibold"
        >
          Today's Deals
        </a>

      </nav>

    </header>
  );
}

export default Navbar;