export type View = 'dashboard' | 'directory' | 'planner' | 'bookings' | 'inquiries' | 'cart' | 'checkout' | 'brochure' | 'client-review' | 'chat' | 'support';

export type ItemCategory = 'flights' | 'hotels' | 'buses' | 'private';

export type TravelType = 'individual' | 'couple' | 'family' | 'group' | 'friends';

export type ClientCategory = 'single' | 'couple' | 'family' | 'friends_group';

export type Gender = 'Male' | 'Female' | 'Other';

export type InquiryStatus = 'pending' | 'in-progress' | 'on-hold' | 'completed';

export type CartStatus = 'draft' | 'pending-approval' | 'approved' | 'changes-requested' | 'on-hold' | 'rejected';

export interface GroupMember {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  role: string;
}

export interface Client {
  id: string;
  name: string;
  membershipId: string;
  lastBooking: string;
  status: 'active' | 'frequent' | 'elite';
  avatar: string;
  email?: string;
  phone?: string;
  category: ClientCategory;
  members: GroupMember[];
}

export interface Message {
  id: string;
  sender: 'admin' | 'bot' | 'client';
  text: string;
  timestamp: string;
}

export interface Inquiry {
  id: string;
  clientId: string;
  clientName: string;
  tripName: string;
  duration: string;
  timeAgo: string;
  isUrgent: boolean;
  status: InquiryStatus;
  messages: Message[];
}

export interface Departure {
  id: string;
  type: 'flight' | 'cruise' | 'bus';
  code: string;
  clientName: string;
  time: string;
  route: string;
}

export interface PlannerItem {
  id: string;
  category: ItemCategory;
  title: string;
  subtitle: string;
  price: number;
  tag?: string;
  details?: string;
  rating?: number;
  duration?: string;
  airline?: string;
  stops?: number;
  amenities?: string[];
  operator?: string;
  location?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  busType?: 'AC' | 'Non-AC' | 'Sleeper';
}

export interface DraftItem {
  id: string;
  plannerItemId: string;
  title: string;
  subtitle: string;
  price: number;
  perPersonPrice: number;
  date: string;
  passengerCount: number;
  category: ItemCategory;
  details?: PlannerItem;
}

export interface ClientCart {
  clientId: string;
  items: DraftItem[];
  status: CartStatus;
  lastSharedAt?: string;
  tripName: string;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  tripName: string;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'scheduled';
  items: DraftItem[];
  dateRange: string;
  travelType: TravelType;
  scheduledAt?: string;
  passengers: GroupMember[];
  paymentStatus: 'paid' | 'unpaid';
}

export interface TravelPackage {
  id: string;
  name: string;
  destination: string;
  price: number;
  duration: string;
  image: string;
  type: TravelType;
  rating: number;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  clientName: string;
  subject: string;
  status: 'open' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: Message[];
}
