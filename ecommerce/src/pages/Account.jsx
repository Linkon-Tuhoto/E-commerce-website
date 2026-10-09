
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CreditCard,
  UserRound,
  ArrowRight,
  ShoppingBag,
  Clock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderService";

const money = (value) =>
  `KSh ${Number(value || 0).toLocaleString("en-KE")}`;

function Account() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (active) {
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load your orders.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const pendingOrders = orders.filter((order) =>
    ["PENDING", "APPROVED", "PROCESSING", "SHIPPED"].includes(
      order.orderStatus
    )
  );

  const paidOrders = orders.filter(
    (order) => order.productPaymentStatus === "PAID"
  );

  const recentOrders = orders.slice(0, 3);

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

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-2xl bg-[#171717] p-6 text-white sm:p-8">
          <p className="text-sm text-gray-300">CUSTOMER ACCOUNT</p>

          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome{user?.name ? `, ${user.name}` : " back"}!
          </h1>

          <p className="mt-2 max-w-xl text-sm text-gray-300">
            Manage your purchases, track deliveries and review your previous
            orders from one place.
          </p>

          <Link
            to="/shop"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#c19d25]"
          >
            Continue shopping <ArrowRight size={17} />
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "All orders",
              value: loading ? "…" : orders.length,
              icon: Package,
            },
            {
              label: "Orders in progress",
              value: loading ? "…" : pendingOrders.length,
              icon: Truck,
            },
            {
              label: "Orders with product payment",
              value: loading ? "…" : paidOrders.length,
              icon: CreditCard,
            },
            {
              label: "Account",
              value: user?.name || "Customer",
              icon: UserRound,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <Icon className="text-[#B08D1F]" size={21} />
                </div>

                <p className="mt-3 break-words text-2xl font-bold text-[#171717]">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h2 className="font-bold text-[#171717]">Recent orders</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your latest purchases
                </p>
              </div>

              <Link
                to="/account/orders"
                className="shrink-0 text-sm font-semibold text-[#9A7710] hover:underline"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <p className="p-6 text-sm text-gray-500">Loading orders…</p>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag
                  size={34}
                  className="mx-auto text-gray-300"
                />
                <h3 className="mt-3 font-semibold">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your purchases will appear here after you place an order.
                </p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black"
                >
                  Explore products
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-[#171717]">
                        {order.orderNumber || order._id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        {money(order.totalAmount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "PENDING"}
                      </span>

                      <Link
                        to={`/account/orders/${order._id}`}
                        className="text-sm font-semibold text-[#9A7710] hover:underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F1E6]">
                <UserRound size={22} className="text-[#9A7710]" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold">My details</h2>
                <p className="text-xs text-gray-500">Your account information</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Full name</p>
                <p className="mt-1 break-words font-medium">
                  {user?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="mt-1 break-words font-medium">
                  {user?.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="mt-1 font-medium">
                  {user?.phone || "Not available"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-[#faf7ec] p-3 text-xs leading-5 text-gray-600">
              <Clock size={15} className="mb-1 text-[#9A7710]" />
              Order and payment updates are shown in your order details.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Account;
