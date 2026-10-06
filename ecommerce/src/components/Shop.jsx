import { useEffect, useState } from "react";
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

import { getProducts } from "../services/productService";

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
            ["Clothing", 0],
            ["Shoes", 0],
            ["Kitchen", 0],
            ["Household", 0],
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

function ProductCard({ product, setCart }) {

  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length
      ? product.sizes[0]
      : ""
  );

  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.length
      ? product.colors[0]
      : null
  );

  const [selectedImageIndex, setSelectedImageIndex] =
    useState(0);

  const [added, setAdded] = useState(false);

  const hasSizes = product?.sizes?.length > 0;

  const hasColors = product?.colors?.length > 0;

  const hasImages = product?.images?.length > 0;

  const isAvailable =
    product?.inStock !== false &&
    (
      product?.stockQuantity === undefined ||
      product?.stockQuantity > 0
    );

  // =========================
  // COLOR CHANGE
  // =========================

  const handleColorChange = (colorName) => {

    const colorIndex = product.colors.findIndex(
      (color) => color.name === colorName
    );

    const color =
      product.colors[colorIndex] || null;

    setSelectedColor(color);

    /*
      For now, images and colors are connected
      by their position.

      Color 0 → Image 0
      Color 1 → Image 1
      Color 2 → Image 2
    */

    if (
      product.images?.length ===
      product.colors?.length &&
      colorIndex >= 0
    ) {
      setSelectedImageIndex(colorIndex);
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = () => {

    if (!isAvailable) {
      return;
    }

    if (hasSizes && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (hasColors && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    const cartItem = {
      ...product,

      selectedSize,

      selectedColor,

      selectedImage:
        product.images?.[selectedImageIndex] || "",

      quantity: 1,
    };

    setCart((currentCart = []) => {

      const existing = currentCart.find(
        (item) =>
          item._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.name ===
            selectedColor?.name
      );

      if (existing) {

        return currentCart.map((item) =>
          item._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.name ===
            selectedColor?.name
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );

      }

      return [
        ...currentCart,
        cartItem,
      ];

    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

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

      {/* =========================
          IMAGE
      ========================= */}

      <div className="relative">

        <Link
          to={`/product/${product._id}`}
          className="block"
        >

          <div
            className="
              relative
              aspect-square
              bg-gray-100
              overflow-hidden
            "
          >

            <img
              src={
                hasImages
                  ? product.images[selectedImageIndex]
                  : "https://via.placeholder.com/600"
              }
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

            {product.newArrival && (
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
                NEW
              </span>
            )}

            {!product.newArrival &&
              product.bestseller && (
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
                  BESTSELLER
                </span>
              )}

            {/* OUT OF STOCK */}

            {!isAvailable && (
              <div
                className="
                  absolute
                  inset-0
                  bg-black/40
                  flex
                  items-center
                  justify-center
                "
              >

                <span
                  className="
                    bg-white
                    px-3
                    py-1.5
                    rounded-md
                    text-xs
                    font-semibold
                  "
                >
                  Out of stock
                </span>

              </div>
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

        {/* =========================
            IMAGE THUMBNAILS
        ========================= */}

        {product?.images?.length > 1 && (

          <div
            className="
              flex
              gap-2
              px-3
              py-2
              overflow-x-auto
            "
          >

            {product.images.map(
              (image, index) => (

                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex(index)
                  }
                  className={`
                    w-12
                    h-12
                    shrink-0
                    rounded-md
                    overflow-hidden
                    border-2
                    transition

                    ${
                      selectedImageIndex === index
                        ? "border-[#D4AF37]"
                        : "border-transparent"
                    }
                  `}
                >

                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </button>

              )
            )}

          </div>

        )}

      </div>

      {/* =========================
          DETAILS
      ========================= */}

      <div className="p-4">

        <Link
          to={`/product/${product._id}`}
          className="block"
        >

          {/* CATEGORY */}

          <p
            className="
              text-[10px]
              tracking-wider
              text-gray-500
              font-semibold
              mb-1
            "
          >
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
              {product.rating || 0}
            </span>

            <span className="text-gray-400">
              ({product.reviews || 0})
            </span>

          </div>

        </Link>

        {/* =========================
            SIZE
        ========================= */}

        {hasSizes && (

          <div className="mb-3">

            <label
              className="
                block
                text-[11px]
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Size
            </label>

            <select
              value={selectedSize}
              onChange={(e) =>
                setSelectedSize(e.target.value)
              }
              className="
                w-full
                border
                border-gray-200
                rounded-lg
                px-2.5
                py-2
                text-xs
                outline-none
                focus:border-[#D4AF37]
              "
            >

              {product.sizes.map(
                (size) => (

                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>

                )
              )}

            </select>

          </div>

        )}

        {/* =========================
            COLOR
        ========================= */}

        {hasColors && (

          <div className="mb-3">

            <label
              className="
                block
                text-[11px]
                font-semibold
                text-gray-600
                mb-1.5
              "
            >
              Color
            </label>

            <select
              value={
                selectedColor?.name || ""
              }
              onChange={(e) =>
                handleColorChange(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-200
                rounded-lg
                px-2.5
                py-2
                text-xs
                outline-none
                focus:border-[#D4AF37]
              "
            >

              {product.colors.map(
                (color) => (

                  <option
                    key={color.name}
                    value={color.name}
                  >
                    {color.name}
                  </option>

                )
              )}

            </select>

          </div>

        )}

        {/* =========================
            PRICE
        ========================= */}

        <div className="flex items-center gap-2 mb-3">

          <span
            className="
              text-[#b08d1f]
              font-bold
            "
          >
            KSh{" "}
            {Number(
              product.price || 0
            ).toLocaleString()}
          </span>

          {product.oldPrice && (

            <span
              className="
                text-xs
                text-gray-400
                line-through
              "
            >
              KSh{" "}
              {Number(
                product.oldPrice
              ).toLocaleString()}
            </span>

          )}

        </div>

        {/* =========================
            ADD TO CART
        ========================= */}

        <button
          type="button"
          onClick={addToCart}
          disabled={!isAvailable}
          className="
            w-full
            h-10
            rounded-lg
            bg-[#D4AF37]
            hover:bg-[#c19d25]
            disabled:bg-gray-200
            disabled:text-gray-400
            disabled:cursor-not-allowed
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

          {!isAvailable
            ? "Out of stock"
            : added
            ? "Added to cart ✓"
            : "Add to cart"}

        </button>

      </div>

    </div>
  );
}

// =========================
// SHOP PAGE
// =========================

function Shop({ cart, setCart }) {

  const [products, setProducts] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [isFilterOpen, setIsFilterOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const productsPerPage = 8;

  // =========================
  // FETCH PRODUCTS
  // =========================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getProducts();

        setProducts(data);

      } catch (error) {

        console.error(
          "Failed to load products:",
          error
        );

        setError(
          "Failed to load products. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      products.length /
        productsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    productsPerPage;

  const currentProducts =
    products.slice(
      startIndex,
      startIndex +
        productsPerPage
    );

  const changePage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) {
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

      {/* =========================
          PAGE HEADER
      ========================= */}

      <section
        className="
          max-w-[1200px]
          mx-auto
          px-5
          sm:px-6
          pt-8
          pb-6
        "
      >

        <p
          className="
            text-[#b08d1f]
            text-[11px]
            font-bold
            tracking-widest
            mb-2
          "
        >
          SHOP MAMBOGA
        </p>

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-3xl
                sm:text-4xl
                font-semibold
              "
            >
              All products
            </h1>

            <p
              className="
                text-gray-500
                text-sm
                mt-2
              "
            >
              Browse our carefully selected products
            </p>

          </div>

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
            <option>
              Recommended
            </option>

            <option>
              Newest
            </option>

            <option>
              Price: Low to high
            </option>

            <option>
              Price: High to low
            </option>

          </select>

        </div>

        {/* MOBILE CONTROLS */}

        <div
          className="
            flex
            sm:hidden
            gap-3
            mt-6
          "
        >

          <button
            type="button"
            onClick={() =>
              setIsFilterOpen(true)
            }
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

            <SlidersHorizontal
              size={17}
            />

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

            <option>
              Recommended
            </option>

            <option>
              Newest
            </option>

            <option>
              Price: Low to high
            </option>

            <option>
              Price: High to low
            </option>

          </select>

        </div>

      </section>

      {/* =========================
          PRODUCTS
      ========================= */}

      <section
        className="
          max-w-[1200px]
          mx-auto
          px-5
          sm:px-6
          pb-16
        "
      >

        <div className="flex gap-8">

          {/* FILTER */}

          <aside
            className="
              hidden
              lg:block
              w-[195px]
              shrink-0
            "
          >

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

              {/* LOADING */}

              {loading && (

                <div
                  className="
                    col-span-full
                    flex
                    justify-center
                    py-20
                  "
                >

                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>

                </div>

              )}

              {/* ERROR */}

              {!loading &&
                error && (

                  <div
                    className="
                      col-span-full
                      flex
                      justify-center
                      py-20
                    "
                  >

                    <div className="text-center">

                      <p
                        className="
                          text-sm
                          text-red-500
                          mb-4
                        "
                      >
                        {error}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          window.location.reload()
                        }
                        className="
                          bg-[#D4AF37]
                          hover:bg-[#c19d25]
                          px-4
                          py-2
                          rounded-lg
                          text-sm
                          font-semibold
                        "
                      >
                        Try again
                      </button>

                    </div>

                  </div>

                )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                currentProducts.length === 0 && (

                  <div
                    className="
                      col-span-full
                      flex
                      justify-center
                      py-20
                    "
                  >

                    <div className="text-center">

                      <p className="text-gray-500 text-sm">
                        No products available.
                      </p>

                      <p
                        className="
                          text-gray-400
                          text-xs
                          mt-1
                        "
                      >
                        Products added by the admin will appear here.
                      </p>

                    </div>

                  </div>

                )}

              {/* PRODUCTS */}

              {!loading &&
                !error &&
                currentProducts.map(
                  (product) => (

                    <ProductCard
                      key={product._id}
                      product={product}
                      cart={cart}
                      setCart={setCart}
                    />

                  )
                )}

            </div>

            {/* PAGINATION */}

            {!loading &&
              !error &&
              products.length > 0 && (

                <div
                  className="
                    mt-14
                    flex
                    flex-col
                    items-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        changePage(
                          currentPage - 1
                        )
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

                      <ChevronLeft
                        size={16}
                      />

                      Previous

                    </button>

                    {Array.from(
                      {
                        length:
                          totalPages,
                      },
                      (_, index) =>
                        index + 1
                    ).map((page) => (

                      <button
                        type="button"
                        key={page}
                        onClick={() =>
                          changePage(page)
                        }
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

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        changePage(
                          currentPage + 1
                        )
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

                      <ChevronRight
                        size={16}
                      />

                    </button>

                  </div>

                  <p
                    className="
                      text-xs
                      text-gray-400
                      mt-4
                    "
                  >
                    Page {currentPage} of{" "}
                    {totalPages}
                  </p>

                </div>

              )}

          </div>

        </div>

      </section>

      {/* =========================
          MOBILE FILTER
      ========================= */}

      {isFilterOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >

          <div
            onClick={() =>
              setIsFilterOpen(false)
            }
            className="
              absolute
              inset-0
              bg-black/40
            "
          />

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
                onClick={() =>
                  setIsFilterOpen(false)
                }
              >
                <X size={21} />
              </button>

            </div>

            <div className="p-5">

              <Filters />

              <button
                type="button"
                onClick={() =>
                  setIsFilterOpen(false)
                }
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