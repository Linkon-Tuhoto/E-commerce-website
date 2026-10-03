import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
} from "lucide-react";

import { products } from "../data/products";

// =========================
// FILTER COMPONENT
// =========================

function Filters() {
  return (
    <div className="space-y-1">

      {/* CATEGORY */}
      <div className="border-b border-gray-200 pb-5">

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Category</h3>
          <Minus size={16} />
        </div>

        <div className="space-y-3">

          {[
            ["Clothing", 2],
            ["Shoes", 2],
            ["Kitchen", 2],
            ["Household", 2],
            ["Accessories", 2],
          ].map(([name, count]) => (

            <label
              key={name}
              className="flex items-center justify-between text-sm cursor-pointer"
            >

              <span className="flex items-center gap-2">

                <input
                  type="checkbox"
                  className="accent-[#D4AF37]"
                />

                {name}

              </span>

              <span className="text-xs text-gray-400">
                {count}
              </span>

            </label>

          ))}

        </div>

      </div>

      {/* OTHER FILTERS */}

      {[
        "Gender",
        "Price range",
        "Size",
        "Availability",
        "Rating",
        "Discount",
      ].map((filter) => (

        <button
          key={filter}
          type="button"
          className="
            w-full
            py-4
            border-b
            border-gray-200
            flex
            items-center
            justify-between
            text-sm
            font-semibold
          "
        >

          {filter}

          <Plus size={17} />

        </button>

      ))}

    </div>
  );
}

// =========================
// PRODUCT CARD
// =========================

function ProductCard({ product }) {
  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        overflow-hidden
        group
        hover:shadow-md
        transition
      "
    >

      {/* IMAGE */}

      <Link
        to={`/product/${product.id}`}
        className="block"
      >

        <div className="relative aspect-square bg-gray-100 overflow-hidden">

          <img
            src={product.images[0]}
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

          {/* BADGE */}

          {product.badge && (
            <span
              className="
                absolute
                top-3
                left-3
                bg-[#D4AF37]
                text-black
                text-[11px]
                font-semibold
                px-2.5
                py-1
                rounded-md
              "
            >
              {product.badge}
            </span>
          )}

          {/* WISHLIST */}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
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
            "
          >
            <Heart size={18} />
          </button>

        </div>

      </Link>

      {/* DETAILS */}

      <div className="p-4">

        {/* CATEGORY */}

        <Link
          to={`/product/${product.id}`}
          className="block"
        >

          <p className="text-[10px] tracking-wider text-gray-500 font-semibold mb-1">
            {product.category}
          </p>

          {/* NAME */}

          <h3 className="font-semibold text-sm mb-2">
            {product.name}
          </h3>

          {/* RATING */}

          <div className="flex items-center gap-1 text-xs mb-3">

            <span className="text-[#b08d1f]">
              ★
            </span>

            <span>
              {product.rating}
            </span>

            <span className="text-gray-400">
              ({product.reviews})
            </span>

          </div>

          {/* SIZES */}

          {product.sizes.length > 0 && (

            <div className="flex gap-1.5 mb-3">

              {product.sizes.map((size) => (

                <span
                  key={size}
                  className="
                    text-[10px]
                    border
                    border-gray-200
                    rounded
                    px-2
                    py-1
                    text-gray-500
                  "
                >
                  {size}
                </span>

              ))}

            </div>

          )}

          {/* PRICE */}

          <div className="flex items-center gap-2 mb-3">

            <span className="text-[#b08d1f] font-bold">
              KSh {product.price.toLocaleString()}
            </span>

            {product.oldPrice && (

              <span className="text-xs text-gray-400 line-through">
                KSh {product.oldPrice.toLocaleString()}
              </span>

            )}

          </div>

        </Link>

        {/* CART BUTTON */}

        <button
          type="button"
          className="
            w-full
            h-10
            rounded-lg
            bg-[#D4AF37]
            hover:bg-[#c19d25]
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-semibold
            transition
          "
        >

          <ShoppingCart size={16} />

          Add to cart

        </button>

      </div>

    </div>
  );
}

// =========================
// SHOP PAGE
// =========================

function Shop() {

  const [currentPage, setCurrentPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productsPerPage = 8;

  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      startIndex + productsPerPage
    );

  const changePage = (page) => {

    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };

  return (

    <main className="bg-white min-h-screen">

      {/* ================= PAGE HEADER ================= */}

      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-8 pb-6">

        <p className="text-[#b08d1f] text-[11px] font-bold tracking-widest mb-2">
          SHOP MAMBOGA
        </p>

        <div className="flex items-end justify-between gap-4">

          <div>

            <h1 className="text-3xl sm:text-4xl font-semibold">
              All products
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Browse our carefully selected products
            </p>

          </div>

          {/* SORT */}

          <select
            className="
              hidden
              sm:block
              border
              border-gray-300
              rounded-lg
              px-4
              py-2.5
              text-sm
              outline-none
            "
          >

            <option>Recommended</option>
            <option>Newest</option>
            <option>Price: Low to high</option>
            <option>Price: High to low</option>

          </select>

        </div>

        {/* MOBILE CONTROLS */}

        <div className="flex sm:hidden gap-3 mt-6">

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="
              flex-1
              border
              border-gray-300
              rounded-lg
              py-2.5
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-medium
            "
          >

            <SlidersHorizontal size={17} />

            Filters

          </button>

          <select
            className="
              flex-1
              border
              border-gray-300
              rounded-lg
              px-3
              py-2.5
              text-sm
              outline-none
            "
          >

            <option>Recommended</option>
            <option>Newest</option>
            <option>Price: Low to high</option>
            <option>Price: High to low</option>

          </select>

        </div>

      </section>

      {/* ================= PRODUCTS AREA ================= */}

      <section className="max-w-[1200px] mx-auto px-5 sm:px-6 pb-16">

        <div className="flex gap-8">

          {/* DESKTOP FILTER SIDEBAR */}

          <aside className="hidden lg:block w-[195px] shrink-0">

            <Filters />

          </aside>

          {/* PRODUCTS */}

          <div className="flex-1">

            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                gap-3
                sm:gap-5
              "
            >

              {currentProducts.map((product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))}

            </div>

            {/* ================= PAGINATION ================= */}

            <div className="mt-14 flex flex-col items-center">

              <div className="flex items-center gap-2">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                  className="
                    hidden
                    sm:flex
                    items-center
                    gap-1
                    px-3
                    py-2
                    text-sm
                    disabled:opacity-30
                  "
                >

                  <ChevronLeft size={16} />

                  Previous

                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    type="button"
                    key={page}
                    onClick={() => changePage(page)}
                    className={`
                      w-9
                      h-9
                      rounded-lg
                      text-sm
                      font-medium
                      transition

                      ${
                        currentPage === page
                          ? "bg-[#D4AF37] text-black"
                          : "border border-gray-200 hover:border-[#D4AF37]"
                      }
                    `}
                  >

                    {page}

                  </button>

                ))}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    px-3
                    py-2
                    text-sm
                    disabled:opacity-30
                  "
                >

                  Next

                  <ChevronRight size={16} />

                </button>

              </div>

              {/* DOTS */}

              <div className="flex gap-1.5 mt-5">

                {Array.from(
                  { length: totalPages },
                  (_, index) => (

                    <button
                      type="button"
                      key={index}
                      onClick={() =>
                        changePage(index + 1)
                      }
                      aria-label={`Go to page ${index + 1}`}
                      className={`
                        rounded-full
                        transition-all

                        ${
                          currentPage === index + 1
                            ? "w-5 h-1.5 bg-[#D4AF37]"
                            : "w-1.5 h-1.5 bg-gray-300"
                        }
                      `}
                    />

                  )
                )}

              </div>

              <p className="text-xs text-gray-400 mt-4">
                Page {currentPage} of {totalPages}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= MOBILE FILTER DRAWER ================= */}

      {isFilterOpen && (

        <div className="fixed inset-0 z-50 lg:hidden">

          {/* BACKDROP */}

          <div
            onClick={() => setIsFilterOpen(false)}
            className="
              absolute
              inset-0
              bg-black/40
            "
          />

          {/* PANEL */}

          <div
            className="
              absolute
              top-0
              left-0
              bottom-0
              w-[88%]
              max-w-[380px]
              bg-white
              overflow-y-auto
              shadow-xl
            "
          >

            <div
              className="
                sticky
                top-0
                bg-white
                z-10
                px-5
                py-5
                border-b
                border-gray-200
                flex
                items-center
                justify-between
              "
            >

              <h2 className="text-lg font-semibold">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
              >
                <X size={21} />
              </button>

            </div>

            <div className="p-5">

              <Filters />

              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="
                  w-full
                  mt-6
                  h-11
                  rounded-lg
                  bg-[#171717]
                  text-white
                  font-semibold
                  text-sm
                "
              >
                Apply filters
              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  );
}

export default Shop;