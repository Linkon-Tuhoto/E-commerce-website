import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Search,
  Package,
  RefreshCw,
} from "lucide-react";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (category !== "All") {
        params.category = category;
      }

      const data = await getProducts(params);

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(
        "Unable to load products. Please check your backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever category changes
  useEffect(() => {
    fetchProducts();
  }, [category]);

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      // Remove deleted product from current list
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert("Failed to delete product.");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // ==========================================
  // DISCOUNT CALCULATION
  // ==========================================

  const getDiscount = (price, oldPrice) => {
    if (!oldPrice || oldPrice <= price) {
      return null;
    }

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-xs font-semibold tracking-widest text-[#b08d1f] uppercase">
              Administration
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              Products
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Add, edit and manage products in your store.
            </p>
          </div>

          <Link to="/admin/products/new"
            className="
              flex items-center justify-center gap-2
              bg-[#D4AF37]
              hover:bg-[#c19d25]
              text-black
              px-4 py-2.5
              rounded-lg
              font-medium
              text-sm
              transition
              w-full sm:w-auto
            "
          >
            <Plus size={18} />
            Add Product
          </Link>

        </div>

        {/* ================================= */}
        {/* FILTER BAR */}
        {/* ================================= */}

        <div className="bg-white border rounded-xl p-4 mb-5">

          <div className="flex flex-col md:flex-row gap-3">

            {/* Search */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  border
                  rounded-lg
                  pl-10
                  pr-4
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-[#D4AF37]
                "
              />

            </div>

            {/* Category */}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                border
                rounded-lg
                px-4
                py-2.5
                text-sm
                bg-white
                outline-none
                focus:border-[#D4AF37]
              "
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Household">Household</option>
            </select>

            {/* Refresh */}

            <button
              onClick={fetchProducts}
              className="
                flex
                items-center
                justify-center
                gap-2
                border
                rounded-lg
                px-4
                py-2.5
                text-sm
                hover:bg-gray-50
                transition
              "
            >
              <RefreshCw size={17} />
              Refresh
            </button>

          </div>

        </div>

        {/* ================================= */}
        {/* PRODUCT COUNT */}
        {/* ================================= */}

        {!loading && !error && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Package size={16} />

            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>
          </div>
        )}

        {/* ================================= */}
        {/* ERROR */}
        {/* ================================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* ================================= */}
        {/* LOADING */}
        {/* ================================= */}

        {loading && (
          <div className="bg-white border rounded-xl p-12 text-center">

            <RefreshCw
              size={24}
              className="mx-auto animate-spin text-[#D4AF37]"
            />

            <p className="text-sm text-gray-500 mt-3">
              Loading products...
            </p>

          </div>
        )}

        {/* ================================= */}
        {/* EMPTY */}
        {/* ================================= */}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="bg-white border rounded-xl p-12 text-center">

              <Package
                size={40}
                className="mx-auto text-gray-300"
              />

              <h2 className="font-medium mt-4">
                No products found
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Try another search or category.
              </p>

            </div>
          )}

        {/* ================================= */}
        {/* PRODUCTS */}
        {/* ================================= */}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="bg-white border rounded-xl overflow-hidden">

              <div className="divide-y">

                {filteredProducts.map((product) => {
                  const discount = getDiscount(
                    product.price,
                    product.oldPrice
                  );

                  return (
                    <div
                      key={product._id}
                      className="
                        p-4
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        gap-4
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* ===================== */}
                      {/* IMAGE */}
                      {/* ===================== */}

                      <div
                        className="
                          w-20
                          h-20
                          rounded-lg
                          overflow-hidden
                          bg-gray-100
                          flex-shrink-0
                        "
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* ===================== */}
                      {/* PRODUCT INFO */}
                      {/* ===================== */}

                      <div className="flex-1 min-w-0">

                        <h2 className="font-medium truncate">
                          {product.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-0.5">
                          {product.category}
                          {" · "}
                          {product.gender}
                        </p>

                        {/* Price */}

                        <div className="flex flex-wrap items-center gap-2 mt-1">

                          <span className="font-semibold">
                            KSh{" "}
                            {Number(product.price).toLocaleString()}
                          </span>

                          {product.oldPrice && (
                            <>
                              <span className="text-sm text-gray-400 line-through">
                                KSh{" "}
                                {Number(
                                  product.oldPrice
                                ).toLocaleString()}
                              </span>

                              {discount && (
                                <span className="text-xs font-medium text-green-600">
                                  {discount}% OFF
                                </span>
                              )}
                            </>
                          )}

                        </div>

                        {/* Tags */}

                        <div className="flex flex-wrap gap-2 mt-2">

                          {product.featured && (
                            <span className="flex items-center gap-1 text-xs bg-yellow-50 text-[#a17d08] px-2 py-1 rounded-full">
                              <Star
                                size={12}
                                fill="currentColor"
                              />
                              Featured
                            </span>
                          )}

                          {product.newArrival && (
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                              New
                            </span>
                          )}

                          {product.bestseller && (
                            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                              Bestseller
                            </span>
                          )}

                        </div>

                      </div>

                      {/* ===================== */}
                      {/* STOCK */}
                      {/* ===================== */}

                      <div className="sm:w-28">

                        <p
                          className={`text-sm font-medium ${
                            product.inStock &&
                            product.stockQuantity > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {product.inStock &&
                          product.stockQuantity > 0
                            ? "In stock"
                            : "Out of stock"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {product.stockQuantity || 0} available
                        </p>

                      </div>

                      {/* ===================== */}
                      {/* ACTIONS */}
                      {/* ===================== */}

                      <div className="flex items-center gap-2">

                        {/* Edit */}

                        <Link   to={`/admin/products/edit/${product._id}`}
                          className="
                            p-2
                            rounded-lg
                            border
                            text-gray-600
                            hover:bg-gray-100
                            transition
                          "
                          title="Edit product"
                        >
                          <Pencil size={17} />
                        </Link>

                        {/* Delete */}

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="
                            p-2
                            rounded-lg
                            border
                            border-red-100
                            text-red-500
                            hover:bg-red-50
                            transition
                          "
                          title="Delete product"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          )}

      </div>
    </div>
  );
}

export default AdminProducts;