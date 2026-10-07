import API_URL from "./api";

const WISHLIST_URL = `${API_URL}/api/wishlist`;

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

// GET MY WISHLIST
export const getMyWishlist = async () => {
  const token = getToken();

  const response = await fetch(WISHLIST_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to fetch wishlist"
    );
  }

  return response.json();
};

// ADD PRODUCT
export const addToWishlist = async (productId) => {
  const token = getToken();

  const response = await fetch(WISHLIST_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      productId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to add to wishlist"
    );
  }

  return response.json();
};

// REMOVE PRODUCT
export const removeFromWishlist = async (productId) => {
  const token = getToken();

  const response = await fetch(
    `${WISHLIST_URL}/${productId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to remove from wishlist"
    );
  }

  return response.json();
};

// CLEAR WISHLIST
export const clearWishlist = async () => {
  const token = getToken();

  const response = await fetch(WISHLIST_URL, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to clear wishlist"
    );
  }

  return response.json();
};