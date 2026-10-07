import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { addToCart as addCartItem } from "../services/cartService";

function NewArrivals({ cart, setCart }) {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH NEW ARRIVALS FROM BACKEND
  // ======================================================

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?newArrival=true`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }

        const data = await response.json();

        const products = Array.isArray(data)
          ? data
          : [];

        // Show the first 4 new arrival products
        setNewArrivals(products.slice(0, 4));
      } catch (err) {
        console.error(
          "Failed to fetch new arrivals:",
          err
        );

        setError(
          "Unable to load new arrivals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const sizes = product.sizes || [];
      const colors = product.colors || [];

      // Automatically use first available option
      const selectedSize =
        sizes.length > 0 ? sizes[0] : "";

      const selectedColor =
        colors.length > 0 ? colors[0] : null;

      const selectedImage =
        product.images?.[0] || "";

      const result = addCartItem({
        product,
        productId: product._id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        selectedImage,
      });

      if (setCart) {
        setCart(result.cart.items);
      }

      // Tell other components that the cart changed
      window.dispatchEvent(
        new Event("cartUpdated")
      );

      alert("Product added to cart");
    } catch (err) {
      console.error(
        "Failed to add product to cart:",
        err
      );

      alert(
        err.message ||
          "Unable to add product to cart"
      );
    }
  };

  // ======================================================
  // DISCOUNT
  // ======================================================

  const getDiscount = (product) => {
    if (
      product.discount !== undefined &&
      product.discount !== null
    ) {
      return product.discount;
    }

    if (
      product.oldPrice &&
      product.oldPrice > product.price
    ) {
      return Math.round(
        ((product.oldPrice - product.price) /
          product.oldPrice) *
          100
      );
    }

    return 0;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">

          {/* Heading */}

          <div className="flex items-end justify-between mb-7">

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
                Just landed
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-black">
                New arrivals
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-black hover:text-[#b08d1f] transition"
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* Loading skeleton */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white animate-pulse"
              >

                <div className="aspect-[4/4.5] bg-gray-200" />

                <div className="p-3 sm:p-4">

                  <div className="h-3 w-16 bg-gray-200 rounded" />

                  <div className="h-4 w-32 bg-gray-200 rounded mt-2" />

                  <div className="h-3 w-20 bg-gray-200 rounded mt-3" />

                  <div className="h-4 w-24 bg-gray-200 rounded mt-3" />

                  <div className="h-10 bg-gray-200 rounded-lg mt-3" />

                </div>

              </div>
            ))}

          </div>

        </div>
      </section>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <section className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">

          <div className="flex items-end justify-between mb-7">

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
                Just landed
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-black">
                New arrivals
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-black hover:text-[#b08d1f] transition"
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center">

            <p className="text-sm text-red-500">
              {error}
            </p>

          </div>

        </div>
      </section>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <section className="w-full bg-white">

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">

        {/* ================= SECTION HEADING ================= */}

        <div className="flex items-end justify-between mb-7">

          <div>

            <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
              Just landed
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-black">
              New arrivals
            </h2>

          </div>

          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-black hover:text-[#b08d1f] transition"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* ================= PRODUCTS ================= */}

        {newArrivals.length > 0 ? (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {newArrivals.map((product) => {

              const images =
                product.images || [];

              const sizes =
                product.sizes || [];

              const discount =
                getDiscount(product);

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-md transition"
                >

                  {/* ================= IMAGE ================= */}

                  <Link
                    to={`/product/${product._id}`}
                    className="relative block bg-gray-100 overflow-hidden"
                  >

                    <div className="aspect-[4/4.5]">

                      {images.length > 0 ? (

                        <img
                          src={images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          No image
                        </div>

                      )}

                    </div>

                    {/* Discount / New badge */}

                    <div className="absolute top-3 left-3">

                      {discount > 0 ? (

                        <span className="bg-[#D4AF37] text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
                          -{discount}%
                        </span>

                      ) : (

                        <span className="bg-[#D4AF37] text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
                          New
                        </span>

                      )}

                    </div>

                    {/* Wishlist */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
                      aria-label={`Add ${product.name} to wishlist`}
                    >
                      <Heart
                        size={18}
                        strokeWidth={1.8}
                      />
                    </button>

                  </Link>

                  {/* ================= PRODUCT INFORMATION ================= */}

                  <div className="p-3 sm:p-4">

                    {/* Category */}

                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                      {product.category}
                    </p>

                    {/* Product name */}

                    <Link
                      to={`/product/${product._id}`}
                    >
                      <h3 className="mt-1 text-sm sm:text-base font-semibold text-black line-clamp-1 hover:text-[#b08d1f] transition">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}

                    <div className="flex items-center gap-1 mt-2">

                      <span className="text-[#b08d1f] text-xs">
                        ★
                      </span>

                      <span className="text-xs text-gray-700">
                        {product.rating || 0}
                      </span>

                      <span className="text-xs text-gray-400">
                        ({product.reviews || 0})
                      </span>

                    </div>

                    {/* Sizes */}

                    {sizes.length > 0 && (

                      <div className="flex gap-1 mt-2 overflow-hidden">

                        {sizes.map((size) => (

                          <span
                            key={size}
                            className="min-w-[24px] h-6 px-1.5 border border-gray-200 rounded text-[10px] flex items-center justify-center text-gray-600"
                          >
                            {size}
                          </span>

                        ))}

                      </div>

                    )}

                    {/* Price */}

                    <div className="flex items-center gap-2 mt-3">

                      <span className="text-base sm:text-lg font-semibold text-[#b08d1f]">
                        KSh{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </span>

                      {product.oldPrice && (

                        <span className="text-xs text-gray-400 line-through">
                          KSh{" "}
                          {Number(
                            product.oldPrice
                          ).toLocaleString()}
                        </span>

                      )}

                    </div>

                    {/* Add to cart */}

                    <button
                      type="button"
                      onClick={(event) =>
                        handleAddToCart(
                          event,
                          product
                        )
                      }
                      disabled={
                        product.inStock === false
                      }
                      className="w-full mt-3 h-10 rounded-lg bg-[#D4AF37] text-black text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#c19d25] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >

                      <ShoppingCart size={16} />

                      {product.inStock === false
                        ? "Out of stock"
                        : "Add to cart"}

                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center">

            <p className="text-sm text-gray-500">
              No new arrivals available at the moment.
            </p>

          </div>

        )}

        {/* ================= MOBILE VIEW ALL ================= */}

        <div className="flex sm:hidden justify-center mt-7">

          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-black"
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>

    </section>
  );
}

export default NewArrivals;