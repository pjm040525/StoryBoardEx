// 모임별 사용자 권한 (Mock Data)
// 실제로는 API에서 가져옴

export type UserRole = 'owner' | 'treasurer' | 'manager' | 'member';

// 각 모임에서의 사용자 역할 (홍길동 기준)
// 모임 ID별로 다른 역할을 가짐
export const USER_ROLES_BY_GROUP: Record<string, UserRole> = {
  '1': 'owner',      // 주말 등산 클럽 - 모임장
  '2': 'treasurer',  // 강남 독서 모임 - 총무
  '3': 'manager',    // 개발자 네트워킹 - 운영진
  '4': 'member',     // 요가 & 명상 클럽 - 일반 회원
  '5': 'member',     // 영어 회화 스터디 - 일반 회원
  '6': 'member',     // 주말 러닝 크루 - 일반 회원
};

// 모임별 사용자 역할 가져오기
export function getUserRoleForGroup(groupId: string): UserRole {
  return USER_ROLES_BY_GROUP[groupId] || 'member';
}

// 역할 라벨
export const ROLE_LABELS: Record<UserRole, string> = {
  owner: '모임장',
  treasurer: '총무',
  manager: '운영진',
  member: '회원',
};

// 역할 색상
export const ROLE_COLORS: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-700',
  treasurer: 'bg-green-100 text-green-700',
  manager: 'bg-blue-100 text-blue-700',
  member: 'bg-stone-100 text-stone-600',
};

// 역할 아이콘 색상 (배경 없는 버전)
export const ROLE_ICON_COLORS: Record<UserRole, string> = {
  owner: 'text-purple-600',
  treasurer: 'text-green-600',
  manager: 'text-blue-600',
  member: 'text-stone-500',
};

// 권한 체크 함수들
export function canWithdraw(role: UserRole): boolean {
  // 보내기 권한: 모임장, 총무 (모임장은 총무 권한 포함)
  return role === 'owner' || role === 'treasurer';
}

export function canViewShares(role: UserRole): boolean {
  // 지분 관리 조회: 모임장, 총무 (모임장은 총무 권한 포함)
  return role === 'owner' || role === 'treasurer';
}

export function canFinalizeSchedule(role: UserRole): boolean {
  // 일정 마무리: 모임장, 총무, 운영진
  return role === 'owner' || role === 'treasurer' || role === 'manager';
}

export function canChangeManagementType(role: UserRole): boolean {
  // 통장 유형 변경: 모임장, 총무만 (모임장은 총무 권한 포함)
  return role === 'owner' || role === 'treasurer';
}

export function canManageMembers(role: UserRole): boolean {
  // 멤버 관리: 모임장, 운영진
  return role === 'owner' || role === 'manager';
}

export function canManageRoles(role: UserRole): boolean {
  // 권한 관리: 모임장만
  return role === 'owner';
}

export function canEditGroup(role: UserRole): boolean {
  // 모임 정보 수정: 모임장, 운영진
  return role === 'owner' || role === 'manager';
}

export function canDeleteGroup(role: UserRole): boolean {
  // 모임 삭제: 모임장만
  return role === 'owner';
}

// 역할 설명
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: '모든 권한 (총무+운영진 권한 포함)',
  treasurer: '회비 보내기, 지분 관리, 정산',
  manager: '멤버 관리, 일정 마무리, 게시글 관리',
  member: '기본 권한 (조회, 참여, 채우기)',
};
