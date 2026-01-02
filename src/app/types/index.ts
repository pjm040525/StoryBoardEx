// 모임 관련 타입
export interface Group {
  id: string;
  name: string;
  image: string;
  description?: string;
  tags: string[];
  memberCount: number;
  maxMembers: number;
  type: 'club' | 'meetup' | 'study';
  isPublic: boolean;
  nextEvent?: {
    title: string;
    date: string;
    location: string;
  };
}

// 멤버 관련 타입
export interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'pending';
  joinedDate: string;
  duesStatus: 'paid' | 'unpaid' | 'overdue';
}

// 회비/거래 관련 타입
export interface Transaction {
  id: number;
  title: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category?: string;
  member?: string;
}

export interface DuesPolicy {
  amount: number;
  paymentDay: number;
  allowMultiplePayments: boolean;
  autoNotification: boolean;
  notificationDay: number;
  gracePeriod: number;
}

// 정산 관련 타입
export interface SettlementItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  receipt?: string;
}

export interface Settlement {
  id: string;
  title: string;
  date: string;
  description?: string;
  items: SettlementItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
}

// 일정 관련 타입
export interface Schedule {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  attendees: string[];
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Vote {
  id: string;
  title: string;
  options: VoteOption[];
  deadline: string;
  isMultipleChoice: boolean;
  status: 'open' | 'closed';
}

export interface VoteOption {
  id: string;
  label: string;
  votes: string[];
}

// 알림 관련 타입
export interface Notification {
  id: string;
  type: 'member' | 'schedule' | 'dues' | 'general';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  groupId?: string;
  groupName?: string;
}

// 스토리 관련 타입
export interface Story {
  id: string;
  image: string;
  caption?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 페이지네이션 타입
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

