import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Crown, Wallet, Users, UserCircle, ChevronRight, Search, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
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
import { MemberRole, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS } from '../../../types';

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: MemberRole;
  joinedDate: string;
}

export function RoleManagementView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [newRole, setNewRole] = useState<MemberRole | null>(null);

  // Mock data
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '홍길동', avatar: '', role: 'owner', joinedDate: '2024.01.15' },
    { id: '2', name: '김철수', avatar: '', role: 'treasurer', joinedDate: '2024.01.20' },
    { id: '3', name: '이영희', avatar: '', role: 'manager', joinedDate: '2024.02.01' },
    { id: '4', name: '박민수', avatar: '', role: 'member', joinedDate: '2024.02.15' },
    { id: '5', name: '정지훈', avatar: '', role: 'member', joinedDate: '2024.03.01' },
    { id: '6', name: '최유진', avatar: '', role: 'member', joinedDate: '2024.03.10' },
  ]);

  const currentUser = members.find(m => m.role === 'owner');

  const roleIcons: Record<MemberRole, React.ReactNode> = {
    owner: <Crown className="w-4 h-4" />,
    treasurer: <Wallet className="w-4 h-4" />,
    manager: <Shield className="w-4 h-4" />,
    member: <UserCircle className="w-4 h-4" />,
    pending: <Users className="w-4 h-4" />,
  };

  const roleDescriptions: Record<MemberRole, string> = {
    owner: '모임의 모든 권한을 가집니다',
    treasurer: '회비 관리 및 정산 권한을 가집니다',
    manager: '멤버 관리 및 게시글 삭제 권한을 가집니다',
    member: '일반 회원 권한을 가집니다',
    pending: '가입 승인 대기 중입니다',
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberClick = (member: Member) => {
    if (member.role === 'owner') {
      toast.info('모임장 권한은 위임으로만 변경할 수 있습니다');
      return;
    }
    setSelectedMember(member);
    setNewRole(member.role);
    setShowRoleDialog(true);
  };

  const handleRoleChange = (role: MemberRole) => {
    if (role === 'owner') {
      setShowRoleDialog(false);
      setShowTransferDialog(true);
    } else {
      setNewRole(role);
    }
  };

  const handleSaveRole = () => {
    if (!selectedMember || !newRole) return;

    setMembers(members.map(m => 
      m.id === selectedMember.id ? { ...m, role: newRole } : m
    ));
    setShowRoleDialog(false);
    toast.success(`${selectedMember.name}님의 권한이 ${ROLE_LABELS[newRole]}(으)로 변경되었습니다`);
  };

  const handleTransferOwnership = () => {
    if (!selectedMember) return;

    setMembers(members.map(m => {
      if (m.id === selectedMember.id) return { ...m, role: 'owner' as MemberRole };
      if (m.role === 'owner') return { ...m, role: 'member' as MemberRole };
      return m;
    }));
    setShowTransferDialog(false);
    toast.success(`${selectedMember.name}님에게 모임장 권한이 위임되었습니다`);
  };

  const getRoleOrder = (role: MemberRole) => {
    const order: Record<MemberRole, number> = {
      owner: 0, treasurer: 1, manager: 2, member: 3, pending: 4
    };
    return order[role];
  };

  const sortedMembers = [...filteredMembers].sort((a, b) => 
    getRoleOrder(a.role) - getRoleOrder(b.role)
  );

  const availableRoles: MemberRole[] = ['treasurer', 'manager', 'member'];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="-ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold text-stone-800">권한 관리</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">권한 안내</p>
                <p className="text-xs text-blue-700 mt-1">
                  모임장은 모든 권한을 가지며, 각 역할에 따라 다른 권한이 부여됩니다.
                  권한 변경은 모임장만 할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Legend */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100 space-y-3">
          <h3 className="font-bold text-stone-900">역할별 권한</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['owner', 'treasurer', 'manager', 'member'] as MemberRole[]).map(role => (
              <div key={role} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50">
                <Badge className={ROLE_COLORS[role]}>
                  {roleIcons[role]}
                  <span className="ml-1">{ROLE_LABELS[role]}</span>
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <Input
            placeholder="멤버 검색"
            className="pl-10 h-11 bg-white border-stone-200 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Member List */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
            <span className="text-sm font-medium text-stone-500">
              멤버 {sortedMembers.length}명
            </span>
          </div>
          <div className="divide-y divide-stone-100">
            {sortedMembers.map(member => (
              <button
                key={member.id}
                onClick={() => handleMemberClick(member)}
                disabled={member.role === 'owner'}
                className={`w-full p-4 flex items-center gap-3 text-left transition-colors ${
                  member.role === 'owner' ? 'bg-orange-50' : 'hover:bg-stone-50'
                }`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900">{member.name}</p>
                    {member.role === 'owner' && (
                      <Crown className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <Badge className={`mt-1 ${ROLE_COLORS[member.role]}`}>
                    {roleIcons[member.role]}
                    <span className="ml-1">{ROLE_LABELS[member.role]}</span>
                  </Badge>
                </div>
                {member.role !== 'owner' && (
                  <ChevronRight className="w-5 h-5 text-stone-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer Ownership Button */}
        <Button
          variant="outline"
          onClick={() => {
            setSelectedMember(null);
            setShowRoleDialog(true);
          }}
          className="w-full h-12 border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <Crown className="w-5 h-5 mr-2" />
          모임장 위임하기
        </Button>
      </div>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>권한 변경</DialogTitle>
            <DialogDescription>
              {selectedMember?.name}님의 권한을 변경합니다
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2">
            {availableRoles.map(role => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                  newRole === role
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-stone-100 hover:border-stone-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ROLE_COLORS[role]}`}>
                  {roleIcons[role]}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-stone-900">{ROLE_LABELS[role]}</p>
                  <p className="text-xs text-stone-500">{roleDescriptions[role]}</p>
                </div>
                {newRole === role && (
                  <Check className="w-5 h-5 text-orange-500" />
                )}
              </button>
            ))}

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => handleRoleChange('owner')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
                  <Crown className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-orange-600">모임장 위임</p>
                  <p className="text-xs text-orange-500">이 멤버에게 모임장을 위임합니다</p>
                </div>
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              취소
            </Button>
            <Button
              onClick={handleSaveRole}
              className="bg-orange-500 hover:bg-orange-600"
            >
              변경하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Ownership Confirmation */}
      <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>모임장 위임</AlertDialogTitle>
            <AlertDialogDescription>
              정말 <span className="font-bold text-stone-900">{selectedMember?.name}</span>님에게 
              모임장을 위임하시겠습니까?
              <br /><br />
              위임 후에는 일반 회원이 되며, 모든 관리 권한을 잃게 됩니다.
              이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTransferOwnership}
              className="bg-orange-500 hover:bg-orange-600"
            >
              위임하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

