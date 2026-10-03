import { useState } from "react";
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

// Temporary products.
// Later this will come from your backend/database.
const products = [
  {
    id: 1,
    name: "Essential Linen Shirt",
    category: "Clothing",
    price: 1890,
    oldPrice: 2400,
    discount: 21,
    rating: 4.8,
    reviews: 48,
    description:
      "Premium quality, dependable comfort and a clean finish designed for everyday use. Selected for quality and value.",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Sand", value: "#D8C39A" },
      { name: "Black", value: "#222222" },
      { name: "Olive", value: "#686854" },
    ],
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
    ],
    inStock: true,
  },

  {
    id: 2,
    name: "Cloud Runner Sneakers",
    category: "Shoes",
    price: 3290,
    oldPrice: 4180,
    discount: 21,
    rating: 4.9,
    reviews: 42,
    description:
      "Lightweight everyday sneakers designed for comfort, movement and everyday wear.",
    sizes: ["39", "40", "41", "42"],
    colors: [
      { name: "Grey", value: "#777777" },
      { name: "Black", value: "#222222" },
    ],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=80",
    ],
    inStock: true,
  },

  {
    id: 3,
    name: "Non-Stick Cookware Set",
    category: "Kitchen",
    price: 4950,
    oldPrice: 5900,
    discount: 16,
    rating: 4.7,
    reviews: 42,
    description:
      "A practical cookware set designed for everyday cooking with a durable non-stick finish.",
    sizes: [],
    colors: [
      { name: "Black", value: "#222222" },
      { name: "Red", value: "#9D2C20" },
    ],
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584990347449-ae2c0d7b6f0a?auto=format&fit=crop&w=1000&q=80",
    ],
    inStock: true,
  },

  {
    id: 4,
    name: "Soft Knit Midi Dress",
    category: "Clothing",
    price: 2750,
    rating: 4.6,
    reviews: 42,
    description:
      "A comfortable midi dress with a soft finish and versatile everyday style.",
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Pink", value: "#EFA5A0" },
      { name: "Black", value: "#222222" },
    ],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
    ],
    inStock: true,
  },
];

export default function ProductDetails({ cart, setCart }) {
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.length ? product.colors[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isFavourite, setIsFavourite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">
            Product not found
          </h1>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#D4AF37] px-5 py-3 rounded-lg font-medium"
          >
            Back to shop
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const discountAmount = product.oldPrice
    ? product.oldPrice - product.price
    : 0;

  const addToCart = () => {
    if (product.sizes.length && !selectedSize) {
      alert("Please select a size");
      return;
    }

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    };

    setCart((currentCart = []) => {
      const existing = currentCart.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.name === selectedColor?.name
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.name === selectedColor?.name
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [...currentCart, cartItem];
    });
  };

  const buyNow = () => {
    addToCart();
    // Checkout route will be connected later.
  };

  return (
    <div className="bg-white text-[#171717] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#D4AF37]">
            Home
          </Link>

          <ChevronRight size={15} />

          <Link to="/shop" className="hover:text-[#D4AF37]">
            {product.category}
          </Link>

          <ChevronRight size={15} />

          <span className="text-gray-700 truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main product section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          
          {/* ================= IMAGE GALLERY ================= */}
          <div>
            <div className="flex flex-col-reverse md:flex-row gap-4">
              
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
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

              {/* Main image */}
              <div className="relative flex-1">
                {product.discount && (
                  <span className="absolute top-4 left-4 z-10 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 rounded-md">
                    -{product.discount}%
                  </span>
                )}

                <button
                  onClick={() => setIsFavourite(!isFavourite)}
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
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= PRODUCT INFORMATION ================= */}
          <div className="flex flex-col">
            
            {/* Category / stock */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-gray-500 mb-3">
              <span>{product.category}</span>
              <span>·</span>
              <span className="text-green-600">
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="currentColor"
                  />
                ))}
              </div>

              <span className="font-semibold">
                {product.rating}
              </span>

              <span className="text-sm text-gray-500">
                {product.reviews} verified reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-3 pb-6 border-b">
              <span className="text-3xl font-bold text-[#B38F00]">
                KSh {product.price.toLocaleString()}
              </span>

              {product.oldPrice && (
                <>
                  <span className="text-gray-400 line-through">
                    KSh {product.oldPrice.toLocaleString()}
                  </span>

                  <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    Save KSh {discountAmount.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-7 py-5">
              {product.description}
            </p>

            {/* ================= SIZE ================= */}
            {product.sizes.length > 0 && (
              <div className="py-5 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Select size</h3>

                  <button className="text-sm underline text-gray-600">
                    Size guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
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
                  Size {selectedSize} selected
                </p>
              </div>
            )}

            {/* ================= COLOUR ================= */}
            {product.colors.length > 0 && (
              <div className="py-5 border-t">
                <h3 className="font-semibold mb-4">
                  Colour:{" "}
                  <span className="font-normal">
                    {selectedColor?.name}
                  </span>
                </h3>

                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        selectedColor?.name === color.name
                          ? "ring-2 ring-black ring-offset-2"
                          : ""
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ================= ACTIONS ================= */}
            <div className="pt-5 border-t">
              <div className="flex gap-3">
                
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
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
                      setQuantity((q) => q + 1)
                    }
                    className="w-11 h-12 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus size={17} />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={addToCart}
                  className="flex-1 h-12 bg-[#D4AF37] hover:bg-[#c5a32f] transition rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={19} />
                  Add to cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => setIsFavourite(!isFavourite)}
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

              {/* Buy now */}
              <button
                onClick={buyNow}
                className="w-full h-12 mt-3 bg-[#171717] hover:bg-black text-white rounded-lg font-semibold"
              >
                Buy now
              </button>
            </div>

            {/* ================= DELIVERY ================= */}
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
                    Nairobi 1–2 days · Upcountry 2–4 days
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
                    Return eligible items in original condition
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LOWER INFORMATION ================= */}
        <div className="mt-14 border-t">
          <div className="flex gap-8 border-b overflow-x-auto">
            {[
              ["description", "Description"],
              ["specifications", "Specifications"],
              ["delivery", "Delivery & returns"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
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

          <div className="py-8 max-w-4xl">
            {activeTab === "description" && (
              <>
                <h2 className="text-2xl font-semibold mb-3">
                  Designed for everyday life
                </h2>

                <p className="text-gray-600 leading-7">
                  Made with carefully selected materials and
                  finished to a high standard. This item combines
                  practical performance with a timeless silhouette
                  that works effortlessly in your day-to-day routine.
                </p>

                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Premium quality materials</li>
                  <li>• Easy care and durable finish</li>
                  <li>• Quality checked by KIFAA</li>
                </ul>
              </>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium">
                    {product.category}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-500">Availability</span>
                  <span className="font-medium text-green-600">
                    In stock
                  </span>
                </div>

                {product.sizes.length > 0 && (
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-500">Sizes</span>
                    <span className="font-medium">
                      {product.sizes.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-5 text-gray-600">
                <div>
                  <h3 className="font-semibold text-black mb-1">
                    Delivery
                  </h3>
                  <p>
                    Nairobi delivery takes approximately 1–2 days.
                    Upcountry delivery takes approximately 2–4 days.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-1">
                    Returns
                  </h3>
                  <p>
                    Eligible items can be returned within 7 days in
                    their original condition.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= YOU MAY ALSO LIKE ================= */}
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
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 4)
            .map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center"
                  >
                    <Heart size={17} />
                  </button>
                </div>

                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    {item.category}
                  </p>

                  <h3 className="font-semibold mt-1 line-clamp-1">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm mt-2">
                    <Star
                      size={13}
                      fill="#D4AF37"
                      className="text-[#D4AF37]"
                    />
                    <span>{item.rating}</span>
                    <span className="text-gray-400">
                      ({item.reviews})
                    </span>
                  </div>

                  <p className="text-[#B38F00] font-bold mt-2">
                    KSh {item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}