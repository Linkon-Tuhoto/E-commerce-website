
import API_URL from "./api";

const WISHLIST_URL = `${API_URL}/api/wishlist`;

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("surveyToken");

const request = async (url, options = {}) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please sign in to use your wishlist.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Wishlist request failed (${response.status}).`
    );
  }

  return data;
};

export const getMyWishlist = () =>
  request(WISHLIST_URL);

export const addToWishlist = (productId) => {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  return request(WISHLIST_URL, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
};

export const removeFromWishlist = (productId) => {
  if (!productId) {
    throw new Error("Product ID is missing.");
  }

  return request(
    `${WISHLIST_URL}/${encodeURIComponent(productId)}`,
    { method: "DELETE" }
  );
};

export const clearWishlist = () =>
  request(WISHLIST_URL, { method: "DELETE" });
