
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  LoaderCircle,
  ArrowLeft,
} from "lucide-react";

import {
  getMyWishlist,
  removeFromWishlist as removeWishlistItem,
} from "../services/wishlistService";

import {
  addToCart as addCartItem,
} from "../services/cartService";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("surveyToken");

function getProductId(product) {
  return product?._id || product?.id || product?.product?._id || product?.product?.id;
}

function normalizeWishlist(response) {
  const entries = Array.isArray(response)
    ? response
    : response?.products ||
      response?.wishlist?.products ||
      response?.wishlist?.items ||
      response?.items ||
      [];

  return entries
    .map((entry) => entry?.product || entry)
    .filter((product) => getProductId(product));
}

function Wishlist({ setCart }) {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [addingId, setAddingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchWishlist = useCallback(async () => {
    if (!getToken()) {
      navigate("/signin", {
        state: {
          from: "/wishlist",
          message: "Please sign in to view your saved products.",
        },
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getMyWishlist();
      setWishlist(normalizeWishlist(response));
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError(err.message || "Could not load your saved products.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (product) => {
    const id = getProductId(product);
    if (!id || removingId) return;

    try {
      setRemovingId(id);
      setError("");
      setNotice("");

      await removeWishlistItem(id);

      setWishlist((current) =>
        current.filter((item) => getProductId(item) !== id)
      );

      setNotice("Product removed from your wishlist.");
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      setError(err.message || "Could not remove this product.");
    } finally {
      setRemovingId("");
    }
  };

  const handleAddToCart = async (product) => {
    const id = getProductId(product);
    if (!id || addingId) return;

    try {
      setAddingId(id);
      setError("");
      setNotice("");

      const result = await addCartItem({
        product,
        productId: id,
        quantity: 1,
        size: product.sizes?.[0] || "",
        color: product.colors?.[0]
          ? {
              name: product.colors[0].name,
              value: product.colors[0].value,
            }
          : null,
        selectedImage: product.images?.[0] || product.image || "",
      });

      if (result?.cart && typeof setCart === "function") {
        setCart(result.cart.items || []);
      }

      setNotice(`${product.name || "Product"} added to your cart.`);
    } catch (err) {
      console.error("Failed to add wishlist product to cart:", err);
      setError(err.message || "Could not add this product to your cart.");
    } finally {
      setAddingId("");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-12">
        <Link
          to="/shop"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Continue shopping
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B38F00]">
            Saved products
          </p>

          <h1 className="text-3xl font-semibold text-[#171717] md:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your saved products stay linked to your account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={fetchWishlist}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {notice && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {notice}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-gray-500">
            <LoaderCircle className="mb-3 animate-spin" size={32} />
            <p>Loading your saved products...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-200 px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f3e8]">
              <Heart size={28} className="text-[#B38F00]" />
            </div>

            <h2 className="text-xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Tap the heart on products you love to save them here.
            </p>

            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black hover:bg-[#c19d25]"
            >
              Explore products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((product) => {
              const id = getProductId(product);
              const image =
                product.images?.[0] ||
                product.image ||
                product.imageUrl ||
                "";

              return (
                <article
                  key={id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Link to={`/product/${id}`}>
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || "Saved product"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          No image available
                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      disabled={removingId === id}
                      aria-label={`Remove ${product.name || "product"} from wishlist`}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm disabled:opacity-50"
                    >
                      {removingId === id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {product.category || "Product"}
                    </p>

                    <Link
                      to={`/product/${id}`}
                      className="mt-1 block truncate text-sm font-semibold hover:text-[#B38F00]"
                    >
                      {product.name || "Unnamed product"}
                    </Link>

                    <p className="mt-2 font-semibold text-[#B38F00]">
                      KSh{" "}
                      {Number(product.price || 0).toLocaleString()}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] py-2.5 text-xs font-semibold text-black hover:bg-[#c19d25] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {addingId === id ? (
                        <>
                          <LoaderCircle size={15} className="animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={15} />
                          Add to cart
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;
