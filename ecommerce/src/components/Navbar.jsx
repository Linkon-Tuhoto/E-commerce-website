import { useState } from "react";
import { Search, User, Heart, ShoppingCart, Menu, X} from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
};

  return (
    <header className="w-full bg-white">

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

              <div>
                <p className="text-sm font-semibold">
                  Account
                </p>

                <p className="text-xs text-gray-500">
                  Sign in
                </p>
              </div>

            </div>


            {/* ================= DESKTOP WISHLIST ================= */}
            <div className="hidden md:block shrink-0 cursor-pointer">
              <Heart
                size={22}
                className="hover:text-[#b08d1f] transition"
              />
            </div>


            {/* ================= DESKTOP CART ================= */}
            <div className="hidden md:flex items-center gap-2 shrink-0 cursor-pointer">

              <ShoppingCart size={22} />

              <div>
                <p className="text-sm font-semibold">
                  Cart
                </p>

                <p className="text-xs text-gray-500">
                  0 items
                </p>
              </div>

            </div>


            {/* ================= MOBILE CART ================= */}
            <div className="ml-auto md:hidden flex items-center gap-4">

              <div className="relative cursor-pointer">
                <ShoppingCart size={23} />

                {/* Cart count */}
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
              </div>


              {/* ================= MOBILE MENU BUTTON ================= */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                aria-label="Toggle navigation menu"
              >

                {isMenuOpen ? (
                  <X size={25} />
                ) : (
                  <Menu size={25} />
                )}

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

            <button
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

      {isMenuOpen && (

        <div className="md:hidden bg-[#f5f1e6] border-b border-[#e5dfcf]">

          <div className="max-w-[1200px] mx-auto px-4">

            <nav className="py-3 flex flex-col">

              {/* All Categories */}
              <a
                href="#"
                onClick={closeMenu}
                className="
                  flex
                  items-center
                  gap-3
                  py-3
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


              {/* Clothing */}
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
                Clothing
              </a>


              {/* Shoes */}
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
                Shoes
              </a>


              {/* Kitchen */}
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
                Kitchen
              </a>


              {/* Household */}
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
                Household
              </a>


              {/* New Arrivals */}
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


              {/* Today's Deals */}
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

          </div>

        </div>

      )}


      {/* ================= FINAL SEPARATOR ================= */}
      <div className="border-b border-gray-300" />

    </header>
  );
}

export default Navbar;