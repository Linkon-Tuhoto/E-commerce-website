import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">

        <div className="flex justify-between items-end mb-7">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#b08d1f] uppercase">
              Shop your way
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-medium">
              Browse categories
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1 text-sm"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-xl h-[250px] sm:h-[300px]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end justify-between">

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">
                      {category.name}
                    </h3>

                    <p className="text-xs text-white/80 mt-1">
                      {category.description}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center">
                    <ArrowRight size={17} />
                  </div>

                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}

export default Categories;