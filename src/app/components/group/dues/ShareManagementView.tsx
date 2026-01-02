import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Users, Search, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';

interface MemberShare {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'treasurer' | 'manager' | 'member';
  totalDeposited: number;  // 총 입금액
  totalUsed: number;       // 총 사용액
  currentShare: number;    // 현재 지분
  sharePercent: number;    // 지분 비율
  joinedDate: string;
}

export function ShareManagementView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // 통장 정보
  const accountInfo = {
    totalBalance: 1250000,
    managementType: 'fair' as 'operating' | 'fair', // 운영비형 or 공정정산형
    totalMembers: 15,
  };

  // Mock 멤버 지분 데이터
  const memberShares: MemberShare[] = [
    { id: '1', name: '홍길동', avatar: '', role: 'owner', totalDeposited: 150000, totalUsed: 30000, currentShare: 120000, sharePercent: 9.6, joinedDate: '2024.01.15' },
    { id: '2', name: '김철수', avatar: '', role: 'treasurer', totalDeposited: 120000, totalUsed: 25000, currentShare: 95000, sharePercent: 7.6, joinedDate: '2024.01.20' },
    { id: '3', name: '이영희', avatar: '', role: 'manager', totalDeposited: 100000, totalUsed: 20000, currentShare: 80000, sharePercent: 6.4, joinedDate: '2024.02.01' },
    { id: '4', name: '박민수', avatar: '', role: 'member', totalDeposited: 90000, totalUsed: 18000, currentShare: 72000, sharePercent: 5.8, joinedDate: '2024.02.15' },
    { id: '5', name: '정지훈', avatar: '', role: 'member', totalDeposited: 80000, totalUsed: 16000, currentShare: 64000, sharePercent: 5.1, joinedDate: '2024.03.01' },
    { id: '6', name: '최유진', avatar: '', role: 'member', totalDeposited: 70000, totalUsed: 14000, currentShare: 56000, sharePercent: 4.5, joinedDate: '2024.03.10' },
  ];

  const roleLabels: Record<string, string> = {
    owner: '모임장',
    treasurer: '총무',
    manager: '운영진',
    member: '회원',
  };

  const roleColors: Record<string, string> = {
    owner: 'bg-purple-100 text-purple-700',
    treasurer: 'bg-green-100 text-green-700',
    manager: 'bg-blue-100 text-blue-700',
    member: 'bg-stone-100 text-stone-600',
  };

  const filteredMembers = memberShares.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSharesTracked = memberShares.reduce((sum, m) => sum + m.currentShare, 0);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold text-stone-800">지분 관리</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Account Summary */}
        <Card className="border-stone-200 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-stone-400 text-sm">총 모임 통장 잔액</p>
                <p className="text-3xl font-bold">{accountInfo.totalBalance.toLocaleString()}원</p>
              </div>
              <Badge className={
                accountInfo.managementType === 'fair' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
              }>
                {accountInfo.managementType === 'fair' ? '공정정산형' : '운영비형'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-400">
              <Users className="w-4 h-4" />
              <span>{accountInfo.totalMembers}명의 멤버</span>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        {accountInfo.managementType === 'fair' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">공정정산형 안내</p>
                  <p className="text-xs text-green-700 mt-1">
                    각 멤버의 입금액에서 사용액을 뺀 금액이 개인 지분입니다.<br/>
                    탈퇴 시 지분만큼 환불받을 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-stone-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">추적된 총 지분</p>
                  <p className="text-lg font-bold text-stone-900">{totalSharesTracked.toLocaleString()}원</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-stone-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">운영비 (공동)</p>
                  <p className="text-lg font-bold text-stone-900">
                    {(accountInfo.totalBalance - totalSharesTracked).toLocaleString()}원
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Member Shares List */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
            <h3 className="font-bold text-stone-900">멤버별 지분</h3>
            <span className="text-xs text-stone-500">{filteredMembers.length}명</span>
          </div>
          <div className="divide-y divide-stone-100">
            {filteredMembers.map((member, index) => (
              <div key={member.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-stone-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900">{member.name}</p>
                      <Badge className={roleColors[member.role]}>
                        {roleLabels[member.role]}
                      </Badge>
                    </div>
                    <p className="text-xs text-stone-500">가입일: {member.joinedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{member.currentShare.toLocaleString()}원</p>
                    <p className="text-xs text-stone-500">{member.sharePercent}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <Progress value={member.sharePercent * 10} className="h-2" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-xs text-blue-600">입금</p>
                    <p className="text-sm font-medium text-blue-700">+{member.totalDeposited.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2">
                    <p className="text-xs text-red-600">사용</p>
                    <p className="text-sm font-medium text-red-700">-{member.totalUsed.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <p className="text-xs text-green-600">지분</p>
                    <p className="text-sm font-medium text-green-700">{member.currentShare.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

