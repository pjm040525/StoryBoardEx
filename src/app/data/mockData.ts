import { UserRole } from './userRoles';

export interface Group {
  id: string;
  name: string;
  image: string;
  tags: string[];
  memberCount: number;
  maxMembers: number;
  type: 'club' | 'meetup' | 'study';
  isPublic: boolean;
  myRole: UserRole; // 현재 사용자의 역할
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
    nextEvent: {
      title: '서울숲 10km 러닝',
      date: '2025-04-13T07:00:00',
      location: '서울숲 입구'
    }
  }
];
