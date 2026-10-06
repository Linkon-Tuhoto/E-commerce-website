import API_URL from "./api";

const ORDER_URL = `${API_URL}/api/orders`;

export const getOrders = async () => {
  const response = await fetch(ORDER_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
};

export const getOrderById = async (id) => {
  const response = await fetch(`${ORDER_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
};

export const updateOrderStatus = async (id, orderStatus) => {
  const response = await fetch(`${ORDER_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderStatus,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to update order status"
    );
  }

  return response.json();
};