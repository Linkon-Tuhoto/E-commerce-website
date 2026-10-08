import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// GET AUTH TOKEN
// =====================================================

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken")
  );
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// =====================================================
// ADMIN USERS
// =====================================================

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ===================================================
  // FETCH USERS
  // ===================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You must be logged in as an admin.");
      }

      const response = await fetch(
        `${API_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch users"
        );
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(
        error.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD USERS
  // ===================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===================================================
  // FILTER USERS
  // ===================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name
          ?.toLowerCase()
          .includes(searchValue) ||
        user.email
          ?.toLowerCase()
          .includes(searchValue) ||
        user.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        user.role
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [users, search]);

  // ===================================================
  // STATISTICS
  // ===================================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "admin"
  ).length;

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-[#D4AF37]"
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[#b08d1f] uppercase">
            Administration
          </p>

          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage registered users.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-lg
            border
            border-gray-200
            bg-white
            text-sm
            font-medium
            text-gray-700
            hover:bg-gray-50
            transition
          "
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Total */}

        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {totalUsers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
              <Users
                size={21}
                className="text-[#b08d1f]"
              />
            </div>

          </div>

        </div>

        {/* Active */}

        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Active users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {activeUsers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
              <UserCheck
                size={21}
                className="text-green-600"
              />
            </div>

          </div>

        </div>

        {/* Inactive */}

        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inactive users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {inactiveUsers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-red-50 flex items-center justify-center">
              <UserX
                size={21}
                className="text-red-500"
              />
            </div>

          </div>

        </div>

        {/* Admins */}

        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {adminUsers}
              </p>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShieldCheck
                size={21}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">

        {/* TABLE HEADER */}

        <div className="p-4 sm:p-5 border-b border-gray-200">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Registered users
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredUsers.length} user
                {filteredUsers.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative w-full sm:w-80">

              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search users..."
                className="
                  w-full
                  h-10
                  pl-10
                  pr-3
                  rounded-lg
                  border
                  border-gray-200
                  outline-none
                  text-sm
                  focus:border-[#D4AF37]
                  focus:ring-1
                  focus:ring-[#D4AF37]
                "
              />

            </div>

          </div>

        </div>

        {/* TABLE */}

        {filteredUsers.length === 0 ? (

          <div className="py-16 text-center">

            <Users
              size={35}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm text-gray-500">
              No users found.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="
                          w-10
                          h-10
                          rounded-full
                          bg-[#D4AF37]/15
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-semibold
                          text-[#9a7914]
                        ">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>

                        <div>

                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PHONE */}

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {user.phone || "—"}
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">

                      {user.role === "admin" ? (

                        <span className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1
                          rounded-full
                          bg-blue-50
                          text-blue-700
                          text-xs
                          font-medium
                        ">
                          <ShieldCheck size={13} />
                          Admin
                        </span>

                      ) : (

                        <span className="
                          inline-flex
                          px-2.5
                          py-1
                          rounded-full
                          bg-gray-100
                          text-gray-600
                          text-xs
                          font-medium
                        ">
                          Customer
                        </span>

                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      {user.isActive ? (

                        <span className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1
                          rounded-full
                          bg-green-50
                          text-green-700
                          text-xs
                          font-medium
                        ">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          Active
                        </span>

                      ) : (

                        <span className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5
                          py-1
                          rounded-full
                          bg-red-50
                          text-red-600
                          text-xs
                          font-medium
                        ">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          Inactive
                        </span>

                      )}

                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}