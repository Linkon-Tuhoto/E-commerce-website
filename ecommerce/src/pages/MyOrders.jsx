
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Search } from "lucide-react";
import { getMyOrders } from "../services/orderService";

const money = (value) =>
  `KSh ${Number(value || 0).toLocaleString("en-KE")}`;

const statusClass = (status) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700",
    APPROVED: "bg-blue-50 text-blue-700",
    PROCESSING: "bg-indigo-50 text-indigo-700",
    SHIPPED: "bg-purple-50 text-purple-700",
    DELIVERED: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-700",
    REJECTED: "bg-red-50 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let active = true;

    getMyOrders()
      .then((data) => {
        if (active) {
          setOrders(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Unable to load your order history.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchText = [
      order.orderNumber,
      order.orderStatus,
      order._id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || order.orderStatus === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} /> My account
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#171717] sm:text-3xl">
            My orders
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track current purchases and revisit your previous orders.
          </p>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#D4AF37]"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#D4AF37]"
          >
            <option value="ALL">All orders</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">
              Loading your orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={38} className="mx-auto text-gray-300" />
              <h2 className="mt-3 font-semibold">No matching orders</h2>
              <p className="mt-1 text-sm text-gray-500">
                Try another search or browse our products to place your first order.
              </p>
              <Link
                to="/shop"
                className="mt-4 inline-block rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <article
                  key={order._id}
                  className="p-5 transition hover:bg-gray-50 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs text-gray-500">ORDER NUMBER</p>
                      <h2 className="mt-1 font-bold text-[#171717]">
                        {order.orderNumber || order._id}
                      </h2>
                      <p className="mt-2 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus || "PENDING"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="mt-1 text-sm font-medium">
                        {(order.items || []).reduce(
                          (total, item) => total + Number(item.quantity || 0),
                          0
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Product payment</p>
                      <p className="mt-1 text-sm font-medium">
                        {order.productPaymentStatus || order.paymentStatus || "PENDING"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="mt-1 text-sm font-bold">
                        {money(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      Transport: {order.transportPaymentStatus || "NOT_SET"}
                    </p>

                    <Link
                      to={`/account/orders/${order._id}`}
                      className="rounded-lg border border-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#171717] hover:bg-[#faf7ec]"
                    >
                      View order & track
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
