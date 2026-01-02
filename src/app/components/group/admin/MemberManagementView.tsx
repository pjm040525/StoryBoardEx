import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, UserCheck, UserX, Crown, Shield, Flag, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { ReportDialog } from '../../report/ReportDialog';
import { useUserPermissions, getRoleLabel, getRoleColor } from '../../../data/userRoles';

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'treasurer' | 'manager' | 'member' | 'pending';
  joinedDate: string;
  duesStatus: 'paid' | 'unpaid' | 'overdue';
  contribution?: number;  // 공정정산형: 입금액
  share?: number;         // 공정정산형: 현재 지분
}

export function MemberManagementView() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const permissions = useUserPermissions(groupId || '1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showKickDialog, setShowKickDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [newRole, setNewRole] = useState<'treasurer' | 'manager' | 'member'>('member');

  // Mock data
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '홍길동', role: 'owner', joinedDate: '2024.01.15', duesStatus: 'paid', contribution: 150000, share: 83333 },
    { id: '2', name: '김철수', role: 'treasurer', joinedDate: '2024.02.10', duesStatus: 'paid', contribution: 100000, share: 83333 },
    { id: '3', name: '이영희', role: 'manager', joinedDate: '2024.03.05', duesStatus: 'unpaid', contribution: 80000, share: 83333 },
    { id: '4', name: '박민수', role: 'member', joinedDate: '2024.03.20', duesStatus: 'overdue', contribution: 50000, share: 83333 },
    { id: '5', name: '정수진', role: 'pending', joinedDate: '2024.04.01', duesStatus: 'unpaid' },
    { id: '6', name: '최영진', role: 'member', joinedDate: '2024.04.05', duesStatus: 'paid', contribution: 100000, share: 83333 },
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: 'member' as const } : m
    ));
    toast.success(`${member?.name}님의 가입을 승인했습니다`);
  };

  const handleReject = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    setMembers(members.filter(m => m.id !== memberId));
    toast.info(`${member?.name}님의 가입을 거절했습니다`);
  };

  const handleKickMember = () => {
    if (selectedMember) {
      setMembers(members.filter(m => m.id !== selectedMember.id));
      toast.success(`${selectedMember.name}님을 추방했습니다`);
      setShowKickDialog(false);
      setSelectedMember(null);
    }
  };

  const handleChangeRole = () => {
    if (selectedMember) {
      setMembers(members.map(m => 
        m.id === selectedMember.id ? { ...m, role: newRole } : m
      ));
      const roleLabels = { treasurer: '총무', manager: '운영진', member: '일반 회원' };
      toast.success(`${selectedMember.name}님의 권한이 ${roleLabels[newRole]}로 변경되었습니다`);
      setShowRoleDialog(false);
      setSelectedMember(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-orange-100 text-orange-700"><Crown className="w-3 h-3 mr-1" />모임장</Badge>;
      case 'treasurer':
        return <Badge className="bg-green-100 text-green-700"><Wallet className="w-3 h-3 mr-1" />총무</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-700"><Shield className="w-3 h-3 mr-1" />운영진</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">대기중</Badge>;
      default:
        return <Badge variant="secondary" className="bg-stone-100 text-stone-600">회원</Badge>;
    }
  };

  const getDuesBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700">납부완료</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700">연체</Badge>;
      default:
        return <Badge variant="secondary" className="bg-stone-100 text-stone-600">미납</Badge>;
    }
  };

  const pendingMembers = filteredMembers.filter(m => m.role === 'pending');
  const activeMembers = filteredMembers.filter(m => m.role !== 'pending');

  // 정렬: owner > treasurer > manager > member
  const sortedActiveMembers = [...activeMembers].sort((a, b) => {
    const order = { owner: 0, treasurer: 1, manager: 2, member: 3 };
    return (order[a.role] || 4) - (order[b.role] || 4);
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="font-bold text-lg text-stone-800">멤버 관리</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <Input
            placeholder="멤버 이름 검색"
            className="pl-10 h-12 bg-white border-stone-200 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
            <p className="text-lg font-bold text-orange-600">{members.filter(m => m.role === 'owner').length}</p>
            <p className="text-xs text-stone-500">모임장</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
            <p className="text-lg font-bold text-green-600">{members.filter(m => m.role === 'treasurer').length}</p>
            <p className="text-xs text-stone-500">총무</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
            <p className="text-lg font-bold text-blue-600">{members.filter(m => m.role === 'manager').length}</p>
            <p className="text-xs text-stone-500">운영진</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-stone-100">
            <p className="text-lg font-bold text-stone-600">{members.filter(m => m.role === 'member').length}</p>
            <p className="text-xs text-stone-500">회원</p>
          </div>
        </div>

        {/* Pending Members */}
        {pendingMembers.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-stone-900">가입 대기 ({pendingMembers.length})</h2>
            <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
              {pendingMembers.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-stone-900">{member.name}</p>
                        {getRoleBadge(member.role)}
                      </div>
                      <p className="text-xs text-stone-500">가입 신청일: {member.joinedDate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(member.id)}
                      className="bg-green-500 hover:bg-green-600 text-white h-8"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      승인
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(member.id)}
                      className="h-8 border-stone-300"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      거절
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Members */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-stone-900">멤버 목록 ({sortedActiveMembers.length})</h2>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {sortedActiveMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900">{member.name}</p>
                      {getRoleBadge(member.role)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-stone-500">가입일: {member.joinedDate}</p>
                      {getDuesBadge(member.duesStatus)}
                    </div>
                    {/* 지분 정보 (총무/모임장에게만 표시) */}
                    {permissions.canManageShares && member.share !== undefined && (
                      <p className="text-xs text-green-600 mt-1">
                        지분: {member.share.toLocaleString()}원
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-5 h-5 text-stone-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {/* 권한 변경 - 모임장만 & owner는 변경 불가 */}
                    {permissions.canAssignRoles && member.role !== 'owner' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member);
                            setNewRole(member.role === 'member' ? 'manager' : 'member');
                            setShowRoleDialog(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          권한 변경
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {/* 추방 - 운영진/모임장만 & owner는 추방 불가 */}
                    {permissions.canManageMembers && member.role !== 'owner' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member);
                            setShowKickDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          추방하기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {/* 신고 - 모두 가능 & 본인/owner는 신고 불가 */}
                    {member.role !== 'owner' && (
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMember(member);
                          setShowReportDialog(true);
                        }}
                        className="text-orange-600"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        신고하기
                      </DropdownMenuItem>
                    )}
                    {member.role === 'owner' && (
                      <DropdownMenuItem disabled className="text-stone-400">
                        모임장은 변경할 수 없습니다
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kick Member Dialog */}
      <AlertDialog open={showKickDialog} onOpenChange={setShowKickDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>멤버 추방</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedMember?.name}님을 정말 추방하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleKickMember}
              className="bg-red-500 hover:bg-red-600"
            >
              추방하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Role Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>권한 변경</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>{selectedMember?.name}님의 권한을 변경합니다.</p>
              <div className="flex flex-wrap gap-2">
                {(['treasurer', 'manager', 'member'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setNewRole(role)}
                    className={`px-3 py-2 rounded-lg border transition-colors ${
                      newRole === role 
                        ? 'border-orange-500 bg-orange-50 text-orange-700' 
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {role === 'treasurer' && '총무'}
                    {role === 'manager' && '운영진'}
                    {role === 'member' && '일반 회원'}
                  </button>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleChangeRole}
              className="bg-orange-500 hover:bg-orange-600"
            >
              변경하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report User Dialog */}
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        type="user"
        targetName={selectedMember?.name}
      />
    </div>
  );
}
