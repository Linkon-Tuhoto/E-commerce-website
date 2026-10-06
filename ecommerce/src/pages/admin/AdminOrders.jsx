import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getOrders } from "../../services/orderService";
import { Link } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchText) ||
      order.customerName?.toLowerCase().includes(searchText) ||
      order.customerPhone?.toLowerCase().includes(searchText);

    const matchesStatus =
      status === "All" || order.orderStatus === status;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (value) => {
    switch (value) {
      case "APPROVED":
      case "PROCESSING":
      case "SHIPPED":
      case "DELIVERED":
        return "bg-green-50 text-green-700";

      case "PENDING":
        return "bg-yellow-50 text-yellow-700";

      case "CANCELLED":
      case "REJECTED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStyle = (value) => {
    switch (value) {
      case "PAID":
        return "bg-green-50 text-green-700";

      case "FAILED":
      case "REJECTED":
        return "bg-red-50 text-red-600";

      case "PROCESSING":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage customer orders and payments
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {orders.length}
                </h2>
              </div>

              <div className="p-3 bg-gray-100 rounded-lg">
                <Package size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {orders.filter(
                    (order) => order.orderStatus === "PENDING"
                  ).length}
                </h2>
              </div>

              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                <Clock size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Paid
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {orders.filter(
                    (order) => order.paymentStatus === "PAID"
                  ).length}
                </h2>
              </div>

              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <CheckCircle size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Rejected
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {orders.filter(
                    (order) =>
                      order.orderStatus === "REJECTED"
                  ).length}
                </h2>
              </div>

              <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                <XCircle size={20} />
              </div>
            </div>
          </div>

        </div>

        {/* Filters */}
        <div className="bg-white border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search order number, customer or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
            </select>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Orders table */}
        <div className="bg-white border rounded-xl overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package
                size={40}
                className="mx-auto text-gray-300 mb-3"
              />

              <h3 className="font-semibold text-gray-800">
                No orders found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Orders will appear here when customers place them.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Order
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Customer
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Items
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Payment
                    </th>

                    <th className="text-left px-5 py-4 font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          #{order.orderNumber}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {order.customerName}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {order.customerPhone}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-gray-700">
                          {order.items?.length || 0} item
                          {order.items?.length === 1 ? "" : "s"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          KSh{" "}
                          {Number(
                            order.totalAmount
                          ).toLocaleString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStyle(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AdminOrders;