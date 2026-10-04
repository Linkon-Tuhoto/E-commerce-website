
import { Link } from "react-router-dom";
import householdImage from "../assets/household.png";

function PromoBanner() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">

        {/* BANNER */}

        <div
          className="
            w-full
            overflow-hidden
            rounded-2xl
            grid
            grid-cols-1
            md:grid-cols-[40%_60%]
            md:aspect-[2.3/1]
          "
        >

          {/* ================= GOLD SECTION ================= */}

          <div className="bg-[#D4AF37] flex items-center px-7 sm:px-10 lg:px-12 py-10 md:py-0">

            <div className="max-w-[430px]">

              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#171717]">
                The home edit
              </p>

              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-[40px] leading-[1.05] font-medium text-[#171717]">
                Little upgrades,
                <br />
                lovelier living.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#171717]/80">
                Curated kitchen and home pieces from KSh 950.
              </p>

              <Link
                to="/shop?category=Household"
                className="
                  inline-flex
                  items-center
                  justify-center
                  mt-6
                  px-5
                  h-10
                  rounded-md
                  bg-[#171717]
                  text-white
                  text-sm
                  font-semibold
                  hover:bg-black
                  transition
                "
              >
                Shop home
              </Link>

            </div>

          </div>


          {/* ================= IMAGE ================= */}

          <div className="w-full h-[260px] md:h-full overflow-hidden">

            <img
              src={householdImage}
              alt="Home and household products"
              className="
                w-full
                h-full
                object-cover
                object-center
              "
            />

          </div>

        </div>

      </div>
    </section>
  );
}

export default PromoBanner;