import { useEffect, useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Navbar({ cart = [] }) {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [localCartCount, setLocalCartCount] =
    useState(0);

  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ======================================================
  // GET CART COUNT FROM LOCAL STORAGE
  // ======================================================

  const getStoredCartCount = () => {
    try {
      const storedCart =
        localStorage.getItem("mamboga_cart");

      if (!storedCart) {
        return 0;
      }

      const parsedCart = JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) {
        return 0;
      }

      return parsedCart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );
    } catch (error) {
      console.error(
        "Failed to read cart:",
        error
      );

      return 0;
    }
  };

  // ======================================================
  // UPDATE CART COUNT
  // ======================================================

  useEffect(() => {
    const updateCartCount = () => {
      const storedCount =
        getStoredCartCount();

      const propCount = Array.isArray(cart)
        ? cart.reduce(
            (total, item) =>
              total +
              Number(item.quantity || 0),
            0
          )
        : 0;

      /*
        Use the larger/current value so the
        navbar stays synchronized with the
        actual saved cart.
      */

      setLocalCartCount(
        Math.max(storedCount, propCount)
      );
    };

    updateCartCount();

    // Update when another browser tab changes localStorage
    const handleStorageChange = (event) => {
      if (
        event.key === "mamboga_cart"
      ) {
        updateCartCount();
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    /*
      The storage event does not fire in the
      same browser tab that changed localStorage.

      This listener allows the navbar to respond
      if another part of the application dispatches
      a cartUpdated event.
    */

    const handleCartUpdated = () => {
      updateCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );
    };
  }, [cart]);

  // ======================================================
  // ALSO CHECK CART WHEN THE ROUTE CHANGES / WINDOW FOCUS
  // ======================================================

  useEffect(() => {
    const checkCart = () => {
      setLocalCartCount(
        getStoredCartCount()
      );
    };

    window.addEventListener(
      "focus",
      checkCart
    );

    return () => {
      window.removeEventListener(
        "focus",
        checkCart
      );
    };
  }, []);

  // ======================================================
  // RENDER
  // ======================================================

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

            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-9 h-9 bg-[#D4AF37] rounded-md flex items-center justify-center">
                <span className="font-bold text-lg">
                  M
                </span>
              </div>

              <span className="text-lg sm:text-xl font-bold tracking-[0.15em]">
                MAMBOGA
              </span>
            </Link>

            {/* ================= DESKTOP SEARCH ================= */}

            <div className="hidden md:flex flex-1">

              <div className="flex w-full">

                <div className="relative flex-1">

                  <Search
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
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

            <button
              type="button"
              onClick={() =>
                navigate("/signin")
              }
              className="
                hidden
                md:flex
                items-center
                gap-2
                shrink-0
                cursor-pointer
                text-left
              "
            >
              <User size={21} />

              <div>

                <p className="text-sm font-semibold">
                  Account
                </p>

                <p className="text-xs text-gray-500">
                  Sign in
                </p>

              </div>

            </button>

            {/* ================= DESKTOP WISHLIST ================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/wishlist")
              }
              className="
                hidden
                md:block
                shrink-0
                cursor-pointer
              "
            >
              <Heart
                size={22}
                className="hover:text-[#b08d1f] transition"
              />
            </button>

            {/* ================= DESKTOP CART ================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/cart")
              }
              className="
                hidden
                md:flex
                items-center
                gap-2
                shrink-0
                cursor-pointer
                text-left
              "
            >

              <ShoppingCart size={22} />

              <div>

                <p className="text-sm font-semibold">
                  Cart
                </p>

                <p className="text-xs text-gray-500">
                  {localCartCount}{" "}
                  {localCartCount === 1
                    ? "item"
                    : "items"}
                </p>

              </div>

            </button>

            {/* ================= MOBILE CART + MENU ================= */}

            <div className="ml-auto md:hidden flex items-center gap-4">

              {/* MOBILE CART */}

              <button
                type="button"
                onClick={() =>
                  navigate("/cart")
                }
                className="relative cursor-pointer"
                aria-label="Open cart"
              >

                <ShoppingCart size={23} />

                {/* CART COUNT */}

                {localCartCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-2
                      -right-2
                      min-w-4
                      h-4
                      px-1
                      rounded-full
                      bg-[#D4AF37]
                      text-[9px]
                      font-bold
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {localCartCount}
                  </span>
                )}

              </button>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setIsMenuOpen(true)
                }
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
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
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

      {/* =================================================
          DESKTOP CATEGORY NAV
      ================================================= */}

      <div className="hidden md:block bg-[#f5f1e6] border-b border-[#e5dfcf]">

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          <nav className="h-12 flex items-center gap-8 text-sm">

            <Link
              to="/shop"
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
            </Link>

            <Link
              to="/shop?category=Clothing"
              className="hover:text-[#a47f12] transition"
            >
              Clothing
            </Link>

            <Link
              to="/shop?category=Shoes"
              className="hover:text-[#a47f12] transition"
            >
              Shoes
            </Link>

            <Link
              to="/shop?category=Kitchen"
              className="hover:text-[#a47f12] transition"
            >
              Kitchen
            </Link>

            <Link
              to="/shop?category=Household"
              className="hover:text-[#a47f12] transition"
            >
              Household
            </Link>

            <Link
              to="/shop?newArrival=true"
              className="hover:text-[#a47f12] transition"
            >
              New Arrivals
            </Link>

            <Link
              to="/shop?featured=true"
              className="
                ml-auto
                text-[#a47f12]
                font-semibold
                hover:text-[#80620b]
                transition
              "
            >
              Today's Deals
            </Link>

          </nav>

        </div>

      </div>

      {/* =================================================
          MOBILE MENU OVERLAY
      ================================================= */}

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

      {/* =================================================
          MOBILE DRAWER
      ================================================= */}

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

        {/* DRAWER HEADER */}

        <div className="bg-white border-b border-[#e5dfcf]">

          <div className="px-4 py-4 flex items-center justify-between">

            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >

              <div className="w-9 h-9 bg-[#D4AF37] rounded-md flex items-center justify-center">

                <span className="font-bold text-lg">
                  M
                </span>

              </div>

              <span className="text-lg font-bold tracking-[0.15em]">
                MAMBOGA
              </span>

            </Link>

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

        {/* MENU LINKS */}

        <nav className="px-4 py-3 flex flex-col">

          {/* ACCOUNT */}

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/signin");
            }}
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
              text-left
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

          </button>

          {/* WISHLIST */}

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/wishlist");
            }}
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
              text-left
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

          </button>

          {/* CART */}

          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/cart");
            }}
            className="
              flex
              items-center
              justify-between
              py-4
              border-b
              border-[#e5dfcf]
              font-medium
              hover:text-[#b08d1f]
              transition
              text-left
            "
          >

            <span className="flex items-center gap-3">

              <ShoppingCart size={20} />

              <div>

                <p className="font-semibold">
                  Cart
                </p>

                <p className="text-xs text-gray-500">
                  {localCartCount}{" "}
                  {localCartCount === 1
                    ? "item"
                    : "items"}
                </p>

              </div>

            </span>

            {localCartCount > 0 && (
              <span
                className="
                  min-w-6
                  h-6
                  px-2
                  rounded-full
                  bg-[#D4AF37]
                  text-xs
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {localCartCount}
              </span>
            )}

          </button>

          {/* ALL CATEGORIES */}

          <Link
            to="/shop"
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
          </Link>

          {/* CLOTHING */}

          <Link
            to="/shop?category=Clothing"
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
          </Link>

          {/* SHOES */}

          <Link
            to="/shop?category=Shoes"
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
          </Link>

          {/* KITCHEN */}

          <Link
            to="/shop?category=Kitchen"
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
          </Link>

          {/* HOUSEHOLD */}

          <Link
            to="/shop?category=Household"
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
          </Link>

          {/* NEW ARRIVALS */}

          <Link
            to="/shop?newArrival=true"
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
          </Link>

          {/* TODAY'S DEALS */}

          <Link
            to="/shop?featured=true"
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
          </Link>

        </nav>

      </aside>

      {/* FINAL SEPARATOR */}

      <div className="border-b border-gray-300" />

    </header>
  );
}

export default Navbar;