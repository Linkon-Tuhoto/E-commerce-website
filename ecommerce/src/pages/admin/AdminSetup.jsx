
import { useState } from "react";
import axios from "axios";
import { ShieldCheck, Eye, EyeOff, LoaderCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminSetup() {
  const [form, setForm] = useState({
    setupKey: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/setup-admin`,
        form
      );

      setMessage(response.data.message);
      setForm({
        setupKey: "",
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the administrator account."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
            <ShieldCheck size={34} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Mamboga Admin Setup
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create the initial administrator account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Admin setup key
            </label>
            <input
              className={inputClass}
              name="setupKey"
              type="password"
              value={form.setupKey}
              onChange={handleChange}
              placeholder="Enter setup key"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Full name
            </label>
            <input
              className={inputClass}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <input
              className={inputClass}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Phone number
            </label>
            <input
              className={inputClass}
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="2547XXXXXXXX"
              autoComplete="tel"
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
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="At least 12 characters"
                autoComplete="new-password"
                minLength={12}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 px-4 py-3.5 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <LoaderCircle className="animate-spin" size={20} />}
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          This setup is intended for the initial administrator only.
        </p>
      </div>
    </div>
  );
}
