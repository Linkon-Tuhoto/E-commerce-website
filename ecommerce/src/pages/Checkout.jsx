import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  User,
} from "lucide-react";

import { getCart } from "../services/cartService";

const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

// =====================================================
// CHECKOUT
// =====================================================

function Checkout({ cart = [], setCart }) {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    county: "",
    town: "",
    area: "",
    building: "",
    directions: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("M-PESA");

  // This is the number that will actually receive
  // the M-PESA STK prompt.
  const [paymentPhone, setPaymentPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/signin", {
        state: {
          from: "/checkout",
          message:
            "Please sign in to continue with your order.",
        },
      });

      return;
    }

    try {
      const storedUser =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  }, [navigate]);

  // ===================================================
  // CART
  // ===================================================

  const currentCart = useMemo(() => {
    if (cart?.length > 0) {
      return cart;
    }

    return getCart();
  }, [cart]);

  // ===================================================
  // CART TOTALS
  // ===================================================

  const itemCount = currentCart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const subtotal = currentCart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // Same delivery rule used by the cart.
  const deliveryFee = subtotal >= 5000 ? 0 : 300;

  const total = subtotal + deliveryFee;

  // ===================================================
  // FORM HANDLING
  // ===================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ===================================================
  // PLACE ORDER
  // ===================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    // -----------------------------------------------
    // CHECK LOGIN
    // -----------------------------------------------

    if (!token) {
      navigate("/signin", {
        state: {
          from: "/checkout",
          message:
            "Please sign in before placing your order.",
        },
      });

      return;
    }

    // -----------------------------------------------
    // CHECK API URL
    // -----------------------------------------------

    if (!API_URL) {
      setError(
        "Backend URL is not configured. Please check your VITE_API_URL."
      );

      return;
    }

    // -----------------------------------------------
    // CHECK CART
    // -----------------------------------------------

    if (currentCart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // -----------------------------------------------
    // CHECK DELIVERY DETAILS
    // -----------------------------------------------

    if (!form.county.trim()) {
      setError("Please enter your county.");
      return;
    }

    if (!form.town.trim()) {
      setError("Please enter your town.");
      return;
    }

    if (!form.area.trim()) {
      setError("Please enter your area.");
      return;
    }

    // -----------------------------------------------
    // CHECK PAYMENT PHONE
    // -----------------------------------------------

    if (!paymentPhone.trim()) {
      setError("Please enter the M-PESA phone number.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // STEP 1: PREPARE ORDER ITEMS
      // =================================================

      const orderItems = currentCart.map((item) => ({
        product: item.productId,

        quantity: Number(item.quantity || 1),

        size: item.selectedSize || "",

        color:
          typeof item.selectedColor === "object"
            ? item.selectedColor?.name || ""
            : item.selectedColor || "",
      }));

      // =================================================
      // STEP 2: CREATE ORDER
      // =================================================

      const orderResponse = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: orderItems,

            deliveryAddress: {
              county: form.county.trim(),
              town: form.town.trim(),
              area: form.area.trim(),
              building: form.building.trim(),
              directions: form.directions.trim(),
            },

            paymentMethod,
          }),
        }
      );

      // -----------------------------------------------
      // READ ORDER RESPONSE SAFELY
      // -----------------------------------------------

      const orderContentType =
        orderResponse.headers.get("content-type") || "";

      let orderData;

      if (
        orderContentType.includes("application/json")
      ) {
        orderData = await orderResponse.json();
      } else {
        const responseText =
          await orderResponse.text();

        console.error(
          "Order API returned non-JSON:",
          responseText
        );

        throw new Error(
          "The server returned an unexpected response. Please check your backend URL and order route."
        );
      }

      // -----------------------------------------------
      // CHECK ORDER RESPONSE
      // -----------------------------------------------

      if (!orderResponse.ok) {
        throw new Error(
          orderData.message ||
            "Unable to create your order."
        );
      }

      if (!orderData.order?._id) {
        throw new Error(
          "Order was created but no order ID was returned."
        );
      }

      console.log(
        "Order created:",
        orderData.order
      );

      // =================================================
      // STEP 3: SEND INTASEND M-PESA STK PUSH
      // =================================================

      const paymentResponse = await fetch(
        `${API_URL}/api/orders/${orderData.order._id}/pay`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          // IMPORTANT:
          // Use the number entered at checkout,
          // NOT the logged-in account phone.
          body: JSON.stringify({
            phoneNumber: paymentPhone.trim(),
          }),
        }
      );

      // -----------------------------------------------
      // READ PAYMENT RESPONSE SAFELY
      // -----------------------------------------------

      const paymentContentType =
        paymentResponse.headers.get("content-type") ||
        "";

      let paymentData;

      if (
        paymentContentType.includes("application/json")
      ) {
        paymentData = await paymentResponse.json();
      } else {
        const responseText =
          await paymentResponse.text();

        console.error(
          "Payment API returned non-JSON:",
          responseText
        );

        throw new Error(
          "The payment server returned an unexpected response. Please check your backend."
        );
      }

      // -----------------------------------------------
      // CHECK PAYMENT RESPONSE
      // -----------------------------------------------

      if (!paymentResponse.ok) {
        throw new Error(
          paymentData.message ||
            "Unable to start M-PESA payment."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        `M-PESA payment prompt sent! Check ${paymentPhone.trim()} and enter your M-PESA PIN to pay KSh ${Number(
          orderData.order.totalAmount
        ).toLocaleString()}.`
      );

      console.log(
        "IntaSend payment response:",
        paymentData
      );

      /*
       * IMPORTANT:
       *
       * DO NOT CLEAR THE CART HERE.
       *
       * The STK prompt has only been sent.
       *
       * Later, when IntaSend confirms the payment,
       * we will:
       *
       * 1. Mark the order as PAID
       * 2. Update the order status
       * 3. Clear the customer's cart
       */
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // EMPTY CART
  // ===================================================

  if (currentCart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f7f3] pt-28 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <Package
            size={48}
            className="mx-auto text-gray-400 mb-4"
          />

          <h1 className="text-2xl font-bold mb-2">
            Your cart is empty
          </h1>

          <p className="text-gray-500 mb-6">
            Add some products before proceeding to
            checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c19d25] px-6 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="min-h-screen bg-[#f8f7f3] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your delivery details and complete
            your payment.
          </p>
        </div>

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
            <CheckCircle2 size={22} />

            <p className="font-medium">
              {success}
            </p>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-6">

              {/* CUSTOMER INFORMATION */}

              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Customer Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Your account details
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>

                    <input
                      type="text"
                      value={user?.name || ""}
                      readOnly
                      placeholder="Your name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Phone
                    </label>

                    <input
                      type="text"
                      value={user?.phone || ""}
                      readOnly
                      placeholder="Your phone number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none"
                    />

                    <p className="text-xs text-gray-500 mt-1">
                      This number is for your account only.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      placeholder="Your email"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 outline-none"
                    />
                  </div>

                </div>
              </section>

              {/* DELIVERY INFORMATION */}

              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Delivery Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Tell us where your order should go
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  {/* COUNTY */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      County *
                    </label>

                    <input
                      type="text"
                      name="county"
                      value={form.county}
                      onChange={handleChange}
                      placeholder="e.g. Nairobi"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* TOWN */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Town *
                    </label>

                    <input
                      type="text"
                      name="town"
                      value={form.town}
                      onChange={handleChange}
                      placeholder="e.g. Kasarani"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* AREA */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Area / Estate *
                    </label>

                    <input
                      type="text"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      placeholder="e.g. Mwiki"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* BUILDING */}

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Building / House
                    </label>

                    <input
                      type="text"
                      name="building"
                      value={form.building}
                      onChange={handleChange}
                      placeholder="e.g. Green Court, House B12"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* DIRECTIONS */}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Delivery Directions
                    </label>

                    <textarea
                      name="directions"
                      value={form.directions}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Nearby landmark, stage, building instructions, etc."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>

                <div className="mt-5 bg-[#faf8ef] border border-[#eadca8] rounded-lg p-4 text-sm text-gray-700">
                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="text-[#a47f12] shrink-0 mt-0.5"
                    />

                    <p>
                      Please provide accurate delivery
                      information so our team can locate
                      you easily.
                    </p>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}

              <section className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Payment Method
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select how you want to pay
                    </p>
                  </div>
                </div>

                {/* PAYMENT PHONE */}

                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">
                    M-PESA Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(event) =>
                      setPaymentPhone(event.target.value)
                    }
                    placeholder="e.g. 0712345678"
                    autoComplete="tel"
                    inputMode="tel"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#D4AF37]"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Enter the number that should receive
                    the M-PESA payment prompt. It can be
                    different from your account phone
                    number.
                  </p>
                </div>

                {/* M-PESA */}

                <label className="flex items-center gap-4 border-2 border-[#D4AF37] bg-[#faf8ef] rounded-xl p-4 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="M-PESA"
                    checked={
                      paymentMethod === "M-PESA"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                    className="accent-[#D4AF37]"
                  />

                  <div className="flex-1">
                    <p className="font-bold">
                      M-PESA
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay securely using M-PESA
                    </p>
                  </div>

                  <span className="font-bold text-green-600">
                    M-PESA
                  </span>
                </label>

                <div className="mt-4 flex gap-3 text-sm text-gray-500">
                  <ShieldCheck
                    size={18}
                    className="shrink-0"
                  />

                  <p>
                    You will receive an M-PESA payment
                    prompt on the number you enter above.
                    Enter your M-PESA PIN to complete the
                    payment securely.
                  </p>
                </div>
              </section>
            </div>

            {/* RIGHT — ORDER SUMMARY */}

            <div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 lg:sticky lg:top-28">

                <h2 className="text-xl font-bold mb-5">
                  Your Order
                </h2>

                {/* ITEMS */}

                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {currentCart.map((item) => {
                    const quantity =
                      Number(item.quantity || 1);

                    const itemTotal =
                      Number(item.price || 0) *
                      quantity;

                    return (
                      <div
                        key={item.cartItemId}
                        className="flex gap-3"
                      >
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package
                                size={20}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>

                          {item.selectedSize && (
                            <p className="text-xs text-gray-500">
                              Size: {item.selectedSize}
                            </p>
                          )}

                          {item.selectedColor && (
                            <p className="text-xs text-gray-500">
                              Color:{" "}
                              {typeof item.selectedColor ===
                              "object"
                                ? item.selectedColor.name
                                : item.selectedColor}
                            </p>
                          )}

                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-sm">
                          KSh{" "}
                          {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* TOTALS */}

                <div className="border-t border-gray-200 mt-6 pt-5 space-y-3">

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Items
                    </span>

                    <span>{itemCount}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Subtotal
                    </span>

                    <span>
                      KSh {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Delivery
                    </span>

                    <span>
                      {deliveryFee === 0
                        ? "FREE"
                        : `KSh ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-bold text-lg">
                      Total
                    </span>

                    <span className="font-bold text-xl">
                      KSh {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-[#D4AF37] hover:bg-[#c19d25] disabled:opacity-60 disabled:cursor-not-allowed py-4 rounded-xl font-bold transition"
                >
                  {loading
                    ? "Sending Payment Prompt..."
                    : `Pay with M-PESA • KSh ${total.toLocaleString()}`}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={15} />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;