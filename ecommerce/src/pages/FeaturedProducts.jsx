import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

import { addToCart as addCartItem } from "../services/cartService";

function FeaturedProducts({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH ALL PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Failed to fetch products:",
          err
        );

        setError(
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
  // SORT PRODUCTS
  // FEATURED FIRST, THEN OTHER PRODUCTS
  // ======================================================

  const featuredProducts = products.filter(
    (product) => product.featured === true
  );

  const otherProducts = products.filter(
    (product) => product.featured !== true
  );

  // ======================================================
  // PRODUCT CARD
  // ======================================================

  const ProductCard = ({ product }) => {
    const images = product.images || [];
    const sizes = product.sizes || [];
    const discount = getDiscount(product);

    return (
      <div
        className="
          group
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          hover:shadow-md
          transition
        "
      >

        {/* IMAGE */}

        <Link
          to={`/product/${product._id}`}
          className="
            relative
            block
            bg-gray-100
            overflow-hidden
          "
        >

          <div className="aspect-[4/4.5]">

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
                text-sm
                text-gray-400
              ">
                No image
              </div>

            )}

          </div>

          {/* BADGE */}

          <div className="absolute top-3 left-3">

            {discount > 0 ? (

              <span className="
                bg-[#D4AF37]
                text-black
                text-[10px]
                sm:text-xs
                font-semibold
                px-2
                py-1
                rounded
              ">
                -{discount}%
              </span>

            ) : product.featured ? (

              <span className="
                bg-[#D4AF37]
                text-black
                text-[10px]
                sm:text-xs
                font-semibold
                px-2
                py-1
                rounded
              ">
                Featured
              </span>

            ) : null}

          </div>

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
            aria-label={`Add ${product.name} to wishlist`}
          >
            <Heart
              size={18}
              strokeWidth={1.8}
            />
          </button>

        </Link>

        {/* PRODUCT INFORMATION */}

        <div className="p-3 sm:p-4">

          <p className="
            text-[10px]
            sm:text-xs
            uppercase
            tracking-wider
            text-gray-500
          ">
            {product.category}
          </p>

          <Link
            to={`/product/${product._id}`}
          >
            <h3 className="
              mt-1
              text-sm
              sm:text-base
              font-semibold
              text-black
              line-clamp-1
              hover:text-[#b08d1f]
              transition
            ">
              {product.name}
            </h3>
          </Link>

          {/* RATING */}

          <div className="
            flex
            items-center
            gap-1
            mt-2
          ">

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
              gap-1
              mt-2
              overflow-hidden
            ">

              {sizes.map((size) => (

                <span
                  key={size}
                  className="
                    min-w-[24px]
                    h-6
                    px-1.5
                    border
                    border-gray-200
                    rounded
                    text-[10px]
                    flex
                    items-center
                    justify-center
                    text-gray-600
                  "
                >
                  {size}
                </span>

              ))}

            </div>

          )}

          {/* PRICE */}

          <div className="
            flex
            items-center
            gap-2
            mt-3
          ">

            <span className="
              text-base
              sm:text-lg
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
                text-xs
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
              h-10
              rounded-lg
              bg-[#D4AF37]
              text-black
              text-xs
              sm:text-sm
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#c19d25]
              disabled:bg-gray-300
              disabled:cursor-not-allowed
              transition
            "
          >

            <ShoppingCart size={16} />

            {product.inStock === false
              ? "Out of stock"
              : "Add to cart"}

          </button>

        </div>

      </div>
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">

        <div className="
          h-8
          w-64
          bg-gray-200
          rounded
          animate-pulse
        " />

        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-3
          sm:gap-4
          mt-8
        ">

          {[1, 2, 3, 4].map((item) => (

            <div
              key={item}
              className="
                rounded-xl
                border
                border-gray-200
                overflow-hidden
                animate-pulse
              "
            >

              <div className="
                aspect-[4/4.5]
                bg-gray-200
              " />

              <div className="p-4">

                <div className="
                  h-3
                  w-16
                  bg-gray-200
                  rounded
                " />

                <div className="
                  h-4
                  w-32
                  bg-gray-200
                  rounded
                  mt-2
                " />

                <div className="
                  h-4
                  w-20
                  bg-gray-200
                  rounded
                  mt-4
                " />

              </div>

            </div>

          ))}

        </div>

      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="
        max-w-[1200px]
        mx-auto
        px-4
        sm:px-6
        py-16
        text-center
      ">

        <p className="text-red-500">
          {error}
        </p>

      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <section className="w-full bg-white">

      <div className="
        max-w-[1200px]
        mx-auto
        px-4
        sm:px-6
        py-10
      ">

        {/* BACK */}

        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-gray-600
            hover:text-[#b08d1f]
            transition
            mb-8
          "
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* PAGE TITLE */}

        <div className="mb-10">

          <p className="
            text-xs
            font-semibold
            tracking-[0.18em]
            text-[#b08d1f]
            uppercase
          ">
            Customer favourites
          </p>

          <h1 className="
            mt-2
            text-3xl
            sm:text-4xl
            font-medium
            text-black
          ">
            Featured products
          </h1>

          <p className="
            mt-2
            text-sm
            text-gray-500
            max-w-xl
          ">
            Discover products our customers are
            loving right now.
          </p>

        </div>

        {/* ==================================================
            FEATURED PRODUCTS
        ================================================== */}

        {featuredProducts.length > 0 && (

          <section>

            <div className="
              flex
              items-center
              justify-between
              mb-5
            ">

              <h2 className="
                text-xl
                sm:text-2xl
                font-semibold
                text-black
              ">
                Featured
              </h2>

              <span className="
                text-xs
                sm:text-sm
                text-gray-500
              ">
                {/*{featuredProducts.length} products*/}
              </span>

            </div>

            <div className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-3
              sm:gap-4
            ">

              {featuredProducts.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                )
              )}

            </div>

          </section>

        )}

        {/* ==================================================
            OTHER PRODUCTS
        ================================================== */}

        {otherProducts.length > 0 && (

          <section className="mt-16">

            <div className="
              flex
              items-center
              justify-between
              mb-5
            ">

              <div>

                <p className="
                  text-xs
                  font-semibold
                  tracking-[0.15em]
                  text-gray-500
                  uppercase
                ">
                  More to explore
                </p>

                <h2 className="
                  mt-1
                  text-xl
                  sm:text-2xl
                  font-semibold
                  text-black
                ">
                  More products
                </h2>

              </div>

              <span className="
                text-xs
                sm:text-sm
                text-gray-500
              ">
                {otherProducts.length} products
              </span>

            </div>

            <div className="
              grid
              grid-cols-2
              lg:grid-cols-4
              gap-3
              sm:gap-4
            ">

              {otherProducts.map(
                (product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                )
              )}

            </div>

          </section>

        )}

        {/* NO PRODUCTS */}

        {products.length === 0 && (

          <div className="
            border
            border-dashed
            border-gray-300
            rounded-xl
            py-16
            text-center
          ">

            <p className="text-gray-500">
              No products available yet.
            </p>

          </div>

        )}

      </div>

    </section>
  );
}

export default FeaturedProducts;