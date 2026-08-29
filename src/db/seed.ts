import { sqlite } from "./index";

const categories = [
  ["fresh", "Fresh picks", "🥬", 1],
  ["pantry", "Pantry staples", "🫙", 2],
  ["dairy", "Dairy & eggs", "🥛", 3],
  ["snacks", "Snacks & drinks", "🍿", 4],
  ["home", "Home care", "🧼", 5],
] as const;

const products = [
  [
    "p1",
    "fresh",
    "Avocado Hass",
    "Creamy, ripe and ready to eat",
    "2 pieces",
    149,
    179,
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80",
    "Ripe today",
  ],
  [
    "p2",
    "fresh",
    "Baby Spinach",
    "Tender leaves, washed and packed",
    "200 g",
    89,
    99,
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
    "Farm fresh",
  ],
  [
    "p3",
    "fresh",
    "Red Seedless Grapes",
    "Sweet, crisp and hand-picked",
    "500 g",
    129,
    159,
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80",
    "Best seller",
  ],
  [
    "p4",
    "pantry",
    "Basmati Rice",
    "Long grain rice for everyday meals",
    "5 kg",
    499,
    569,
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
    "Value pack",
  ],
  [
    "p5",
    "pantry",
    "Cold Pressed Olive Oil",
    "Extra virgin, smooth and peppery",
    "500 ml",
    389,
    449,
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    "Kitchen pick",
  ],
  [
    "p6",
    "pantry",
    "Multigrain Atta",
    "Stone-ground blend of 5 grains",
    "5 kg",
    319,
    349,
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    null,
  ],
  [
    "p7",
    "dairy",
    "Farm Fresh Milk",
    "Pasteurised full cream milk",
    "1 L",
    68,
    null,
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80",
    "Delivered chilled",
  ],
  [
    "p8",
    "dairy",
    "Free Range Eggs",
    "Rich yolks from happy hens",
    "12 pack",
    139,
    159,
    "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80",
    "Farm fresh",
  ],
  [
    "p9",
    "snacks",
    "Sea Salt Potato Crisps",
    "Kettle cooked and extra crunchy",
    "150 g",
    99,
    110,
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&q=80",
    "Movie night",
  ],
  [
    "p10",
    "snacks",
    "Sparkling Lime Water",
    "Bright, bubbly refreshment",
    "4 x 330 ml",
    179,
    null,
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80",
    "Chilled",
  ],
  [
    "p11",
    "home",
    "Plant Based Dishwash",
    "Tough on grease, gentle on hands",
    "500 ml",
    159,
    189,
    "https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=600&q=80",
    "New",
  ],
  [
    "p12",
    "home",
    "Laundry Liquid",
    "Fresh linen clean for everyday loads",
    "1 L",
    249,
    299,
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&q=80",
    "Save 17%",
  ],
] as const;

const insertCategory = sqlite.prepare(
  "INSERT OR IGNORE INTO categories (id,name,emoji,sort_order) VALUES (?,?,?,?)",
);
const insertProduct = sqlite.prepare(
  "INSERT OR IGNORE INTO products (id,category_id,name,description,unit,price,original_price,image_url,badge) VALUES (?,?,?,?,?,?,?,?,?)",
);
const seed = sqlite.transaction(() => {
  for (const category of categories) insertCategory.run(...category);
  for (const product of products) insertProduct.run(...product);
});
seed();
console.log(
  `Seeded ${categories.length} categories and ${products.length} products.`,
);
