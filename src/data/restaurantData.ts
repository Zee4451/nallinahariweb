import type { MenuItem, Review } from '@/types/restaurant';

export const RESTAURANT_INFO = {
  name: 'Nahari King',
  brandTitle: 'The Nahari 👑 King',
  tagline: 'Delhi Ka Asli Swaad, Ab Indore Ke Khajrana Mein',
  subtext: 'Indore’s Most Celebrated Slow-Cooked Nalli Nihari, Paye & Royal Non-Veg Thaal',
  phone: '099775 71717',
  whatsapp: '919977571717',
  email: 'order@thenahariking.com',
  instagram: 'https://www.instagram.com/thenahariking/',
  instagramHandle: '@thenahariking',
  googleRating: 4.5,
  googleReviewCount: '8+ Google Reviews & Viral Vlogs',
  address: 'Chota Gate, 56 Kadar Colony, Opp. Dargah Gate 2, Dargah Pakiza Road, Khajrana, Indore, Madhya Pradesh 452016',
  landmark: 'Opposite Dargah Gate 2, Corner of Kadar Colony / Gulzar Choraha, Khajrana, Indore',
  timings: {
    fajrNihari: '06:00 AM – 10:30 AM (Indore Morning Special Nihari & Khamiri)',
    lunch: '12:30 PM – 04:00 PM',
    dinner: '06:30 PM – 12:00 AM (Midnight Nihari • Peak Vibe at 11 PM)'
  }
};

export const TIME_SLOTS = [
  '07:00 AM (Early Morning Special Nihari)',
  '08:30 AM (Indore Morning Desi Ghee Breakfast)',
  '01:00 PM (Afternoon Lunch)',
  '07:30 PM (Evening First Batch)',
  '09:00 PM (Prime Dastarkhwan Dinner)',
  '10:30 PM (Late Night Khajrana Rush)',
  '11:30 PM (Midnight Nihari Special - Closes 12 AM)'
];

export const MENU_ITEMS: MenuItem[] = [
  // --- SIGNATURE NIHARI & PAYE ---
  {
    id: 'special-nalli-nihari',
    name: 'Nahari King Special Nalli Nihari',
    urduName: 'نہاری کنگ سپیشل نلی نہاری',
    description: 'Delhi style slow charcoal-simmered tender mutton shank with juicy molten bone marrow (Nalli), enriched with pure desi roghan.',
    price: 340,
    category: 'nihari',
    tag: '👑 Indore Bestseller',
    isSignature: true,
    spiceLevel: 'zesty',
    cookTimeHours: 10,
    image: '/images/dishes/special-nalli-nihari.jpg',
    portionSizes: [
      { name: 'Half Nalli Nihari (1 Shank + Marrow)', price: 340, serves: '1 Person' },
      { name: 'Full King Nalli Nihari (2 ShOption)', price: 620, serves: '2 Persons' },
      { name: 'Jumbo Royal Family Bowl (4 ShOption)', price: 1190, serves: '3-4 Persons' }
    ]
  },
  {
    id: 'paye-ki-nihari',
    name: 'Khajrana Special Mutton Paye Nihari',
    urduName: 'خجرانہ سپیشل پائے نہاری',
    description: 'Slow-cooked trotters simmered for 12 hours over gentle coals. Collagen-rich, aromatic and deeply comforting.',
    price: 300,
    category: 'nihari',
    tag: 'Winter & Dawn Favorite',
    isSignature: true,
    spiceLevel: 'classic',
    cookTimeHours: 12,
    image: '/images/dishes/mutton-paye-nihari.jpg',
    portionSizes: [
      { name: 'Half Bowl (2 Paye)', price: 300, serves: '1 Person' },
      { name: 'Full Bowl (4 Paye)', price: 560, serves: '2 Persons' }
    ]
  },
  {
    id: 'shahi-mutton-korma-curry',
    name: 'Purani Delhi Shahi Mutton Korma',
    urduName: 'شاہی مٹن قورمہ',
    description: 'Tender baby mutton simmered in a velvety golden-brown fried onion paste, yogurt, and aromatic nutmeg-mace roghan gravy.',
    price: 320,
    category: 'nihari',
    tag: 'Chef Special',
    isSignature: true,
    spiceLevel: 'classic',
    cookTimeHours: 4,
    image: '/images/dishes/mutton-curry-korma.jpg',
    portionSizes: [
      { name: 'Half Bowl (2 Pcs)', price: 320, serves: '1 Person' },
      { name: 'Full Bowl (4 Pcs)', price: 590, serves: '2 Persons' }
    ]
  },
  {
    id: 'royal-butter-mutton',
    name: 'Royal Butter Mutton Gravy',
    urduName: 'رائل بٹر مٹن گریوی',
    description: 'Succulent slow-braised mutton finished with pure butter, fresh cream, roasted fenugreek (kasuri methi), served best with layered parathas.',
    price: 350,
    category: 'nihari',
    tag: 'Rich & Creamy',
    isSignature: true,
    spiceLevel: 'mild',
    cookTimeHours: 4,
    image: '/images/dishes/butter-mutton-gravy.jpg',
    portionSizes: [
      { name: 'Half Plate (2 Pcs)', price: 350, serves: '1 Person' },
      { name: 'Full Plate (4 Pcs)', price: 640, serves: '2 Persons' }
    ]
  },
  {
    id: 'maghaz-nalli-nihari',
    name: 'Gosht Maghaz Nalli Nihari',
    urduName: 'گوشت مغز نلی نہاری',
    description: 'Signature rich mutton Nihari topped with pan-roasted fresh brain marrow (Maghaz), ginger juliennes, and lime.',
    price: 420,
    category: 'nihari',
    tag: 'Crown Special',
    isSignature: true,
    spiceLevel: 'zesty',
    cookTimeHours: 10,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    portionSizes: [
      { name: 'Single Portion', price: 420, serves: '1 Person' },
      { name: 'Double Maghaz Royal Deg', price: 780, serves: '2-3 Persons' }
    ]
  },
  {
    id: 'chicken-zafrani-nihari',
    name: 'Chicken Zafrani Nihari',
    urduName: 'چکن زعفرانی نہاری',
    description: 'Juicy country chicken leg pieces slow cooked in aromatic saffron and mild potli gravy. Lighter yet bursting with flavor.',
    price: 240,
    category: 'nihari',
    tag: 'Chicken Special',
    isSignature: false,
    spiceLevel: 'mild',
    cookTimeHours: 5,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80'
  },

  // --- VIRAL INDORE THAAL OFFERS ---
  {
    id: 'grand-nonveg-thaal',
    name: 'Viral Indore Grand Non-Veg Thaal (₹799 Offer)',
    urduName: 'شاہی نان ویج تھال',
    description: 'Indore ki viral feast! Includes Nalli Nihari, Mutton Paye, Seekh Kebabs, Dum Biryani, 4 Khamiri/Rumali Rotis, and Raita.',
    price: 799,
    category: 'biryani',
    tag: '🔥 Viral Food Vlog Special',
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    portionSizes: [
      { name: 'Maharaja Thaal (Serves 2-3)', price: 799, serves: '2-3 Persons' },
      { name: 'Sultan Family Grand Thaal (Serves 4-5)', price: 1399, serves: '4-5 Persons' }
    ]
  },
  {
    id: 'indore-combo-100',
    name: 'Khajrana Street Combo (Half Nihari + 3 Rotis)',
    urduName: 'کھجرانہ سٹریٹ کومبو',
    description: 'Pocket-friendly viral offer: Piping hot rich aromatic Nihari served with 3 tandoor rotis and green chutney.',
    price: 150,
    category: 'nihari',
    tag: 'Pocket Friendly',
    isSignature: false,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
  },

  // --- BIRYANI & RICE ---
  {
    id: 'nalli-dum-biryani',
    name: 'Nahari King Mutton Dum Biryani',
    urduName: 'مٹن دم بریانی',
    description: 'Long-grain fragrant basmati rice layered with slow-cooked spiced succulent mutton, topped with whole marrow bone and fresh mint.',
    price: 360,
    category: 'biryani',
    tag: 'Mutton Dum Special',
    isSignature: true,
    spiceLevel: 'classic',
    image: '/images/dishes/mutton-dum-biryani.jpg',
    portionSizes: [
      { name: 'Half Handi', price: 360, serves: '1-2 Persons' },
      { name: 'Full Handi Platter', price: 650, serves: '2-3 Persons' }
    ]
  },

  // --- KEBABS ---
  {
    id: 'seekh-kebab-khajrana',
    name: 'Charcoal Seekh Kebab (4 Pcs)',
    urduName: 'سیخ کباب خاص',
    description: 'Charcoal grilled spiced minced meat basted with butter and tossed with chaat masala, onions and lemon.',
    price: 220,
    category: 'kebabs',
    tag: 'Charcoal Grilled',
    isSignature: false,
    spiceLevel: 'zesty',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'galawati-kebab-indore',
    name: 'Shahi Galawati Kebab (4 Pcs)',
    urduName: 'شاہی گلابٹی کباب',
    description: 'Melt-in-mouth smoked mince with aromatic spices and clove charcoal aroma.',
    price: 240,
    category: 'kebabs',
    tag: 'Melt-in-Mouth',
    isSignature: true,
    spiceLevel: 'mild',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },

  // --- ARTISAN BREADS ---
  {
    id: 'delhi-khamiri-roti',
    name: 'Old Delhi Khamiri Roti',
    urduName: 'دہلی خمیری روٹی',
    description: 'Spongy, yeast-leavened tandoor bread perfect for soaking up the rich roghan gravy of Nalli Nihari.',
    price: 25,
    category: 'breads',
    tag: 'Must With Nihari',
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rumali-roti',
    name: 'Tava Rumali Roti',
    urduName: 'رومالی روٹی',
    description: 'Handkerchief-thin soft roti baked over an inverted dome tawa.',
    price: 15,
    category: 'breads',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shahi-sheermal',
    name: 'Indore Shahi Sheermal',
    urduName: 'شاہی شیرمال',
    description: 'Saffron-infused mildly sweet milk bread glazed with desi ghee.',
    price: 70,
    category: 'breads',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80'
  },

  // --- DESSERTS ---
  {
    id: 'shahi-tukda-indore',
    name: 'Shahi Tukda with Rabri',
    urduName: 'شاہی ٹکڑا ربڑی',
    description: 'Golden fried bread soaked in saffron syrup, layered with thick rabri and pistachios.',
    price: 120,
    category: 'desserts',
    tag: 'Sweet Finale',
    isSignature: true,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'zafrani-phirni-khajrana',
    name: 'Zafrani Matka Phirni',
    urduName: 'زعفرانی پھرنی',
    description: 'Chilled ground rice pudding cooked with thick milk, saffron, and slivered almonds in an earthen bowl.',
    price: 90,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
  },

  // --- BEVERAGES ---
  {
    id: 'kashmiri-kahwa-tea',
    name: 'Kashmiri Saffron Kahwa',
    urduName: 'کشمیری قہوہ',
    description: 'Warm digestive green tea infused with cinnamon, green cardamom, almond slivers and pure saffron.',
    price: 80,
    category: 'beverages',
    tag: 'Digestive',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shahi-gulab-sharbat',
    name: 'Shahi Gulab Rooh Sharbat',
    urduName: 'شاہی گلاب شربت',
    description: 'Refreshing cold rose drink with soaked basil seeds (sabja) and chilled milk.',
    price: 60,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-rizwan',
    author: 'Rizwan Shah (Food Vlogger)',
    city: 'Rizwan Shah Vlogs • Indore',
    rating: 5,
    quote: 'Delhi ka asli swad! Opp. Dargah Gate 2 Khajrana par jo Nalli Nihari aur ₹799 wali Non-Veg Thaal milti hai, poore Indore me koi takkar nahi hai. Marrow falls right out of the bone!',
    dishRecommended: 'Nahari King Special Nalli Nihari & Thaal',
    date: 'Viral Review'
  },
  {
    id: 'rev-google-1',
    author: 'Fardin Shah',
    city: 'Khajrana Local Guide (Google Review ⭐ 4.5)',
    rating: 5,
    quote: 'Best Nihari in Indore! Piping hot Khamiri roti ke saath molten marrow aur roghan ka swad lajawab hai. 11 PM late night rush is insane!',
    dishRecommended: 'Half Nalli Nihari with Khamiri Roti',
    date: 'Verified Dine-in'
  },
  {
    id: 'rev-google-2',
    author: 'Indore Foodie Biker',
    city: 'Food Critic & Explorer',
    rating: 5,
    quote: 'If you crave authentic Jama Masjid / Old Delhi style slow simmered Nihari in Madhya Pradesh, Nahari King at Kadar Colony is the only destination.',
    dishRecommended: 'Gosht Maghaz Nalli Nihari',
    date: 'Recent Visit'
  }
];
