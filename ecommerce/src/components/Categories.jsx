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
      image: "https://www.image2url.com/r2/default/images/1791807996713-4fd51be4-2ebb-41a0-9b76-bd947c7261ee.png",
    },
    {
      name: "Shoes",
      description: "Every step, elevated",
      image: "https://www.image2url.com/r2/default/images/1791807923893-01595448-c63e-48a0-b6d9-ceb78f1ed264.png",
    },
    {
      name: "Kitchen",
      description: "Cook beautifully",
      image: "https://www.image2url.com/r2/default/images/1791807817882-e8ccdd1c-dca8-44ae-9399-d1155f73c651.png",
    },
    {
      name: "Household",
      description: "Make home feel good",
      image: "https://www.image2url.com/r2/default/images/1791807466288-891346c3-4d3c-4854-8702-48e540c00fa4.png",
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
            className="flex items-center gap-1 text-sm"
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