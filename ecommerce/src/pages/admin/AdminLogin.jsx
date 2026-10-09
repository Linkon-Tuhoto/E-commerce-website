
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email: email.trim().toLowerCase(), password }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("The server returned an invalid login response.");
      }

      if (user.role !== "admin") {
        setError("This account does not have administrator access.");
        return;
      }

      // Save the credentials only after confirming the admin role.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Keep compatibility with existing pages that use these keys.
      localStorage.setItem("surveyToken", token);
      localStorage.setItem("authToken", token);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Mamboga Admin
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                className={`${inputClass} pr-12`}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3.5 font-bold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {loading && (
              <LoaderCircle size={20} className="animate-spin" />
            )}
            {loading ? "Signing in..." : "Admin Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not an administrator?{" "}
          <Link
            to="/login"
            className="font-semibold text-yellow-700 hover:underline"
          >
            Customer login
          </Link>
        </p>
      </div>
    </div>
  );
}
