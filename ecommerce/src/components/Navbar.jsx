
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
import { useAuth } from "../context/AuthContext";

function Navbar({ cart = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localCartCount, setLocalCartCount] = useState(0);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getStoredCartCount = () => {
    try {
      const storedCart = localStorage.getItem("mamboga_cart");

      if (!storedCart) return 0;

      const parsedCart = JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) return 0;

      return parsedCart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
      );
    } catch (error) {
      console.error("Failed to read cart:", error);
      return 0;
    }
  };

  useEffect(() => {
    const updateCartCount = () => {
      const storedCount = getStoredCartCount();

      const propCount = Array.isArray(cart)
        ? cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
          )
        : 0;

      setLocalCartCount(Math.max(storedCount, propCount));
    };

    updateCartCount();

    const handleStorageChange = (event) => {
      if (event.key === "mamboga_cart") {
        updateCartCount();
      }
    };

    const handleCartUpdated = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [cart]);

  useEffect(() => {
    const checkCart = () => {
      setLocalCartCount(getStoredCartCount());
    };

    window.addEventListener("focus", checkCart);

    return () => {
      window.removeEventListener("focus", checkCart);
    };
  }, []);

  const handleAccountClick = () => {
    closeMenu();
    navigate(isAuthenticated ? "/account" : "/signin");
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-white shadow-sm">
      {/* TOP BAR */}
      <div className="hidden bg-[#171717] text-xs text-white sm:block">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-2 sm:px-6">
          <p>Free delivery in Nairobi on orders over KSh 5,000</p>

          <div className="flex items-center gap-6">
            <span>Need help?</span>
            <span>0712 345 678</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex min-h-[72px] items-center gap-4 py-3 sm:gap-8">
            {/* LOGO */}
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#D4AF37]">
                <span className="text-lg font-bold">M</span>
              </div>

              <span className="text-lg font-bold tracking-[0.15em] sm:text-xl">
                MAMBOGA
              </span>
            </Link>

            {/* DESKTOP SEARCH */}
            <div className="hidden flex-1 md:flex">
              <div className="flex w-full">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search products, categories and brands"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        const query = event.currentTarget.value.trim();

                        navigate(
                          query
                            ? `/shop?search=${encodeURIComponent(query)}`
                            : "/shop"
                        );
                      }
                    }}
                    className="h-11 w-full rounded-l-md border border-gray-300 py-2 pl-11 pr-4 text-sm outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Search products, categories and brands"]'
                    );

                    const query = input?.value?.trim();

                    navigate(
                      query
                        ? `/shop?search=${encodeURIComponent(query)}`
                        : "/shop"
                    );
                  }}
                  className="h-11 rounded-r-md bg-[#D4AF37] px-7 text-sm font-semibold transition hover:bg-[#c19d25]"
                >
                  Search
                </button>
              </div>
            </div>

            {/* DESKTOP ACCOUNT */}
            <button
              type="button"
              onClick={handleAccountClick}
              className="hidden shrink-0 cursor-pointer items-center gap-2 text-left md:flex"
            >
              <User size={21} />

              <div className="max-w-[130px]">
                <p className="truncate text-sm font-semibold">
                  {isAuthenticated
                    ? user?.name || "My Account"
                    : "Account"}
                </p>

                <p className="text-xs text-gray-500">
                  {isAuthenticated ? "View orders" : "Sign in"}
                </p>
              </div>
            </button>

            {/* DESKTOP WISHLIST */}
            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="hidden shrink-0 cursor-pointer md:block"
              aria-label="Open wishlist"
            >
              <Heart
                size={22}
                className="transition hover:text-[#b08d1f]"
              />
            </button>

            {/* DESKTOP CART */}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="hidden shrink-0 cursor-pointer items-center gap-2 text-left md:flex"
            >
              <ShoppingCart size={22} />

              <div>
                <p className="text-sm font-semibold">Cart</p>
                <p className="text-xs text-gray-500">
                  {localCartCount}{" "}
                  {localCartCount === 1 ? "item" : "items"}
                </p>
              </div>
            </button>

            {/* MOBILE CART AND MENU */}
            <div className="ml-auto flex items-center gap-4 md:hidden">
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="relative cursor-pointer"
                aria-label="Open cart"
              >
                <ShoppingCart size={23} />

                {localCartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[9px] font-bold">
                    {localCartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-gray-100"
                aria-label="Open navigation menu"
              >
                <Menu size={25} />
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div className="pb-4 md:hidden">
            <form
              className="flex w-full"
              onSubmit={(event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);
                const query = String(formData.get("search") || "").trim();

                navigate(
                  query
                    ? `/shop?search=${encodeURIComponent(query)}`
                    : "/shop"
                );
              }}
            >
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  name="search"
                  type="search"
                  placeholder="Search products..."
                  className="h-10 w-full rounded-l-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="h-10 rounded-r-md bg-[#D4AF37] px-5 text-sm font-semibold hover:bg-[#c19d25]"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* DESKTOP CATEGORY NAV */}
      <div className="hidden border-b border-[#e5dfcf] bg-[#f5f1e6] md:block">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <nav className="flex h-12 items-center gap-8 text-sm">
            <Link
              to="/shop"
              className="flex items-center gap-2 font-semibold transition hover:text-[#a47f12]"
            >
              <Menu size={18} />
              All Categories
            </Link>

            <Link
              to="/shop?category=Clothing"
              className="transition hover:text-[#a47f12]"
            >
              Clothing
            </Link>

            <Link
              to="/shop?category=Shoes"
              className="transition hover:text-[#a47f12]"
            >
              Shoes
            </Link>

            <Link
              to="/shop?category=Kitchen"
              className="transition hover:text-[#a47f12]"
            >
              Kitchen
            </Link>

            <Link
              to="/shop?category=Household"
              className="transition hover:text-[#a47f12]"
            >
              Household
            </Link>

            <Link
              to="/shop?newArrival=true"
              className="transition hover:text-[#a47f12]"
            >
              New Arrivals
            </Link>

            <Link
              to="/shop?featured=true"
              className="ml-auto font-semibold text-[#a47f12] transition hover:text-[#80620b]"
            >
              Today's Deals
            </Link>
          </nav>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 w-[86%] max-w-[390px] overflow-y-auto bg-[#f5f1e6] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        {/* DRAWER HEADER */}
        <div className="border-b border-[#e5dfcf] bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#D4AF37]">
                <span className="text-lg font-bold">M</span>
              </div>

              <span className="text-lg font-bold tracking-[0.15em]">
                MAMBOGA
              </span>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-gray-100"
              aria-label="Close navigation menu"
            >
              <X size={25} />
            </button>
          </div>
        </div>

        {/* MENU LINKS */}
        <nav className="flex flex-col px-4 py-3">
          {/* ACCOUNT */}
          <button
            type="button"
            onClick={handleAccountClick}
            className="flex items-center gap-3 border-b border-[#e5dfcf] py-4 text-left font-medium transition hover:text-[#b08d1f]"
          >
            <User size={20} />

            <div className="min-w-0">
              <p className="font-semibold">
                {isAuthenticated
                  ? user?.name || "My Account"
                  : "Account"}
              </p>

              <p className="text-xs text-gray-500">
                {isAuthenticated ? "View orders and account" : "Sign in"}
              </p>
            </div>
          </button>

          {/* CUSTOMER ACCOUNT LINKS */}
          {isAuthenticated && (
            <>
              <Link
                to="/account"
                onClick={closeMenu}
                className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
              >
                My Account
              </Link>

              <Link
                to="/account/orders"
                onClick={closeMenu}
                className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
              >
                My Orders
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="border-b border-[#e5dfcf] py-3 text-left font-medium text-red-700 transition hover:text-red-900"
              >
                Sign Out
              </button>
            </>
          )}

          {/* WISHLIST */}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/wishlist");
            }}
            className="flex items-center gap-3 border-b border-[#e5dfcf] py-4 text-left font-medium transition hover:text-[#b08d1f]"
          >
            <Heart size={20} />

            <div>
              <p className="font-semibold">Wish List</p>
              <p className="text-xs text-gray-500">Your saved products</p>
            </div>
          </button>

          {/* CART */}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              navigate("/cart");
            }}
            className="flex items-center justify-between border-b border-[#e5dfcf] py-4 text-left font-medium transition hover:text-[#b08d1f]"
          >
            <span className="flex items-center gap-3">
              <ShoppingCart size={20} />

              <span>
                <span className="block font-semibold">Cart</span>
                <span className="block text-xs text-gray-500">
                  {localCartCount}{" "}
                  {localCartCount === 1 ? "item" : "items"}
                </span>
              </span>
            </span>

            {localCartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#D4AF37] px-2 text-xs font-bold">
                {localCartCount}
              </span>
            )}
          </button>

          {/* CATEGORIES */}
          <Link
            to="/shop"
            onClick={closeMenu}
            className="flex items-center gap-3 border-b border-[#e5dfcf] py-4 font-semibold transition hover:text-[#a47f12]"
          >
            <Menu size={18} />
            All Categories
          </Link>

          <Link
            to="/shop?category=Clothing"
            onClick={closeMenu}
            className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
          >
            Clothing
          </Link>

          <Link
            to="/shop?category=Shoes"
            onClick={closeMenu}
            className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
          >
            Shoes
          </Link>

          <Link
            to="/shop?category=Kitchen"
            onClick={closeMenu}
            className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
          >
            Kitchen
          </Link>

          <Link
            to="/shop?category=Household"
            onClick={closeMenu}
            className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
          >
            Household
          </Link>

          <Link
            to="/shop?newArrival=true"
            onClick={closeMenu}
            className="border-b border-[#e5dfcf] py-3 transition hover:text-[#a47f12]"
          >
            New Arrivals
          </Link>

          <Link
            to="/shop?featured=true"
            onClick={closeMenu}
            className="py-3 font-semibold text-[#a47f12] transition hover:text-[#80620b]"
          >
            Today's Deals
          </Link>

          {!isAuthenticated && (
            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-4 rounded-lg bg-[#D4AF37] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[#c19d25]"
            >
              Create an account
            </Link>
          )}
        </nav>
      </aside>
    </header>
  );
}

export default Navbar;
