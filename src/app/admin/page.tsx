"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useCMS } from "@/components/CMSContext";
import {
  MENU_ITEMS as DEFAULT_MENU_ITEMS,
  RESTAURANT_INFO as DEFAULT_RESTAURANT_INFO,
} from "@/data/restaurantData";
import type { MenuItem as GlobalMenuItem } from "@/types/restaurant";

type OrderStatus =
  | "Pending"
  | "Cooking in Degh"
  | "Ready for Pickup"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";

type OrderFilter = "All" | "Pending" | "Cooking" | "Completed";
type PaymentMethod = "Cash" | "UPI" | "Online";
type Portion =
  | "Single Bowl"
  | "Half Degh"
  | "Full Degh"
  | "Plate"
  | "Handi"
  | "Single Serving"
  | "Glass";
type SpiceLevel = "Mild" | "Medium" | "Royal Hot" | "Extra Hot";
type AdminTab = "orders" | "reservations" | "inventory" | "reviews" | "banners" | "settings";
type ReviewFilter = "all" | "featured";

interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  portion: Portion;
  spiceLevel: SpiceLevel;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

interface DailyStats {
  grossRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  previousRevenue: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tag: string;
  emoji: string;
  stockStatus: "In Stock" | "Sold Out";
  stockCount: number;
  stockUnit: string;
}

interface Reservation {
  id: string;
  guestName: string;
  contact: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingType:
  | "Traditional Diwan"
  | "Royal Dining Table"
  | "Shahi Majlis VIP";
  status: "Confirmed" | "Seated" | "Completed" | "Cancelled";
  notes?: string;
}

interface Review {
  id: string;
  customer: string;
  rating: number;
  quote: string;
  dish: string;
  date: string;
  approved: boolean;
  featured: boolean;
}

interface AdminData {
  version: 1;
  orders: Order[];
  dailyStats: DailyStats;
  menu: MenuItem[];
  reservations: Reservation[];
  reviews: Review[];
}

interface ShiftInfo {
  label: string;
  detail: string;
  tone: "gold" | "emerald" | "crimson";
}

interface NewOrderDraft {
  customerName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  portion: Portion;
  spiceLevel: SpiceLevel;
  notes: string;
  selectedMenuItemId: string;
  quantity: number;
  items: OrderItem[];
}

interface ReservationDraft {
  guestName: string;
  contact: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingType: Reservation["seatingType"];
  notes: string;
}

type SeedItemSpec = readonly [string, number, Portion, SpiceLevel];

const SESSION_STORAGE_KEY = "nahari-king-admin-session";
const DATA_STORAGE_KEY = "nahari-king-admin-data-v1";

const restaurantData: { menu: MenuItem[] } = {
  menu: [
    {
      id: "NK-001",
      name: "Nahari King Special Nalli Nihari",
      description: "Overnight dum-cooked marrow shanks with hand-ground masala.",
      price: 520,
      category: "Signature Stews",
      tag: "Royal Signature",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 24,
      stockUnit: "shanks",
    },
    {
      id: "NK-002",
      name: "Shahi Mutton Paye",
      description: "Silken trotter gravy slow-reduced until dawn.",
      price: 380,
      category: "Signature Stews",
      tag: "Dawn Special",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 14,
      stockUnit: "bowls",
    },
    {
      id: "NK-003",
      name: "Mutton Dum Biryani",
      description: "Fragrant aged basmati layered with saffron and marinated mutton.",
      price: 440,
      category: "Biryani",
      tag: "Dum Cooked",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 8,
      stockUnit: "handis",
    },
    {
      id: "NK-004",
      name: "Old Delhi Khamiri Roti",
      description: "Naturally fermented, soft-centred royal bread.",
      price: 90,
      category: "Breads",
      tag: "Tandoor",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 42,
      stockUnit: "pieces",
    },
    {
      id: "NK-005",
      name: "Warqi Roomali Roti",
      description: "Paper-thin layered bread finished with pure ghee.",
      price: 70,
      category: "Breads",
      tag: "House Favourite",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 35,
      stockUnit: "pieces",
    },
    {
      id: "NK-006",
      name: "Nihari Keema",
      description: "Minced mutton folded into the king's signature gravy.",
      price: 460,
      category: "Signature Stews",
      tag: "Chef's Pick",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 18,
      stockUnit: "bowls",
    },
    {
      id: "NK-007",
      name: "Kakori Galawat Kebab",
      description: "Melt-in-mouth kebabs scented with rose and nutmeg.",
      price: 390,
      category: "Kebabs",
      tag: "Awadhi Classic",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 20,
      stockUnit: "plates",
    },
    {
      id: "NK-008",
      name: "Sheermal-e-Khaas",
      description: "Saffron-kneaded sweet bread baked in the royal tandoor.",
      price: 120,
      category: "Breads",
      tag: "Saffron",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 30,
      stockUnit: "pieces",
    },
    {
      id: "NK-009",
      name: "Shahi Tukda",
      description: "Golden bread, rabri, reduced saffron syrup and silver leaf.",
      price: 220,
      category: "Desserts",
      tag: "Royal Finish",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 16,
      stockUnit: "bowls",
    },
    {
      id: "NK-010",
      name: "Illayachi Phirni",
      description: "Stone-ground rice pudding infused with green cardamom.",
      price: 160,
      category: "Desserts",
      tag: "Clay Pot",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 20,
      stockUnit: "bowls",
    },
    {
      id: "NK-011",
      name: "Royal Badam Lassi",
      description: "Thick cultured lassi with almonds, pistachio and rose.",
      price: 140,
      category: "Beverages",
      tag: "Chilled",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 24,
      stockUnit: "glasses",
    },
    {
      id: "NK-012",
      name: "Zafrani Gulab Jamun",
      description: "Soft khoya dumplings soaked in saffron-rose syrup.",
      price: 180,
      category: "Desserts",
      tag: "Saffron",
      emoji: "",
      stockStatus: "In Stock",
      stockCount: 24,
      stockUnit: "pieces",
    },
  ],
};

const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; tone: string }
> = {
  Pending: { label: "Pending", tone: "gold" },
  "Cooking in Degh": { label: "Cooking", tone: "crimson" },
  "Ready for Pickup": { label: "Ready", tone: "blue" },
  "Out for Delivery": { label: "Out for Delivery", tone: "violet" },
  Completed: { label: "Completed", tone: "emerald" },
  Cancelled: { label: "Cancelled", tone: "muted" },
};

const COOKING_STATUSES: readonly OrderStatus[] = [
  "Cooking in Degh",
  "Ready for Pickup",
  "Out for Delivery",
];

const ADVANCE_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Cooking in Degh",
  "Cooking in Degh": "Ready for Pickup",
  "Ready for Pickup": "Out for Delivery",
  "Out for Delivery": "Completed",
};

const NAV_ITEMS: ReadonlyArray<{
  id: AdminTab;
  label: string;
  icon: string;
  kicker: string;
}> = [
    { id: "orders", label: "Live Orders", icon: "🍲", kicker: "Kitchen Display" },
    { id: "reservations", label: "Reservations", icon: "📅", kicker: "Guest Book" },
    { id: "inventory", label: "Menu & Degh", icon: "🥘", kicker: "Dishes & Images CMS" },
    { id: "banners", label: "Viral Offers", icon: "🏷️", kicker: "Homepage Banners" },
    { id: "settings", label: "Profile & Timings", icon: "🏢", kicker: "Store Info CMS" },
    { id: "reviews", label: "Reviews", icon: "⭐", kicker: "Moderation" },
  ];

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function toLocalISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function todayISO(): string {
  return toLocalISODate(new Date());
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toLocalISODate(date);
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function createOrderId(): string {
  return `NK-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | Date): string {
  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTime(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatDateLabel(): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function getActiveShift(): ShiftInfo {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) {
    return {
      label: "Morning Fajr",
      detail: "Sehri & slow-degh prep",
      tone: "gold",
    };
  }

  if (hour >= 11 && hour < 17) {
    return {
      label: "Lunch",
      detail: "Royal lunch service",
      tone: "emerald",
    };
  }

  return {
    label: "Midnight Nihari",
    detail: "Final dum & degh finish",
    tone: "crimson",
  };
}

function statusTone(status: OrderStatus): string {
  return ORDER_STATUS_META[status]?.tone ?? "muted";
}

function calculateGrowth(current: number, previous: number): number {
  if (previous <= 0) return 0;
  return ((current - previous) / previous) * 100;
}

function csvCell(value: unknown): string {
  const raw = String(value ?? "");
  return `"${raw.replace(/"/g, '""')}"`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function loadAdminData(): AdminData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DATA_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.orders) ||
      !Array.isArray(parsed.menu) ||
      !Array.isArray(parsed.reservations) ||
      !Array.isArray(parsed.reviews) ||
      !isRecord(parsed.dailyStats)
    ) {
      return null;
    }

    const dailyStats = parsed.dailyStats;
    const numericStatsAreValid = [
      "grossRevenue",
      "totalOrders",
      "pendingOrders",
      "previousRevenue",
    ].every((key) => typeof dailyStats[key] === "number");

    if (!numericStatsAreValid) return null;

    return {
      version: 1,
      orders: parsed.orders as Order[],
      dailyStats: dailyStats as unknown as DailyStats,
      menu: parsed.menu as MenuItem[],
      reservations: parsed.reservations as Reservation[],
      reviews: parsed.reviews as Review[],
    };
  } catch {
    return null;
  }
}

function makeSeedItems(specs: readonly SeedItemSpec[]): OrderItem[] {
  const menuLookup = new Map(
    restaurantData.menu.map((item) => [item.id, item] as const),
  );

  return specs.map(([menuItemId, quantity, portion, spiceLevel], index) => {
    const menuItem = menuLookup.get(menuItemId);
    if (!menuItem) throw new Error(`Unknown seed menu item: ${menuItemId}`);

    return {
      id: createId(`line-${index}`),
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity,
      unitPrice: menuItem.price,
      portion,
      spiceLevel,
    };
  });
}

function makeSeedOrder(
  id: string,
  customerName: string,
  phone: string,
  status: OrderStatus,
  paymentMethod: PaymentMethod,
  createdAt: string,
  specs: readonly SeedItemSpec[],
  notes?: string,
): Order {
  const items = makeSeedItems(specs);

  return {
    id,
    customerName,
    phone,
    items,
    totalAmount: items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    ),
    paymentMethod,
    status,
    createdAt,
    notes,
  };
}

function makeSeedReservation(
  id: string,
  guestName: string,
  contact: string,
  timeSlot: string,
  guests: number,
  seatingType: Reservation["seatingType"],
  status: Reservation["status"],
  notes?: string,
): Reservation {
  return {
    id,
    guestName,
    contact,
    date: todayISO(),
    timeSlot,
    guests,
    seatingType,
    status,
    notes,
  };
}

function makeSeedReview(
  id: string,
  customer: string,
  rating: number,
  quote: string,
  dish: string,
  ageInDays: number,
  approved: boolean,
  featured: boolean,
): Review {
  return {
    id,
    customer,
    rating,
    quote,
    dish,
    date: daysAgo(ageInDays),
    approved,
    featured,
  };
}

function seedAdminData(): AdminData {
  const orders: Order[] = [
    makeSeedOrder(
      "NK-240601",
      "Aariz Khan",
      "+91 98765 43210",
      "Cooking in Degh",
      "UPI",
      minutesAgo(7),
      [
        ["NK-001", 2, "Single Bowl", "Royal Hot"],
        ["NK-004", 4, "Plate", "Mild"],
      ],
      "Gate no. 3 delivery",
    ),
    makeSeedOrder(
      "NK-240602",
      "Meher Fatima",
      "+91 98220 11445",
      "Pending",
      "Online",
      minutesAgo(11),
      [["NK-003", 1, "Handi", "Medium"]],
    ),
    makeSeedOrder(
      "NK-240603",
      "Danish Qureshi",
      "+91 77380 99112",
      "Ready for Pickup",
      "Cash",
      minutesAgo(16),
      [
        ["NK-002", 2, "Single Bowl", "Extra Hot"],
        ["NK-008", 2, "Plate", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240604",
      "Sanjana Patel",
      "+91 90991 22778",
      "Out for Delivery",
      "UPI",
      minutesAgo(24),
      [["NK-001", 1, "Half Degh", "Medium"]],
      "Call before arrival",
    ),
    makeSeedOrder(
      "NK-240605",
      "Arman Siddiqui",
      "+91 95100 66234",
      "Completed",
      "Online",
      minutesAgo(31),
      [
        ["NK-003", 2, "Handi", "Royal Hot"],
        ["NK-011", 2, "Glass", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240606",
      "Ruhi Verma",
      "+91 81410 55091",
      "Pending",
      "UPI",
      minutesAgo(36),
      [["NK-007", 2, "Plate", "Medium"]],
    ),
    makeSeedOrder(
      "NK-240607",
      "Kabir Malhotra",
      "+91 99988 10203",
      "Cooking in Degh",
      "Cash",
      minutesAgo(43),
      [
        ["NK-001", 1, "Full Degh", "Extra Hot"],
        ["NK-005", 6, "Plate", "Mild"],
      ],
      "Family celebration",
    ),
    makeSeedOrder(
      "NK-240608",
      "Nisha Gupta",
      "+91 93277 88120",
      "Completed",
      "Online",
      minutesAgo(52),
      [
        ["NK-010", 2, "Single Serving", "Mild"],
        ["NK-012", 6, "Single Serving", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240609",
      "Farhan Ali",
      "+91 70655 44129",
      "Pending",
      "Cash",
      minutesAgo(59),
      [["NK-001", 3, "Single Bowl", "Royal Hot"]],
    ),
    makeSeedOrder(
      "NK-240610",
      "Aditi Joshi",
      "+91 86520 31044",
      "Out for Delivery",
      "UPI",
      minutesAgo(67),
      [["NK-003", 1, "Handi", "Medium"]],
      "No onion garnish",
    ),
    makeSeedOrder(
      "NK-240611",
      "Zoya Ahmed",
      "+91 91730 82011",
      "Cooking in Degh",
      "Online",
      minutesAgo(74),
      [
        ["NK-002", 3, "Single Bowl", "Royal Hot"],
        ["NK-004", 6, "Plate", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240612",
      "Rohan Singh",
      "+91 94066 77182",
      "Completed",
      "Cash",
      minutesAgo(83),
      [
        ["NK-008", 4, "Plate", "Mild"],
        ["NK-011", 2, "Glass", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240613",
      "Ishaan Chauhan",
      "+91 96690 20314",
      "Pending",
      "UPI",
      minutesAgo(91),
      [["NK-006", 2, "Single Bowl", "Extra Hot"]],
    ),
    makeSeedOrder(
      "NK-240614",
      "Maryam Sheikh",
      "+91 95899 41023",
      "Ready for Pickup",
      "Online",
      minutesAgo(99),
      [["NK-003", 2, "Handi", "Royal Hot"]],
    ),
    makeSeedOrder(
      "NK-240615",
      "Vikram Rathore",
      "+91 80055 61290",
      "Completed",
      "Cash",
      minutesAgo(111),
      [["NK-001", 1, "Half Degh", "Medium"]],
    ),
    makeSeedOrder(
      "NK-240616",
      "Pooja Mehta",
      "+91 92244 78012",
      "Pending",
      "UPI",
      minutesAgo(119),
      [
        ["NK-009", 2, "Single Serving", "Mild"],
        ["NK-012", 4, "Single Serving", "Mild"],
      ],
    ),
    makeSeedOrder(
      "NK-240617",
      "Omar Qureshi",
      "+91 97720 14556",
      "Cooking in Degh",
      "Cash",
      minutesAgo(132),
      [
        ["NK-001", 4, "Single Bowl", "Royal Hot"],
        ["NK-004", 8, "Plate", "Mild"],
      ],
      "Bulk family order",
    ),
    makeSeedOrder(
      "NK-240618",
      "Ananya Bose",
      "+91 82910 56734",
      "Pending",
      "Online",
      minutesAgo(144),
      [["NK-003", 1, "Handi", "Medium"]],
    ),
  ];

  const reservations: Reservation[] = [
    makeSeedReservation(
      "RKV-0701",
      "Anaya Khan",
      "+91 98765 10101",
      "19:30",
      4,
      "Shahi Majlis VIP",
      "Confirmed",
      "Window majlis; anniversary cake allowed",
    ),
    makeSeedReservation(
      "RKV-0702",
      "Rohit Sharma",
      "+91 98220 20202",
      "13:00",
      2,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0703",
      "Zainab Ali",
      "+91 77380 30303",
      "20:00",
      6,
      "Royal Dining Table",
      "Seated",
      "One child seat",
    ),
    makeSeedReservation(
      "RKV-0704",
      "Michael Dsouza",
      "+91 90991 40404",
      "13:30",
      3,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0705",
      "Ayesha Siddiqui",
      "+91 95100 50505",
      "21:00",
      5,
      "Royal Dining Table",
      "Confirmed",
      "Prefers low-spice nihari",
    ),
    makeSeedReservation(
      "RKV-0706",
      "Rajput Family",
      "+91 81410 60606",
      "19:00",
      10,
      "Shahi Majlis VIP",
      "Confirmed",
      "VIP host: Mahendra Singh",
    ),
    makeSeedReservation(
      "RKV-0707",
      "Meera Jain",
      "+91 99988 70707",
      "14:00",
      2,
      "Traditional Diwan",
      "Completed",
    ),
    makeSeedReservation(
      "RKV-0708",
      "Saif Qureshi",
      "+91 93277 80808",
      "20:30",
      8,
      "Royal Dining Table",
      "Seated",
    ),
    makeSeedReservation(
      "RKV-0709",
      "Priya Nair",
      "+91 70655 90909",
      "13:15",
      4,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0710",
      "Arjun Verma",
      "+91 86520 12121",
      "21:30",
      2,
      "Traditional Diwan",
      "Cancelled",
      "Guest cancelled by phone",
    ),
    makeSeedReservation(
      "RKV-0711",
      "Fatima Trust Delegation",
      "+91 91730 23232",
      "18:30",
      14,
      "Shahi Majlis VIP",
      "Confirmed",
      "Separate billing requested",
    ),
    makeSeedReservation(
      "RKV-0712",
      "Nikhil Kapoor",
      "+91 94066 34343",
      "19:45",
      3,
      "Royal Dining Table",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0713",
      "Sana Mir",
      "+91 96690 45454",
      "12:45",
      2,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0714",
      "Vikram Chandra",
      "+91 80055 56565",
      "20:15",
      6,
      "Royal Dining Table",
      "Seated",
    ),
    makeSeedReservation(
      "RKV-0715",
      "Divya Reddy",
      "+91 86070 67676",
      "13:45",
      4,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0716",
      "Al-Falah Group",
      "+91 97720 78787",
      "22:00",
      12,
      "Shahi Majlis VIP",
      "Confirmed",
      "Advance payment received",
    ),
    makeSeedReservation(
      "RKV-0717",
      "Kavya Shah",
      "+91 82910 89898",
      "14:30",
      2,
      "Traditional Diwan",
      "Confirmed",
    ),
    makeSeedReservation(
      "RKV-0718",
      "Rahul Gupta",
      "+91 95550 11222",
      "21:15",
      5,
      "Royal Dining Table",
      "Confirmed",
      "Birthday note required",
    ),
  ];

  const reviews: Review[] = [
    makeSeedReview(
      "REV-901",
      "Ayesha Rahman",
      5,
      "The nalli literally left the bone and the gravy stayed warm until midnight. Royal from first spoon to last.",
      "Nahari King Special Nalli Nihari",
      1,
      true,
      true,
    ),
    makeSeedReview(
      "REV-902",
      "Rohan Malhotra",
      5,
      "Indore's most authentic dum experience. The khamiri roti is the perfect partner for the nihari.",
      "Old Delhi Khamiri Roti",
      2,
      true,
      true,
    ),
    makeSeedReview(
      "REV-903",
      "Zoya Khan",
      5,
      "The majlis felt like a private court dinner. Impeccable service and the paya was silk-smooth.",
      "Shahi Mutton Paye",
      2,
      true,
      true,
    ),
    makeSeedReview(
      "REV-904",
      "Aditya Joshi",
      4,
      "Beautiful aromatics, generous marrow and a biryani that deserves its own journey to Indore.",
      "Mutton Dum Biryani",
      3,
      true,
      false,
    ),
    makeSeedReview(
      "REV-905",
      "Meher Contractor",
      5,
      "The saffron, rose and slow-cooked meat balance is extraordinary. A true royal kitchen.",
      "Nahari King Special Nalli Nihari",
      4,
      true,
      true,
    ),
    makeSeedReview(
      "REV-906",
      "Farhan Qureshi",
      5,
      "Kakori kebabs melted instantly and the royal hot nigari had exactly the right warmth.",
      "Kakori Galawat Kebab",
      5,
      true,
      true,
    ),
    makeSeedReview(
      "REV-907",
      "Naina Verma",
      4,
      "Warm hospitality, dramatic ambience and phirni that tastes like an old family recipe.",
      "Illayachi Phirni",
      6,
      true,
      false,
    ),
    makeSeedReview(
      "REV-908",
      "Imran Sayed",
      5,
      "Worth every minute of the slow cook. The marrow shank is the finest I have had outside Lucknow.",
      "Nahari King Special Nalli Nihari",
      7,
      true,
      false,
    ),
    makeSeedReview(
      "REV-909",
      "Sneha Patel",
      3,
      "Lovely flavours and service, though the dinner rush made our biryani wait a little longer.",
      "Mutton Dum Biryani",
      8,
      false,
      false,
    ),
    makeSeedReview(
      "REV-910",
      "Kabir Rathore",
      5,
      "The VIP majlis turned a family dinner into a celebration. Every detail felt considered.",
      "Shahi Tukda",
      9,
      true,
      false,
    ),
  ];

  return {
    version: 1,
    orders,
    dailyStats: {
      grossRevenue: 42_850,
      totalOrders: 84,
      pendingOrders: 6,
      previousRevenue: 39_680,
    },
    menu: restaurantData.menu.map((item) => ({ ...item })),
    reservations,
    reviews,
  };
}

function createEmptyOrderDraft(): NewOrderDraft {
  return {
    customerName: "",
    phone: "",
    paymentMethod: "UPI",
    portion: "Single Bowl",
    spiceLevel: "Medium",
    notes: "",
    selectedMenuItemId: restaurantData.menu[0]?.id ?? "",
    quantity: 1,
    items: [],
  };
}

function createEmptyReservationDraft(): ReservationDraft {
  return {
    guestName: "",
    contact: "",
    date: "",
    timeSlot: "19:30",
    guests: 2,
    seatingType: "Traditional Diwan",
    notes: "",
  };
}

function portionForItem(item: MenuItem): Portion {
  if (item.category === "Breads") return "Plate";
  if (item.category === "Biryani") return "Handi";
  if (item.category === "Desserts" || item.category === "Beverages") {
    return "Single Serving";
  }
  return "Single Bowl";
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [today, setToday] = useState("");
  const [activeShift, setActiveShift] = useState<ShiftInfo | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    grossRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    previousRevenue: 0,
  });
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [orderFilter, setOrderFilter] = useState<OrderFilter>("All");
  const [orderSearch, setOrderSearch] = useState("");
  const [reservationDateFilter, setReservationDateFilter] = useState("");
  const [seatingFilter, setSeatingFilter] = useState("All");
  const [menuCategoryFilter, setMenuCategoryFilter] = useState("All");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [orderDraft, setOrderDraft] = useState<NewOrderDraft>(
    createEmptyOrderDraft,
  );
  const [reservationDraft, setReservationDraft] =
    useState<ReservationDraft>(createEmptyReservationDraft);
  const [orderFormError, setOrderFormError] = useState("");
  const [reservationFormError, setReservationFormError] = useState("");
  const {
    state: cmsState,
    updateDish,
    addDish,
    deleteDish,
    updateViralOffer,
    updateRestaurantInfo,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useCMS();

  const [editingDish, setEditingDish] = useState<GlobalMenuItem | null>(null);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishDraft, setNewDishDraft] = useState<Partial<GlobalMenuItem>>({
    id: "",
    name: "",
    urduName: "",
    description: "",
    price: 350,
    category: "nihari",
    tag: "👑 Indore Special",
    image: "/images/dishes/special-nalli-nihari.jpg",
    isSignature: true,
  });

  const [tickerIndex, setTickerIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const revenueGrowth = calculateGrowth(
    dailyStats.grossRevenue,
    dailyStats.previousRevenue,
  );
  const todayReservations = reservations.filter(
    (reservation) => reservation.date === today,
  );
  const vipReservations = todayReservations.filter(
    (reservation) => reservation.seatingType === "Shahi Majlis VIP",
  );
  const soldOutItems = menu.filter((item) => item.stockStatus === "Sold Out");
  const approvedReviews = reviews.filter((review) => review.approved);
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
      approvedReviews.length
      : 0;
  const featuredReviews = reviews.filter((review) => review.featured).length;

  const visibleOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.phone.replace(/\D/g, "").includes(query);

      const matchesFilter =
        orderFilter === "All"
          ? true
          : orderFilter === "Pending"
            ? order.status === "Pending"
            : orderFilter === "Cooking"
              ? COOKING_STATUSES.includes(order.status)
              : order.status === "Completed";

      return matchesSearch && matchesFilter;
    });
  }, [orders, orderFilter, orderSearch]);

  const visibleReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesDate =
        !reservationDateFilter || reservation.date === reservationDateFilter;
      const matchesSeating =
        seatingFilter === "All" || reservation.seatingType === seatingFilter;
      return matchesDate && matchesSeating;
    });
  }, [reservations, reservationDateFilter, seatingFilter]);

  const visibleMenu = useMemo(() => {
    return menu.filter(
      (item) =>
        menuCategoryFilter === "All" || item.category === menuCategoryFilter,
    );
  }, [menu, menuCategoryFilter]);

  const visibleReviews = useMemo(() => {
    return reviews.filter(
      (review) => reviewFilter === "all" || review.featured === true,
    );
  }, [reviews, reviewFilter]);

  const tickerMessages = useMemo(
    () => [
      "Kitchen Live • Deghs Active • Dum in progress",
      `${dailyStats.pendingOrders} orders need kitchen attention right now`,
      `${todayReservations.length} guest reservations • ${vipReservations.length} Shahi Majlis VIP`,
      `${soldOutItems.length} menu ${soldOutItems.length === 1 ? "item is" : "items are"} currently sold out`,
      "Nalli marrow shanks are being finished in the royal degh",
      "Guest experience rating holds at " + averageRating.toFixed(1) + " stars",
    ],
    [
      averageRating,
      dailyStats.pendingOrders,
      soldOutItems.length,
      todayReservations.length,
      vipReservations.length,
    ],
  );

  const selectedDraftMenuItem = menu.find(
    (item) => item.id === orderDraft.selectedMenuItemId,
  );
  const draftOrderTotal = orderDraft.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const menuCategories = Array.from(
    new Set(menu.map((item) => item.category)),
  ).sort();

  function notify(message: string): void {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      setIsAuthenticated(
        window.localStorage.getItem(SESSION_STORAGE_KEY) === "true",
      );
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    try {
      const loadedData = loadAdminData();
      const nextData = loadedData ?? seedAdminData();
      const nextToday = todayISO();

      setOrders(nextData.orders);
      setDailyStats(nextData.dailyStats);
      setMenu(nextData.menu);
      setReservations(nextData.reservations);
      setReviews(nextData.reviews);
      setToday(nextToday);
      setActiveShift(getActiveShift());
      setReservationDateFilter(nextToday);
      setHasLoaded(true);
    } catch {
      const fallback = seedAdminData();
      setOrders(fallback.orders);
      setDailyStats(fallback.dailyStats);
      setMenu(fallback.menu);
      setReservations(fallback.reservations);
      setReviews(fallback.reviews);
      setToday(todayISO());
      setActiveShift(getActiveShift());
      setReservationDateFilter(todayISO());
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    try {
      const payload: AdminData = {
        version: 1,
        orders,
        dailyStats,
        menu,
        reservations,
        reviews,
      };
      window.localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Dashboard remains usable if device storage is unavailable.
    }
  }, [hasLoaded, orders, dailyStats, menu, reservations, reviews]);

  useEffect(() => {
    if (!isAuthenticated) {
      pinInputRef.current?.focus();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTickerIndex((current) => (current + 1) % tickerMessages.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [tickerMessages.length]);

  function handleLogin(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const passcode = pin.trim();

    if (passcode !== "nahari786" && passcode !== "admin123") {
      setLoginError("The royal passcode did not match. Try the kitchen hint.");
      return;
    }

    try {
      if (rememberSession) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, "true");
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // The session still works for the current tab.
    }

    setLoginError("");
    setPin("");
    setIsAuthenticated(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    notify("Royal kitchen terminal unlocked");
  }

  function handleLogout(): void {
    try {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup errors.
    }
    setIsAuthenticated(false);
    setPin("");
    setRememberSession(false);
    notify("Session securely closed");
  }

  function handleSimulateLiveOrder(): void {
    const availableMenu = menu.filter(
      (item) => item.stockStatus === "In Stock",
    );
    if (availableMenu.length === 0) {
      notify("All dishes are sold out — restock the degh first");
      return;
    }

    const shuffled = [...availableMenu].sort(() => Math.random() - 0.5);
    const chosenCount = Math.random() < 0.68 ? 1 : Math.min(2, shuffled.length);
    const customerName = [
      "Rehan Ansari",
      "Ishita Modi",
      "Sakina Bhopali",
      "Jai Rathore",
      "Noor Siddiqui",
      "Kunal Jain",
      "Shabana Qureshi",
      "Vivaan Solanki",
    ][Math.floor(Math.random() * 8)];
    const phoneDigits = String(
      9_000_000_000 + Math.floor(Math.random() * 900_000_000),
    );
    const phone = `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
    const status: OrderStatus =
      Math.random() < 0.58 ? "Pending" : "Cooking in Degh";
    const paymentMethod: PaymentMethod = ["Cash", "UPI", "Online"][
      Math.floor(Math.random() * 3)
    ] as PaymentMethod;
    const items: OrderItem[] = shuffled.slice(0, chosenCount).map((item) => ({
      id: createId("live-line"),
      menuItemId: item.id,
      name: item.name,
      quantity:
        item.category === "Breads" || item.category === "Desserts"
          ? 2 + Math.floor(Math.random() * 3)
          : 1 + Math.floor(Math.random() * 2),
      unitPrice: item.price,
      portion: portionForItem(item),
      spiceLevel: ["Medium", "Royal Hot", "Extra Hot"][
        Math.floor(Math.random() * 3)
      ] as SpiceLevel,
    }));
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const newOrder: Order = {
      id: createOrderId(),
      customerName,
      phone,
      items,
      totalAmount,
      paymentMethod,
      status,
      createdAt: new Date().toISOString(),
      notes: "Simulated live counter order",
    };

    setOrders((current) => [newOrder, ...current]);
    setDailyStats((current) => ({
      ...current,
      grossRevenue: current.grossRevenue + totalAmount,
      totalOrders: current.totalOrders + 1,
      pendingOrders:
        current.pendingOrders + (status === "Pending" ? 1 : 0),
    }));
    notify(`${customerName}'s live order entered the KDS`);
  }

  function handleExportCsv(): void {
    const headers = [
      "Order ID",
      "Guest",
      "Phone",
      "Items",
      "Total",
      "Payment",
      "Status",
      "Created",
      "Notes",
    ];
    const rows = orders.map((order) => [
      order.id,
      order.customerName,
      order.phone,
      order.items
        .map(
          (item) =>
            `${item.quantity}x ${item.name} (${item.portion}, ${item.spiceLevel})`,
        )
        .join(" | "),
      order.totalAmount,
      order.paymentMethod,
      order.status,
      `${formatDate(order.createdAt)} ${formatTime(order.createdAt)}`,
      order.notes ?? "",
    ]);
    const csv =
      "" +
      [headers, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nahari-king-orders-${today || "today"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify("Live order ledger exported as CSV");
  }

  function handleResetData(): void {
    if (
      !window.confirm(
        "Reset all orders, reservations, inventory and moderation data to the royal demo state?",
      )
    ) {
      return;
    }

    const fresh = seedAdminData();
    const nextToday = todayISO();
    setOrders(fresh.orders);
    setDailyStats(fresh.dailyStats);
    setMenu(fresh.menu);
    setReservations(fresh.reservations);
    setReviews(fresh.reviews);
    setToday(nextToday);
    setReservationDateFilter(nextToday);
    setOrderFilter("All");
    setOrderSearch("");
    setSeatingFilter("All");
    setMenuCategoryFilter("All");
    setReviewFilter("all");
    setIsOrderModalOpen(false);
    setIsReservationModalOpen(false);
    setOrderDraft(createEmptyOrderDraft());
    setReservationDraft(createEmptyReservationDraft());
    setOrderFormError("");
    setReservationFormError("");
    notify("Royal demo data restored");
  }

  function handleOrderStatusChange(
    orderId: string,
    nextStatus: OrderStatus,
  ): void {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder || currentOrder.status === nextStatus) return;

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order,
      ),
    );
    setDailyStats((current) => {
      let grossRevenue = current.grossRevenue;

      if (
        nextStatus === "Cancelled" &&
        currentOrder.status !== "Cancelled"
      ) {
        grossRevenue = Math.max(0, grossRevenue - currentOrder.totalAmount);
      } else if (
        currentOrder.status === "Cancelled" &&
        nextStatus !== "Cancelled"
      ) {
        grossRevenue += currentOrder.totalAmount;
      }

      return {
        ...current,
        grossRevenue,
        pendingOrders:
          current.pendingOrders -
          (currentOrder.status === "Pending" ? 1 : 0) +
          (nextStatus === "Pending" ? 1 : 0),
      };
    });
    notify(`Order ${orderId} moved to ${nextStatus}`);
  }

  function handleAdvanceOrder(orderId: string): void {
    const currentOrder = orders.find((order) => order.id === orderId);
    const nextStatus = currentOrder
      ? ADVANCE_STATUS[currentOrder.status]
      : undefined;
    if (currentOrder && nextStatus) {
      handleOrderStatusChange(orderId, nextStatus);
    }
  }

  function openOrderModal(): void {
    setOrderDraft(createEmptyOrderDraft());
    setOrderFormError("");
    setIsOrderModalOpen(true);
  }

  function handleAddDraftItem(): void {
    const menuItem = selectedDraftMenuItem;
    if (!menuItem) return;

    if (menuItem.stockStatus === "Sold Out") {
      setOrderFormError(`${menuItem.name} is currently sold out.`);
      return;
    }

    setOrderDraft((current) => {
      const quantity = Math.max(1, Math.floor(current.quantity || 1));
      const line: OrderItem = {
        id: createId("draft-line"),
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity,
        unitPrice: menuItem.price,
        portion: current.portion,
        spiceLevel: current.spiceLevel,
      };
      const existing = current.items.find(
        (item) =>
          item.menuItemId === line.menuItemId &&
          item.portion === line.portion &&
          item.spiceLevel === line.spiceLevel,
      );

      return {
        ...current,
        quantity: 1,
        items: existing
          ? current.items.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + line.quantity }
              : item,
          )
          : [...current.items, line],
      };
    });
    setOrderFormError("");
  }

  function handleCreateOrder(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const customerName = orderDraft.customerName.trim();
    const phone = orderDraft.phone.trim();
    const phoneDigits = getPhoneDigits(phone);

    if (!customerName) {
      setOrderFormError("Enter the guest name before sending the order.");
      return;
    }
    if (phoneDigits.length < 10) {
      setOrderFormError("Enter a valid 10-digit guest contact number.");
      return;
    }
    if (orderDraft.items.length === 0) {
      setOrderFormError("Add at least one menu item to the order.");
      return;
    }

    const totalAmount = orderDraft.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const newOrder: Order = {
      id: createOrderId(),
      customerName,
      phone,
      items: orderDraft.items,
      totalAmount,
      paymentMethod: orderDraft.paymentMethod,
      status: "Pending",
      createdAt: new Date().toISOString(),
      notes: orderDraft.notes.trim() || undefined,
    };

    setOrders((current) => [newOrder, ...current]);
    setDailyStats((current) => ({
      ...current,
      grossRevenue: current.grossRevenue + totalAmount,
      totalOrders: current.totalOrders + 1,
      pendingOrders: current.pendingOrders + 1,
    }));
    setIsOrderModalOpen(false);
    setOrderDraft(createEmptyOrderDraft());
    setOrderFormError("");
    notify(`${customerName}'s manual order is now pending`);
  }

  function openReservationModal(): void {
    setReservationDraft({
      ...createEmptyReservationDraft(),
      date: today || todayISO(),
    });
    setReservationFormError("");
    setIsReservationModalOpen(true);
  }

  function handleCreateReservation(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();
    const guestName = reservationDraft.guestName.trim();
    const contact = reservationDraft.contact.trim();
    const contactDigits = getPhoneDigits(contact);

    if (!guestName) {
      setReservationFormError("Enter the lead guest's name.");
      return;
    }
    if (contactDigits.length < 10) {
      setReservationFormError("Enter a valid contact number.");
      return;
    }
    if (!reservationDraft.date || !reservationDraft.timeSlot) {
      setReservationFormError("Choose both a reservation date and time slot.");
      return;
    }
    if (reservationDraft.guests < 1 || reservationDraft.guests > 40) {
      setReservationFormError("Guest count must be between 1 and 40.");
      return;
    }

    const newReservation: Reservation = {
      id: `RKV-${Date.now().toString().slice(-6)}`,
      guestName,
      contact,
      date: reservationDraft.date,
      timeSlot: reservationDraft.timeSlot,
      guests: Math.floor(reservationDraft.guests),
      seatingType: reservationDraft.seatingType,
      status: "Confirmed",
      notes: reservationDraft.notes.trim() || undefined,
    };

    setReservations((current) =>
      [...current, newReservation].sort((a, b) =>
        `${a.date}T${a.timeSlot}`.localeCompare(`${b.date}T${b.timeSlot}`),
      ),
    );
    setIsReservationModalOpen(false);
    setReservationDraft(createEmptyReservationDraft());
    setReservationFormError("");
    notify(`${guestName}'s reservation is confirmed`);
  }

  function handleReservationStatusChange(
    reservationId: string,
    status: Reservation["status"],
  ): void {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status }
          : reservation,
      ),
    );
    notify(`Reservation ${reservationId} marked as ${status}`);
  }

  function openWhatsApp(reservation: Reservation): void {
    const phone = getPhoneDigits(reservation.contact);
    if (!phone) return;

    const message =
      `Assalamu Alaikum ${reservation.guestName}, this is The Nahari King. ` +
      `Your ${reservation.seatingType} reservation for ${formatDate(reservation.date)} ` +
      `at ${formatTime(`${reservation.date}T${reservation.timeSlot}:00`)} ` +
      `for ${reservation.guests} guest${reservation.guests === 1 ? "" : "s"} ` +
      `is ${reservation.status.toLowerCase()}. We look forward to welcoming you royally.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleStockToggle(
    item: MenuItem,
    shouldBeInStock: boolean,
  ): void {
    const nextStatus: MenuItem["stockStatus"] = shouldBeInStock
      ? "In Stock"
      : "Sold Out";
    const nextCount =
      shouldBeInStock && item.stockCount === 0 ? 1 : item.stockCount;

    setMenu((current) =>
      current.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, stockStatus: nextStatus, stockCount: nextCount }
          : menuItem,
      ),
    );

    // Sync to global CMS
    const targetCmsDish = cmsState.menuItems.find((d) => d.id === item.id || d.name.toLowerCase() === item.name.toLowerCase());
    if (targetCmsDish) {
      updateDish({
        ...targetCmsDish,
        tag: shouldBeInStock ? (targetCmsDish.tag || "In Stock") : "Sold Out",
      });
    }

    if (!shouldBeInStock) notify(`${item.name} marked sold out`);
  }

  function handleCommitPrice(
    item: MenuItem,
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const nextPrice = Number(event.currentTarget.value);

    if (!Number.isFinite(nextPrice) || nextPrice < 10) {
      event.currentTarget.value = String(item.price);
      notify("Enter a valid price of 10 or more");
      return;
    }

    const roundedPrice = Math.round(nextPrice);
    setMenu((current) =>
      current.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, price: roundedPrice }
          : menuItem,
      ),
    );

    // Sync to global CMS
    const targetCmsDish = cmsState.menuItems.find((d) => d.id === item.id || d.name.toLowerCase() === item.name.toLowerCase());
    if (targetCmsDish) {
      updateDish({
        ...targetCmsDish,
        price: roundedPrice,
      });
    }

    notify(`${item.name} price updated to ${formatINR(roundedPrice)}`);
  }

  function handleAdjustStock(item: MenuItem, delta: number): void {
    const nextCount = Math.max(0, item.stockCount + delta);
    const stockStatus: MenuItem["stockStatus"] =
      nextCount === 0 ? "Sold Out" : "In Stock";

    setMenu((current) =>
      current.map((menuItem) =>
        menuItem.id === item.id
          ? { ...menuItem, stockCount: nextCount, stockStatus }
          : menuItem,
      ),
    );

    if (nextCount === 0) notify(`${item.name} is now sold out`);
  }

  function handleReviewFeatureToggle(reviewId: string): void {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review) return;

    const nextValue = !(review.approved && review.featured);
    setReviews((current) =>
      current.map((item) =>
        item.id === reviewId
          ? { ...item, approved: nextValue, featured: nextValue }
          : item,
      ),
    );
    notify(
      nextValue
        ? `${review.customer}'s review approved and featured`
        : `${review.customer}'s review removed from homepage`,
    );
  }

  function stockLabel(itemId: string, fallback: string): string {
    const item = menu.find((menuItem) => menuItem.id === itemId);
    return item ? `${item.stockCount} ${item.stockUnit}` : fallback;
  }

  const shiftLabel = activeShift?.label ?? "Connecting";
  const shiftDetail = activeShift?.detail ?? "Preparing the royal terminal";
  const dateLabel = hasLoaded ? formatDateLabel() : "Preparing terminal";

  return (
    <div
      className={`dashboard-shell ${isAuthenticated ? "is-unlocked" : "is-locked"}`}
    >
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="ambient ambient-three" aria-hidden="true" />

      <div className="layout" aria-hidden={!isAuthenticated}>
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-orb" aria-hidden="true">
              <span></span>
            </div>
            <div>
              <strong>The Nahari King</strong>
              <small>Admin Command</small>
            </div>
          </div>

          <p className="nav-label">Royal Operations</p>
          <nav className="side-nav" aria-label="Admin dashboard sections">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                aria-pressed={activeTab === item.id}
              >
                <span className="nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="nav-copy">
                  <strong>{item.label}</strong>
                  <small>{item.kicker}</small>
                </span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="degh-note">
              <span aria-hidden="true"></span>
              <div>
                <strong>12-Hour Dum</strong>
                <small>Sealed at dusk • Opened for royalty</small>
              </div>
            </div>
            <div className="sidebar-seal">NK · INDORE</div>
          </div>
        </aside>

        <div className="workspace">
          <header className="topbar">
            <div className="topbar-brand">
              <div className="brand-mark" aria-hidden="true">
                <span></span>
              </div>
              <div className="brand-copy">
                <strong>The Nahari King</strong>
                <small>Royal Kitchen Terminal &amp; Management</small>
              </div>
            </div>

            <div className="topbar-context">
              <span className="live-badge">
                <i className="live-dot" />
                Kitchen Live • Deghs Active
              </span>
              <span className="context-divider" aria-hidden="true" />
              <span className="context-item"> {dateLabel}</span>
              <span className={`shift-badge shift-${activeShift?.tone ?? "gold"}`}>
                {shiftLabel} • {shiftDetail}
              </span>
            </div>

            <div className="topbar-actions">
              <button
                className="action-button"
                type="button"
                onClick={handleSimulateLiveOrder}
              >
                <span aria-hidden="true"></span> Simulate Live Order
              </button>
              <button
                className="action-button"
                type="button"
                onClick={handleExportCsv}
              >
                <span aria-hidden="true"></span> Export CSV
              </button>
              <button
                className="action-button danger-button"
                type="button"
                onClick={handleResetData}
              >
                <span aria-hidden="true"></span> Reset Data
              </button>
              <button
                className="logout-button"
                type="button"
                onClick={handleLogout}
                aria-label="Logout of admin dashboard"
                title="Logout"
              >

              </button>
            </div>
          </header>

          <section className="ticker" aria-live="polite">
            <span className="ticker-label">LIVE</span>
            <div className="ticker-track">
              <span
                key={tickerIndex}
                className="ticker-message"
                aria-hidden="true"
              >
                {tickerMessages[tickerIndex]}
              </span>
            </div>
            <span className="ticker-hint">Indore • Royal Kitchen</span>
          </section>

          <main className="content">
            {!hasLoaded ? (
              <div className="loading-state" role="status">
                <span className="loading-crest"></span>
                <strong>Opening the royal kitchen terminal…</strong>
                <small>Warming deghs and aligning the guest ledger</small>
              </div>
            ) : (
              <>
                <section className="kpi-section" aria-label="Today's overview">
                  <div className="section-intro">
                    <div>
                      <p className="eyebrow">Royal Ledger</p>
                      <h2>Today at a Glance</h2>
                    </div>
                    <span className="last-sync">
                      <i /> Updated just now
                    </span>
                  </div>

                  <div className="kpi-grid">
                    <article className="kpi-card revenue-card">
                      <div className="kpi-glow" aria-hidden="true" />
                      <div className="kpi-top">
                        <span className="kpi-icon"></span>
                        <span className="kpi-growth positive">
                          {revenueGrowth.toFixed(1)}%
                        </span>
                      </div>
                      <p className="kpi-label">Today's Gross Revenue</p>
                      <strong className="kpi-value">
                        {formatINR(dailyStats.grossRevenue)}
                      </strong>
                      <p className="kpi-caption">
                        vs {formatINR(dailyStats.previousRevenue)} previous
                        benchmark
                      </p>
                      <svg
                        className="kpi-spark"
                        viewBox="0 0 180 48"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <polyline
                          points="0,38 22,34 40,36 58,25 78,28 96,18 118,21 138,10 158,14 180,4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </article>

                    <article className="kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-icon"></span>
                        <span className="status-pill tone-gold">
                          {dailyStats.pendingOrders} pending
                        </span>
                      </div>
                      <p className="kpi-label">Total Orders Today</p>
                      <strong className="kpi-value">
                        {dailyStats.totalOrders}
                      </strong>
                      <p className="kpi-caption">
                        {orders.length} latest orders visible on KDS
                      </p>
                    </article>

                    <article className="kpi-card">
                      <div className="kpi-top">
                        <span className="kpi-icon"></span>
                        <span className="status-pill tone-violet">
                          {vipReservations.length} VIP Majlis
                        </span>
                      </div>
                      <p className="kpi-label">Table Reservations</p>
                      <strong className="kpi-value">
                        {todayReservations.length}
                      </strong>
                      <p className="kpi-caption">
                        {vipReservations.length} royal majlis bookings today
                      </p>
                    </article>

                    <article className="kpi-card inventory-card">
                      <div className="kpi-top">
                        <span className="kpi-icon"></span>
                        <span className="status-pill tone-emerald">Deghs Ready</span>
                      </div>
                      <p className="kpi-label">Degh Inventory Stock</p>
                      <div className="stock-stack">
                        <div className="stock-row">
                          <span> Nalli marrow</span>
                          <strong>{stockLabel("NK-001", "24 shanks")}</strong>
                        </div>
                        <div className="stock-row">
                          <span> Mutton paye</span>
                          <strong>{stockLabel("NK-002", "14 bowls")}</strong>
                        </div>
                        <div className="stock-row">
                          <span> Dum biryani</span>
                          <strong>{stockLabel("NK-003", "8 handis")}</strong>
                        </div>
                      </div>
                    </article>
                  </div>
                </section>

                {activeTab === "orders" && (
                  <section className="section-panel" aria-labelledby="orders-title">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Kitchen Display System</p>
                        <h2 id="orders-title">Live Orders &amp; Degh Queue</h2>
                        <p>
                          Track every bowl from the counter to the guest's table.
                        </p>
                      </div>
                      <span className="section-emblem" aria-hidden="true">

                      </span>
                    </div>

                    <div className="toolbar">
                      <div
                        className="filter-group"
                        role="group"
                        aria-label="Filter orders by status"
                      >
                        {(["All", "Pending", "Cooking", "Completed"] as const).map(
                          (filter) => (
                            <button
                              key={filter}
                              type="button"
                              className={
                                orderFilter === filter ? "filter-button active" : "filter-button"
                              }
                              onClick={() => setOrderFilter(filter)}
                              aria-pressed={orderFilter === filter}
                            >
                              {filter}
                            </button>
                          ),
                        )}
                      </div>
                      <label className="search-box">
                        <span aria-hidden="true"></span>
                        <input
                          type="search"
                          value={orderSearch}
                          onChange={(event) => setOrderSearch(event.target.value)}
                          placeholder="Search guest or Order ID…"
                          aria-label="Search orders by guest or Order ID"
                        />
                      </label>
                      <button
                        className="primary-button"
                        type="button"
                        onClick={openOrderModal}
                      >
                        <span aria-hidden="true"></span> New Order
                      </button>
                    </div>

                    <div className="result-count">
                      Showing {visibleOrders.length} of {orders.length} latest
                      orders
                    </div>

                    <div className="order-grid">
                      {visibleOrders.map((order) => (
                        <article
                          key={order.id}
                          className={`order-card status-${statusTone(order.status)}`}
                        >
                          <div className="status-rail" aria-hidden="true" />
                          <div className="order-topline">
                            <div>
                              <span className="order-id">{order.id}</span>
                              <small className="time-stamp">
                                {formatTime(order.createdAt)}
                              </small>
                            </div>
                            <span
                              className={`status-pill tone-${statusTone(order.status)}`}
                            >
                              {ORDER_STATUS_META[order.status].label}
                            </span>
                          </div>

                          <div className="customer-line">
                            <span className="guest-avatar" aria-hidden="true">
                              {order.customerName.slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <strong>{order.customerName}</strong>
                              <a href={`tel:${getPhoneDigits(order.phone)}`}>
                                {order.phone}
                              </a>
                            </div>
                          </div>

                          <div className="order-items">
                            {order.items.map((item) => (
                              <div className="order-item" key={item.id}>
                                <span className="item-quantity">{item.quantity}×</span>
                                <div>
                                  <strong>{item.name}</strong>
                                  <small>
                                    {item.portion} • {item.spiceLevel} •{" "}
                                    {formatINR(item.quantity * item.unitPrice)}
                                  </small>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="order-footer">
                            <div>
                              <span className="order-total">
                                {formatINR(order.totalAmount)}
                              </span>
                              <small className="payment-meta">
                                {order.paymentMethod === "UPI"
                                  ? ""
                                  : order.paymentMethod === "Online"
                                    ? ""
                                    : ""}{" "}
                                {order.paymentMethod}
                              </small>
                            </div>
                            <div className="status-actions">
                              <select
                                className="status-select"
                                value={order.status}
                                onChange={(event) =>
                                  handleOrderStatusChange(
                                    order.id,
                                    event.target.value as OrderStatus,
                                  )
                                }
                                aria-label={`Change status for order ${order.id}`}
                              >
                                {(
                                  Object.keys(ORDER_STATUS_META) as OrderStatus[]
                                ).map((status) => (
                                  <option value={status} key={status}>
                                    {ORDER_STATUS_META[status].label}
                                  </option>
                                ))}
                              </select>
                              {ADVANCE_STATUS[order.status] && (
                                <button
                                  className="advance-button"
                                  type="button"
                                  onClick={() => handleAdvanceOrder(order.id)}
                                >
                                  Advance
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    {visibleOrders.length === 0 && (
                      <div className="empty-state">
                        <span aria-hidden="true"></span>
                        <strong>No matching orders</strong>
                        <p>Try another status or search term.</p>
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "reservations" && (
                  <section
                    className="section-panel"
                    aria-labelledby="reservations-title"
                  >
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Guest Book</p>
                        <h2 id="reservations-title">Table Reservations</h2>
                        <p>
                          Manage diwans, royal tables and private Shahi Majlis.
                        </p>
                      </div>
                      <span className="section-emblem" aria-hidden="true">

                      </span>
                    </div>

                    <div className="toolbar reservation-toolbar">
                      <label className="date-filter">
                        <span aria-hidden="true"></span>
                        <input
                          type="date"
                          value={reservationDateFilter}
                          min={today}
                          onChange={(event) =>
                            setReservationDateFilter(event.target.value)
                          }
                          aria-label="Filter reservations by date"
                        />
                      </label>
                      <select
                        className="toolbar-select"
                        value={seatingFilter}
                        onChange={(event) => setSeatingFilter(event.target.value)}
                        aria-label="Filter reservations by seating type"
                      >
                        <option value="All">All seating types</option>
                        <option value="Traditional Diwan">
                          Traditional Diwan
                        </option>
                        <option value="Royal Dining Table">
                          Royal Dining Table
                        </option>
                        <option value="Shahi Majlis VIP">Shahi Majlis VIP</option>
                      </select>
                      <button
                        className="primary-button"
                        type="button"
                        onClick={openReservationModal}
                      >
                        <span aria-hidden="true"></span> Add Reservation
                      </button>
                    </div>

                    <div className="result-count">
                      {visibleReservations.length} bookings •{" "}
                      {visibleReservations.filter(
                        (item) => item.seatingType === "Shahi Majlis VIP",
                      ).length}{" "}
                      VIP majlis
                    </div>

                    <div className="reservation-grid">
                      {visibleReservations.map((reservation) => (
                        <article
                          key={reservation.id}
                          className={`reservation-card reservation-${reservation.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          <div className="reservation-top">
                            <span className="pass-id">{reservation.id}</span>
                            <span
                              className={`status-pill reservation-status-${reservation.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {reservation.status}
                            </span>
                          </div>
                          <div className="reservation-identity">
                            <span className="guest-avatar vip">
                              {reservation.guestName.slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <h3>{reservation.guestName}</h3>
                              <span> {reservation.contact}</span>
                            </div>
                          </div>
                          <div className="reservation-details">
                            <span>
                              {formatDate(reservation.date)}
                            </span>
                            <span>
                              {formatTime(
                                `${reservation.date}T${reservation.timeSlot}:00`,
                              )}
                            </span>
                            <span> {reservation.guests} guests</span>
                            <span> {reservation.seatingType}</span>
                          </div>
                          {reservation.notes && (
                            <p className="reservation-notes">
                              {reservation.notes}
                            </p>
                          )}
                          <div className="reservation-actions">
                            <select
                              className="status-select"
                              value={reservation.status}
                              onChange={(event) =>
                                handleReservationStatusChange(
                                  reservation.id,
                                  event.target.value as Reservation["status"],
                                )
                              }
                              aria-label={`Change reservation status for ${reservation.id}`}
                            >
                              {(["Confirmed", "Seated", "Completed", "Cancelled"] as const).map(
                                (status) => (
                                  <option value={status} key={status}>
                                    {status}
                                  </option>
                                ),
                              )}
                            </select>
                            <button
                              className="whatsapp-button"
                              type="button"
                              onClick={() => openWhatsApp(reservation)}
                            >
                              WhatsApp
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    {visibleReservations.length === 0 && (
                      <div className="empty-state">
                        <span aria-hidden="true"></span>
                        <strong>No reservations for this view</strong>
                        <p>Choose another date or seating type.</p>
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "inventory" && (
                  <section
                    className="section-panel"
                    aria-labelledby="inventory-title"
                  >
                    <div className="section-heading inventory-heading">
                      <div>
                        <p className="eyebrow">Degh &amp; Counter</p>
                        <h2 id="inventory-title">Menu Inventory</h2>
                        <p>
                          Control live pricing, availability and remaining stock.
                        </p>
                      </div>
                      <div className="inventory-heading-stats" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span>
                          <i className="stock-dot in-stock" />
                          {menu.length - soldOutItems.length} in stock
                        </span>
                        <span>
                          <i className="stock-dot sold-out" />
                          {soldOutItems.length} sold out
                        </span>
                        <button
                          type="button"
                          className="primary-button"
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #D4AF37, #AA7C11)',
                            color: '#090404',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setNewDishDraft({
                              id: `dish-${Date.now()}`,
                              name: '',
                              urduName: '',
                              description: '',
                              price: 350,
                              category: 'nihari',
                              tag: '👑 Indore Special',
                              image: '/images/dishes/special-nalli-nihari.jpg',
                              isSignature: true
                            });
                            setIsAddDishModalOpen(true);
                          }}
                        >
                          + Add New Dish
                        </button>
                      </div>
                    </div>

                    <div className="toolbar">
                      <div
                        className="filter-group menu-filter"
                        role="group"
                        aria-label="Filter menu by category"
                      >
                        <button
                          type="button"
                          className={
                            menuCategoryFilter === "All"
                              ? "filter-button active"
                              : "filter-button"
                          }
                          onClick={() => setMenuCategoryFilter("All")}
                          aria-pressed={menuCategoryFilter === "All"}
                        >
                          All
                        </button>
                        {menuCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            className={
                              menuCategoryFilter === category
                                ? "filter-button active"
                                : "filter-button"
                            }
                            onClick={() => setMenuCategoryFilter(category)}
                            aria-pressed={menuCategoryFilter === category}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="menu-grid">
                      {visibleMenu.map((item) => (
                        <article
                          key={item.id}
                          className={`menu-card ${item.stockStatus === "Sold Out" ? "is-sold-out" : ""
                            }`}
                        >
                          <div className="menu-thumb">
                            <span aria-hidden="true">{item.emoji}</span>
                            <i aria-hidden="true" />
                          </div>
                          <div className="menu-card-body">
                            <div className="menu-card-top">
                              <span className="menu-tag">{item.tag}</span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={item.stockStatus === "In Stock"}
                                className={`stock-switch ${item.stockStatus === "In Stock" ? "on" : ""
                                  }`}
                                onClick={() =>
                                  handleStockToggle(
                                    item,
                                    item.stockStatus === "Sold Out",
                                  )
                                }
                              >
                                <span className="knob" />
                                <span className="switch-copy">
                                  {item.stockStatus === "In Stock"
                                    ? "In Stock"
                                    : "Sold Out"}
                                </span>
                              </button>
                            </div>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>

                            <div className="menu-controls">
                              <label className="price-editor">
                                <span></span>
                                <input
                                  key={`${item.id}-${item.price}`}
                                  type="number"
                                  min="10"
                                  step="5"
                                  defaultValue={item.price}
                                  onBlur={(event) =>
                                    handleCommitPrice(item, event)
                                  }
                                  onFocus={(event) => event.currentTarget.select()}
                                  aria-label={`Price for ${item.name}`}
                                />
                              </label>
                              <div className="stock-control">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStock(item, -1)}
                                  disabled={item.stockCount <= 0}
                                  aria-label={`Decrease ${item.name} stock`}
                                >

                                </button>
                                <span className="stock-count">
                                  {item.stockCount} {item.stockUnit}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAdjustStock(item, 1)}
                                  aria-label={`Increase ${item.name} stock`}
                                >

                                </button>
                              </div>
                            </div>
                            <div className="menu-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(212,175,55,0.15)' }}>
                              <span style={{ fontSize: '0.78rem', color: '#BFA888' }}>{item.category} • {item.id}</span>
                              <button
                                type="button"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  background: 'rgba(212,175,55,0.12)',
                                  border: '1px solid rgba(212,175,55,0.35)',
                                  color: '#D4AF37',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                onClick={() => {
                                  const matchingCmsDish = cmsState.menuItems.find((d) => d.id === item.id || d.name.toLowerCase() === item.name.toLowerCase()) || {
                                    id: item.id,
                                    name: item.name,
                                    urduName: "",
                                    description: item.description,
                                    price: item.price,
                                    category: "nihari",
                                    tag: item.tag,
                                    image: "/images/dishes/special-nalli-nihari.jpg",
                                    isSignature: true,
                                  };
                                  setEditingDish(matchingCmsDish);
                                }}
                              >
                                ✏️ Edit Dish & Image
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                {activeTab === "reviews" && (
                  <section
                    className="section-panel"
                    aria-labelledby="reviews-title"
                  >
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Guest Voices</p>
                        <h2 id="reviews-title">Reviews &amp; Moderation</h2>
                        <p>Approve genuine praise and feature it on the homepage.</p>
                      </div>
                      <div className="review-score">
                        <strong>{averageRating.toFixed(1)}</strong>
                        <span> average</span>
                      </div>
                    </div>

                    <div className="reviews-summary">
                      <span>
                        <b>{approvedReviews.length}</b> approved
                      </span>
                      <span>
                        <b>{featuredReviews}</b> featured
                      </span>
                      <span>
                        <b>{reviews.length - approvedReviews.length}</b> awaiting
                      </span>
                      <div
                        className="filter-group"
                        role="group"
                        aria-label="Filter reviews"
                      >
                        <button
                          type="button"
                          className={
                            reviewFilter === "all"
                              ? "filter-button active"
                              : "filter-button"
                          }
                          onClick={() => setReviewFilter("all")}
                          aria-pressed={reviewFilter === "all"}
                        >
                          All Reviews
                        </button>
                        <button
                          type="button"
                          className={
                            reviewFilter === "featured"
                              ? "filter-button active"
                              : "filter-button"
                          }
                          onClick={() => setReviewFilter("featured")}
                          aria-pressed={reviewFilter === "featured"}
                        >
                          Featured
                        </button>
                      </div>
                    </div>

                    <div className="review-grid">
                      {visibleReviews.map((review) => (
                        <article key={review.id} className="review-card">
                          <div className="review-header">
                            <span className="reviewer-avatar">
                              {review.customer.slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <strong>{review.customer}</strong>
                              <small>{formatDate(review.date)}</small>
                            </div>
                            <span className="stars" aria-label={`${review.rating} out of 5 stars`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={star <= review.rating ? "filled" : ""}
                                  aria-hidden="true"
                                >

                                </span>
                              ))}
                            </span>
                          </div>
                          <blockquote>“{review.quote}”</blockquote>
                          <div className="review-card-footer">
                            <span className="recommended-dish">
                              Recommended: {review.dish}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={review.approved && review.featured}
                              className={`feature-switch ${review.approved && review.featured ? "on" : ""
                                }`}
                              onClick={() =>
                                handleReviewFeatureToggle(review.id)
                              }
                            >
                              <span className="knob" />
                              <span>
                                {review.approved && review.featured
                                  ? "Approved + Featured"
                                  : "Approve + Feature"}
                              </span>
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    {visibleReviews.length === 0 && (
                      <div className="empty-state">
                        <span aria-hidden="true"></span>
                        <strong>No featured reviews yet</strong>
                        <p>Switch to All Reviews to moderate guest feedback.</p>
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "banners" && (
                  <section className="section-panel" aria-labelledby="banners-title">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Marketing &amp; Promotions</p>
                        <h2 id="banners-title">Viral Offers &amp; Homepage Banners</h2>
                        <p>Live edits reflect instantly across the homepage promotional thaal banner.</p>
                      </div>
                      <button
                        type="button"
                        className="primary-button"
                        style={{
                          padding: '10px 20px',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #D4AF37, #AA7C11)',
                          color: '#090404',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => notify("Promotional banner saved & broadcasted live")}
                      >
                        ✓ Changes Auto-Saved
                      </button>
                    </div>

                    <div style={{ background: '#120607', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '24px', maxWidth: '750px' }}>
                      <h3 style={{ color: '#D4AF37', marginBottom: '18px', fontSize: '1.2rem' }}>₹799 Non-Veg Royal Thaal Banner Settings</h3>
                      
                      <label className="field" style={{ marginBottom: '16px', display: 'block' }}>
                        <span style={{ display: 'block', color: '#BFA888', marginBottom: '6px', fontSize: '0.85rem' }}>Banner Badge / Tagline</span>
                        <input
                          type="text"
                          value={cmsState.viralOffer?.tag || ""}
                          onChange={(e) => updateViralOffer({ tag: e.target.value })}
                          style={{ padding: '12px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                        />
                      </label>

                      <label className="field" style={{ marginBottom: '16px', display: 'block' }}>
                        <span style={{ display: 'block', color: '#BFA888', marginBottom: '6px', fontSize: '0.85rem' }}>Offer Headline</span>
                        <input
                          type="text"
                          value={cmsState.viralOffer?.title || ""}
                          onChange={(e) => updateViralOffer({ title: e.target.value })}
                          style={{ padding: '12px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                        />
                      </label>

                      <label className="field" style={{ marginBottom: '16px', display: 'block' }}>
                        <span style={{ display: 'block', color: '#BFA888', marginBottom: '6px', fontSize: '0.85rem' }}>Description &amp; Inclusions</span>
                        <textarea
                          rows={3}
                          value={cmsState.viralOffer?.description || ""}
                          onChange={(e) => updateViralOffer({ description: e.target.value })}
                          style={{ padding: '12px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                        />
                      </label>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <label className="field">
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '6px', fontSize: '0.85rem' }}>CTA Button Text</span>
                          <input
                            type="text"
                            value={cmsState.viralOffer?.ctaText || ""}
                            onChange={(e) => updateViralOffer({ ctaText: e.target.value })}
                            style={{ padding: '12px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                        <label className="field">
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '6px', fontSize: '0.85rem' }}>Price Tag</span>
                          <input
                            type="text"
                            value={cmsState.viralOffer?.priceTag || "₹799"}
                            onChange={(e) => updateViralOffer({ priceTag: e.target.value })}
                            style={{ padding: '12px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                      </div>

                      <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(212,175,55,0.06)', borderRadius: '8px', borderLeft: '3px solid #D4AF37' }}>
                        <span style={{ color: '#D4AF37', fontWeight: 600, fontSize: '0.85rem' }}>Live Preview: </span>
                        <span style={{ color: '#FAF7F2', fontSize: '0.85rem' }}>{cmsState.viralOffer?.title}</span>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "settings" && (
                  <section className="section-panel" aria-labelledby="settings-title">
                    <div className="section-heading">
                      <div>
                        <p className="eyebrow">Restaurant Identity &amp; CMS</p>
                        <h2 id="settings-title">Restaurant Profile &amp; Timings</h2>
                        <p>Manage WhatsApp contact number, address, timings, and backup data.</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          className="ghost-button"
                          style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                          onClick={() => {
                            const json = exportDataJson();
                            const blob = new Blob([json], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `nahari_king_backup_${todayISO()}.json`;
                            a.click();
                            notify("CMS Data Exported successfully");
                          }}
                        >
                          ⬇ Export JSON
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          style={{ padding: '8px 14px', fontSize: '0.85rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.4)' }}
                          onClick={() => {
                            if (window.confirm("Restore all dishes and info to factory defaults?")) {
                              resetToDefaults();
                              notify("Reset to original factory data");
                            }
                          }}
                        >
                          Reset Defaults
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                      <div style={{ background: '#120607', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                        <h3 style={{ color: '#D4AF37', marginBottom: '14px', fontSize: '1.05rem' }}>Contact &amp; Ordering</h3>
                        <label className="field" style={{ marginBottom: '12px', display: 'block' }}>
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '4px', fontSize: '0.8rem' }}>Direct Calling Phone</span>
                          <input
                            type="text"
                            value={cmsState.restaurantInfo?.phone || ""}
                            onChange={(e) => updateRestaurantInfo({ phone: e.target.value })}
                            style={{ padding: '10px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                        <label className="field" style={{ marginBottom: '12px', display: 'block' }}>
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '4px', fontSize: '0.8rem' }}>WhatsApp Ordering (Without +)</span>
                          <input
                            type="text"
                            value={cmsState.restaurantInfo?.whatsapp || ""}
                            onChange={(e) => updateRestaurantInfo({ whatsapp: e.target.value })}
                            style={{ padding: '10px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                        <label className="field" style={{ marginBottom: '12px', display: 'block' }}>
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '4px', fontSize: '0.8rem' }}>Email Address</span>
                          <input
                            type="text"
                            value={cmsState.restaurantInfo?.email || ""}
                            onChange={(e) => updateRestaurantInfo({ email: e.target.value })}
                            style={{ padding: '10px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                      </div>

                      <div style={{ background: '#120607', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '20px' }}>
                        <h3 style={{ color: '#D4AF37', marginBottom: '14px', fontSize: '1.05rem' }}>Location &amp; Landmark</h3>
                        <label className="field" style={{ marginBottom: '12px', display: 'block' }}>
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '4px', fontSize: '0.8rem' }}>Full Address</span>
                          <textarea
                            rows={3}
                            value={cmsState.restaurantInfo?.address || ""}
                            onChange={(e) => updateRestaurantInfo({ address: e.target.value })}
                            style={{ padding: '10px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                        <label className="field" style={{ display: 'block' }}>
                          <span style={{ display: 'block', color: '#BFA888', marginBottom: '4px', fontSize: '0.8rem' }}>Landmark</span>
                          <input
                            type="text"
                            value={cmsState.restaurantInfo?.landmark || ""}
                            onChange={(e) => updateRestaurantInfo({ landmark: e.target.value })}
                            style={{ padding: '10px', background: '#1A0709', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#FAF7F2' }}
                          />
                        </label>
                      </div>
                    </div>
                  </section>
                )}

                <footer className="dashboard-footer">
                  <span> The Nahari King • Indore</span>
                  <span>Royal kitchen operations • Private admin terminal</span>
                </footer>
              </>
            )}
          </main>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="login-backdrop">
          <div className="login-card">
            <div className="royal-crest" aria-hidden="true">
              <span className="crest-ring" />
              <span className="crest-letter"></span>
            </div>
            <p className="login-eyebrow">Private Royal Terminal</p>
            <h1>The Nahari King</h1>
            <p className="login-subtitle">
              Indore's celebrated slow-cooked Nalli Nihari
            </p>

            <form className="login-form" onSubmit={handleLogin}>
              <label className="pin-label" htmlFor="admin-pin">
                Royal Passcode
              </label>
              <div className={`pin-field ${loginError ? "failed" : ""}`}>
                <span aria-hidden="true"></span>
                <input
                  id="admin-pin"
                  ref={pinInputRef}
                  type="password"
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value);
                    setLoginError("");
                  }}
                  inputMode="text"
                  autoComplete="current-password"
                  placeholder="Enter passcode"
                  aria-invalid={Boolean(loginError)}
                  aria-describedby="passcode-hint"
                />
              </div>
              <p id="passcode-hint" className="login-hint">
                Private terminal • Authorized staff credentials only
              </p>

              <label className="session-row">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(event) =>
                    setRememberSession(event.target.checked)
                  }
                />
                <span className="custom-checkbox" aria-hidden="true">

                </span>
                Remember session on this device
              </label>

              {loginError && (
                <p className="login-error" role="alert">
                  {loginError}
                </p>
              )}

              <button className="login-submit" type="submit">
                Unlock Royal Kitchen <span aria-hidden="true"></span>
              </button>
            </form>

            <div className="security-note">
              <span aria-hidden="true"></span>
              Private admin gate • Session preference stays on this device
            </div>
          </div>
        </div>
      )}

      {isOrderModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOrderModalOpen(false);
          }}
        >
          <div
            className="modal order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-order-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Manual Counter Entry</p>
                <h2 id="new-order-title">Add a New Order</h2>
                <p>Build the guest's plate and send it straight to KDS.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsOrderModalOpen(false)}
                aria-label="Close new order form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateOrder}>
              <div className="form-grid">
                <label className="field">
                  <span>Guest name *</span>
                  <input
                    type="text"
                    value={orderDraft.customerName}
                    onChange={(event) =>
                      setOrderDraft({
                        ...orderDraft,
                        customerName: event.target.value,
                      })
                    }
                    placeholder="e.g. Aariz Khan"
                    required
                  />
                </label>
                <label className="field">
                  <span>Contact number *</span>
                  <input
                    type="tel"
                    value={orderDraft.phone}
                    onChange={(event) =>
                      setOrderDraft({
                        ...orderDraft,
                        phone: event.target.value,
                      })
                    }
                    placeholder="+91 98765 43210"
                    required
                  />
                </label>
                <label className="field">
                  <span>Payment method</span>
                  <select
                    value={orderDraft.paymentMethod}
                    onChange={(event) =>
                      setOrderDraft({
                        ...orderDraft,
                        paymentMethod: event.target.value as PaymentMethod,
                      })
                    }
                  >
                    {(["Cash", "UPI", "Online"] as const).map((method) => (
                      <option value={method} key={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Kitchen notes</span>
                  <input
                    type="text"
                    value={orderDraft.notes}
                    onChange={(event) =>
                      setOrderDraft({
                        ...orderDraft,
                        notes: event.target.value,
                      })
                    }
                    placeholder="Allergy, delivery gate, celebration…"
                  />
                </label>
              </div>

              <div className="item-picker">
                <div className="item-picker-title">
                  <div>
                    <strong>Pick from the live menu</strong>
                    <small>Price uses the current inventory value</small>
                  </div>
                  {selectedDraftMenuItem && (
                    <span>
                      {formatINR(selectedDraftMenuItem.price)} •{" "}
                      {selectedDraftMenuItem.stockCount}{" "}
                      {selectedDraftMenuItem.stockUnit} left
                    </span>
                  )}
                </div>
                <div className="picker-row">
                  <select
                    value={orderDraft.selectedMenuItemId}
                    onChange={(event) =>
                      setOrderDraft({
                        ...orderDraft,
                        selectedMenuItemId: event.target.value,
                      })
                    }
                    aria-label="Choose menu item"
                  >
                    {menu.map((item) => (
                      <option
                        value={item.id}
                        key={item.id}
                        disabled={item.stockStatus === "Sold Out"}
                      >
                        {item.name} — {formatINR(item.price)}
                        {item.stockStatus === "Sold Out" ? " (Sold Out)" : ""}
                      </option>
                    ))}
                  </select>
                  <label className="quantity-field">
                    <span>Qty</span>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={orderDraft.quantity}
                      onChange={(event) =>
                        setOrderDraft({
                          ...orderDraft,
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                  </label>
                  <button
                    className="add-item-button"
                    type="button"
                    onClick={handleAddDraftItem}
                  >
                    Add Item
                  </button>
                </div>
                <div className="picker-options">
                  <label>
                    <span>Portion</span>
                    <select
                      value={orderDraft.portion}
                      onChange={(event) =>
                        setOrderDraft({
                          ...orderDraft,
                          portion: event.target.value as Portion,
                        })
                      }
                    >
                      {([
                        "Single Bowl",
                        "Half Degh",
                        "Full Degh",
                        "Plate",
                        "Handi",
                        "Single Serving",
                        "Glass",
                      ] as const).map((portion) => (
                        <option value={portion} key={portion}>
                          {portion}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Spice level</span>
                    <select
                      value={orderDraft.spiceLevel}
                      onChange={(event) =>
                        setOrderDraft({
                          ...orderDraft,
                          spiceLevel: event.target.value as SpiceLevel,
                        })
                      }
                    >
                      {(["Mild", "Medium", "Royal Hot", "Extra Hot"] as const).map(
                        (level) => (
                          <option value={level} key={level}>
                            {level}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
              </div>

              <div className="draft-items">
                <div className="draft-items-title">
                  <strong>Order plate</strong>
                  <span>{orderDraft.items.length} lines</span>
                </div>
                {orderDraft.items.length === 0 ? (
                  <p className="draft-empty">No items added yet.</p>
                ) : (
                  orderDraft.items.map((item) => (
                    <div className="draft-item" key={item.id}>
                      <span>{item.quantity}×</span>
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.portion} • {item.spiceLevel}
                        </small>
                      </div>
                      <b>{formatINR(item.quantity * item.unitPrice)}</b>
                      <button
                        type="button"
                        onClick={() =>
                          setOrderDraft({
                            ...orderDraft,
                            items: orderDraft.items.filter(
                              (draftItem) => draftItem.id !== item.id,
                            ),
                          })
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="order-total-box">
                <span>Order total</span>
                <strong>{formatINR(draftOrderTotal)}</strong>
              </div>

              {orderFormError && (
                <p className="form-error" role="alert">
                  {orderFormError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setIsOrderModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={orderDraft.items.length === 0}
                >
                  Send to KDS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReservationModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setIsReservationModalOpen(false);
            }
          }}
        >
          <div
            className="modal reservation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-reservation-title"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Walk-in / VIP Booking</p>
                <h2 id="new-reservation-title">Add a Reservation</h2>
                <p>Reserve a diwan, royal table or private majlis.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsReservationModalOpen(false)}
                aria-label="Close reservation form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateReservation}>
              <div className="form-grid">
                <label className="field">
                  <span>Guest / group name *</span>
                  <input
                    type="text"
                    value={reservationDraft.guestName}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        guestName: event.target.value,
                      })
                    }
                    placeholder="e.g. Fatima Trust Delegation"
                    required
                  />
                </label>
                <label className="field">
                  <span>Contact number *</span>
                  <input
                    type="tel"
                    value={reservationDraft.contact}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        contact: event.target.value,
                      })
                    }
                    placeholder="+91 98765 43210"
                    required
                  />
                </label>
                <label className="field">
                  <span>Reservation date *</span>
                  <input
                    type="date"
                    value={reservationDraft.date}
                    min={today}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        date: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>Time slot *</span>
                  <input
                    type="time"
                    value={reservationDraft.timeSlot}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        timeSlot: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>Guests *</span>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={reservationDraft.guests}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        guests: Number(event.target.value),
                      })
                    }
                    required
                  />
                </label>
                <label className="field">
                  <span>Seating type *</span>
                  <select
                    value={reservationDraft.seatingType}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        seatingType: event.target.value as Reservation["seatingType"],
                      })
                    }
                  >
                    {([
                      "Traditional Diwan",
                      "Royal Dining Table",
                      "Shahi Majlis VIP",
                    ] as const).map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field field-wide">
                  <span>Special request</span>
                  <textarea
                    value={reservationDraft.notes}
                    onChange={(event) =>
                      setReservationDraft({
                        ...reservationDraft,
                        notes: event.target.value,
                      })
                    }
                    placeholder="Anniversary, child seat, separate billing…"
                    rows={3}
                  />
                </label>
              </div>

              {reservationFormError && (
                <p className="form-error" role="alert">
                  {reservationFormError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setIsReservationModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dish Modal */}
      {editingDish && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setEditingDish(null);
          }}
        >
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">CMS Dish Editor</p>
                <h2>Edit Dish &amp; Image</h2>
                <p>Changes will update live across the website menu and cards.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setEditingDish(null)}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateDish(editingDish);
                // Also update local menu representation
                setMenu((cur) =>
                  cur.map((m) =>
                    m.id === editingDish.id
                      ? {
                          ...m,
                          name: editingDish.name,
                          description: editingDish.description,
                          price: editingDish.price,
                          tag: editingDish.tag || m.tag,
                        }
                      : m
                  )
                );
                notify(`${editingDish.name} details & image saved`);
                setEditingDish(null);
              }}
            >
              <div className="form-grid">
                <label className="field field-wide">
                  <span>Dish Name *</span>
                  <input
                    type="text"
                    required
                    value={editingDish.name}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, name: e.target.value })
                    }
                  />
                </label>

                <label className="field field-wide">
                  <span>Urdu Calligraphy Name</span>
                  <input
                    type="text"
                    value={editingDish.urduName || ""}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, urduName: e.target.value })
                    }
                    placeholder="e.g. نہاری کنگ سپیشل نلی نہاری"
                  />
                </label>

                <label className="field">
                  <span>Price (₹) *</span>
                  <input
                    type="number"
                    min="10"
                    required
                    value={editingDish.price}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="field">
                  <span>Category *</span>
                  <select
                    value={editingDish.category}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        category: e.target.value as GlobalMenuItem["category"],
                      })
                    }
                  >
                    <option value="nihari">nihari</option>
                    <option value="biryani">biryani</option>
                    <option value="kebabs">kebabs</option>
                    <option value="breads">breads</option>
                    <option value="desserts">desserts</option>
                    <option value="beverages">beverages</option>
                  </select>
                </label>

                <label className="field field-wide">
                  <span>Tag / Badge (e.g. 👑 Indore Bestseller, 🔥 Viral Special)</span>
                  <input
                    type="text"
                    value={editingDish.tag || ""}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, tag: e.target.value })
                    }
                  />
                </label>

                <label className="field field-wide">
                  <span>Image URL / Asset Path *</span>
                  <input
                    type="text"
                    required
                    value={editingDish.image || ""}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, image: e.target.value })
                    }
                    placeholder="/images/dishes/special-nalli-nihari.jpg or https://..."
                  />
                </label>

                <label className="field field-wide">
                  <span>Description *</span>
                  <textarea
                    rows={3}
                    required
                    value={editingDish.description}
                    onChange={(e) =>
                      setEditingDish({
                        ...editingDish,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                <label className="field field-wide" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(editingDish.isSignature)}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, isSignature: e.target.checked })
                    }
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span>Show as Signature Dish on Homepage</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setEditingDish(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {isAddDishModalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setIsAddDishModalOpen(false);
          }}
        >
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Menu Expansion</p>
                <h2>+ Add New Dish to Live Menu</h2>
                <p>Add a new Awadhi recipe with image path and pricing.</p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsAddDishModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newDishDraft.name || !newDishDraft.price) return;
                const newDish: GlobalMenuItem = {
                  id: newDishDraft.id || `dish-${Date.now()}`,
                  name: newDishDraft.name,
                  urduName: newDishDraft.urduName || "",
                  description: newDishDraft.description || "",
                  price: Number(newDishDraft.price) || 350,
                  category: (newDishDraft.category as GlobalMenuItem["category"]) || "nihari",
                  tag: newDishDraft.tag || "👑 Royal Fare",
                  image: newDishDraft.image || "/images/dishes/special-nalli-nihari.jpg",
                  isSignature: Boolean(newDishDraft.isSignature),
                };

                addDish(newDish);
                // Also update local inventory list
                setMenu((cur) => [
                  {
                    id: newDish.id,
                    name: newDish.name,
                    description: newDish.description,
                    price: newDish.price,
                    category: newDish.category,
                    tag: newDish.tag || "",
                    emoji: "🥘",
                    stockStatus: "In Stock",
                    stockCount: 20,
                    stockUnit: "bowls",
                  },
                  ...cur,
                ]);

                notify(`${newDish.name} added to the royal menu!`);
                setIsAddDishModalOpen(false);
              }}
            >
              <div className="form-grid">
                <label className="field field-wide">
                  <span>Dish Name *</span>
                  <input
                    type="text"
                    required
                    value={newDishDraft.name || ""}
                    onChange={(e) =>
                      setNewDishDraft({ ...newDishDraft, name: e.target.value })
                    }
                    placeholder="e.g. Shahi Mutton Dum Qorma"
                  />
                </label>

                <label className="field field-wide">
                  <span>Urdu Calligraphy Name</span>
                  <input
                    type="text"
                    value={newDishDraft.urduName || ""}
                    onChange={(e) =>
                      setNewDishDraft({ ...newDishDraft, urduName: e.target.value })
                    }
                    placeholder="e.g. شاہی قورمہ"
                  />
                </label>

                <label className="field">
                  <span>Price (₹) *</span>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newDishDraft.price || 350}
                    onChange={(e) =>
                      setNewDishDraft({
                        ...newDishDraft,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="field">
                  <span>Category *</span>
                  <select
                    value={newDishDraft.category || "nihari"}
                    onChange={(e) =>
                      setNewDishDraft({
                        ...newDishDraft,
                        category: e.target.value as GlobalMenuItem["category"],
                      })
                    }
                  >
                    <option value="nihari">nihari</option>
                    <option value="biryani">biryani</option>
                    <option value="kebabs">kebabs</option>
                    <option value="breads">breads</option>
                    <option value="desserts">desserts</option>
                    <option value="beverages">beverages</option>
                  </select>
                </label>

                <label className="field field-wide">
                  <span>Tag / Badge (e.g. 👑 Indore Special, 🌟 New Arrival)</span>
                  <input
                    type="text"
                    value={newDishDraft.tag || ""}
                    onChange={(e) =>
                      setNewDishDraft({ ...newDishDraft, tag: e.target.value })
                    }
                  />
                </label>

                <label className="field field-wide">
                  <span>Image URL / Asset Path *</span>
                  <input
                    type="text"
                    required
                    value={newDishDraft.image || ""}
                    onChange={(e) =>
                      setNewDishDraft({ ...newDishDraft, image: e.target.value })
                    }
                    placeholder="/images/dishes/special-nalli-nihari.jpg"
                  />
                </label>

                <label className="field field-wide">
                  <span>Description *</span>
                  <textarea
                    rows={3}
                    required
                    value={newDishDraft.description || ""}
                    onChange={(e) =>
                      setNewDishDraft({
                        ...newDishDraft,
                        description: e.target.value,
                      })
                    }
                    placeholder="Slow cooked with Awadhi herbs and spices..."
                  />
                </label>

                <label className="field field-wide" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(newDishDraft.isSignature)}
                    onChange={(e) =>
                      setNewDishDraft({ ...newDishDraft, isSignature: e.target.checked })
                    }
                    style={{ width: 'auto', margin: 0 }}
                  />
                  <span>Show as Signature Dish on Homepage</span>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setIsAddDishModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Add to Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          <span aria-hidden="true"></span> {toast}
        </div>
      )}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        button,
        input,
        select,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        input,
        select,
        textarea {
          width: 100%;
        }

        ::selection {
          background: #d4af37;
          color: #120607;
        }

        .dashboard-shell {
          position: relative;
          min-height: 100vh;
          color: #f8ead0;
          background:
            radial-gradient(circle at 15% 0%, rgba(122, 12, 14, 0.2), transparent 30%),
            linear-gradient(135deg, #090404 0%, #120607 48%, #0b0507 100%);
          overflow-x: hidden;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .ambient {
          position: fixed;
          z-index: 0;
          border-radius: 999px;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.28;
        }

        .ambient-one {
          width: 420px;
          height: 420px;
          top: -180px;
          right: 8%;
          background: #d4af37;
          opacity: 0.12;
        }

        .ambient-two {
          width: 360px;
          height: 360px;
          top: 40%;
          left: -180px;
          background: #7a0c0e;
          opacity: 0.2;
        }

        .ambient-three {
          width: 300px;
          height: 300px;
          right: -120px;
          bottom: -100px;
          background: #10b981;
          opacity: 0.08;
        }

        .layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr);
          min-height: 100vh;
          transition: filter 0.45s ease, opacity 0.45s ease;
        }

        .is-locked .layout {
          filter: blur(16px) saturate(0.65);
          opacity: 0.58;
          pointer-events: none;
          user-select: none;
        }

        .sidebar {
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 28px 20px 22px;
          border-right: 1px solid rgba(212, 175, 55, 0.18);
          background:
            linear-gradient(180deg, rgba(24, 9, 11, 0.96), rgba(9, 4, 4, 0.98)),
            repeating-linear-gradient(
              135deg,
              transparent 0,
              transparent 18px,
              rgba(212, 175, 55, 0.025) 19px,
              rgba(212, 175, 55, 0.025) 20px
            );
          box-shadow: 20px 0 60px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(24px);
        }

        .sidebar-brand,
        .topbar-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brand-orb,
        .brand-mark {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(252, 232, 166, 0.55);
          border-radius: 50%;
          color: #fce8a6;
          background:
            radial-gradient(circle at 35% 25%, #5b3811, transparent 38%),
            linear-gradient(145deg, #2c130b, #100708);
          box-shadow:
            inset 0 0 18px rgba(212, 175, 55, 0.12),
            0 0 28px rgba(212, 175, 55, 0.14);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
        }

        .sidebar-brand strong,
        .brand-copy strong {
          display: block;
          color: #fff5dc;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
          letter-spacing: 0.02em;
        }

        .sidebar-brand small,
        .brand-copy small {
          display: block;
          margin-top: 3px;
          color: #b89a58;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .nav-label {
          margin: 38px 10px 10px;
          color: #77623a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .side-nav {
          display: grid;
          gap: 9px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 62px;
          padding: 10px 12px;
          border: 1px solid transparent;
          border-radius: 14px;
          color: #b9a783;
          background: transparent;
          text-align: left;
          transition:
            border-color 0.25s ease,
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .nav-item:hover {
          color: #fff0c4;
          background: rgba(212, 175, 55, 0.06);
          transform: translateX(3px);
        }

        .nav-item.active {
          border-color: rgba(212, 175, 55, 0.28);
          color: #fff4d3;
          background:
            linear-gradient(100deg, rgba(212, 175, 55, 0.17), rgba(122, 12, 14, 0.12));
          box-shadow:
            inset 3px 0 #d4af37,
            0 10px 30px rgba(0, 0, 0, 0.18);
        }

        .nav-icon {
          display: grid;
          flex: 0 0 34px;
          place-items: center;
          width: 34px;
          height: 34px;
          margin-right: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.045);
          font-size: 18px;
        }

        .nav-copy strong,
        .nav-copy small {
          display: block;
        }

        .nav-copy strong {
          font-size: 13px;
          font-weight: 700;
        }

        .nav-copy small {
          margin-top: 3px;
          color: #7f6e52;
          font-size: 9px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sidebar-footer {
          margin-top: auto;
        }

        .degh-note {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 14px;
          border: 1px solid rgba(212, 175, 55, 0.16);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.035);
        }

        .degh-note > span {
          font-size: 25px;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.25));
        }

        .degh-note strong,
        .degh-note small {
          display: block;
        }

        .degh-note strong {
          color: #f3d998;
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .degh-note small {
          margin-top: 3px;
          color: #817056;
          font-size: 9px;
        }

        .sidebar-seal {
          margin-top: 14px;
          color: #655337;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.24em;
          text-align: center;
        }

        .workspace {
          min-width: 0;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          display: grid;
          grid-template-columns: minmax(250px, 1fr) auto auto;
          align-items: center;
          gap: 18px;
          min-height: 84px;
          padding: 14px 28px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.14);
          background: rgba(9, 4, 4, 0.82);
          box-shadow: 0 14px 35px rgba(0, 0, 0, 0.16);
          backdrop-filter: blur(24px);
        }

        .topbar-context {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #bca982;
          font-size: 11px;
          white-space: nowrap;
        }

        .live-badge,
        .shift-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .live-badge {
          color: #d9f8e9;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse 2s infinite;
        }

        .context-divider {
          width: 1px;
          height: 25px;
          background: rgba(212, 175, 55, 0.18);
        }

        .shift-badge {
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.22);
        }

        .shift-emerald {
          color: #d9f8e9;
          background: rgba(16, 185, 129, 0.09);
          border-color: rgba(16, 185, 129, 0.22);
        }

        .shift-crimson {
          color: #ffd9d8;
          background: rgba(122, 12, 14, 0.16);
          border-color: rgba(239, 68, 68, 0.25);
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-button,
        .logout-button {
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: #d8c391;
          background: rgba(255, 255, 255, 0.035);
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .action-button {
          padding: 9px 11px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .action-button:hover,
        .logout-button:hover {
          color: #fff0c4;
          border-color: rgba(212, 175, 55, 0.55);
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-1px);
        }

        .danger-button:hover {
          color: #ffb4b1;
          border-color: rgba(239, 68, 68, 0.45);
          background: rgba(122, 12, 14, 0.13);
        }

        .logout-button {
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 50%;
          font-size: 19px;
        }

        .ticker {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 42px;
          padding: 0 28px;
          overflow: hidden;
          border-bottom: 1px solid rgba(212, 175, 55, 0.12);
          background:
            linear-gradient(90deg, rgba(122, 12, 14, 0.12), transparent 35%, rgba(212, 175, 55, 0.07));
        }

        .ticker::after {
          position: absolute;
          right: 0;
          bottom: -1px;
          left: 0;
          height: 1px;
          content: "";
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          opacity: 0.45;
        }

        .ticker-label {
          position: relative;
          z-index: 1;
          margin-right: 14px;
          padding: 4px 7px;
          border: 1px solid #d4af37;
          border-radius: 4px;
          color: #120607;
          background: #d4af37;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .ticker-track {
          min-width: 0;
          flex: 1;
          overflow: hidden;
        }

        .ticker-message {
          display: block;
          overflow: hidden;
          color: #cbb88e;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 12px;
          letter-spacing: 0.02em;
          text-overflow: ellipsis;
          white-space: nowrap;
          animation: tickerIn 0.45s ease both;
        }

        .ticker-hint {
          margin-left: 16px;
          color: #6f5c40;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .content {
          width: 100%;
          max-width: 1640px;
          margin: 0 auto;
          padding: 30px 28px 24px;
        }

        .section-intro,
        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .eyebrow {
          margin: 0 0 6px;
          color: #d4af37;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #fff4d8;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(24px, 2.2vw, 34px);
          font-weight: 500;
          letter-spacing: -0.025em;
        }

        .section-heading p,
        .section-intro p:not(.eyebrow) {
          margin: 7px 0 0;
          color: #8f7e64;
          font-size: 12px;
        }

        .last-sync {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #71806f;
          font-size: 10px;
          white-space: nowrap;
        }

        .last-sync i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 9px rgba(16, 185, 129, 0.6);
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
        }

        .kpi-card,
        .section-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.16);
          background:
            linear-gradient(145deg, rgba(31, 12, 14, 0.88), rgba(13, 6, 8, 0.92));
          box-shadow:
            inset 0 1px rgba(255, 255, 255, 0.025),
            0 22px 60px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(18px);
        }

        .kpi-card {
          min-height: 205px;
          padding: 20px;
          border-radius: 19px;
          transition:
            transform 0.28s ease,
            border-color 0.28s ease,
            box-shadow 0.28s ease;
        }

        .kpi-card::before {
          position: absolute;
          top: -80px;
          right: -60px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          content: "";
          background: radial-gradient(circle, rgba(212, 175, 55, 0.12), transparent 68%);
        }

        .kpi-card:hover {
          border-color: rgba(212, 175, 55, 0.34);
          box-shadow:
            inset 0 1px rgba(255, 255, 255, 0.04),
            0 26px 70px rgba(0, 0, 0, 0.3);
          transform: translateY(-4px);
        }

        .kpi-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .kpi-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 13px;
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.1);
          font-family: Georgia, serif;
          font-size: 22px;
          box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.06);
        }

        .kpi-growth,
        .status-pill {
          display: inline-flex;
          align-items: center;
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .kpi-growth.positive {
          color: #9df0c8;
          background: rgba(16, 185, 129, 0.1);
        }

        .kpi-label {
          margin: 18px 0 5px;
          color: #a8936e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .kpi-value {
          display: block;
          color: #fff6df;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(25px, 2.3vw, 34px);
          letter-spacing: -0.035em;
        }

        .kpi-caption {
          margin: 7px 0 0;
          color: #75664e;
          font-size: 10px;
        }

        .kpi-spark {
          position: absolute;
          right: 18px;
          bottom: 17px;
          width: 125px;
          height: 35px;
          color: rgba(212, 175, 55, 0.4);
          opacity: 0.65;
        }

        .status-pill.tone-gold {
          color: #ffe5a0;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid rgba(212, 175, 55, 0.24);
        }

        .status-pill.tone-crimson {
          color: #ffc1be;
          background: rgba(122, 12, 14, 0.18);
          border: 1px solid rgba(239, 68, 68, 0.24);
        }

        .status-pill.tone-blue {
          color: #c9e7ff;
          background: rgba(37, 99, 235, 0.13);
          border: 1px solid rgba(96, 165, 250, 0.24);
        }

        .status-pill.tone-violet {
          color: #e2d4ff;
          background: rgba(109, 40, 217, 0.14);
          border: 1px solid rgba(167, 139, 250, 0.24);
        }

        .status-pill.tone-emerald {
          color: #baf5d9;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .status-pill.tone-muted {
          color: #aaa092;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .stock-stack {
          display: grid;
          gap: 7px;
          margin-top: 12px;
        }

        .stock-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 7px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
          color: #a79473;
          font-size: 10px;
        }

        .stock-row strong {
          color: #f3d998;
          font-size: 10px;
        }

        .section-panel {
          margin-top: 28px;
          padding: 25px;
          border-radius: 22px;
          animation: panelIn 0.45s ease both;
        }

        .section-emblem {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 62px;
          height: 62px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50%;
          color: #fce8a6;
          background:
            radial-gradient(circle at 35% 30%, rgba(212, 175, 55, 0.18), transparent 45%),
            rgba(255, 255, 255, 0.025);
          font-size: 27px;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0 12px;
        }

        .filter-group {
          display: inline-flex;
          max-width: 100%;
          padding: 4px;
          overflow-x: auto;
          border: 1px solid rgba(212, 175, 55, 0.13);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.18);
        }

        .filter-button {
          padding: 8px 12px;
          border: 0;
          border-radius: 8px;
          color: #928066;
          background: transparent;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .filter-button:hover {
          color: #ead59f;
        }

        .filter-button.active {
          color: #170908;
          background: linear-gradient(135deg, #fce8a6, #d4af37);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.18);
        }

        .search-box {
          position: relative;
          display: block;
          min-width: 210px;
          flex: 1;
        }

        .search-box > span {
          position: absolute;
          top: 50%;
          left: 12px;
          color: #8d7654;
          font-size: 18px;
          transform: translateY(-52%);
        }

        .search-box input,
        .toolbar select,
        .date-filter input,
        .field input,
        .field select,
        .field textarea,
        .item-picker select,
        .quantity-field input,
        .picker-options select {
          border: 1px solid rgba(212, 175, 55, 0.15);
          outline: none;
          color: #ead9b8;
          background: rgba(4, 2, 3, 0.58);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .search-box input {
          height: 40px;
          padding: 0 13px 0 38px;
          border-radius: 11px;
          font-size: 11px;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(212, 175, 55, 0.62);
          background: rgba(7, 3, 4, 0.82);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08);
        }

        .primary-button,
        .ghost-button,
        .add-item-button,
        .advance-button,
        .whatsapp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 40px;
          padding: 0 14px;
          border-radius: 11px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .primary-button {
          border: 1px solid rgba(252, 232, 166, 0.65);
          color: #170908;
          background: linear-gradient(135deg, #fce8a6, #c99d2e);
          box-shadow: 0 9px 24px rgba(212, 175, 55, 0.16);
          white-space: nowrap;
        }

        .primary-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.25);
        }

        .ghost-button {
          border: 1px solid rgba(212, 175, 55, 0.18);
          color: #bca982;
          background: rgba(255, 255, 255, 0.035);
        }

        .ghost-button:hover {
          color: #fff0c4;
          border-color: rgba(212, 175, 55, 0.4);
        }

        .result-count {
          margin: 0 2px 13px;
          color: #6f614d;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .order-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .order-card {
          position: relative;
          min-width: 0;
          padding: 18px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.13);
          border-radius: 16px;
          background:
            linear-gradient(145deg, rgba(31, 13, 15, 0.88), rgba(11, 5, 7, 0.94));
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
          transition:
            transform 0.24s ease,
            border-color 0.24s ease,
            box-shadow 0.24s ease;
        }

        .order-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.28);
          transform: translateY(-2px);
        }

        .status-rail {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
          background: #d4af37;
        }

        .status-crimson .status-rail {
          background: #ef4444;
        }

        .status-blue .status-rail {
          background: #60a5fa;
        }

        .status-violet .status-rail {
          background: #a78bfa;
        }

        .status-emerald .status-rail {
          background: #10b981;
        }

        .status-muted .status-rail {
          background: #777;
        }

        .order-topline,
        .order-footer,
        .customer-line,
        .order-item,
        .reservation-top,
        .reservation-identity,
        .reservation-actions,
        .review-header,
        .review-card-footer,
        .menu-card-top,
        .draft-items-title,
        .draft-item,
        .item-picker-title,
        .picker-row,
        .order-total-box {
          display: flex;
          align-items: center;
        }

        .order-topline,
        .reservation-top {
          justify-content: space-between;
          gap: 12px;
        }

        .order-id,
        .pass-id {
          display: block;
          color: #f4d998;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .time-stamp {
          display: block;
          margin-top: 3px;
          color: #6f614d;
          font-size: 9px;
        }

        .customer-line {
          gap: 10px;
          margin-top: 16px;
        }

        .guest-avatar,
        .reviewer-avatar {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 35px;
          height: 35px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 50%;
          color: #fce8a6;
          background: linear-gradient(145deg, rgba(122, 12, 14, 0.55), rgba(43, 16, 17, 0.8));
          font-family: Georgia, serif;
          font-size: 13px;
          font-weight: 700;
        }

        .guest-avatar.vip {
          border-color: rgba(252, 232, 166, 0.6);
          box-shadow: 0 0 18px rgba(212, 175, 55, 0.16);
        }

        .customer-line strong,
        .customer-line a,
        .reservation-identity strong,
        .reservation-identity span {
          display: block;
        }

        .customer-line strong,
        .reservation-identity strong {
          color: #f5e5c3;
          font-size: 12px;
        }

        .customer-line a,
        .reservation-identity span {
          margin-top: 2px;
          color: #8e7a5c;
          font-size: 9px;
          text-decoration: none;
        }

        .customer-line a:hover {
          color: #d4af37;
        }

        .order-items {
          display: grid;
          gap: 8px;
          margin: 16px 0;
          padding: 12px 0;
          border-top: 1px solid rgba(212, 175, 55, 0.08);
          border-bottom: 1px solid rgba(212, 175, 55, 0.08);
        }

        .order-item {
          gap: 8px;
        }

        .item-quantity {
          display: grid;
          flex: 0 0 25px;
          place-items: center;
          width: 25px;
          height: 25px;
          border-radius: 7px;
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.1);
          font-size: 9px;
          font-weight: 900;
        }

        .order-item strong,
        .order-item small,
        .draft-item strong,
        .draft-item small {
          display: block;
        }

        .order-item strong,
        .draft-item strong {
          overflow: hidden;
          color: #d9c8a6;
          font-size: 10px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .order-item small,
        .draft-item small {
          margin-top: 2px;
          color: #71624d;
          font-size: 8px;
        }

        .order-footer {
          justify-content: space-between;
          gap: 12px;
        }

        .order-total {
          display: block;
          color: #fff0c4;
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 700;
        }

        .payment-meta {
          display: block;
          margin-top: 2px;
          color: #76664e;
          font-size: 8px;
          text-transform: uppercase;
        }

        .status-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-select {
          min-width: 126px;
          height: 34px;
          padding: 0 8px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 8px;
          outline: none;
          color: #cbb78e;
          background: rgba(3, 2, 3, 0.7);
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .advance-button,
        .whatsapp-button {
          min-height: 34px;
          padding: 0 9px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          color: #cbb78e;
          background: rgba(255, 255, 255, 0.035);
          font-size: 8px;
          white-space: nowrap;
        }

        .advance-button:hover,
        .whatsapp-button:hover {
          color: #fff0c4;
          border-color: rgba(212, 175, 55, 0.45);
          transform: translateY(-1px);
        }

        .whatsapp-button {
          color: #baf5d9;
          border-color: rgba(16, 185, 129, 0.22);
          background: rgba(16, 185, 129, 0.08);
        }

        .reservation-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .reservation-card {
          position: relative;
          min-width: 0;
          padding: 18px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.13);
          border-radius: 16px;
          background:
            linear-gradient(145deg, rgba(31, 13, 15, 0.88), rgba(10, 5, 7, 0.94));
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);
          transition:
            transform 0.24s ease,
            border-color 0.24s ease;
        }

        .reservation-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
        }

        .reservation-card::after {
          position: absolute;
          top: -35px;
          right: -35px;
          width: 90px;
          height: 90px;
          border: 1px solid rgba(212, 175, 55, 0.08);
          border-radius: 50%;
          content: "";
        }

        .reservation-identity {
          gap: 10px;
          margin-top: 15px;
        }

        .reservation-identity h3 {
          overflow: hidden;
          margin: 0;
          color: #f5e5c3;
          font-family: Georgia, serif;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .reservation-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin: 16px 0 10px;
          padding: 11px;
          border-radius: 11px;
          color: #9c896a;
          background: rgba(255, 255, 255, 0.028);
          font-size: 9px;
        }

        .reservation-details span:last-child {
          grid-column: 1 / -1;
          color: #d4b96e;
        }

        .reservation-notes {
          min-height: 30px;
          margin: 0 0 12px;
          overflow: hidden;
          color: #7f6f58;
          font-size: 9px;
          line-height: 1.5;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .reservation-actions {
          justify-content: flex-end;
          gap: 7px;
        }

        .reservation-status-confirmed {
          color: #baf5d9;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.22);
        }

        .reservation-status-seated {
          color: #c9e7ff;
          background: rgba(37, 99, 235, 0.11);
          border-color: rgba(96, 165, 250, 0.22);
        }

        .reservation-status-completed {
          color: #aaa092;
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .reservation-status-cancelled {
          color: #ffb4b1;
          background: rgba(122, 12, 14, 0.12);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .date-filter {
          position: relative;
          display: block;
          width: 190px;
        }

        .date-filter span {
          position: absolute;
          top: 50%;
          left: 11px;
          z-index: 1;
          color: #9b8053;
          font-size: 12px;
          transform: translateY(-50%);
        }

        .date-filter input,
        .toolbar-select {
          height: 40px;
          padding: 0 11px;
          border-radius: 11px;
          font-size: 10px;
        }

        .date-filter input {
          padding-left: 31px;
        }

        .toolbar-select {
          min-width: 180px;
          outline: none;
          color: #cbb78e;
          background: rgba(4, 2, 3, 0.6);
          font-size: 10px;
          font-weight: 700;
        }

        .reservation-toolbar .primary-button {
          margin-left: auto;
        }

        .inventory-heading-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #8e7b5f;
          font-size: 10px;
          font-weight: 700;
        }

        .inventory-heading-stats span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .stock-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .stock-dot.in-stock {
          background: #10b981;
          box-shadow: 0 0 9px rgba(16, 185, 129, 0.5);
        }

        .stock-dot.sold-out {
          background: #ef4444;
          box-shadow: 0 0 9px rgba(239, 68, 68, 0.45);
        }

        .menu-filter {
          flex: 1;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .menu-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.14);
          border-radius: 17px;
          background:
            linear-gradient(150deg, rgba(33, 13, 15, 0.95), rgba(9, 4, 5, 0.97));
          box-shadow: 0 17px 45px rgba(0, 0, 0, 0.2);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .menu-card:hover {
          border-color: rgba(212, 175, 55, 0.33);
          box-shadow: 0 22px 55px rgba(0, 0, 0, 0.28);
          transform: translateY(-3px);
        }

        .menu-card.is-sold-out {
          filter: saturate(0.55);
          opacity: 0.82;
        }

        .menu-card.is-sold-out::after {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          padding: 7px 13px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 999px;
          color: #ffc3c0;
          background: rgba(54, 10, 14, 0.92);
          content: "SOLD OUT";
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          transform: translate(-50%, -50%) rotate(-7deg);
        }

        .menu-thumb {
          position: relative;
          display: grid;
          place-items: center;
          height: 128px;
          overflow: hidden;
          background:
            radial-gradient(circle at 35% 25%, rgba(252, 232, 166, 0.2), transparent 28%),
            linear-gradient(145deg, #3b1512, #16080a);
        }

        .menu-thumb::before,
        .menu-thumb::after {
          position: absolute;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 50%;
          content: "";
        }

        .menu-thumb::before {
          width: 150px;
          height: 150px;
        }

        .menu-thumb::after {
          width: 100px;
          height: 100px;
        }

        .menu-thumb > span {
          position: relative;
          z-index: 1;
          font-size: 55px;
          filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.45));
          transform: translateY(5px);
          transition: transform 0.3s ease;
        }

        .menu-card:hover .menu-thumb > span {
          transform: translateY(1px) scale(1.08);
        }

        .menu-thumb i {
          position: absolute;
          width: 75px;
          height: 75px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          transform: rotate(45deg);
        }

        .menu-card-body {
          padding: 17px;
        }

        .menu-card-top {
          justify-content: space-between;
          gap: 8px;
        }

        .menu-tag {
          padding: 5px 7px;
          border: 1px solid rgba(212, 175, 55, 0.16);
          border-radius: 999px;
          color: #d8ba72;
          background: rgba(212, 175, 55, 0.06);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .stock-switch,
        .feature-switch {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px;
          border: 0;
          color: #88765c;
          background: rgba(255, 255, 255, 0.045);
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .stock-switch {
            min-width: 92px;
            justify-content: center;
            border-radius: 999px;
        }

        .feature-switch {
          justify-content: flex-end;
          border-radius: 9px;
        }

        .stock-switch .knob,
        .feature-switch .knob {
          position: relative;
          z-index: 1;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          background: #6e604c;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .stock-switch::before,
        .feature-switch::before {
          position: absolute;
          width: 28px;
          height: 17px;
          border-radius: 999px;
          content: "";
          background: #493c31;
          transition: background 0.25s ease;
        }

        .stock-switch .knob {
          margin-left: 3px;
        }

        .stock-switch.on::before,
        .feature-switch.on::before {
          background: #10b981;
        }

        .stock-switch.on .knob,
        .feature-switch.on .knob {
          background: #eafff4;
          transform: translateX(11px);
        }

        .menu-card h3 {
          min-height: 42px;
          margin: 13px 0 7px;
          color: #f6e4bd;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.3;
        }

        .menu-card p {
          min-height: 48px;
          margin: 0 0 14px;
          color: #87755d;
          font-size: 9px;
          line-height: 1.55;
        }

        .menu-controls {
          display: grid;
          grid-template-columns: minmax(90px, 0.7fr) minmax(130px, 1fr);
          gap: 8px;
        }

        .price-editor {
          position: relative;
          display: block;
        }

        .price-editor > span {
          position: absolute;
          top: 50%;
          left: 10px;
          color: #c9a858;
          font-size: 12px;
          transform: translateY(-50%);
        }

        .price-editor input {
          height: 37px;
          padding: 0 9px 0 25px;
          border-radius: 9px;
          color: #fff0c4;
          font-size: 11px;
          font-weight: 800;
        }

        .price-editor input::-webkit-outer-spin-button,
        .price-editor input::-webkit-inner-spin-button {
          margin: 0;
          appearance: none;
        }

        .stock-control {
          display: grid;
          grid-template-columns: 31px 1fr 31px;
          align-items: center;
          height: 37px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.14);
          border-radius: 9px;
          background: rgba(0, 0, 0, 0.24);
        }

        .stock-control button {
          height: 100%;
          border: 0;
          color: #d4af37;
          background: rgba(212, 175, 55, 0.06);
          font-size: 14px;
        }

        .stock-control button:hover:not(:disabled) {
          background: rgba(212, 175, 55, 0.14);
        }

        .stock-count {
          overflow: hidden;
          color: #a99676;
          font-size: 8px;
          font-weight: 800;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .menu-card-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid rgba(212, 175, 55, 0.08);
          color: #685a46;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .reviews-summary {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: -4px 0 18px;
          padding: 12px 14px;
          border: 1px solid rgba(212, 175, 55, 0.11);
          border-radius: 13px;
          color: #8c795e;
          background: rgba(255, 255, 255, 0.025);
          font-size: 10px;
        }

        .reviews-summary b {
          color: #f1d794;
        }

        .reviews-summary .filter-group {
          margin-left: auto;
        }

        .review-score {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 66px;
          height: 66px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 50%;
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.08);
          box-shadow: 0 0 28px rgba(212, 175, 55, 0.08);
        }

        .review-score strong {
          font-family: Georgia, serif;
          font-size: 24px;
          line-height: 1;
        }

        .review-score span {
          margin-top: -12px;
          color: #8e7958;
          font-size: 7px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .review-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .review-card {
          min-width: 0;
          padding: 19px;
          border: 1px solid rgba(212, 175, 55, 0.13);
          border-radius: 16px;
          background:
            linear-gradient(145deg, rgba(31, 13, 15, 0.88), rgba(10, 5, 7, 0.94));
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
          transition:
            transform 0.24s ease,
            border-color 0.24s ease;
        }

        .review-card:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-2px);
        }

        .review-header {
          gap: 10px;
        }

        .review-header strong,
        .review-header small {
          display: block;
        }

        .review-header strong {
          color: #ead7ae;
          font-size: 11px;
        }

        .review-header small {
          margin-top: 2px;
          color: #71614b;
          font-size: 8px;
        }

        .stars {
          margin-left: auto;
          color: #574936;
          font-size: 11px;
          letter-spacing: 1px;
          white-space: nowrap;
        }

        .stars .filled {
          color: #f4cf5e;
          text-shadow: 0 0 9px rgba(212, 175, 55, 0.35);
        }

        .review-card blockquote {
          min-height: 78px;
          margin: 15px 0;
          color: #cbb998;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 13px;
          line-height: 1.7;
        }

        .review-card-footer {
          justify-content: space-between;
          gap: 10px;
        }

        .recommended-dish {
          min-width: 0;
          overflow: hidden;
          color: #7f6e55;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-state,
        .loading-state {
          display: grid;
          place-items: center;
          min-height: 260px;
          padding: 35px;
          border: 1px dashed rgba(212, 175, 55, 0.2);
          border-radius: 18px;
          color: #8f7b5d;
          background: rgba(255, 255, 255, 0.018);
          text-align: center;
        }

        .empty-state > span {
          font-size: 34px;
          opacity: 0.7;
        }

        .empty-state strong,
        .loading-state strong {
          display: block;
          margin-top: 12px;
          color: #d9c59a;
          font-family: Georgia, serif;
          font-size: 18px;
        }

        .empty-state p,
        .loading-state small {
          margin: 6px 0 0;
          font-size: 10px;
        }

        .loading-state {
          margin-top: 28px;
        }

        .loading-crest {
          display: grid;
          place-items: center;
          width: 64px;
          height: 64px;
          border: 1px solid rgba(212, 175, 55, 0.35);
          border-radius: 50%;
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.06);
          font-family: Georgia, serif;
          font-size: 31px;
          animation: crestGlow 2s ease-in-out infinite;
        }

        .dashboard-footer {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 24px 2px 4px;
          color: #514435;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .login-backdrop {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: grid;
          place-items: center;
          padding: 22px;
          background:
            radial-gradient(circle at 50% 20%, rgba(122, 12, 14, 0.3), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.12), transparent 38%),
            rgba(5, 2, 3, 0.88);
          backdrop-filter: blur(12px);
          animation: backdropIn 0.45s ease both;
        }

        .login-card {
          position: relative;
          width: min(100%, 470px);
          padding: 38px 40px 30px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.34);
          border-radius: 26px;
          background:
            linear-gradient(145deg, rgba(38, 14, 15, 0.98), rgba(10, 4, 6, 0.99)),
            repeating-linear-gradient(
              135deg,
              transparent 0,
              transparent 24px,
              rgba(212, 175, 55, 0.025) 25px,
              rgba(212, 175, 55, 0.025) 26px
            );
          box-shadow:
            inset 0 1px rgba(255, 255, 255, 0.05),
            0 35px 100px rgba(0, 0, 0, 0.6),
            0 0 60px rgba(122, 12, 14, 0.14);
          text-align: center;
          animation: loginIn 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .login-card::before {
          position: absolute;
          top: -145px;
          left: 50%;
          width: 360px;
          height: 260px;
          border: 1px solid rgba(212, 175, 55, 0.14);
          border-bottom: 0;
          border-radius: 50% 50% 0 0;
          content: "";
          transform: translateX(-50%);
        }

        .royal-crest {
          position: relative;
          display: grid;
          place-items: center;
          width: 88px;
          height: 88px;
          margin: 0 auto 20px;
          border: 1px solid rgba(252, 232, 166, 0.45);
          border-radius: 50%;
          color: #fce8a6;
          background:
            radial-gradient(circle at 35% 25%, #5c3613, transparent 38%),
            linear-gradient(145deg, #31130d, #100708);
          box-shadow:
            inset 0 0 25px rgba(212, 175, 55, 0.12),
            0 0 38px rgba(212, 175, 55, 0.16);
          font-family: Georgia, serif;
          font-size: 45px;
        }

        .crest-ring {
          position: absolute;
          inset: 7px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 50%;
        }

        .crest-letter {
          position: relative;
          z-index: 1;
          margin-top: -3px;
        }

        .login-eyebrow {
          margin: 0 0 7px;
          color: #d4af37;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .login-card h1 {
          margin: 0;
          color: #fff3d4;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 35px;
          font-weight: 500;
          letter-spacing: -0.035em;
        }

        .login-subtitle {
          margin: 7px auto 25px;
          color: #928066;
          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
        }

        .login-form {
          position: relative;
          z-index: 1;
          text-align: left;
        }

        .pin-label {
          display: block;
          margin: 0 0 7px 2px;
          color: #c3ac80;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .pin-field {
          display: flex;
          align-items: center;
          height: 55px;
          padding: 0 15px;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 13px;
          background: rgba(3, 2, 3, 0.72);
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .pin-field:focus-within {
          border-color: rgba(212, 175, 55, 0.75);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.07);
        }

        .pin-field.failed {
          border-color: rgba(239, 68, 68, 0.65);
          animation: shake 0.35s ease;
        }

        .pin-icon {
          margin-right: 10px;
          color: #c6a257;
          font-size: 17px;
        }

        .pin-field input {
          min-width: 0;
          height: 100%;
          flex: 1;
          border: 0;
          outline: 0;
          color: #fff0c4;
          background: transparent;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 17px;
          letter-spacing: 0.18em;
        }

        .pin-field input::placeholder {
          color: #625440;
          letter-spacing: 0.05em;
        }

        .login-hint {
          margin: 8px 2px 16px;
          color: #715f48;
          font-size: 9px;
          line-height: 1.5;
        }

        .login-hint strong {
          color: #bd9d58;
        }

        .session-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 2px 17px;
          color: #a08c6c;
          cursor: pointer;
          font-size: 10px;
        }

        .session-row input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          opacity: 0;
        }

        .custom-checkbox {
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 6px;
          color: transparent;
          background: rgba(255, 255, 255, 0.035);
          font-size: 11px;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .session-row input:checked + .custom-checkbox {
          color: #170908;
          background: #d4af37;
        }

        .login-error {
          margin: -5px 2px 12px;
          color: #ffaaa6;
          font-size: 9px;
        }

        .login-submit {
          width: 100%;
          min-height: 50px;
          border: 1px solid rgba(252, 232, 166, 0.6);
          border-radius: 12px;
          color: #170908;
          background: linear-gradient(135deg, #fce8a6, #c89a2b);
          box-shadow: 0 13px 30px rgba(212, 175, 55, 0.18);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .login-submit:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 17px 38px rgba(212, 175, 55, 0.28);
        }

        .security-note {
          position: relative;
          z-index: 1;
          margin-top: 18px;
          color: #5f513f;
          font-size: 8px;
        }

        .security-note span {
          margin-right: 5px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: grid;
          place-items: center;
          padding: 20px;
          overflow-y: auto;
          background: rgba(4, 2, 3, 0.82);
          backdrop-filter: blur(14px);
          animation: backdropIn 0.25s ease both;
        }

        .modal {
          width: min(100%, 760px);
          max-height: calc(100vh - 40px);
          overflow-y: auto;
          margin: auto;
          border: 1px solid rgba(212, 175, 55, 0.28);
          border-radius: 21px;
          background:
            linear-gradient(145deg, rgba(34, 13, 15, 0.99), rgba(10, 4, 6, 0.99));
          box-shadow:
            0 35px 110px rgba(0, 0, 0, 0.6),
            0 0 50px rgba(122, 12, 14, 0.12);
          animation: modalIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          padding: 24px 25px 18px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.12);
        }

        .modal-header p:not(.eyebrow) {
          margin: 6px 0 0;
          color: #806f57;
          font-size: 10px;
        }

        .close-button {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 50%;
          color: #bda87d;
          background: rgba(255, 255, 255, 0.035);
          font-size: 22px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .close-button:hover {
          color: #fff0c4;
          border-color: rgba(212, 175, 55, 0.5);
        }

        .modal form {
          padding: 20px 25px 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .field {
          display: block;
          min-width: 0;
        }

        .field-wide {
          grid-column: 1 / -1;
        }

        .field > span {
          display: block;
          margin: 0 0 6px 2px;
          color: #b7a27a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field input,
        .field select,
        .field textarea {
          height: 42px;
          padding: 0 12px;
          border-radius: 10px;
          font-size: 11px;
        }

        .field textarea {
          height: auto;
          min-height: 82px;
          padding: 11px 12px;
          resize: vertical;
          line-height: 1.5;
        }

        .item-picker,
        .draft-items {
          margin-top: 19px;
          padding: 15px;
          border: 1px solid rgba(212, 175, 55, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.022);
        }

        .item-picker-title,
        .draft-items-title,
        .order-total-box {
          justify-content: space-between;
          gap: 12px;
        }

        .item-picker-title strong,
        .item-picker-title small,
        .draft-items-title strong,
        .draft-items-title span {
          display: block;
        }

        .item-picker-title strong,
        .draft-items-title strong {
          color: #e9d5a8;
          font-size: 11px;
        }

        .item-picker-title small,
        .draft-items-title span {
          margin-top: 3px;
          color: #71614b;
          font-size: 8px;
        }

        .item-picker-title > span {
          color: #d4af37;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .picker-row {
          gap: 8px;
          margin-top: 12px;
        }

        .picker-row select,
        .picker-options select,
        .quantity-field input {
          height: 40px;
          padding: 0 10px;
          border-radius: 9px;
          outline: none;
          color: #d9c7a3;
          background: rgba(3, 2, 3, 0.68);
          font-size: 10px;
        }

        .picker-row select {
          min-width: 0;
          flex: 1;
        }

        .quantity-field {
          display: grid;
          grid-template-columns: 1fr;
          align-content: center;
          width: 64px;
          color: #76664e;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-align: center;
          text-transform: uppercase;
        }

        .quantity-field input {
          width: 100%;
          margin-top: 4px;
          text-align: center;
        }

        .add-item-button {
          border: 1px solid rgba(212, 175, 55, 0.25);
          color: #170908;
          background: linear-gradient(135deg, #fce8a6, #c79b2e);
          font-size: 9px;
        }

        .picker-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 9px;
        }

        .picker-options label > span {
          display: block;
          margin: 0 0 5px 2px;
          color: #76664e;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .draft-items-title {
          margin-bottom: 9px;
        }

        .draft-empty {
          margin: 0;
          color: #655641;
          font-size: 9px;
          text-align: center;
        }

        .draft-item {
          gap: 8px;
          padding: 9px 0;
          border-top: 1px solid rgba(212, 175, 55, 0.08);
        }

        .draft-item > span {
          display: grid;
          flex: 0 0 26px;
          place-items: center;
          width: 26px;
          height: 26px;
          border-radius: 7px;
          color: #fce8a6;
          background: rgba(212, 175, 55, 0.1);
          font-size: 9px;
          font-weight: 900;
        }

        .draft-item > div {
          min-width: 0;
          flex: 1;
        }

        .draft-item > b {
          color: #e6c97e;
          font-size: 10px;
        }

        .draft-item button {
          width: 25px;
          height: 25px;
          border: 0;
          border-radius: 50%;
          color: #a15450;
          background: rgba(122, 12, 14, 0.12);
          font-size: 13px;
        }

        .order-total-box {
          margin-top: 17px;
          padding: 14px 16px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.055);
        }

        .order-total-box span {
          color: #9b8766;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .order-total-box strong {
          color: #fff0c4;
          font-family: Georgia, serif;
          font-size: 23px;
        }

        .form-error {
          margin: 14px 0 0;
          padding: 10px 12px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 9px;
          color: #ffb4b1;
          background: rgba(122, 12, 14, 0.1);
          font-size: 9px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 20px;
        }

        .toast {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 400;
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: min(420px, calc(100vw - 40px));
          padding: 13px 16px;
          border: 1px solid rgba(212, 175, 55, 0.34);
          border-radius: 13px;
          color: #f6e5bd;
          background: rgba(25, 11, 11, 0.94);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.42);
          backdrop-filter: blur(18px);
          font-size: 11px;
          animation: toastIn 0.3s ease both;
        }

        .toast > span {
          color: #d4af37;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        @keyframes tickerIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes panelIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes loginIn {
          from { opacity: 0; transform: translateY(22px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes crestGlow {
          0%, 100% { box-shadow: 0 0 18px rgba(212, 175, 55, 0.08); }
          50% { box-shadow: 0 0 35px rgba(212, 175, 55, 0.24); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @media (max-width: 1250px) {
          .topbar {
            grid-template-columns: minmax(230px, 1fr) auto;
          }

          .topbar-context {
            grid-column: 1 / -1;
            grid-row: 2;
            justify-content: flex-start;
            padding-top: 2px;
          }

          .topbar-actions {
            justify-self: end;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .reservation-grid,
          .menu-grid,
          .order-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 920px) {
          .layout {
            display: block;
          }

          .sidebar {
            position: sticky;
            top: 0;
            z-index: 50;
            display: block;
            width: 100%;
            height: auto;
            padding: 10px 14px;
            border-right: 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.16);
          }

          .sidebar-brand {
            display: none;
          }

          .nav-label,
          .sidebar-footer {
            display: none;
          }

          .side-nav {
            display: flex;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .side-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-item {
            flex: 0 0 auto;
            width: auto;
            min-height: 52px;
            padding: 8px 12px;
          }

          .nav-copy small,
          .nav-icon {
            display: none;
          }

          .nav-copy strong {
            font-size: 11px;
          }

          .topbar {
            position: static;
            grid-template-columns: 1fr auto;
            padding: 14px 18px;
          }

          .topbar-context {
            display: none;
          }

          .action-button {
            padding: 8px 9px;
          }

          .action-button:first-child {
            display: none;
          }

          .content {
            padding: 22px 18px 20px;
          }

          .order-grid,
          .reservation-grid,
          .menu-grid,
          .review-grid {
            grid-template-columns: 1fr;
          }

          .section-intro,
          .section-heading {
            align-items: flex-start;
          }

          .section-emblem,
          .review-score {
            display: none;
          }

          .inventory-heading-stats {
            flex-wrap: wrap;
            margin-top: 10px;
            width: 100%;
          }
        }

        @media (max-width: 640px) {
          .topbar-brand {
            min-width: 0;
          }

          .brand-mark {
            width: 40px;
            height: 40px;
            font-size: 21px;
          }

          .brand-copy strong {
            max-width: 180px;
            overflow: hidden;
            font-size: 14px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .brand-copy small {
            max-width: 210px;
            overflow: hidden;
            font-size: 8px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .action-button:not(.danger-button) {
            display: none;
          }

          .ticker {
            padding: 0 15px;
          }

          .ticker-hint {
            display: none;
          }

          .content {
            padding: 18px 12px 16px;
          }

          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 11px;
          }

          .kpi-card {
            min-height: 185px;
          }

          .section-panel {
            margin-top: 20px;
            padding: 17px 13px;
            border-radius: 17px;
          }

          .toolbar,
          .reservation-toolbar {
            align-items: stretch;
            flex-wrap: wrap;
          }

          .filter-group {
            width: 100%;
            flex-basis: 100%;
          }

          .search-box,
          .date-filter,
          .toolbar-select {
            width: 100%;
            flex-basis: 100%;
          }

          .primary-button {
            width: 100%;
          }

          .reservation-toolbar .primary-button {
            margin-left: 0;
          }

          .order-card,
          .reservation-card,
          .review-card {
            padding: 15px;
          }

          .order-footer,
          .reservation-actions,
          .review-card-footer,
          .item-picker-title,
          .modal-header {
            align-items: stretch;
            flex-direction: column;
          }

          .status-actions,
          .reservation-actions,
          .review-card-footer,
          .modal-actions {
            width: 100%;
          }

          .status-select {
            min-width: 0;
            flex: 1;
          }

          .advance-button,
          .whatsapp-button {
            flex: 1;
          }

          .feature-switch {
            justify-content: flex-start;
          }

          .reviews-summary {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .reviews-summary .filter-group {
            width: 100%;
            margin-left: 0;
          }

          .form-grid,
          .picker-options {
            grid-template-columns: 1fr;
          }

          .field-wide {
            grid-column: auto;
          }

          .picker-row {
            align-items: stretch;
            flex-wrap: wrap;
          }

          .picker-row select {
            flex-basis: 100%;
          }

          .quantity-field {
            flex: 1;
          }

          .add-item-button {
            flex-basis: 100%;
          }

          .modal-backdrop {
            align-items: start;
            padding: 10px;
          }

          .modal {
            max-height: calc(100vh - 20px);
            border-radius: 17px;
          }

          .modal-header,
          .modal form {
            padding-right: 16px;
            padding-left: 16px;
          }

          .login-backdrop {
            padding: 12px;
          }

          .login-card {
            padding: 30px 21px 23px;
            border-radius: 21px;
          }

          .login-card h1 {
            font-size: 29px;
          }

          .dashboard-footer {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}