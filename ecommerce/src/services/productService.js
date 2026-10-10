
import API_URL from "./api";

const PRODUCT_URL = `${API_URL}/api/products`;

const getAuthHeaders = (includeJson = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("surveyToken");

  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `${fallbackMessage} (HTTP ${response.status})`
    );
  }

  return data;
};

// Public: fetch products
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

  return handleResponse(response, "Failed to fetch products");
};

// Public: fetch one product
export const getProductById = async (id) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`);

  return handleResponse(response, "Failed to fetch product");
};

// Protected: create product
export const createProduct = async (productData) => {
  const response = await fetch(PRODUCT_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(productData),
  });

  return handleResponse(response, "Failed to create product");
};

// Protected: update product
export const updateProduct = async (id, productData) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(productData),
  });

  return handleResponse(response, "Failed to update product");
};

// Protected: delete product
export const deleteProduct = async (id) => {
  const response = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, "Failed to delete product");
};
