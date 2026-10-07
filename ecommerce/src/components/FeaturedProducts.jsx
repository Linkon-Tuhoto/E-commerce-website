import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import { addToCart as addCartItem } from "../services/cartService";

function FeaturedProducts({ cart, setCart }) {
  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH TRENDING / FEATURED PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?featured=true`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch featured products"
          );
        }

        const data = await response.json();

        // Make sure we always have an array
        const products = Array.isArray(data)
          ? data
          : [];

        // Show only the first 4 featured products
        setFeaturedProducts(
          products.slice(0, 4)
        );
      } catch (err) {
        console.error(
          "Failed to fetch featured products:",
          err
        );

        setError(
          "Unable to load trending products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = (
    event,
    product
  ) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const sizes = product.sizes || [];
      const colors = product.colors || [];

      /*
        If the product has sizes, use the first
        available size.

        If it has colors, use the first color.
      */

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

      // Tell Navbar that cart changed
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
  // DISCOUNT CALCULATION
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">

          {/* HEADER */}

          <div className="flex items-end justify-between mb-7">

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
                Customer favourites
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-[#171717]">
                Trending now
              </h2>
            </div>

            <Link
              to="/shop"
              className="
                flex
                items-center
                gap-1
                text-sm
                font-medium
                text-[#171717]
                hover:text-[#b08d1f]
                transition
              "
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* LOADING SKELETON */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#e5e5e5]
                    bg-white
                    animate-pulse
                  "
                >

                  <div className="aspect-[4/4.5] bg-gray-200" />

                  <div className="p-3 sm:p-4">

                    <div className="h-3 w-16 bg-gray-200 rounded" />

                    <div className="h-4 w-32 bg-gray-200 rounded mt-2" />

                    <div className="h-3 w-20 bg-gray-200 rounded mt-3" />

                    <div className="h-4 w-24 bg-gray-200 rounded mt-3" />

                    <div className="h-9 bg-gray-200 rounded-md mt-3" />

                  </div>

                </div>
              )
            )}

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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">

          <div className="flex items-end justify-between mb-7">

            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
                Customer favourites
              </p>

              <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-[#171717]">
                Trending now
              </h2>
            </div>

            <Link
              to="/shop"
              className="
                flex
                items-center
                gap-1
                text-sm
                font-medium
                text-[#171717]
                hover:text-[#b08d1f]
              "
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
  // MAIN RENDER
  // ======================================================

  return (
    <section className="w-full bg-white">

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">

        {/* ================= HEADER ================= */}

        <div className="flex items-end justify-between mb-7">

          <div>

            <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
              Customer favourites
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-[#171717]">
              Trending now
            </h2>

          </div>

          <Link
            to="/shop"
            className="
              flex
              items-center
              gap-1
              text-sm
              font-medium
              text-[#171717]
              hover:text-[#b08d1f]
              transition
            "
          >
            View all
            <ArrowRight size={16} />
          </Link>

        </div>

        {/* ================= PRODUCTS ================= */}

        {featuredProducts.length > 0 ? (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {featuredProducts.map(
              (product) => {

                const images =
                  product.images || [];

                const sizes =
                  product.sizes || [];

                const discount =
                  getDiscount(product);

                return (

                  <div
                    key={product._id}
                    className="
                      group
                      overflow-hidden
                      rounded-xl
                      border
                      border-[#e5e5e5]
                      bg-white
                      hover:shadow-md
                      transition
                    "
                  >

                    {/* ================= IMAGE ================= */}

                    <Link
                      to={`/product/${product._id}`}
                      className="block"
                    >

                      <div className="
                        relative
                        aspect-[4/4.5]
                        bg-[#f3f3f3]
                        overflow-hidden
                      ">

                        {images.length > 0 ? (

                          <img
                            src={images[0]}
                            alt={product.name}
                            className="
                              w-full
                              h-full
                              object-cover
                              group-hover:scale-105
                              transition
                              duration-500
                            "
                          />

                        ) : (

                          <div className="
                            w-full
                            h-full
                            flex
                            items-center
                            justify-center
                            text-gray-400
                            text-sm
                          ">
                            No image
                          </div>

                        )}

                        {/* DISCOUNT / FEATURED BADGE */}

                        {discount > 0 ? (

                          <span
                            className="
                              absolute
                              top-3
                              left-3
                              bg-[#D4AF37]
                              text-black
                              text-[10px]
                              sm:text-[11px]
                              font-semibold
                              px-2
                              py-1
                              rounded-md
                            "
                          >
                            -{discount}%
                          </span>

                        ) : (

                          <span
                            className="
                              absolute
                              top-3
                              left-3
                              bg-[#D4AF37]
                              text-black
                              text-[10px]
                              sm:text-[11px]
                              font-semibold
                              px-2
                              py-1
                              rounded-md
                            "
                          >
                            Featured
                          </span>

                        )}

                        {/* WISHLIST */}

                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          className="
                            absolute
                            top-3
                            right-3
                            w-9
                            h-9
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                            shadow-sm
                            hover:bg-gray-50
                            transition
                          "
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            size={18}
                            strokeWidth={1.8}
                          />
                        </button>

                      </div>

                    </Link>

                    {/* ================= PRODUCT INFO ================= */}

                    <div className="p-3 sm:p-4">

                      {/* CATEGORY */}

                      <p className="
                        text-[10px]
                        sm:text-[11px]
                        uppercase
                        tracking-[0.12em]
                        text-gray-500
                      ">
                        {product.category}
                      </p>

                      {/* NAME */}

                      <Link
                        to={`/product/${product._id}`}
                      >
                        <h3 className="
                          mt-1
                          text-sm
                          sm:text-base
                          font-semibold
                          text-[#171717]
                          line-clamp-1
                          hover:text-[#b08d1f]
                          transition
                        ">
                          {product.name}
                        </h3>
                      </Link>

                      {/* RATING */}

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

                      {/* SIZES */}

                      {sizes.length > 0 && (

                        <div className="
                          flex
                          flex-wrap
                          gap-1.5
                          mt-2
                        ">

                          {sizes.map(
                            (size) => (

                              <span
                                key={size}
                                className="
                                  border
                                  border-gray-200
                                  rounded
                                  px-1.5
                                  py-0.5
                                  text-[9px]
                                  sm:text-[10px]
                                  text-gray-600
                                "
                              >
                                {size}
                              </span>

                            )
                          )}

                        </div>

                      )}

                      {/* PRICE */}

                      <div className="flex items-center gap-2 mt-3">

                        <span className="
                          text-sm
                          sm:text-base
                          font-semibold
                          text-[#b08d1f]
                        ">
                          KSh{" "}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </span>

                        {product.oldPrice && (

                          <span className="
                            text-[10px]
                            sm:text-xs
                            text-gray-400
                            line-through
                          ">
                            KSh{" "}
                            {Number(
                              product.oldPrice
                            ).toLocaleString()}
                          </span>

                        )}

                      </div>

                      {/* ADD TO CART */}

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
                        className="
                          w-full
                          mt-3
                          h-9
                          sm:h-10
                          rounded-md
                          bg-[#D4AF37]
                          hover:bg-[#c19d25]
                          disabled:bg-gray-300
                          disabled:cursor-not-allowed
                          text-black
                          text-xs
                          sm:text-sm
                          font-semibold
                          flex
                          items-center
                          justify-center
                          gap-2
                          transition
                        "
                      >

                        <ShoppingCart size={15} />

                        {product.inStock === false
                          ? "Out of stock"
                          : "Add to cart"}

                      </button>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        ) : (

          <div className="
            border
            border-dashed
            border-gray-300
            rounded-xl
            py-12
            text-center
          ">

            <p className="text-sm text-gray-500">
              No featured products available
              at the moment.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default FeaturedProducts;