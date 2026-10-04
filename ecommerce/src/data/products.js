import shirt from "../assets/shirt.png";
import shoes from "../assets/shoesImage.png";
import kitchen from "../assets/kitchen.png";
import dress from "../assets/dress.png";
import sneakers from "../assets/sneakers.png";
import bowl from "../assets/bowl.png";
import basket from "../assets/basket.png";
import cushions from "../assets/cushion.png";

export const products = [
  {
    id: 1,
    name: "Essential Linen Shirt",
    category: "Clothing",
    gender: "Men",
    price: 1890,
    oldPrice: 2400,
    discount: 21,
    rating: 4.8,
    reviews: 48,
    featured: true,

    description:
      "A comfortable and stylish linen shirt designed for everyday wear.",

    sizes: ["S", "M", "L", "XL"],

    colors: [
      {
        name: "Sand",
        value: "#D8C39A",
      },
      {
        name: "Black",
        value: "#222222",
      },
    ],

    images: [shirt],

    inStock: true,
  },

  {
    id: 2,
    name: "Cloud Runner Sneakers",
    category: "Shoes",
    gender: "Unisex",
    price: 3290,
    oldPrice: 4180,
    discount: 21,
    rating: 4.9,
    reviews: 42,
    featured: true,

    description:
      "Lightweight everyday sneakers designed for comfort and movement.",

    sizes: ["39", "40", "41", "42"],

    colors: [
      {
        name: "Grey",
        value: "#777777",
      },
      {
        name: "Black",
        value: "#222222",
      },
    ],

    images: [shoes],

    inStock: true,
  },

  {
    id: 3,
    name: "Non-Stick Cookware Set",
    category: "Kitchen",
    gender: "Unisex",
    price: 4950,
    oldPrice: 5900,
    discount: 16,
    rating: 4.7,
    reviews: 42,
    featured: true,

    description:
      "A practical cookware set designed for everyday cooking.",

    sizes: [],

    colors: [
      {
        name: "Black",
        value: "#222222",
      },
      {
        name: "Red",
        value: "#9D2C20",
      },
    ],

    images: [kitchen],

    inStock: true,
  },

  {
    id: 4,
    name: "Soft Knit Midi Dress",
    category: "Clothing",
    gender: "Women",
    price: 2750,
    oldPrice: null,
    discount: null,
    rating: 4.6,
    reviews: 32,
    featured: true,

    description:
      "A comfortable midi dress with a soft finish and versatile everyday style.",

    sizes: ["S", "M", "L"],

    colors: [
      {
        name: "Pink",
        value: "#EFA5A0",
      },
      {
        name: "Black",
        value: "#222222",
      },
    ],

    images: [dress],

    inStock: true,
  },

  {
    id: 5,
    name: "Everyday White Trainers",
    category: "Shoes",
    gender: "Unisex",
    price: 3600,
    oldPrice: 4200,
    discount: 14,
    rating: 4.8,
    reviews: 38,
    featured: true,

    description:
      "Clean and comfortable trainers suitable for everyday outfits.",

    sizes: ["38", "39", "40", "41", "42"],

    colors: [
      {
        name: "White",
        value: "#FFFFFF",
      },
      {
        name: "Black",
        value: "#222222",
      },
    ],

    images: [sneakers],

    inStock: true,
  },

  {
    id: 6,
    name: "Artisan Serving Bowl",
    category: "Kitchen",
    gender: "Unisex",
    price: 1450,
    oldPrice: null,
    discount: null,
    rating: 4.5,
    reviews: 21,
    featured: true,

    description:
      "A stylish serving bowl designed for everyday dining and entertaining.",

    sizes: [],

    colors: [
      {
        name: "Cream",
        value: "#E8DDC8",
      },
    ],

    images: [bowl],

    inStock: true,
  },

  {
    id: 7,
    name: "Woven Storage Basket",
    category: "Household",
    gender: "Unisex",
    price: 2100,
    oldPrice: 2600,
    discount: 19,
    rating: 4.7,
    reviews: 27,
    featured: true,

    description:
      "A practical woven basket for keeping your home organised.",

    sizes: [],

    colors: [
      {
        name: "Natural",
        value: "#B89B70",
      },
    ],

    images: [basket],

    inStock: true,
  },

  {
    id: 8,
    name: "Cotton Cushion Pair",
    category: "Household",
    gender: "Unisex",
    price: 1750,
    oldPrice: null,
    discount: null,
    rating: 4.6,
    reviews: 19,
    featured: true,

    description:
      "Soft cotton cushions that add comfort and style to your living space.",

    sizes: [],

    colors: [
      {
        name: "Beige",
        value: "#D8C8AE",
      },
    ],

    images: [cushions],

    inStock: true,
  },
];