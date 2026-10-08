import { Link, useNavigate } from "react-router-dom";

import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function Cart({ cart = [], setCart }) {
  const navigate = useNavigate();

  // =====================================================
  // CREATE UNIQUE CART ITEM ID
  // =====================================================

  const getCartItemId = (item) => {
    if (item.cartItemId) {
      return item.cartItemId;
    }

    return [
      item.productId || item._id || item.id,
      item.selectedSize || item.size || "",
      item.selectedColor?.name || item.color?.name || "",
    ].join("-");
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = (item, amount) => {
    const targetId = getCartItemId(item);

    setCart((currentCart) =>
      currentCart.map((cartItem) => {
        const cartItemId = getCartItemId(cartItem);

        if (cartItemId !== targetId) {
          return cartItem;
        }

        return {
          ...cartItem,
          quantity: Math.max(
            1,
            Number(cartItem.quantity || 1) + amount
          ),
        };
      })
    );
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (item) => {
    const targetId = getCartItemId(item);

    setCart((currentCart) =>
      currentCart.filter(
        (cartItem) =>
          getCartItemId(cartItem) !== targetId
      )
    );
  };

  // =====================================================
  // TOTAL NUMBER OF ITEMS
  // =====================================================

  const itemCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  /*
   * IMPORTANT
   *
   * Delivery is no longer calculated on the cart.
   *
   * The backend creates an order with deliveryFee = 0.
   *
   * If transport/delivery has a cost, the admin will
   * set that fee after reviewing the order.
   */

  const delivery = 0;

  const total = subtotal + delivery;

  // =====================================================
  // CHECKOUT
  // =====================================================

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:py-12">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B38F00]">
            Your shopping bag
          </p>

          <h1 className="text-3xl font-semibold text-[#171717] md:text-4xl">
            Shopping Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}{" "}
            in your cart
          </p>
        </div>

        {/* ================= EMPTY CART ================= */}

        {cart.length === 0 ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-gray-200 px-6 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f3e8]">
              <ShoppingBag
                size={28}
                className="text-[#B38F00]"
              />
            </div>

            <h2 className="text-xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              Looks like you haven't added anything
              to your cart yet. Explore our products
              and find something you love.
            </p>

            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#c19d25]"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* ================= CART ITEMS ================= */}

            <div className="space-y-4">

              {cart.map((item) => {
                const itemId = getCartItemId(item);

                const productId =
                  item.productId ||
                  item._id ||
                  item.id;

                const image =
                  item.selectedImage ||
                  item.image ||
                  item.images?.[0] ||
                  "";

                const selectedSize =
                  item.selectedSize ||
                  item.size;

                const selectedColor =
                  item.selectedColor ||
                  item.color;

                return (
                  <div
                    key={itemId}
                    className="rounded-xl border border-gray-200 p-4"
                  >

                    <div className="flex gap-4">

                      {/* IMAGE */}

                      <Link
                        to={`/product/${productId}`}
                        className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-36 md:w-32"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </Link>

                      {/* DETAILS */}

                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex justify-between gap-3">

                          <div className="min-w-0">

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              {item.category}
                            </p>

                            <Link
                              to={`/product/${productId}`}
                              className="mt-1 block truncate font-semibold text-[#171717] hover:text-[#B38F00]"
                            >
                              {item.name}
                            </Link>

                            {/* SIZE */}

                            {selectedSize && (
                              <p className="mt-1 text-xs text-gray-500">
                                Size:{" "}
                                <span className="font-medium text-gray-700">
                                  {selectedSize}
                                </span>
                              </p>
                            )}

                            {/* COLOR */}

                            {selectedColor && (
                              <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                Color:

                                {selectedColor.value && (
                                  <span
                                    className="h-3 w-3 rounded-full border border-gray-300"
                                    style={{
                                      backgroundColor:
                                        selectedColor.value,
                                    }}
                                  />
                                )}

                                <span className="font-medium text-gray-700">
                                  {selectedColor.name ||
                                    selectedColor}
                                </span>
                              </p>
                            )}

                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item)
                            }
                            className="shrink-0 text-gray-400 transition hover:text-red-500"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                        {/* BOTTOM */}

                        <div className="mt-auto flex items-end justify-between gap-4 pt-4">

                          {/* QUANTITY */}

                          <div className="flex items-center rounded-lg border border-gray-200">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  -1
                                )
                              }
                              className="p-2 transition hover:bg-gray-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  1
                                )
                              }
                              className="p-2 transition hover:bg-gray-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>

                          </div>

                          {/* PRICE */}

                          <p className="font-semibold text-[#B38F00]">
                            KSh{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

              {/* CONTINUE SHOPPING */}

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-gray-600 hover:text-[#B38F00]"
              >
                <ArrowLeft size={16} />
                Continue shopping
              </Link>

            </div>

            {/* ================= ORDER SUMMARY ================= */}

            <div className="h-fit rounded-xl border border-gray-200 p-6">

              <h2 className="text-lg font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                {/* ITEMS */}

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Items
                  </span>

                  <span>
                    {itemCount}
                  </span>
                </div>

                {/* SUBTOTAL */}

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    KSh {subtotal.toLocaleString()}
                  </span>
                </div>

                {/* DELIVERY */}

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="text-green-600">
                    Not charged yet
                  </span>
                </div>

                <p className="text-xs leading-5 text-gray-500">
                  Delivery or transport charges, if applicable,
                  will be added separately after your order
                  is reviewed.
                </p>

                {/* TOTAL */}

                <div className="border-t border-gray-200 pt-4">

                  <div className="flex justify-between text-base font-semibold">

                    <span>
                      Pay Now
                    </span>

                    <span className="text-[#B38F00]">
                      KSh {total.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#c19d25]"
              >
                Proceed to Checkout
              </button>

              {/* SECURITY */}

              <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-5">

                <ShieldCheck
                  size={20}
                  className="shrink-0 text-[#B38F00]"
                />

                <p className="text-xs leading-5 text-gray-500">
                  Secure checkout. Your payment information
                  is protected.
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default Cart;