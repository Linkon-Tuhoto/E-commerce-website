import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Authentication will be connected to the backend later.
  };

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[500px] items-center px-4 py-12">

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">

          {/* Heading */}
          <div className="text-center">

            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#D4AF37] font-bold text-black">
              M
            </div>

            <h1 className="text-2xl font-semibold text-[#171717]">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your account and orders.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#B38F00] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember */}
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-[#D4AF37]"
              />
              Remember me
            </label>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#c19d25]"
            >
              Sign In
            </button>

          </form>

          {/* Register */}
          <div className="mt-7 border-t border-gray-100 pt-6 text-center">

            <p className="text-sm text-gray-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="mt-2 inline-block text-sm font-semibold text-[#B38F00] hover:underline"
            >
              Create an account
            </Link>

          </div>

        </div>
      </div>
    </main>
  );
}

export default SignIn;