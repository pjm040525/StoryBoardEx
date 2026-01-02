import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MoreVertical, UserCheck, UserX, Crown, Shield } from 'lucide-react';
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

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'pending';
  joinedDate: string;
  duesStatus: 'paid' | 'unpaid' | 'overdue';
}

export function MemberManagementView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showKickDialog, setShowKickDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'member'>('member');

  // Mock data
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '홍길동', role: 'admin', joinedDate: '2024.01.15', duesStatus: 'paid' },
    { id: '2', name: '김철수', role: 'member', joinedDate: '2024.02.10', duesStatus: 'paid' },
    { id: '3', name: '이영희', role: 'member', joinedDate: '2024.03.05', duesStatus: 'unpaid' },
    { id: '4', name: '박민수', role: 'member', joinedDate: '2024.03.20', duesStatus: 'overdue' },
    { id: '5', name: '정수진', role: 'pending', joinedDate: '2024.04.01', duesStatus: 'unpaid' },
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
      toast.success(`${selectedMember.name}님의 권한이 ${newRole === 'admin' ? '관리자' : '일반 멤버'}로 변경되었습니다`);
      setShowRoleDialog(false);
      setSelectedMember(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-orange-100 text-orange-700"><Crown className="w-3 h-3 mr-1" />관리자</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">대기중</Badge>;
      default:
        return <Badge variant="secondary" className="bg-stone-100 text-stone-600">멤버</Badge>;
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
          <h2 className="font-bold text-lg text-stone-900">멤버 목록 ({activeMembers.length})</h2>
          <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {activeMembers.map((member) => (
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
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-5 h-5 text-stone-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {member.role !== 'admin' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMember(member);
                            setNewRole(member.role === 'admin' ? 'member' : 'admin');
                            setShowRoleDialog(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          권한 변경
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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
                      </>
                    )}
                    {member.role === 'admin' && (
                      <DropdownMenuItem disabled className="text-stone-400">
                        관리자는 변경할 수 없습니다
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
            <AlertDialogDescription>
              {selectedMember?.name}님의 권한을 {newRole === 'admin' ? '관리자' : '일반 멤버'}로 변경하시겠습니까?
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
    </div>
  );
}

