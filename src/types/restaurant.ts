export type Category = 'nihari' | 'biryani' | 'kebabs' | 'breads' | 'desserts' | 'beverages';

export type SpiceLevel = 'mild' | 'classic' | 'zesty' | 'royal-fiery';

export interface PortionOption {
  name: string;
  price: number;
  serves: string;
}

export interface MenuItem {
  id: string;
  name: string;
  urduName: string;
  description: string;
  price: number;
  category: Category;
  tag?: string;
  spiceLevel?: SpiceLevel;
  portionSizes?: PortionOption[];
  image: string;
  isSignature?: boolean;
  cookTimeHours?: number;
}

export interface CartItem {
  item: MenuItem;
  selectedPortion?: PortionOption;
  selectedSpice?: SpiceLevel;
  quantity: number;
}

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingType: 'diwan' | 'table' | 'majlis';
  specialRequest?: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  quote: string;
  dishRecommended: string;
  date: string;
}
