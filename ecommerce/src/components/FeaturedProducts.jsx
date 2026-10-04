import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";

function FeaturedProducts() {
  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 4);

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

            {featuredProducts.map((product) => (

              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="
                  group
                  block
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

                <div className="relative aspect-[4/4.5] bg-[#f3f3f3] overflow-hidden">

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


                  {/* DISCOUNT / FEATURED BADGE */}

                  {product.discount ? (
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
                      -{product.discount}%
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


                {/* ================= PRODUCT INFO ================= */}

                <div className="p-3 sm:p-4">

                  {/* CATEGORY */}

                  <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-gray-500">
                    {product.category}
                  </p>


                  {/* NAME */}

                  <h3 className="mt-1 text-sm sm:text-base font-semibold text-[#171717] line-clamp-1">
                    {product.name}
                  </h3>


                  {/* RATING */}

                  <div className="flex items-center gap-1 mt-2">

                    <span className="text-[#b08d1f] text-xs">
                      ★
                    </span>

                    <span className="text-xs text-gray-700">
                      {product.rating}
                    </span>

                    <span className="text-xs text-gray-400">
                      ({product.reviews})
                    </span>

                  </div>


                  {/* SIZES */}

                  {product.sizes && product.sizes.length > 0 && (

                    <div className="flex flex-wrap gap-1.5 mt-2">

                      {product.sizes.map((size) => (

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

                      ))}

                    </div>

                  )}


                  {/* PRICE */}

                  <div className="flex items-center gap-2 mt-3">

                    <span className="text-sm sm:text-base font-semibold text-[#b08d1f]">
                      KSh {product.price.toLocaleString()}
                    </span>

                    {product.oldPrice && (

                      <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                        KSh {product.oldPrice.toLocaleString()}
                      </span>

                    )}

                  </div>


                  {/* ADD TO CART */}

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="
                      w-full
                      mt-3
                      h-9
                      sm:h-10
                      rounded-md
                      bg-[#D4AF37]
                      hover:bg-[#c19d25]
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

                    Add to cart

                  </button>

                </div>

              </Link>

            ))}

          </div>

        ) : (

          <div className="border border-dashed border-gray-300 rounded-xl py-12 text-center">

            <p className="text-sm text-gray-500">
                No featured products available at the moment.
            </p>

          </div>

        )}

      </div>
    </section>
  );
}

export default FeaturedProducts;