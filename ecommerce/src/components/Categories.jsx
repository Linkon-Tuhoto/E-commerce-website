import { ArrowRight } from "lucide-react";

import clothingImage from "../assets/clothing.png";
import shoesImage from "../assets/shoesImage.png";
import kitchenImage from "../assets/kitchen.png";
import householdImage from "../assets/household.png";

function Categories() {
  const categories = [
    {
      name: "Clothing",
      description: "Men, women & kids",
      image: clothingImage,
    },
    {
      name: "Shoes",
      description: "Every step, elevated",
      image: shoesImage,
    },
    {
      name: "Kitchen",
      description: "Cook beautifully",
      image: kitchenImage,
    },
    {
      name: "Household",
      description: "Make home feel good",
      image: householdImage,
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14 sm:py-16">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-7">

          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] text-[#b08d1f] uppercase">
              Shop your way
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-[-0.03em] text-[#171717]">
              Browse categories
            </h2>
          </div>

          <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-[#b08d1f]">
            View all
            <ArrowRight size={16} />
          </button>

        </div>


        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {categories.map((category) => (
            <div
              key={category.name}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                h-[250px]
                sm:h-[300px]
                lg:h-[340px]
                cursor-pointer
              "
            >

              {/* IMAGE */}
              <img
                src={category.image}
                alt={category.name}
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />

              {/* DARK OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/15
                  to-transparent
                "
              />

              {/* TEXT */}
              <div className="absolute bottom-4 left-4 right-4 text-white">

                <div className="flex items-end justify-between gap-2">

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-[10px] sm:text-xs tracking-[0.08em] text-white/80">
                      {category.description}
                    </p>
                  </div>

                  {/* ARROW */}
                  <div
                    className="
                      shrink-0
                      w-9
                      h-9
                      rounded-full
                      bg-white
                      text-black
                      flex
                      items-center
                      justify-center
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    <ArrowRight size={17} />
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>


        {/* MOBILE VIEW ALL */}
        <button className="sm:hidden mt-5 flex items-center gap-1 text-sm font-medium text-gray-700">
          View all
          <ArrowRight size={16} />
        </button>

      </div>
    </section>
  );
}

export default Categories;