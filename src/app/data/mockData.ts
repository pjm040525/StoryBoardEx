import { UserRole } from './userRoles';

export type ManagementType = 'operating' | 'fair';

export interface GroupAccount {
  managementType: ManagementType;
  totalBalance: number;      // 총 잔액
  perPersonShare?: number;   // 공정정산형: 1인당 지분 (모두 동일)
  totalDeposited?: number;   // 공정정산형: 총 입금액
  totalUsed?: number;        // 총 사용액
  memberCount: number;       // 현재 멤버 수
  entryFee?: number;         // 공정정산형: 신규 가입비 (기존 멤버 지분과 맞추기 위한 금액)
}

export interface Group {
  id: string;
  name: string;
  image: string;
  tags: string[];
  memberCount: number;
  maxMembers: number;
  type: 'club' | 'meetup' | 'study';
  isPublic: boolean;
  myRole: UserRole;
  myRoles?: UserRole[];  // 복수 역할 (운영진+총무 등)
  account: GroupAccount; // 통장 정보
  nextEvent?: {
    title: string;
    date: string;
    location: string;
  };
}

export const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: '주말 등산 클럽',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['등산', '운동', '친목'],
    memberCount: 15,
    maxMembers: 50,
    type: 'club',
    isPublic: true,
    myRole: 'owner', // 모임장
    account: {
      managementType: 'fair', // 공정정산형
      totalBalance: 1250000,
      perPersonShare: 83333,  // 1,250,000 / 15명 = 83,333원 (모두 동일)
      totalDeposited: 1500000,
      totalUsed: 250000,
      memberCount: 15,
      entryFee: 83333,  // 신규 가입 시 내야 할 금액
    },
    nextEvent: {
      title: '관악산 정기 산행',
      date: '2025-04-12T10:00:00',
      location: '사당역 4번 출구'
    }
  },
  {
    id: '2',
    name: '강남 독서 모임',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['독서', '자기계발'],
    memberCount: 8,
    maxMembers: 10,
    type: 'study',
    isPublic: false,
    myRole: 'treasurer', // 총무
    account: {
      managementType: 'operating', // 운영비형 - 환불 X, 축적형
      totalBalance: 480000,
      totalDeposited: 640000,
      totalUsed: 160000,
      memberCount: 8,
    },
    nextEvent: {
      title: '4월 독서 토론',
      date: '2025-04-20T14:00:00',
      location: '강남 스터디카페'
    }
  },
  {
    id: '3',
    name: '개발자 네트워킹',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['개발', 'IT', '네트워킹'],
    memberCount: 25,
    maxMembers: 30,
    type: 'meetup',
    isPublic: true,
    myRole: 'manager', // 운영진
    myRoles: ['manager', 'treasurer'], // 운영진 + 총무 권한 동시 보유
    account: {
      managementType: 'fair', // 공정정산형
      totalBalance: 750000,
      perPersonShare: 30000,  // 750,000 / 25명 = 30,000원
      totalDeposited: 900000,
      totalUsed: 150000,
      memberCount: 25,
      entryFee: 30000,
    },
    nextEvent: {
      title: '4월 정기 밋업',
      date: '2025-04-20T19:00:00',
      location: '강남역 스타트업 카페'
    }
  },
  {
    id: '4',
    name: '요가 & 명상 클럽',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['요가', '명상', '건강'],
    memberCount: 12,
    maxMembers: 20,
    type: 'club',
    isPublic: true,
    myRole: 'member', // 일반 회원
    account: {
      managementType: 'operating', // 운영비형
      totalBalance: 360000,
      totalDeposited: 480000,
      totalUsed: 120000,
      memberCount: 12,
    },
    nextEvent: {
      title: '일요일 모닝 요가',
      date: '2025-04-14T08:00:00',
      location: '한강공원 여의도지구'
    }
  },
  {
    id: '5',
    name: '영어 회화 스터디',
    image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['영어', '회화', '스터디'],
    memberCount: 6,
    maxMembers: 8,
    type: 'study',
    isPublic: false,
    myRole: 'member', // 일반 회원
    account: {
      managementType: 'fair', // 공정정산형
      totalBalance: 180000,
      perPersonShare: 30000,  // 180,000 / 6명 = 30,000원
      totalDeposited: 210000,
      totalUsed: 30000,
      memberCount: 6,
      entryFee: 30000,
    },
  },
  {
    id: '6',
    name: '주말 러닝 크루',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['러닝', '운동', '건강'],
    memberCount: 35,
    maxMembers: 50,
    type: 'club',
    isPublic: true,
    myRole: 'member', // 일반 회원
    account: {
      managementType: 'operating', // 운영비형
      totalBalance: 875000,
      totalDeposited: 1050000,
      totalUsed: 175000,
      memberCount: 35,
    },
    nextEvent: {
      title: '서울숲 10km 러닝',
      date: '2025-04-13T07:00:00',
      location: '서울숲 입구'
    }
  }
];

// 모임 정보 가져오기
export function getGroupById(groupId: string): Group | undefined {
  return MOCK_GROUPS.find(g => g.id === groupId);
}

// 공정정산형: 신규 가입비 계산
export function calculateEntryFee(group: Group): number {
  if (group.account.managementType !== 'fair') return 0;
  return group.account.perPersonShare || 0;
}

// 공정정산형: 탈퇴 시 환불금 계산
export function calculateRefundAmount(group: Group): number {
  if (group.account.managementType !== 'fair') return 0; // 운영비형은 환불 X
  return group.account.perPersonShare || 0;
}

// 통장 유형 설명
export const MANAGEMENT_TYPE_INFO = {
  fair: {
    name: '공정정산형',
    description: '모든 멤버가 동일한 지분을 가집니다',
    features: [
      '모든 멤버 동일 지분',
      '신규 가입 시: 기존 멤버 지분만큼 납부',
      '탈퇴 시: 지분만큼 환불',
      '정산 시: 균등 분배',
    ],
    color: 'green',
  },
  operating: {
    name: '운영비형',
    description: '회비가 축적되어 운영비로 사용됩니다',
    features: [
      '탈퇴 시 환불 없음',
      '남은 돈 계속 축적',
      '운영비로 자유롭게 사용',
      '정산 없이 모임 유지',
    ],
    color: 'blue',
  },
};
