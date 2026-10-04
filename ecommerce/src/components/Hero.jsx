import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import  heroimg from "../assets/heroimg.png";


function Hero() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-35 sm:pt-40">

        {/* HERO CONTAINER */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            bg-[#f4f0e7]
            min-h-[520px]
            lg:min-h-[560px]
            flex
            flex-col
            lg:flex-row
          "
        >

          {/* ================= LEFT CONTENT ================= */}
          <div
            className="
              w-full
              lg:w-[50%]
              px-7
              sm:px-10
              lg:px-14
              py-12
              lg:py-16
              flex
              flex-col
              justify-center
              relative
              z-10
            "
          >

            {/* SMALL BADGE */}
            <div
              className="
                inline-flex
                w-fit
                items-center
                rounded-full
                border
                border-gray-300
                px-4
                py-2
                text-[10px]
                sm:text-xs
                font-semibold
                tracking-[0.08em]
                text-gray-700
              "
            >
              MID-YEAR EDIT · UP TO 30% OFF
            </div>


            {/* HEADING */}
            <h1
              className="
                mt-7
                text-[42px]
                leading-[1.02]
                sm:text-5xl
                lg:text-[58px]
                xl:text-[62px]
                font-medium
                tracking-[-0.04em]
                text-[#171717]
                max-w-[550px]
              "
            >
              Everyday style.
              <span className="block text-[#b08d1f]">
                Made remarkable.
              </span>
            </h1>


            {/* DESCRIPTION */}
            <p
              className="
                mt-6
                text-sm
                sm:text-base
                leading-7
                text-gray-600
                max-w-[500px]
              "
            >
              Fresh looks and home essentials, thoughtfully selected
              for life in Kenya.
            </p>


            {/* CTA */}
            <button
              className="
                mt-8
                w-fit
                flex
                items-center
                gap-3
                rounded-md
                bg-[#D4AF37]
                px-6
                py-3.5
                text-sm
                font-semibold
                text-black
                transition
                hover:bg-[#c19d25]
              "
            >
              Shop the collection
              <ArrowRight size={18} />
            </button>


            {/* BENEFITS */}
            <div
              className="
                mt-9
                flex
                flex-wrap
                items-center
                gap-x-7
                gap-y-4
                text-xs
                sm:text-sm
                text-gray-600
              "
            >

              <div className="flex items-center gap-2">
                <Truck size={18} strokeWidth={1.7} />
                <span>Nationwide delivery</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} strokeWidth={1.7} />
                <span>Secure M-Pesa</span>
              </div>

            </div>

          </div>


          {/* ================= RIGHT IMAGE ================= */}
          <div
            className="
              relative
              w-full
              lg:w-[50%]
              min-h-[360px]
              lg:min-h-full
            "
          >

            <img
              src={heroimg}
              alt="Featured collection"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
              "
            />


            {/* FLOATING CARD */}
            <div
              className="
                absolute
                bottom-5
                right-5
                sm:bottom-7
                sm:right-7
                bg-white
                rounded-xl
                px-5
                py-4
                shadow-lg
                min-w-[170px]
              "
            >

              <p
                className="
                  text-[9px]
                  font-semibold
                  tracking-[0.15em]
                  text-[#b08d1f]
                "
              >
                NEW SEASON
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                Modern essentials
              </p>

              <button
                className="
                  mt-3
                  text-xs
                  font-medium
                  text-gray-700
                  underline
                  underline-offset-4
                "
              >
                Explore now
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;