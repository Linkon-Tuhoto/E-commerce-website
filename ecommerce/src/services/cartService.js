import API_URL from "./api";

const CART_URL = `${API_URL}/api/cart`;

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

// GET MY CART
export const getMyCart = async () => {
  const token = getToken();

  const response = await fetch(CART_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to fetch cart"
    );
  }

  return response.json();
};

// ADD TO CART
export const addToCart = async ({
  productId,
  quantity = 1,
  size = "",
  color = {},
}) => {
  const token = getToken();

  const response = await fetch(CART_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      productId,
      quantity,
      size,
      color,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to add product to cart"
    );
  }

  return response.json();
};

// UPDATE CART ITEM
export const updateCartItem = async (itemId, quantity) => {
  const token = getToken();

  const response = await fetch(`${CART_URL}/${itemId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      quantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to update cart"
    );
  }

  return response.json();
};

// REMOVE CART ITEM
export const removeFromCart = async (itemId) => {
  const token = getToken();

  const response = await fetch(`${CART_URL}/${itemId}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to remove cart item"
    );
  }

  return response.json();
};

// CLEAR CART
export const clearCart = async () => {
  const token = getToken();

  const response = await fetch(CART_URL, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to clear cart"
    );
  }

  return response.json();
};