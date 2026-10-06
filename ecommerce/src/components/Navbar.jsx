import { useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";

function Navbar({ cart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white fixed top-0 left-0 z-50 shadow-sm">

      {/* ================= TOP BAR ================= */}

      <div className="hidden sm:block bg-[#171717] text-white text-xs">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">

          <p>
            Free delivery in Nairobi on orders over KSh 5,000
          </p>

          <div className="flex items-center gap-6">
            <span>Need help?</span>
            <span>0712 345 678</span>
          </div>

        </div>
      </div>


      {/* ================= MAIN NAVBAR ================= */}

      <div className="border-b border-gray-200">

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          <div className="min-h-[72px] py-3 flex items-center gap-4 sm:gap-8">


            {/* ================= LOGO ================= */}

            <div className="flex items-center gap-2 shrink-0">

              <div className="w-9 h-9 bg-[#D4AF37] rounded-md flex items-center justify-center">

                <span className="font-bold text-lg">
                  M
                </span>

              </div>

              <span className="text-lg sm:text-xl font-bold tracking-[0.15em]">
                MAMBOGA
              </span>

            </div>


            {/* ================= DESKTOP SEARCH ================= */}

            <div className="hidden md:flex flex-1">

              <div className="flex w-full">

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search products, categories and brands"
                    className="
                      w-full
                      h-11
                      border
                      border-gray-300
                      rounded-l-md
                      pl-11
                      pr-4
                      text-sm
                      outline-none
                      focus:border-[#D4AF37]
                    "
                  />

                </div>

                <button
                  type="button"
                  className="
                    h-11
                    px-7
                    bg-[#D4AF37]
                    hover:bg-[#c19d25]
                    font-semibold
                    text-sm
                    rounded-r-md
                    transition
                  "
                >
                  Search
                </button>

              </div>

            </div>


            {/* ================= DESKTOP ACCOUNT ================= */}

            <div className="hidden md:flex items-center gap-2 shrink-0 cursor-pointer">

              <User size={21} />

              <Link to="/signin" className="flex flex-col">

                <p className="text-sm font-semibold">
                  Account
                </p>

                <p className="text-xs text-gray-500">
                  Sign in
                </p>

              </Link>

            </div>


            {/* ================= DESKTOP WISHLIST ================= */}

            <Link to="wishlist" className="hidden md:block shrink-0 cursor-pointer">

              <Heart
                size={22}
                className="hover:text-[#b08d1f] transition"
              />

            </Link>


            {/* ================= DESKTOP CART ================= */}

            <Link to="cart" className="hidden md:flex items-center gap-2 shrink-0 cursor-pointer">

              <ShoppingCart size={22} />

              <div>

                <p className="text-sm font-semibold">
                  Cart
                </p>

                <p className="text-xs text-gray-500">
                  0 items
                </p>

              </div>

            </Link>


            {/* ================= MOBILE CART + MENU ================= */}

            <div className="ml-auto md:hidden flex items-center gap-4">

              {/* MOBILE CART */}

              <Link to="cart" className="relative cursor-pointer">

                <ShoppingCart size={23} />

                <span
                  className="
                    absolute
                    -top-2
                    -right-2
                    w-4
                    h-4
                    rounded-full
                    bg-[#D4AF37]
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  0
                </span>

              </Link>


              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-md
                  hover:bg-gray-100
                  transition
                "
                aria-label="Open navigation menu"
              >

                <Menu size={25} />

              </button>

            </div>

          </div>


          {/* ================= MOBILE SEARCH ================= */}

          <div className="md:hidden pb-4">

            <div className="flex w-full">

              <div className="relative flex-1">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  className="
                    w-full
                    h-10
                    border
                    border-gray-300
                    rounded-l-md
                    pl-9
                    pr-3
                    text-sm
                    outline-none
                    focus:border-[#D4AF37]
                  "
                />

              </div>

              <button
                type="button"
                className="
                  h-10
                  px-5
                  bg-[#D4AF37]
                  hover:bg-[#c19d25]
                  font-semibold
                  text-sm
                  rounded-r-md
                "
              >
                Search
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* ================= DESKTOP CATEGORY NAV ========== */}
      {/* ================================================= */}

      <div className="hidden md:block bg-[#f5f1e6] border-b border-[#e5dfcf]">

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          <nav className="h-12 flex items-center gap-8 text-sm">
            <Link to="/" className="hover:text-[#a47f12] transition">
            Home
            </Link>

            <button
              type="button"
              className="
                flex
                items-center
                gap-2
                font-semibold
                hover:text-[#a47f12]
                transition
              "
            >
              <Menu size={18} />
              All Categories
            </button>


            <a
              href="#"
              className="hover:text-[#a47f12] transition"
            >
              Clothing
            </a>


            <a
              href="#"
              className="hover:text-[#a47f12] transition"
            >
              Shoes
            </a>


            <a
              href="#"
              className="hover:text-[#a47f12] transition"
            >
              Kitchen
            </a>


            <a
              href="#"
              className="hover:text-[#a47f12] transition"
            >
              Household
            </a>


            <a
              href="#"
              className="hover:text-[#a47f12] transition"
            >
              New Arrivals
            </a>


            <a
              href="#"
              className="
                ml-auto
                text-[#a47f12]
                font-semibold
                hover:text-[#80620b]
                transition
              "
            >
              Today's Deals
            </a>

          </nav>

        </div>

      </div>


      {/* ================================================= */}
      {/* ================= MOBILE MENU ==================== */}
      {/* ================================================= */}

      {/* DARK OVERLAY */}

      <div
        className={`
          fixed
          inset-0
          z-40
          bg-black/40
          md:hidden
          transition-opacity
          duration-300
          ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={closeMenu}
      />


      {/* RIGHT SIDE DRAWER */}

      <aside
        className={`
          fixed
          top-0
          right-0
          bottom-0
          z-50
          w-[86%]
          max-w-[390px]
          bg-[#f5f1e6]
          shadow-2xl
          md:hidden
          overflow-y-auto
          transition-transform
          duration-300
          ease-out
          ${
            isMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* ================= DRAWER HEADER ================= */}

        <div className="bg-white border-b border-[#e5dfcf]">

          <div className="px-4 py-4 flex items-center justify-between">

            {/* LOGO */}

            <div className="flex items-center gap-2">

              <div className="w-9 h-9  rounded-md flex items-center justify-center">

                <span className="font-bold text-lg">
                  
                </span>

              </div>

              <span className="text-lg font-bold tracking-[0.15em]">
                
              </span>

            </div>


            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeMenu}
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                rounded-md
                hover:bg-gray-100
                transition
              "
              aria-label="Close navigation menu"
            >
              <X size={25} />
            </button>

          </div>

        </div>


        {/* ================= MENU LINKS ================= */}

        <nav className="px-4 py-3 flex flex-col">

          {/* ACCOUNT */}

          <Link
            to="/signin"
            onClick={closeMenu}
            className="
              flex
              items-center
              gap-3
              py-4
              border-b
              border-[#e5dfcf]
              font-medium
              hover:text-[#b08d1f]
              transition
            "
          >

            <User size={20} />

            <div>

              <p className="font-semibold">
                Account
              </p>

              <p className="text-xs text-gray-500">
                Sign In
              </p>

            </div>

          </Link>


          {/* WISH LIST */}

          <Link
            to="/wishlist"
            onClick={closeMenu}
            className="
              flex
              items-center
              gap-3
              py-4
              border-b
              border-[#e5dfcf]
              font-medium
              hover:text-[#b08d1f]
              transition
            "
          >

            <Heart size={20} />

            <div>

              <p className="font-semibold">
                Wish List
              </p>

              <p className="text-xs text-gray-500">
                Your Saved Products
              </p>

            </div>

          </Link>

          <Link to="/" onClick={closeMenu} className="gap-3 py-4 border-b border-[#e5dfcf] hover:text-[#a47f12] transition">
          Home
          </Link>


          {/* ALL CATEGORIES */}

          <a
            href="/shop"
            onClick={closeMenu}
            className="
              flex
              items-center
              gap-3
              py-4
              font-semibold
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >

            <Menu size={18} />

            All Categories

          </a>


          {/* CLOTHING */}

          <a
            href="/shop?category=Clothing"
            onClick={closeMenu}
            className="
              py-3
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >
            Clothing
          </a>


          {/* SHOES */}

          <a
            href="/shop?category=Shoes"
            onClick={closeMenu}
            className="
              py-3
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >
            Shoes
          </a>


          {/* KITCHEN */}

          <a
            href="/shop?category=Kitchen"
            onClick={closeMenu}
            className="
              py-3
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >
            Kitchen
          </a>


          {/* HOUSEHOLD */}

          <a
            href="/shop?category=Household"
            onClick={closeMenu}
            className="
              py-3
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >
            Household
          </a>


          {/* NEW ARRIVALS */}

          <a
            href="#"
            onClick={closeMenu}
            className="
              py-3
              border-b
              border-[#e5dfcf]
              hover:text-[#a47f12]
              transition
            "
          >
            New Arrivals
          </a>


          {/* TODAY'S DEALS */}

          <a
            href="#"
            onClick={closeMenu}
            className="
              py-3
              text-[#a47f12]
              font-semibold
              hover:text-[#80620b]
              transition
            "
          >
            Today's Deals
          </a>

        </nav>

      </aside>


      {/* FINAL SEPARATOR */}

      <div className="border-b border-gray-300" />

    </header>
  );
}

export default Navbar;