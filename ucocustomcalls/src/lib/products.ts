import { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "duck-pt-whiskey",
    slug: "pintail-acrylic-whiskey-river",
    title: "Pintail Acrylic — Whiskey River",
    description:
      "Hand-turned acrylic Pintail duck call tuned for open water with crisp top end and easy low air start.",
    category: "duck",
    priceCents: 95_00,
    images: [
      { src: "/images/wc.jpg", alt: "Whiskey River Pintail", primary: true },
      { src: "/images/whh.jpg", alt: "Whiskey River Pintail close" }
    ],
    badges: ["Acrylic", "Single Reed", "Handturned"],
    features: ["Open water tuning", "Crisp top end", "Easy low air start"],
    variantOptions: { reed: ["single"], color: ["Whiskey River"] },
    audio: [{ src: "/audio/pintail-openwater.mp3", label: "Open Water Demo" }],
    inStock: true,
    ratingValue: 4.8,
    ratingCount: 57
  },
  {
    id: "goose-canada-ocean",
    slug: "canada-goose-ocean-green",
    title: "Canada Goose — Ocean Green",
    description:
      "Fast break, deep honk, effortless clucks. Field-ready acrylic tuned for Canada geese.",
    category: "goose",
    priceCents: 110_00,
    images: [
      { src: "/images/goose.jpg", alt: "Ocean Green Canada Goose", primary: true }
    ],
    badges: ["Acrylic", "Goose"],
    features: ["Fast break", "Deep honk resonance", "Effortless clucks"],
    audio: [{ src: "/audio/canada-honk.mp3", label: "Canada Honk" }],
    inStock: true,
    ratingValue: 4.6,
    ratingCount: 34
  },
  {
    id: "lanyard-brass",
    slug: "paracord-lanyard-brass",
    title: "Paracord Lanyard — Brass Finisher",
    description:
      "Durable paracord with brass finisher. Holds multiple calls, field-tested in PA winters.",
    category: "lanyards",
    priceCents: 35_00,
  images: [{ src: "/images/obla2.jpg", alt: "Paracord Lanyard", primary: true }],
    badges: ["Paracord", "Handmade"],
    features: ["Cold weather tested", "Multiple call drops", "Brass accent"],
    inStock: true
  }
];

export const CATEGORIES = [
  { handle: "duck", name: "Duck Calls" },
  { handle: "goose", name: "Goose Calls" },
  { handle: "lanyards", name: "Paracord Lanyards" },
  { handle: "accessories", name: "Accessories" }
] as const;
