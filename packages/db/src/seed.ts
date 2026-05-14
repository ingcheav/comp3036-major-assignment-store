import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertCategory(name: string) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function createProductIfMissing(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
}) {
  const existing = await prisma.product.findFirst({ where: { name: data.name } });
  if (existing) {
    return prisma.product.update({ where: { id: existing.id }, data });
  }
  return prisma.product.create({ data });
}

export async function seed() {
  console.log("🌱 Seeding data");

  const laptops = await upsertCategory("Laptops");
  const tablets = await upsertCategory("Tablets");
  const phones = await upsertCategory("Smartphones");
  const audio = await upsertCategory("Audio");
  const accessories = await upsertCategory("Accessories");

  await prisma.user.upsert({
    where: { email: "admin@electromart.com" },
    update: { name: "Admin", role: "ADMIN" },
    create: {
      name: "Admin",
      email: "admin@electromart.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@electromart.com" },
    update: { name: "Test User", role: "USER" },
    create: {
      name: "Test User",
      email: "user@electromart.com",
      password: await bcrypt.hash("user123", 10),
      role: "USER",
    },
  });

  const products = [
    {
      name: 'MacBook Pro 16"',
      description:
        "Apple M5 Pro chip, 18‑core CPU, 20‑core GPU, 16‑core Neural Engine. Provides more performance and higher memory options for more demanding workflows.",
      price: 2999.99,
      stock: 25,
      categoryId: laptops.id,
      imageUrl:
        "https://media.bechtle.com/is/180712/1c4b3d4ee288fc9434f5175bf56070570/c3/-/17d0a51b86a44179ae57761fd4e273d3?version=0&x=3840&quality=75",
    },
    {
      name: "XPS 14 Laptop (2026)",
      description:
        "Intel® Core™ Ultra 5 325 processor with 8 high‑efficiency cores and integrated Intel® Graphics. Delivers smooth everyday performance with fast LPDDR5X memory and power‑efficient design for portable productivity.",
      price: 2599.99,
      stock: 20,
      categoryId: laptops.id,
      imageUrl:
        "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-14-da14260/media-gallery/touch/laptop-da14260t-gray-copilot-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=320&wid=376&qlt=100,1&resMode=sharp2&size=376,320&chrss=full",
    },
    {
      name: "iPhone 17 Pro Max",
      description:
        "A19 Pro chip with vapour cooling, 256GB, 48MP triple‑camera system, 6.9‑inch Super Retina XDR display. Delivers faster sustained performance, sharper photography, and the best battery life ever in an iPhone.",
      price: 1999.99,
      stock: 25,
      categoryId: phones.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/816124-Product-0-I-638930469004888934.jpg?v=1757904066",
    },
    {
      name: "Samsung Galaxy S25",
      description:
        "Snapdragon 8 Elite, 200MP camera, 6.2 Dynamic AMOLED display.",
      price: 999.99,
      stock: 20,
      categoryId: phones.id,
      imageUrl:
        "https://s3-ap-southeast-2.amazonaws.com/wc-prod-pim/JPEG_1000x1000/SAS25256NV_samsung_galaxy_s25_256gb_navy.jpg",
    },
    {
      name: "Google Pixel 10 Pro XL",
      description:
        "Google Tensor G5 chip with upgraded TPU, 256GB, 50MP triple‑camera system, 6.8″ LTPO Super Actua display. Delivers faster AI performance, brighter visuals, and pro‑level photography with up to 100× zoom.",
      price: 1799.99,
      stock: 17,
      categoryId: phones.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/816898-Product-0-I-638888198404497099_bde504e9-a243-4f20-8721-e475f93154ca.jpg?v=1773626347",
    },
    {
      name: "Sony WH-1000XM6",
      description:
        "HD Noise Cancelling Processor QN3 + Integrated Processor V2, AI‑beamforming mics, up to 30‑hour battery life. Delivers industry‑leading noise cancellation, clearer voice pickup, and premium comfort for everyday and travel use.",
      price: 449.99,
      stock: 30,
      categoryId: audio.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/812874-Product-0-I-638827703403543800.jpg?v=1773103926",
    },
    {
      name: "AirPods Pro 3",
      description:
        "Advanced acoustic architecture, next‑gen Active Noise Cancellation, built‑in heart rate sensing. Delivers up to 2× better noise reduction, richer audio clarity, and longer listening time for everyday and workout use.",
      price: 349.99,
      stock: 50,
      categoryId: audio.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/841227-Product-0-I-638930604606650237_8e9e1bfc-39e6-4e6c-80ba-b5fb5a862442.jpg?v=1759894145",
    },
    {
      name: "Bose QuietComfort 45",
      description:
        "Legendary comfort and acoustic noise cancelling technology.",
      price: 279.99,
      stock: 22,
      categoryId: audio.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/659957-Product-0-I-638303307604034509_60044264-39cc-45e9-952c-af61747eaa27.jpg?v=1728617014",
    },
    {
      name: "Logitech MX Master 4",
      description:
        "Haptic Sense Panel with customizable feedback, MagSpeed scroll wheel, 8K DPI precision sensor. Provides faster workflow control, smoother scrolling, and more accurate tracking across any surface.",
      price: 159.99,
      stock: 50,
      categoryId: accessories.id,
      imageUrl:
        "https://www.jbhifi.com.au/cdn/shop/files/812446-Product-0-I-638941163404955453.jpg?v=1758519606",
    },
    {
      name: "Razer Basilisk V3 Customizable Ergonomic Gaming Mouse",
      description:
        "26K DPI Focus+ optical sensor, 10+1 programmable buttons, HyperScroll Tilt Wheel. Provides faster precision aiming, deeper customization, and smoother scrolling for competitive gaming performance.",
      price: 59.99,
      stock: 40,
      categoryId: accessories.id,
      imageUrl:
        "https://m.media-amazon.com/images/I/61AcT0ZuO3L._AC_SY355_.jpg",
    },
    {
      name: "Keychron Q1 Keyboard",
      description:
        "QMK mechanical keyboard, aluminium frame, hot-swappable switches.",
      price: 99.99,
      stock: 35,
      categoryId: accessories.id,
      imageUrl:
        "https://www.keychron.com/cdn/shop/products/Keychron-Q1-QMK-VIA-custom-mechanical-keyboard-75-percent-layout-full-aluminum-black-frame-for-Mac-Windows-iOS-RGB-backlight-with-hot-swappable-Gateron-G-Pro-switch-red.jpg?v=1657854465&width=900",
    },
    {
      name: "Nuphy Air V3 Series Keyboard",
      description:
        "3.5mm deep‑travel Nano switches, 4000mAh battery, CNC‑machined anodized aluminium case. Provides smoother mechanical feel, dramatically longer battery life, and a more refined, ultra‑portable typing experience.",
      price: 139.99,
      stock: 35,
      categoryId: accessories.id,
      imageUrl:
        "https://nuphy.com/cdn/shop/files/2.4_Air75_V3_middle.png?v=1770186462&width=888",
    },
    {
      name: "Anker 100W USB-C Hub",
      description:
        "7-in-1 USB-C hub with 4K HDMI, SD card, PD charging.",
      price: 59.99,
      stock: 60,
      categoryId: accessories.id,
      imageUrl:
        "https://m.media-amazon.com/images/I/71ZzUx9bwlL._AC_SY450_.jpg",
    },
  ];

  for (const product of products) {
    await createProductIfMissing(product);
  }

  // Seed a test order so orders tests pass
  const testUser = await prisma.user.findUnique({ 
    where: { email: "user@electromart.com" } 
  });

  const macbook = await prisma.product.findFirst({ 
    where: { name: 'MacBook Pro 16"' } 
  });

  const airpods = await prisma.product.findFirst({ 
    where: { name: "AirPods Pro 3" } 
  });

  if (testUser && macbook && airpods) {
    // Check if test order already exists to avoid duplicates
    const existingOrder = await prisma.order.findFirst({
      where: { userId: testUser.id, status: "PAID" }
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          userId: testUser.id,
          total: macbook.price + airpods.price,
          status: "PAID",
          orderItems: {
            create: [
              {
                productId: macbook.id,
                quantity: 1,
                price: macbook.price,
              },
              {
                productId: airpods.id,
                quantity: 1,
                price: airpods.price,
              },
            ],
          },
        },
      });
      console.log("✅ Test order seeded");
    }
  }
}
