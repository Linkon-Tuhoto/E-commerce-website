const CART_KEY = "mamboga_cart";

// ===============================
// GET CART
// ===============================

export const getCart = () => {
  try {
    const storedCart =
      localStorage.getItem(CART_KEY);

    if (!storedCart) {
      return [];
    }

    return JSON.parse(storedCart);
  } catch (error) {
    console.error(
      "Failed to load cart:",
      error
    );

    return [];
  }
};


// ===============================
// SAVE CART
// ===============================

export const saveCart = (cart) => {
  try {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.error(
      "Failed to save cart:",
      error
    );
  }
};


// ===============================
// ADD TO CART
// ===============================

export const addToCart = ({
  product,
  productId,
  quantity = 1,
  size = "",
  color = null,
  selectedImage = "",
}) => {

  const currentCart = getCart();

  const actualProductId =
    productId ||
    product?._id ||
    product?.id;

  if (!actualProductId) {
    throw new Error(
      "Product ID is required."
    );
  }

  const cartItemId = [
    actualProductId,
    size || "",
    color?.name || "",
  ].join("-");

  const existingItem =
    currentCart.find(
      (item) =>
        item.cartItemId === cartItemId
    );

  let updatedCart;

  if (existingItem) {

    updatedCart = currentCart.map(
      (item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity:
                Number(item.quantity || 0) +
                Number(quantity || 1),
            }
          : item
    );

  } else {

    if (!product) {
      throw new Error(
        "Product information is required when adding a new item."
      );
    }

    const newItem = {
      cartItemId,

      productId: actualProductId,

      name: product.name,

      price: Number(product.price || 0),

      oldPrice:
        product.oldPrice || null,

      category:
        product.category || "",

      images:
        product.images || [],

      image:
        selectedImage ||
        product.images?.[0] ||
        "",

      selectedImage:
        selectedImage ||
        product.images?.[0] ||
        "",

      selectedSize: size || "",

      selectedColor: color || null,

      quantity:
        Number(quantity || 1),
    };

    updatedCart = [
      ...currentCart,
      newItem,
    ];
  }

  saveCart(updatedCart);

  return {
    message: "Product added to cart",
    cart: {
      items: updatedCart,
    },
  };
};


// ===============================
// UPDATE CART ITEM
// ===============================

export const updateCartItem = (
  cartItemId,
  quantity
) => {

  const currentCart = getCart();

  const updatedCart =
    currentCart.map((item) =>
      item.cartItemId === cartItemId
        ? {
            ...item,
            quantity: Math.max(
              1,
              Number(quantity)
            ),
          }
        : item
    );

  saveCart(updatedCart);

  return {
    message: "Cart updated",
    cart: {
      items: updatedCart,
    },
  };
};


// ===============================
// REMOVE CART ITEM
// ===============================

export const removeFromCart = (
  cartItemId
) => {

  const currentCart = getCart();

  const updatedCart =
    currentCart.filter(
      (item) =>
        item.cartItemId !== cartItemId
    );

  saveCart(updatedCart);

  return {
    message: "Item removed",
    cart: {
      items: updatedCart,
    },
  };
};


// ===============================
// CLEAR CART
// ===============================

export const clearCart = () => {

  localStorage.removeItem(CART_KEY);

  return {
    message: "Cart cleared",
    cart: {
      items: [],
    },
  };
};


// ===============================
// GET CART COUNT
// ===============================

export const getCartCount = () => {

  const cart = getCart();

  return cart.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0),
    0
  );
};