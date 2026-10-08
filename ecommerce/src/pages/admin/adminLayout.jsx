import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Store,
} from "lucide-react";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/admin" className="text-xl font-bold text-[#D4AF37]">
            MAMBOGA
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">

          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Package size={18} />
            Products
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Users size={18} />
            Users
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <ShoppingBag size={18} />
            Orders
          </Link>

          <Link
            to="/admin/customers"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Users size={18} />
            Customers
          </Link>

          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            <Settings size={18} />
            Settings
          </Link>

        </nav>

        {/* Back to store */}
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white transition"
          >
            <Store size={18} />
            View Store
          </Link>
        </div>

      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;