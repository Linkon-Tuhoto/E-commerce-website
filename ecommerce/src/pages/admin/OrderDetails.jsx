import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getOrderById,
  updateOrderStatus,
} from "../../services/orderService";

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);

      const data = await updateOrderStatus(id, newStatus);

      setOrder(data.order);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update order.");
    } finally {
      setUpdating(false);
    }
  };

  const formatMoney = (amount) => {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          Loading order...
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6">
          {error || "Order not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-5">

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Placed{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">

              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100">
                {order.orderStatus}
              </span>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  order.paymentStatus === "PAID"
                    ? "bg-green-50 text-green-700"
                    : order.paymentStatus === "FAILED" ||
                      order.paymentStatus === "REJECTED"
                    ? "bg-red-50 text-red-600"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                Payment: {order.paymentStatus}
              </span>

            </div>

          </div>
        </div>
      </div>

      <div className="p-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Products */}
            <div className="bg-white border rounded-xl overflow-hidden">

              <div className="px-5 py-4 border-b flex items-center gap-2">
                <Package size={19} />
                <h2 className="font-semibold">
                  Order Items
                </h2>
              </div>

              <div className="divide-y">

                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 flex gap-4"
                  >

                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package size={24} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">

                      <div className="flex justify-between gap-4">

                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>

                          {item.size && (
                            <p className="text-sm text-gray-500 mt-1">
                              Size: {item.size}
                            </p>
                          )}

                          {item.color && (
                            <p className="text-sm text-gray-500">
                              Color: {item.color}
                            </p>
                          )}

                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {formatMoney(
                              item.price * item.quantity
                            )}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {formatMoney(item.price)} each
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

              {/* Totals */}
              <div className="border-t p-5 space-y-3">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    {formatMoney(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span>
                    {formatMoney(order.deliveryFee)}
                  </span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>

                  <span>
                    {formatMoney(order.totalAmount)}
                  </span>
                </div>

              </div>

            </div>

            {/* Payment */}
            <div className="bg-white border rounded-xl">

              <div className="px-5 py-4 border-b flex items-center gap-2">
                <CreditCard size={19} />
                <h2 className="font-semibold">
                  Payment Information
                </h2>
              </div>

              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Payment Status
                  </p>

                  <p className="font-semibold mt-1">
                    {order.paymentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Payment Method
                  </p>

                  <p className="font-semibold mt-1">
                    {order.paymentMethod || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Payment Reference
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    {order.paymentReference || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Amount
                  </p>

                  <p className="font-semibold mt-1">
                    {formatMoney(order.totalAmount)}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Customer */}
            <div className="bg-white border rounded-xl">

              <div className="px-5 py-4 border-b flex items-center gap-2">
                <User size={19} />
                <h2 className="font-semibold">
                  Customer
                </h2>
              </div>

              <div className="p-5 space-y-4">

                <div>
                  <p className="text-xs text-gray-500">
                    Name
                  </p>

                  <p className="font-medium mt-1">
                    {order.customerName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400" />

                  <span className="text-sm">
                    {order.customerPhone}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />

                  <span className="text-sm break-all">
                    {order.customerEmail || "No email"}
                  </span>
                </div>

              </div>

            </div>

            {/* Order actions */}
            <div className="bg-white border rounded-xl">

              <div className="px-5 py-4 border-b">
                <h2 className="font-semibold">
                  Order Actions
                </h2>
              </div>

              <div className="p-5 space-y-3">

                <button
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange("APPROVED")
                  }
                  className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  <CheckCircle size={17} />
                  Approve Order
                </button>

                <button
                  disabled={updating}
                  onClick={() =>
                    handleStatusChange("REJECTED")
                  }
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle size={17} />
                  Reject Order
                </button>

                <select
                  value={order.orderStatus}
                  disabled={updating}
                  onChange={(e) =>
                    handleStatusChange(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm outline-none focus:border-[#D4AF37]"
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="APPROVED">
                    Approved
                  </option>

                  <option value="PROCESSING">
                    Processing
                  </option>

                  <option value="SHIPPED">
                    Shipped
                  </option>

                  <option value="DELIVERED">
                    Delivered
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                  <option value="REJECTED">
                    Rejected
                  </option>
                </select>

              </div>

            </div>

            {/* Admin note */}
            <div className="bg-white border rounded-xl p-5">

              <h2 className="font-semibold mb-3">
                Admin Note
              </h2>

              <p className="text-sm text-gray-500">
                {order.adminNote ||
                  "No admin note has been added."}
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminOrderDetails;