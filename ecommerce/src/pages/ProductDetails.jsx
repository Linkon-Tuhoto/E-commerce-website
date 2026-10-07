import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  ChevronRight,
  Star,
} from "lucide-react";

import { addToCart as addCartItem } from "../services/cartService";


export default function ProductDetails({ cart, setCart }) {
  const { id } = useParams();

  // =========================
  // PRODUCT STATE
  // =========================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // PRODUCT OPTIONS
  // =========================

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [isFavourite, setIsFavourite] = useState(false);

  const [activeTab, setActiveTab] = useState(
    "description"
  );


  // =========================
  // FETCH PRODUCT
  // =========================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);

      } catch (err) {
        console.error(
          "Failed to fetch product:",
          err
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  // =========================
  // SET DEFAULT OPTIONS
  // =========================

  useEffect(() => {
    if (!product) return;

    setSelectedImage(0);

    setSelectedSize(
      product.sizes?.length
        ? product.sizes[0]
        : ""
    );

    setSelectedColor(
      product.colors?.length
        ? product.colors[0]
        : null
    );

    setQuantity(1);

  }, [product]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading product...
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">

        <div className="text-center">

          <h1 className="text-2xl font-semibold mb-3">
            Product not found
          </h1>

          <p className="text-gray-500 mb-6">
            {error ||
              "This product does not exist."}
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#D4AF37] px-5 py-3 rounded-lg font-medium hover:bg-[#c5a32f]"
          >
            Back to shop

            <ChevronRight size={18} />
          </Link>

        </div>

      </div>
    );
  }


  // =========================
  // PRODUCT VALUES
  // =========================

  const images = product.images || [];
  const sizes = product.sizes || [];
  const colors = product.colors || [];

  const discountAmount =
    product.oldPrice
      ? product.oldPrice - product.price
      : 0;


  // Calculate discount if backend doesn't provide it
  const discount =
    product.discount ??
    (
      product.oldPrice &&
      product.oldPrice > product.price
        ? Math.round(
            ((product.oldPrice -
              product.price) /
              product.oldPrice) *
              100
          )
        : 0
    );


  // =========================
  // ADD TO CART
  // =========================

  const addToCart = () => {

    // Products with sizes must have a size
    if (sizes.length && !selectedSize) {

      alert("Please select a size");

      return;
    }


    try {

      const result = addCartItem({

        product,

        productId: product._id,

        quantity,

        size: selectedSize,

        color: selectedColor,

        selectedImage:
          images[selectedImage] || "",
      });


      // Update React cart state
      setCart(result.cart.items);


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


  // =========================
  // BUY NOW
  // =========================

  const buyNow = () => {

    addToCart();

    // Checkout will be connected
    // after we create the checkout page.
  };


  // =========================
  // RENDER
  // =========================

  return (

    <div className="bg-white text-[#171717] min-h-screen">


      {/* =========================
          BREADCRUMB
      ========================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        <div className="flex items-center gap-2 text-sm text-gray-500">

          <Link
            to="/"
            className="hover:text-[#D4AF37]"
          >
            Home
          </Link>

          <ChevronRight size={15} />

          <Link
            to="/shop"
            className="hover:text-[#D4AF37]"
          >
            {product.category}
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-700 truncate">
            {product.name}
          </span>

        </div>

      </div>


      {/* =========================
          MAIN PRODUCT SECTION
      ========================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">


          {/* =========================
              IMAGE GALLERY
          ========================= */}

          <div>

            <div className="flex flex-col-reverse md:flex-row gap-4">


              {/* THUMBNAILS */}

              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">

                {images.map((image, index) => (

                  <button
                    key={`${image}-${index}`}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-[#D4AF37]"
                        : "border-gray-200"
                    }`}
                  >

                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                  </button>

                ))}

              </div>


              {/* MAIN IMAGE */}

              <div className="relative flex-1">

                {discount > 0 && (

                  <span className="absolute top-4 left-4 z-10 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 rounded-md">

                    -{discount}%

                  </span>

                )}


                {/* FAVOURITE */}

                <button
                  onClick={() =>
                    setIsFavourite(
                      !isFavourite
                    )
                  }
                  className="absolute z-10 top-4 right-4 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center"
                >

                  <Heart
                    size={21}
                    className={
                      isFavourite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700"
                    }
                  />

                </button>


                <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden">

                  {images.length > 0 ? (

                    <img
                      src={
                        images[selectedImage]
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image available
                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* =========================
              PRODUCT INFORMATION
          ========================= */}

          <div className="flex flex-col">


            {/* CATEGORY / STOCK */}

            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-gray-500 mb-3">

              <span>
                {product.category}
              </span>

              <span>·</span>

              <span
                className={
                  product.inStock
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {product.inStock
                  ? "In stock"
                  : "Out of stock"}
              </span>

            </div>


            {/* PRODUCT NAME */}

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">

              {product.name}

            </h1>


            {/* RATING */}

            <div className="flex items-center gap-2 mb-6">

              <div className="flex items-center gap-0.5 text-[#D4AF37]">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <Star
                      key={star}
                      size={16}
                      fill="currentColor"
                    />

                  )
                )}

              </div>


              <span className="font-semibold">

                {product.rating || 0}

              </span>


              <span className="text-sm text-gray-500">

                {product.reviews || 0}{" "}
                verified reviews

              </span>

            </div>


            {/* PRICE */}

            <div className="flex items-center flex-wrap gap-3 pb-6 border-b">

              <span className="text-3xl font-bold text-[#B38F00]">

                KSh{" "}
                {Number(
                  product.price || 0
                ).toLocaleString()}

              </span>


              {product.oldPrice && (

                <>

                  <span className="text-gray-400 line-through">

                    KSh{" "}
                    {Number(
                      product.oldPrice
                    ).toLocaleString()}

                  </span>


                  {discountAmount > 0 && (

                    <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded">

                      Save KSh{" "}
                      {discountAmount.toLocaleString()}

                    </span>

                  )}

                </>

              )}

            </div>


            {/* DESCRIPTION */}

            <p className="text-gray-600 leading-7 py-5">

              {product.description}

            </p>


            {/* =========================
                SIZE
            ========================= */}

            {sizes.length > 0 && (

              <div className="py-5 border-t">

                <div className="flex items-center justify-between mb-3">

                  <h3 className="font-semibold">
                    Select size
                  </h3>

                  <button className="text-sm underline text-gray-600">
                    Size guide
                  </button>

                </div>


                <div className="flex flex-wrap gap-2">

                  {sizes.map((size) => (

                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`w-12 h-11 rounded-lg border text-sm font-medium transition ${
                        selectedSize === size
                          ? "bg-[#171717] text-white border-[#171717]"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >

                      {size}

                    </button>

                  ))}

                </div>


                <p className="text-sm text-gray-500 mt-2">

                  Size{" "}
                  {selectedSize}{" "}
                  selected

                </p>

              </div>

            )}


            {/* =========================
                COLOUR
            ========================= */}

            {colors.length > 0 && (

              <div className="py-5 border-t">

                <h3 className="font-semibold mb-4">

                  Colour:{" "}

                  <span className="font-normal">

                    {selectedColor?.name}

                  </span>

                </h3>


                <div className="flex items-center gap-3">

                  {colors.map((color) => (

                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        selectedColor?.name ===
                        color.name
                          ? "ring-2 ring-black ring-offset-2"
                          : ""
                      }`}
                    >

                      <span
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            color.value,
                        }}
                      />

                    </button>

                  ))}

                </div>

              </div>

            )}


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="pt-5 border-t">

              <div className="flex gap-3">


                {/* QUANTITY */}

                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                  <button
                    onClick={() =>
                      setQuantity(
                        (q) =>
                          Math.max(
                            1,
                            q - 1
                          )
                      )
                    }
                    className="w-11 h-12 flex items-center justify-center hover:bg-gray-100"
                  >

                    <Minus size={17} />

                  </button>


                  <span className="w-10 text-center font-medium">

                    {quantity}

                  </span>


                  <button
                    onClick={() =>
                      setQuantity(
                        (q) => q + 1
                      )
                    }
                    className="w-11 h-12 flex items-center justify-center hover:bg-gray-100"
                  >

                    <Plus size={17} />

                  </button>

                </div>


                {/* ADD TO CART */}

                <button
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className={`flex-1 h-12 transition rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    product.inStock
                      ? "bg-[#D4AF37] hover:bg-[#c5a32f]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >

                  <ShoppingCart size={19} />

                  {product.inStock
                    ? "Add to cart"
                    : "Out of stock"}

                </button>


                {/* WISHLIST */}

                <button
                  onClick={() =>
                    setIsFavourite(
                      !isFavourite
                    )
                  }
                  className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center"
                >

                  <Heart
                    size={20}
                    className={
                      isFavourite
                        ? "fill-red-500 text-red-500"
                        : ""
                    }
                  />

                </button>

              </div>


              {/* BUY NOW */}

              <button
                onClick={buyNow}
                disabled={!product.inStock}
                className={`w-full h-12 mt-3 rounded-lg font-semibold ${
                  product.inStock
                    ? "bg-[#171717] hover:bg-black text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >

                Buy now

              </button>

            </div>


            {/* =========================
                DELIVERY
            ========================= */}

            <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">


              <div className="flex gap-4 p-4 border-b">

                <Truck
                  size={22}
                  className="text-[#B38F00] flex-shrink-0"
                />

                <div>

                  <h4 className="font-semibold">
                    Delivery countrywide
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">

                    Nairobi 1–2 days ·
                    Upcountry 2–4 days

                  </p>

                </div>

              </div>


              <div className="flex gap-4 p-4">

                <ShieldCheck
                  size={22}
                  className="text-[#B38F00] flex-shrink-0"
                />

                <div>

                  <h4 className="font-semibold">
                    7-day easy returns
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">

                    Return eligible items
                    in original condition

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =========================
            LOWER INFORMATION
        ========================= */}

        <div className="mt-14 border-t">


          {/* TABS */}

          <div className="flex gap-8 border-b overflow-x-auto">

            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["delivery", "Delivery & returns"],
            ].map(([key, label]) => (

              <button
                key={key}
                onClick={() =>
                  setActiveTab(key)
                }
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 ${
                  activeTab === key
                    ? "border-[#D4AF37]"
                    : "border-transparent text-gray-500"
                }`}
              >

                {label}

              </button>

            ))}

          </div>


          {/* TAB CONTENT */}

          <div className="py-8 max-w-4xl">


            {/* DESCRIPTION */}

            {activeTab ===
              "description" && (

              <>

                <h2 className="text-2xl font-semibold mb-3">

                  Designed for everyday life

                </h2>


                <p className="text-gray-600 leading-7">

                  {product.description}

                </p>


                <ul className="mt-4 space-y-2 text-gray-600">

                  <li>
                    • Premium quality materials
                  </li>

                  <li>
                    • Easy care and durable finish
                  </li>

                  <li>
                    • Quality checked by MAMBOGA
                  </li>

                </ul>

              </>

            )}


            {/* SPECIFICATIONS */}

            {activeTab ===
              "specifications" && (

              <div className="space-y-3">


                <div className="flex justify-between border-b pb-3">

                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium">
                    {product.category}
                  </span>

                </div>


                <div className="flex justify-between border-b pb-3">

                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span
                    className={
                      product.inStock
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {product.inStock
                      ? "In stock"
                      : "Out of stock"}
                  </span>

                </div>


                {product.brand && (

                  <div className="flex justify-between border-b pb-3">

                    <span className="text-gray-500">
                      Brand
                    </span>

                    <span className="font-medium">
                      {product.brand}
                    </span>

                  </div>

                )}


                {sizes.length > 0 && (

                  <div className="flex justify-between border-b pb-3">

                    <span className="text-gray-500">
                      Sizes
                    </span>

                    <span className="font-medium">
                      {sizes.join(", ")}
                    </span>

                  </div>

                )}


                {colors.length > 0 && (

                  <div className="flex justify-between border-b pb-3">

                    <span className="text-gray-500">
                      Colours
                    </span>

                    <span className="font-medium">
                      {colors
                        .map(
                          (color) =>
                            color.name
                        )
                        .join(", ")}
                    </span>

                  </div>

                )}

              </div>

            )}


            {/* DELIVERY */}

            {activeTab === "delivery" && (

              <div className="space-y-5 text-gray-600">


                <div>

                  <h3 className="font-semibold text-black mb-1">
                    Delivery
                  </h3>

                  <p>
                    Nairobi delivery takes
                    approximately 1–2 days.
                    Upcountry delivery takes
                    approximately 2–4 days.
                  </p>

                </div>


                <div>

                  <h3 className="font-semibold text-black mb-1">
                    Returns
                  </h3>

                  <p>
                    Eligible items can be
                    returned within 7 days
                    in their original condition.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =========================
          YOU MAY ALSO LIKE
      ========================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl sm:text-3xl font-semibold">
            You may also like
          </h2>


          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold hover:text-[#B38F00]"
          >

            View all

            <ChevronRight size={17} />

          </Link>

        </div>


        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/*

            For now this section is intentionally empty.

            Once Shop.jsx is connected to MongoDB,
            we can fetch related products here too.

          */}

          <div className="col-span-full text-center py-8 text-gray-400">

            More products coming soon

          </div>

        </div>

      </section>

    </div>
  );
}