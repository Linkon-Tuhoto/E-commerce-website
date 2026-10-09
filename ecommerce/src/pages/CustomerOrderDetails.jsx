
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

import { getOrderById } from "../services/orderService";

const money = (value) =>
  `KSh ${Number(value || 0).toLocaleString("en-KE")}`;

const steps = [
  { status: "PENDING", label: "Order placed" },
  { status: "APPROVED", label: "Order approved" },
  { status: "PROCESSING", label: "Preparing your order" },
  { status: "SHIPPED", label: "Dispatched for delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

const statusRank = (status) =>
  steps.findIndex((step) => step.status === status);

function PaymentCard({ title, status, reference }) {
  const paid = status === "PAID";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{title}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <h3 className="font-bold text-[#171717]">{status || "PENDING"}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            paid
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {paid ? "Paid" : "Not confirmed"}
        </span>
      </div>

      {reference && (
        <p className="mt-3 break-all text-xs text-gray-500">
          Reference: {reference}
        </p>
      )}
    </div>
  );
}

function CustomerOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);

        if (active) setOrder(data.order || data);
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load this order.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] p-8 text-center text-gray-500">
        Loading order details…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[50vh] px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            {error || "Order not found."}
          </p>
          <Link
            to="/account/orders"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-700"
          >
            <ArrowLeft size={16} /> Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  const address = order.deliveryAddress || {};
  const orderStatus = order.orderStatus || "PENDING";
  const currentRank = statusRank(orderStatus);
  const isCancelled = ["CANCELLED", "REJECTED"].includes(orderStatus);

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/account/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} /> Back to my orders
        </Link>

        <div className="mb-6 rounded-xl bg-[#171717] p-6 text-white sm:p-8">
          <p className="text-xs text-gray-300">ORDER DETAILS</p>

          <h1 className="mt-2 break-words text-2xl font-bold">
            {order.orderNumber || order._id}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs">
              {orderStatus}
            </span>
            <span className="text-sm text-gray-300">
              Placed{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "date unavailable"}
            </span>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Truck size={20} className="text-[#9A7710]" />
            Order progress
          </h2>

          {isCancelled ? (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              This order is {orderStatus.toLowerCase()}. Please contact the store
              if you need assistance.
            </div>
          ) : (
            <ol className="mt-6 space-y-5">
              {steps.map((step, index) => {
                const completed =
                  currentRank >= 0 && index <= currentRank;

                const isCurrent = step.status === orderStatus;

                return (
                  <li key={step.status} className="flex items-start gap-3">
                    {completed ? (
                      <CheckCircle2
                        size={21}
                        className="mt-0.5 shrink-0 text-green-600"
                      />
                    ) : (
                      <Circle
                        size={21}
                        className="mt-0.5 shrink-0 text-gray-300"
                      />
                    )}

                    <div>
                      <p
                        className={`text-sm ${
                          isCurrent
                            ? "font-bold text-[#171717]"
                            : completed
                              ? "font-medium text-gray-700"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>

                      {isCurrent && (
                        <p className="mt-1 text-xs text-[#9A7710]">
                          Current status
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-5 text-xs leading-5 text-gray-500">
            Progress updates when the store changes your order status. Delivery
            dates are not estimated here because no delivery schedule has been
            provided.
          </p>
        </section>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <PaymentCard
            title="Product payment"
            status={order.productPaymentStatus || order.paymentStatus}
            reference={
              order.productPaymentReference || order.paymentReference
            }
          />

          <PaymentCard
            title="Transport payment"
            status={order.transportPaymentStatus || "NOT_SET"}
            reference={order.transportPaymentReference}
          />
        </div>

        <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <Package size={20} className="text-[#9A7710]" />
              Items ordered
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {(order.items || []).map((item, index) => (
              <div
                key={`${item.product || item.name}-${index}`}
                className="flex gap-4 p-5"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name || "Product"}
                    className="h-20 w-20 shrink-0 rounded-lg border border-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Package size={25} className="text-gray-400" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="break-words font-semibold">
                    {item.name || "Product"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                    {item.size ? ` · Size: ${item.size}` : ""}
                    {item.color ? ` · Color: ${item.color}` : ""}
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {money(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <MapPin size={20} className="text-[#9A7710]" />
              Delivery address
            </h2>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>{address.area || "Area not provided"}</p>
              <p>
                {[address.town, address.county].filter(Boolean).join(", ")}
              </p>
              {address.building && <p>{address.building}</p>}
              {address.directions && (
                <p>Directions: {address.directions}</p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-bold">Order summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Subtotal</span>
                <span>{money(order.subtotal)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">Transport fee</span>
                <span>
                  {Number(order.deliveryFee) > 0
                    ? money(order.deliveryFee)
                    : "Not set"}
                </span>
              </div>

              <div className="flex justify-between gap-3 border-t border-gray-100 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{money(order.totalAmount)}</span>
              </div>
            </div>

            <Link
              to="/shop"
              className="mt-5 block rounded-lg bg-[#D4AF37] px-4 py-3 text-center text-sm font-semibold text-black hover:bg-[#c19d25]"
            >
              Continue shopping
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrderDetails;
