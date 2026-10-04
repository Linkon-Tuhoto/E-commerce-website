import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-[#171717] text-white">

      {/* Newsletter */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] text-[#D4AF37] uppercase">
              Stay in the loop
            </p>

            <h2 className="mt-2 text-xl sm:text-2xl font-medium">
              New drops, good deals.
            </h2>
          </div>

          <form className="w-full lg:w-[365px] flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 min-w-0 h-11 px-4 bg-[#171717] border border-gray-700 rounded-l-lg outline-none text-sm text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
            />

            <button
              type="submit"
              className="h-11 px-5 sm:px-6 bg-[#D4AF37] text-black font-semibold text-sm rounded-r-lg hover:bg-[#c19d25] transition"
            >
              Subscribe
            </button>
          </form>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-9 sm:mt-10" />

        {/* Main footer */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-9 lg:gap-8 py-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">

            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-md bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                M
              </span>

              <span className="text-xl font-bold tracking-[0.12em]">
                MAMBOGA
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-gray-400 max-w-[230px]">
              Thoughtfully selected fashion, kitchen and home essentials
              for modern Kenyan living.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">

              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaInstagram size={15} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaFacebookF size={15} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition"
              >
                <FaTwitter size={15} />
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold mb-4">
              Shop
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <Link
                to="/shop?category=Clothing"
                className="block hover:text-[#D4AF37] transition"
              >
                Clothing
              </Link>

              <Link
                to="/shop?category=Shoes"
                className="block hover:text-[#D4AF37] transition"
              >
                Shoes
              </Link>

              <Link
                to="/shop?category=Kitchen"
                className="block hover:text-[#D4AF37] transition"
              >
                Kitchen
              </Link>

              <Link
                to="/shop?category=Household"
                className="block hover:text-[#D4AF37] transition"
              >
                Household
              </Link>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-4">
              Help
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <Link
                to="/support"
                className="block hover:text-[#D4AF37] transition"
              >
                Customer Support
              </Link>

              <Link
                to="/delivery"
                className="block hover:text-[#D4AF37] transition"
              >
                Delivery Information
              </Link>

              <Link
                to="/returns"
                className="block hover:text-[#D4AF37] transition"
              >
                Returns & Refunds
              </Link>

              <Link
                to="/contact"
                className="block hover:text-[#D4AF37] transition"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-4">
              Company
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <Link
                to="#"
                className="block hover:text-[#D4AF37] transition"
              >
                About Us
              </Link>

              <Link
                to="/privacy"
                className="block hover:text-[#D4AF37] transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="block hover:text-[#D4AF37] transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Visit Us */}
          <div>
            <h3 className="text-sm font-semibold mb-4">
              Visit us
            </h3>

            <div className="space-y-2 text-sm text-gray-400 leading-5">
              <p>
                Westgate Shopping Mall
              </p>

              <p>
                Mwanzi Road, Nairobi
              </p>

              <p>
                0712 345 678
              </p>

              <p>
                hello@mamboga.co.ke
              </p>
            </div>
          </div>

        </div>

        {/* Bottom divider */}
        <div className="border-t border-gray-800" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pt-5">

          <p className="text-xs text-gray-500">
            © 2026 Mamboga Retail Ltd. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2">

            <span className="px-2 py-1 bg-white rounded text-[9px] font-bold text-black">
              M-PESA
            </span>

            <span className="px-2 py-1 bg-white rounded text-[9px] font-bold text-black">
              VISA
            </span>

            <span className="px-2 py-1 bg-white rounded text-[9px] font-bold text-black">
              Mastercard
            </span>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;