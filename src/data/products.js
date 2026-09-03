export const CATEGORIES = [
  { id: 'all', name: 'For You', icon: 'Sparkles' },
  { id: 'home', name: 'Home & Furniture', icon: 'Home' },
  { id: 'mobiles', name: 'Mobiles', icon: 'Smartphone' },
  { id: 'electronics', name: 'Electronics', icon: 'Laptop' },
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'appliances', name: 'Appliances', icon: 'Tv' },
  { id: 'beauty', name: 'Beauty & Care', icon: 'Sparkle' },
  { id: 'toys', name: 'Toys & Sports', icon: 'Gamepad2' },
];

export const PRODUCTS = [
  // Shoes / Fashion Default Featured Item
  {
    id: 'shoes-1',
    title: 'Asics GEL - RUN ADAPT Running Shoes For Men',
    brand: 'Asics',
    category: 'fashion',
    subCategory: "Men's Footwear",
    price: 3399,
    originalPrice: 6999,
    discount: '51% off',
    rating: 3.9,
    reviewsCount: 334,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    sizeInfo: 'Size: 8, Black, 8',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Black', 'Navy', 'Grey'],
    capacityOptions: ['7', '8', '9', '10'],
    deliveryDays: 'Delivery by Sep 11, Fri',
    couponInfo: 'Save extra ₹340 with Coupon',
    offers: [
      'Bank Offer 10% instant discount on Axis Bank Cards',
      'Save extra ₹340 with Coupon applied',
      'Special Discount Price inclusive of extra offers'
    ],
    specs: {
      'Type': 'Running Shoes',
      'Upper Material': 'Mesh & Synthetic',
      'Sole Material': 'Rubber GEL Cushioning',
      'Warranty': '3 Months Brand Warranty'
    }
  },
  // Home & Furniture
  {
    id: 'home-1',
    title: 'Duroflex Ease Plus Fabric 2 Seater Sofa (Finish Color - Chive Green)',
    brand: 'Duroflex',
    category: 'home',
    subCategory: 'Living Room Furniture',
    price: 14249,
    originalPrice: 24999,
    discount: '43% off',
    rating: 4.3,
    reviewsCount: 1204,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Chive Green', 'Navy Blue', 'Warm Beige', 'Chocolate Brown'],
    capacityOptions: ['1 Seater', '2 Seater', '3 Seater'],
    deliveryDays: 'Delivery by Tomorrow, Fri',
    offers: [
      'Bank Offer 10% instant discount on PNB Credit Cards',
      'Special Price Get extra ₹2000 off (price inclusive of cashback)',
      'No Cost EMI starting from ₹1,188/month'
    ],
    specs: {
      'Frame Material': 'Solid Sheesham Wood',
      'Upholstery Material': 'Premium Linen Fabric',
      'Filling Material': 'High Resilience Foam',
      'Warranty': '3 Years Manufacturer Warranty'
    }
  },
  {
    id: 'home-2',
    title: 'Rashee Creations 153 cm (5 ft) Window Net Transparent Curtain (White, Pack of 2)',
    brand: 'Rashee Creations',
    category: 'home',
    subCategory: 'Curtains & Accessories',
    price: 355,
    originalPrice: 999,
    discount: '64% off',
    rating: 4.3,
    reviewsCount: 687,
    isAssured: true,
    isBestseller: false,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['White', 'Off-White', 'Cream'],
    capacityOptions: ['5 ft Window', '7 ft Door', '9 ft Long Door'],
    deliveryDays: 'Free Delivery by Sat',
    offers: ['Buy 2 Get 5% Extra Off'],
    specs: {
      'Material': 'Polyester Net',
      'Transparency': 'Semi-Transparent',
      'Pattern': 'Self Design Floral'
    }
  },
  {
    id: 'home-3',
    title: 'Vastrora Double Size Fitted Terry Cotton Waterproof Mattress Protector (72x72 in)',
    brand: 'Vastrora',
    category: 'home',
    subCategory: 'Bed Linen & Blankets',
    price: 512,
    originalPrice: 1199,
    discount: '57% off',
    rating: 4.0,
    reviewsCount: 4006,
    isAssured: true,
    isBestseller: false,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Green', 'Grey', 'Navy Blue', 'Maroon'],
    capacityOptions: ['Single Bed', 'Double Bed', 'King Bed'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: ['10% cashback on Axis Bank Flipcart Card'],
    specs: {
      'Waterproof': '100% TPU Layer',
      'Material': 'Terry Cotton Top',
      'Fits Mattress Height': 'Up to 8 inches'
    }
  },
  {
    id: 'home-4',
    title: 'FABDRAPE 274 cm (9 ft) Long Door Polyester Blackout Curtain (Cosmic Cream, Solid)',
    brand: 'FABDRAPE',
    category: 'home',
    subCategory: 'Curtains & Accessories',
    price: 1133,
    originalPrice: 2672,
    discount: '57% off',
    rating: 4.4,
    reviewsCount: 151,
    isAssured: true,
    isBestseller: false,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c5163?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c5163?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Cosmic Cream', 'Slate Grey', 'Royal Blue'],
    capacityOptions: ['7 ft Door', '9 ft Long Door'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: ['Combo Offer Available'],
    specs: {
      'Material': 'Triple Weave Blackout Polyester',
      'Light Blocking': 'Up to 90%'
    }
  },

  // Mobiles
  {
    id: 'mobile-1',
    title: 'realme P1 5G (Phoenix Red, 128 GB) (6 GB RAM)',
    brand: 'realme',
    category: 'mobiles',
    subCategory: '5G Smartphones',
    price: 14999,
    originalPrice: 20999,
    discount: '28% off',
    rating: 4.5,
    reviewsCount: 18450,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Phoenix Red', 'Peacock Green'],
    capacityOptions: ['6 GB RAM / 128 GB', '8 GB RAM / 256 GB'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: [
      'Bank Offer ₹1000 Instant Discount on HDFC Credit Cards',
      'Exchange Bonus Up to ₹12,000 off on exchange'
    ],
    specs: {
      'Processor': 'MediaTek Dimensity 7050 5G',
      'Display': '120Hz AMOLED Display',
      'Camera': '50MP Sony LYT-600 OIS Camera',
      'Battery': '5000 mAh with 45W SUPERVOOC Charge'
    }
  },
  {
    id: 'mobile-2',
    title: 'Apple iPhone 15 (Black, 128 GB)',
    brand: 'Apple',
    category: 'mobiles',
    subCategory: 'Flagship Phones',
    price: 64999,
    originalPrice: 79900,
    discount: '18% off',
    rating: 4.7,
    reviewsCount: 52300,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Black', 'Blue', 'Pink', 'Green', 'Yellow'],
    capacityOptions: ['128 GB', '256 GB', '512 GB'],
    deliveryDays: 'Free Express Delivery Today',
    offers: [
      'Flat ₹4,000 Instant Cashback on SBI Credit Cards',
      'No Cost EMI starting at ₹5,416/month'
    ],
    specs: {
      'Chipset': 'A16 Bionic chip with 5-core GPU',
      'Display': 'Super Retina XDR OLED display with Dynamic Island',
      'Camera': '48MP Main + 12MP Ultra Wide camera',
      'Connector': 'USB-C supporting USB 2'
    }
  },

  // Electronics
  {
    id: 'elec-1',
    title: 'MIVI DuoPods A25 True Wireless Earbuds with 40H Playtime & Low Latency',
    brand: 'MIVI',
    category: 'electronics',
    subCategory: 'Audio & Wearables',
    price: 899,
    originalPrice: 2999,
    discount: '70% off',
    rating: 4.2,
    reviewsCount: 38200,
    isAssured: true,
    isBestseller: true,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Midnight Black', 'Ocean Blue', 'Snow White'],
    capacityOptions: ['Standard Edition'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: ['Extra 5% cashback on Flipcart Axis Card'],
    specs: {
      'Bluetooth Version': '5.3',
      'Driver Size': '13mm Bass Drivers',
      'Battery Life': '40 Hours Total Playtime',
      'IP Rating': 'IPX4 Sweat Resistance'
    }
  },
  {
    id: 'elec-2',
    title: 'ASUS TUF Gaming F15 Intel Core i5 11th Gen - (16 GB/512 GB SSD/4GB RTX 2050)',
    brand: 'ASUS',
    category: 'electronics',
    subCategory: 'Laptops',
    price: 52990,
    originalPrice: 74990,
    discount: '29% off',
    rating: 4.4,
    reviewsCount: 8910,
    isAssured: true,
    isBestseller: false,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Graphite Black'],
    capacityOptions: ['16GB RAM / 512GB SSD'],
    deliveryDays: 'Free Delivery by Fri',
    offers: ['No Cost EMI starting ₹4,416/mo', 'Free 1 Year Damage Protection'],
    specs: {
      'Processor': 'Intel Core i5-11400H 11th Gen',
      'Graphics': 'NVIDIA GeForce RTX 2050 4GB VRAM',
      'Display': '15.6" FHD 144Hz Anti-glare Display'
    }
  },

  // Fashion
  {
    id: 'fashion-1',
    title: 'Womens Rayon Straight Embroidery Kurta Set with Dupatta',
    brand: 'Libas',
    category: 'fashion',
    subCategory: 'Ethnic Wear',
    price: 799,
    originalPrice: 2999,
    discount: '73% off',
    rating: 4.3,
    reviewsCount: 14200,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Mustard Yellow', 'Teal Green', 'Wine Red'],
    capacityOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: ['Special Discount applied at checkout'],
    specs: {
      'Fabric': '100% Premium Viscose Rayon',
      'Sleeve Length': '3/4th Sleeves',
      'Neckline': 'Round Neck with Zari Work'
    }
  },
  {
    id: 'fashion-2',
    title: "Men's Slim Fit Pure Cotton Casual Button-Down Shirt",
    brand: 'Roadster',
    category: 'fashion',
    subCategory: "Men's Casual Wear",
    price: 499,
    originalPrice: 1499,
    discount: '66% off',
    rating: 4.1,
    reviewsCount: 9340,
    isAssured: true,
    isBestseller: false,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Olive Green', 'Sky Blue', 'White'],
    capacityOptions: ['39 (M)', '40 (L)', '42 (XL)'],
    deliveryDays: 'Free Delivery by Sat',
    offers: ['Buy 3 Get 10% Extra Off'],
    specs: {
      'Pattern': 'Solid Casual',
      'Fit': 'Slim Fit',
      'Fabric Care': 'Machine Wash Cold'
    }
  },

  // Appliances
  {
    id: 'app-1',
    title: 'LG 7 Kg 5 Star Smart Inverter Fully Automatic Front Load Washing Machine',
    brand: 'LG',
    category: 'appliances',
    subCategory: 'Washing Machines',
    price: 27990,
    originalPrice: 38990,
    discount: '28% off',
    rating: 4.6,
    reviewsCount: 16500,
    isAssured: true,
    isBestseller: true,
    isSponsored: false,
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Middle Black', 'Silver Grey'],
    capacityOptions: ['7.0 Kg', '8.0 Kg'],
    deliveryDays: 'Scheduled Free Delivery + Installation',
    offers: ['Flat ₹2500 Instant Discount with PNB/SBI Cards'],
    specs: {
      'Energy Rating': '5 Star Energy Efficient',
      'Motor': 'Direct Drive Inverter Motor',
      'Feature': 'Hygiene Steam Wash & 6 Motion DD'
    }
  },

  // Beauty & Toys
  {
    id: 'beauty-1',
    title: 'Maybelline New York Super Stay Matte Ink Liquid Lipstick (16H Wear)',
    brand: 'Maybelline',
    category: 'beauty',
    subCategory: 'Makeup',
    price: 489,
    originalPrice: 699,
    discount: '30% off',
    rating: 4.4,
    reviewsCount: 22100,
    isAssured: true,
    isBestseller: true,
    isSponsored: true,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
    ],
    colorOptions: ['Pioneer Red', 'Lover Pink', 'Seductress Nude'],
    capacityOptions: ['5 ml'],
    deliveryDays: 'Free Delivery by Tomorrow',
    offers: ['Buy 2 Get 1 Free on Select Beauty'],
    specs: {
      'Finish': 'Matte Liquid',
      'Longevity': 'Up to 16 Hours Transfer Proof'
    }
  }
];

export const HERO_BANNERS = [
  {
    id: 1,
    title: 'BIG BACHAT DAYS',
    subtitle: 'Sale Is Live! Shop your essentials now',
    bankOffer: 'Up to ₹4,200 Instant Discount on Credit Cards',
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    tag: 'Live Now'
  },
  {
    id: 2,
    title: 'Ethnic Kurta Sets & Sarees',
    subtitle: 'Min. 70% Off | Grab top ethnic must-haves',
    bankOffer: 'Extra ₹500 off on first order',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    tag: 'Fashion Festive'
  },
  {
    id: 3,
    title: 'Flagship 5G Smartphones',
    subtitle: 'realme, Samsung & iPhone Deals from ₹2,666/Month',
    bankOffer: 'Exchange Bonus up to ₹15,000',
    bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    tag: 'Tech Mega Sale'
  }
];
