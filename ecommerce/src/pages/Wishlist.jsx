import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

function Wishlist({ wishlist, setWishlist, setCart }) {
  const removeFromWishlist = (id) => {
    setWishlist((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-12">

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B38F00]">
            Saved products
          </p>

          <h1 className="text-3xl font-semibold text-[#171717] md:text-4xl">
            Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Products you've saved for later.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-gray-200 px-6 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f3e8]">
              <Heart size={28} className="text-[#B38F00]" />
            </div>

            <h2 className="text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Save products you love and come back to them whenever you're
              ready.
            </p>

            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black hover:bg-[#c19d25]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

            {wishlist.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >

                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">

                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <Trash2
                      size={16}
                      className="text-gray-500"
                    />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {product.category}
                  </p>

                  <Link
                    to={`/product/${product.id}`}
                    className="mt-1 block truncate text-sm font-semibold hover:text-[#B38F00]"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-2 font-semibold text-[#B38F00]">
                    KSh {product.price.toLocaleString()}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] py-2.5 text-xs font-semibold text-black hover:bg-[#c19d25]"
                  >
                    <ShoppingCart size={15} />
                    Add to cart
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;