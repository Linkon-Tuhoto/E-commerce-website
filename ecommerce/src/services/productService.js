import API_URL from "./api";

const PRODUCT_URL = `${API_URL}/api/products`;

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const url = query.toString()
    ? `${PRODUCT_URL}?${query.toString()}`
    : PRODUCT_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};


export const getProductById = async (id) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
};


export const createProduct = async (productData) => {
  const response = await fetch(PRODUCT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
};


export const updateProduct = async (id, productData) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
};


export const deleteProduct = async (id) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
};