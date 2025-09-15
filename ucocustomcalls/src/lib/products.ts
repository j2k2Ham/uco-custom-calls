import { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: "duck-pt-whiskey",
    slug: "pintail-acrylic-whiskey-river",
    title: "Pintail Acrylic — Whiskey River",
    description:
      "Hand-turned acrylic Pintail duck call tuned for open water with crisp top end and easy low air start.",
    category: "duck",
    price: 95_00,
    images: [
      { src: "/images/duck-whiskey-1.jpg", alt: "Whiskey River Pintail" },
      { src: "/images/duck-whiskey-2.jpg", alt: "Whiskey River Pintail close" }
    ],
    badges: ["Acrylic", "Single Reed", "Handturned"],
    options: { reed: ["single"], color: ["Whiskey River"] },
    audio: [{ src: "/audio/pintail-openwater.mp3", label: "Open Water Demo" }],
    inStock: true
  },
  {
    id: "goose-canada-ocean",
    slug: "canada-goose-ocean-green",
    title: "Canada Goose — Ocean Green",
    description:
      "Fast break, deep honk, effortless clucks. Field-ready acrylic tuned for Canada geese.",
    category: "goose",
    price: 110_00,
    images: [
      { src: "/images/goose-ocean-1.jpg", alt: "Ocean Green Canada Goose" }
    ],
    badges: ["Acrylic", "Goose"],
    audio: [{ src: "/audio/canada-honk.mp3", label: "Canada Honk" }],
    inStock: true
  },
  {
    id: "lanyard-brass",
    slug: "paracord-lanyard-brass",
    title: "Paracord Lanyard — Brass Finisher",
    description:
      "Durable paracord with brass finisher. Holds multiple calls, field-tested in PA winters.",
    category: "lanyards",
    price: 35_00,
    images: [{ src: "/images/lanyard-brass-1.jpg", alt: "Paracord Lanyard" }],
    inStock: true
  }
];

export const CATEGORIES = [
  { handle: "duck", name: "Duck Calls" },
  { handle: "goose", name: "Goose Calls" },
  { handle: "lanyards", name: "Paracord Lanyards" }
] as const;
