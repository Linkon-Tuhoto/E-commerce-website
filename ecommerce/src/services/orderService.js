import API_URL from "./api";

const ORDER_URL = `${API_URL}/api/orders`;

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("surveyToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

// =====================================================
// AUTH HEADERS
// =====================================================

const getAuthHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

// =====================================================
// SAFELY READ RESPONSE
// =====================================================

const parseResponse = async (response) => {
  const contentType =
    response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return {
    message:
      text || "Unexpected server response",
  };
};

// =====================================================
// GET ALL ORDERS
// ADMIN ONLY
// =====================================================

export const getOrders = async () => {
  const response = await fetch(
    ORDER_URL,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch orders"
    );
  }

  return data;
};

// =====================================================
// GET MY ORDERS
// CUSTOMER
// =====================================================

export const getMyOrders = async () => {
  const response = await fetch(
    `${ORDER_URL}/my-orders`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch your orders"
    );
  }

  return data;
};

// =====================================================
// GET ONE ORDER
// CUSTOMER / ADMIN
// =====================================================

export const getOrderById = async (id) => {
  const response = await fetch(
    `${ORDER_URL}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch order"
    );
  }

  return data;
};

// =====================================================
// CREATE ORDER
// =====================================================

export const createOrder = async ({
  items,
  deliveryAddress,
}) => {
  const response = await fetch(
    ORDER_URL,
    {
      method: "POST",
      headers: getAuthHeaders(),

      body: JSON.stringify({
        items,
        deliveryAddress,
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create order"
    );
  }

  return data;
};

// =====================================================
// PAY FOR PRODUCTS
// =====================================================

export const initiateProductPayment = async (
  orderId,
  phoneNumber
) => {
  const response = await fetch(
    `${ORDER_URL}/${orderId}/pay`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        phoneNumber,
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to initiate product payment"
    );
  }

  return data;
};

// =====================================================
// PAY FOR TRANSPORT
// =====================================================

export const initiateTransportPayment = async (
  orderId,
  phoneNumber
) => {
  const response = await fetch(
    `${ORDER_URL}/${orderId}/pay-transport`,
    {
      method: "POST",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        phoneNumber,
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to initiate transport payment"
    );
  }

  return data;
};

// =====================================================
// UPDATE TRANSPORT FEE
// ADMIN ONLY
// =====================================================

export const updateTransportFee = async (
  orderId,
  deliveryFee
) => {
  const response = await fetch(
    `${ORDER_URL}/${orderId}/transport`,
    {
      method: "PUT",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        deliveryFee: Number(
          deliveryFee
        ),
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update transport fee"
    );
  }

  return data;
};

// =====================================================
// UPDATE ORDER STATUS
// ADMIN ONLY
// =====================================================

export const updateOrderStatus = async (
  id,
  orderStatus
) => {
  const response = await fetch(
    `${ORDER_URL}/${id}/status`,
    {
      method: "PUT",

      headers: getAuthHeaders(),

      body: JSON.stringify({
        orderStatus,
      }),
    }
  );

  const data =
    await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update order status"
    );
  }

  return data;
};