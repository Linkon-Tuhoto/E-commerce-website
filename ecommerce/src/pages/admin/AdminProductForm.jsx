import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, ImagePlus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";

function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "Clothing",
    gender: "Unisex",
    description: "",
    price: "",
    oldPrice: "",
    stockQuantity: "",
    featured: false,
    newArrival: false,
    bestseller: false,
  });

  const [images, setImages] = useState([""]);

  const [sizes, setSizes] = useState([""]);

  const [colors, setColors] = useState([
    {
      name: "",
      value: "",
    },
  ]);

  // ==========================================
  // LOAD PRODUCT WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (!isEditMode) return;

    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setError("");

        const product = await getProductById(id);

        setFormData({
          name: product.name || "",
          brand: product.brand || "",
          sku: product.sku || "",
          category: product.category || "Clothing",
          gender: product.gender || "Unisex",
          description: product.description || "",
          price: product.price ?? "",
          oldPrice: product.oldPrice ?? "",
          stockQuantity: product.stockQuantity ?? "",
          featured: product.featured || false,
          newArrival: product.newArrival || false,
          bestseller: product.bestseller || false,
        });

        setImages(
          product.images?.length
            ? product.images
            : [""]
        );

        setSizes(
          product.sizes?.length
            ? product.sizes
            : [""]
        );

        setColors(
          product.colors?.length
            ? product.colors
            : [
                {
                  name: "",
                  value: "",
                },
              ]
        );
      } catch (error) {
        console.error("Failed to load product:", error);

        setError(
          error.message || "Failed to load product."
        );
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [id, isEditMode]);

  // ==========================================
  // NORMAL INPUTS
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // IMAGES
  // ==========================================

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];

    updatedImages[index] = value;

    setImages(updatedImages);
  };

  const addImage = () => {
    setImages((current) => [...current, ""]);
  };

  const removeImage = (index) => {
    if (images.length === 1) return;

    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  // ==========================================
  // SIZES
  // ==========================================

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];

    updatedSizes[index] = value;

    setSizes(updatedSizes);
  };

  const addSize = () => {
    setSizes((current) => [...current, ""]);
  };

  const removeSize = (index) => {
    if (sizes.length === 1) return;

    setSizes((current) =>
      current.filter((_, sizeIndex) => sizeIndex !== index)
    );
  };

  // ==========================================
  // COLORS
  // ==========================================

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...colors];

    updatedColors[index] = {
      ...updatedColors[index],
      [field]: value,
    };

    setColors(updatedColors);
  };

  const addColor = () => {
    setColors((current) => [
      ...current,
      {
        name: "",
        value: "",
      },
    ]);
  };

  const removeColor = (index) => {
    if (colors.length === 1) return;

    setColors((current) =>
      current.filter((_, colorIndex) => colorIndex !== index)
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const cleanedImages = images
      .map((image) => image.trim())
      .filter(Boolean);

    const cleanedSizes = sizes
      .map((size) => size.trim())
      .filter(Boolean);

    const cleanedColors = colors
      .map((color) => ({
        name: color.name.trim(),
        value: color.value.trim(),
      }))
      .filter((color) => color.name && color.value);

    // Validation

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    if (cleanedImages.length === 0) {
      setError("Please add at least one product image.");
      return;
    }

    if (
      formData.oldPrice &&
      Number(formData.oldPrice) < Number(formData.price)
    ) {
      setError(
        "Old price should be greater than or equal to the current price."
      );
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name.trim(),

        brand: formData.brand.trim(),

        sku: formData.sku.trim() || undefined,

        category: formData.category,

        gender: formData.gender,

        description: formData.description.trim(),

        price: Number(formData.price),

        oldPrice: formData.oldPrice
          ? Number(formData.oldPrice)
          : null,

        images: cleanedImages,

        sizes: cleanedSizes,

        colors: cleanedColors,

        stockQuantity: formData.stockQuantity
          ? Number(formData.stockQuantity)
          : 0,

        inStock:
          formData.stockQuantity &&
          Number(formData.stockQuantity) > 0,

        featured: formData.featured,

        newArrival: formData.newArrival,

        bestseller: formData.bestseller,

        tags: [],
      };

      if (isEditMode) {
        // UPDATE EXISTING PRODUCT
        await updateProduct(id, productData);
      } else {
        // CREATE NEW PRODUCT
        await createProduct(productData);
      }

      navigate("/admin/products");

    } catch (error) {
      console.error(
        isEditMode
          ? "Failed to update product:"
          : "Failed to create product:",
        error
      );

      setError(
        error.message ||
          (isEditMode
            ? "Failed to update product."
            : "Failed to create product.")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING PRODUCT
  // ==========================================

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="
            w-8 h-8
            border-4
            border-gray-200
            border-t-[#D4AF37]
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="text-sm text-gray-500 mt-3">
            Loading product...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-8">

          <Link
            to="/admin/products"
            className="
              p-2
              rounded-lg
              border
              bg-white
              hover:bg-gray-100
              transition
            "
          >
            <ArrowLeft size={18} />
          </Link>

          <div>

            <p className="
              text-xs
              font-semibold
              tracking-widest
              text-[#b08d1f]
              uppercase
            ">
              Administration
            </p>

            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update this product's information."
                : "Add a new product to your store."}
            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="
            mb-6
            bg-red-50
            border
            border-red-200
            text-red-600
            rounded-xl
            p-4
            text-sm
          ">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* =====================================
              BASIC INFORMATION
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <h2 className="text-lg font-semibold mb-5">
              Basic Information
            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              {/* NAME */}

              <div className="md:col-span-2">

                <label className="label">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Essential Linen Shirt"
                  className="input"
                />

              </div>

              {/* BRAND */}

              <div>

                <label className="label">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Mamboga"
                  className="input"
                />

              </div>

              {/* SKU */}

              <div>

                <label className="label">
                  SKU
                </label>

                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="e.g. SHIRT-001"
                  className="input"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="label">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input bg-white"
                >
                  <option value="Clothing">
                    Clothing
                  </option>

                  <option value="Shoes">
                    Shoes
                  </option>

                  <option value="Kitchen">
                    Kitchen
                  </option>

                  <option value="Household">
                    Household
                  </option>
                </select>

              </div>

              {/* GENDER */}

              <div>

                <label className="label">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input bg-white"
                >
                  <option value="Unisex">
                    Unisex
                  </option>

                  <option value="Men">
                    Men
                  </option>

                  <option value="Women">
                    Women
                  </option>

                  <option value="Kids">
                    Kids
                  </option>
                </select>

              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="label">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the product..."
                  className="input resize-none"
                />

              </div>

            </div>

          </section>


          {/* =====================================
              PRICING
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <h2 className="text-lg font-semibold mb-5">
              Pricing & Stock
            </h2>

            <div className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
            ">

              <div>

                <label className="label">
                  Price (KSh) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Old Price (KSh)
                </label>

                <input
                  type="number"
                  name="oldPrice"
                  value={formData.oldPrice}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />

              </div>

              <div>

                <label className="label">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="input"
                />

              </div>

            </div>

          </section>


          {/* =====================================
              IMAGES
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-5
            ">

              <div>

                <h2 className="text-lg font-semibold">
                  Product Images
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add image URLs for this product.
                </p>

              </div>

              <ImagePlus
                size={22}
                className="text-[#D4AF37]"
              />

            </div>

            <div className="space-y-3">

              {images.map((image, index) => (

                <div
                  key={index}
                  className="flex gap-2"
                >

                  <input
                    type="url"
                    value={image}
                    onChange={(e) =>
                      handleImageChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="https://example.com/image.jpg"
                    className="input flex-1"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeImage(index)
                    }
                    disabled={images.length === 1}
                    className="
                      p-2.5
                      rounded-lg
                      border
                      text-red-500
                      hover:bg-red-50
                      disabled:opacity-40
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

            <button
              type="button"
              onClick={addImage}
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#a17d08]
              "
            >
              <Plus size={17} />
              Add another image
            </button>

          </section>


          {/* =====================================
              SIZES
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <h2 className="text-lg font-semibold">
              Sizes
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Add sizes if the product has size variations.
            </p>

            <div className="space-y-3">

              {sizes.map((size, index) => (

                <div
                  key={index}
                  className="flex gap-2"
                >

                  <input
                    type="text"
                    value={size}
                    onChange={(e) =>
                      handleSizeChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="e.g. M"
                    className="input flex-1"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSize(index)
                    }
                    disabled={sizes.length === 1}
                    className="
                      p-2.5
                      rounded-lg
                      border
                      text-red-500
                      hover:bg-red-50
                      disabled:opacity-40
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

            <button
              type="button"
              onClick={addSize}
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#a17d08]
              "
            >
              <Plus size={17} />
              Add size
            </button>

          </section>


          {/* =====================================
              COLORS
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <h2 className="text-lg font-semibold">
              Colors
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Add available product colors.
            </p>

            <div className="space-y-3">

              {colors.map((color, index) => (

                <div
                  key={index}
                  className="
                    grid
                    grid-cols-[1fr_1fr_auto]
                    gap-2
                  "
                >

                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) =>
                      handleColorChange(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Color name"
                    className="input"
                  />

                  <input
                    type="text"
                    value={color.value}
                    onChange={(e) =>
                      handleColorChange(
                        index,
                        "value",
                        e.target.value
                      )
                    }
                    placeholder="#000000"
                    className="input"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeColor(index)
                    }
                    disabled={colors.length === 1}
                    className="
                      p-2.5
                      rounded-lg
                      border
                      text-red-500
                      hover:bg-red-50
                      disabled:opacity-40
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

            <button
              type="button"
              onClick={addColor}
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                font-medium
                text-[#a17d08]
              "
            >
              <Plus size={17} />
              Add color
            </button>

          </section>


          {/* =====================================
              STORE SETTINGS
          ====================================== */}

          <section className="
            bg-white
            border
            rounded-xl
            p-5
            sm:p-6
          ">

            <h2 className="text-lg font-semibold mb-5">
              Store Settings
            </h2>

            <div className="space-y-4">

              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mt-1 accent-[#D4AF37]"
                />

                <div>
                  <p className="font-medium text-sm">
                    Featured Product
                  </p>

                  <p className="text-xs text-gray-500">
                    Show this product in featured products.
                  </p>
                </div>

              </label>


              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                  className="mt-1 accent-[#D4AF37]"
                />

                <div>
                  <p className="font-medium text-sm">
                    New Arrival
                  </p>

                  <p className="text-xs text-gray-500">
                    Mark this product as a new arrival.
                  </p>
                </div>

              </label>


              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="bestseller"
                  checked={formData.bestseller}
                  onChange={handleChange}
                  className="mt-1 accent-[#D4AF37]"
                />

                <div>
                  <p className="font-medium text-sm">
                    Bestseller
                  </p>

                  <p className="text-xs text-gray-500">
                    Mark this product as a bestseller.
                  </p>
                </div>

              </label>

            </div>

          </section>


          {/* =====================================
              ACTIONS
          ====================================== */}

          <div className="
            flex
            flex-col
            sm:flex-row
            justify-end
            gap-3
          ">

            <Link
              to="/admin/products"
              className="
                px-5
                py-2.5
                rounded-lg
                border
                bg-white
                text-sm
                font-medium
                text-center
                hover:bg-gray-50
                transition
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="
                px-6
                py-2.5
                rounded-lg
                bg-[#D4AF37]
                hover:bg-[#c19d25]
                text-black
                text-sm
                font-medium
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? isEditMode
                  ? "Updating Product..."
                  : "Saving Product..."
                : isEditMode
                  ? "Update Product"
                  : "Save Product"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AdminProductForm;