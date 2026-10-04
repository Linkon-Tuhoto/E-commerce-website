import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";

function NewArrivals() {
  // Temporary selection.
  // Later the admin will control which products are New Arrivals.
  const newArrivals = products.slice(4, 8);

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">

        {/* Section heading */}
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

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-md transition"
            >
              {/* Image */}
              <Link
                to={`/product/${product.id}`}
                className="relative block bg-gray-100 overflow-hidden"
              >
                <div className="aspect-[4/4.5]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Discount / New badge */}
                <div className="absolute top-3 left-3">
                  {product.discount ? (
                    <span className="bg-[#D4AF37] text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded">
                      -{product.discount}%
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
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  <Heart size={18} strokeWidth={1.8} />
                </button>
              </Link>

              {/* Product information */}
              <div className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500">
                  {product.category}
                </p>

                <Link to={`/product/${product.id}`}>
                  <h3 className="mt-1 text-sm sm:text-base font-semibold text-black line-clamp-1 hover:text-[#b08d1f] transition">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-[#b08d1f] text-xs">★</span>

                  <span className="text-xs text-gray-700">
                    {product.rating}
                  </span>

                  <span className="text-xs text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex gap-1 mt-2 overflow-hidden">
                    {product.sizes.map((size) => (
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
                    KSh {product.price.toLocaleString()}
                  </span>

                  {product.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      KSh {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  className="w-full mt-3 h-10 rounded-lg bg-[#D4AF37] text-black text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#c19d25] transition"
                >
                  <ShoppingCart size={16} />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All */}
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