import { useParams } from 'react-router-dom';
import { Wallet, ArrowDownLeft, ArrowUpRight, History, Receipt, PieChart, Info, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  getUserRoleForGroup, 
  canWithdraw, 
  canViewShares,
  ROLE_LABELS, 
  ROLE_COLORS 
} from '../../../data/userRoles';

export function DuesView() {
  const { groupId } = useParams();
  
  // 모임별 역할 가져오기
  const userRole = getUserRoleForGroup(groupId || '1');
  
  // 권한 체크
  const showWithdrawButton = canWithdraw(userRole);
  const showSharesLink = canViewShares(userRole);

  const transactions = [
    { id: 1, title: '4월 정기 산행 뒤풀이', amount: -150000, date: '2024.04.12', type: 'expense' },
    { id: 2, title: '홍길동 회비 입금', amount: 30000, date: '2024.04.10', type: 'income' },
    { id: 3, title: '김철수 회비 입금', amount: 30000, date: '2024.04.10', type: 'income' },
  ];

  // 통장 정보
  const accountInfo = {
    totalBalance: 1250000,
    managementType: 'fair' as 'operating' | 'fair',
    myShare: 85000,
    sharePercent: 6.8,
  };

  return (
    <div className="space-y-6 pb-20">
      {/* User Role Badge */}
      <div className="flex justify-end">
        <Badge className={`${ROLE_COLORS[userRole]} text-xs`}>
          {ROLE_LABELS[userRole]}
        </Badge>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-stone-900 to-stone-800 text-white border-none shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-stone-400 text-sm mb-1">총 모임 통장 잔액</p>
              <h2 className="text-3xl font-bold">{accountInfo.totalBalance.toLocaleString()}원</h2>
            </div>
            <div className="p-2 bg-white/10 rounded-full">
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
          </div>

          {/* Management Type Badge */}
          <div className="mb-4">
            <Badge className={
              accountInfo.managementType === 'fair' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            }>
              {accountInfo.managementType === 'fair' ? '공정정산형' : '운영비형'}
            </Badge>
          </div>

          {/* My Share (공정정산형일 때만) */}
          {accountInfo.managementType === 'fair' && (
            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-400 text-sm">내 지분</span>
                <span className="text-xl font-bold text-orange-400">
                  {accountInfo.myShare.toLocaleString()}원
                </span>
              </div>
              <Progress value={accountInfo.sharePercent * 10} className="h-2 bg-white/10" />
              <p className="text-xs text-stone-500 text-right mt-1">
                전체 대비 {accountInfo.sharePercent}%
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link to="deposit" className="flex-1">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none h-12 rounded-xl">
                <ArrowDownLeft className="w-4 h-4 mr-2" />
                채우기
              </Button>
            </Link>
            
            {showWithdrawButton ? (
              <Link to="withdraw" className="flex-1">
                <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-none h-12 rounded-xl">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  보내기
                </Button>
              </Link>
            ) : (
              <Button 
                variant="secondary" 
                disabled 
                className="flex-1 bg-white/5 text-white/50 border-none h-12 rounded-xl cursor-not-allowed"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                보내기
              </Button>
            )}
          </div>
          
          {!showWithdrawButton && (
            <p className="text-xs text-stone-500 text-center mt-2">
              보내기는 모임장/총무만 가능합니다
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="settlement-request">
          <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-stone-200 hover:bg-stone-50 hover:border-orange-200 rounded-xl group">
            <div className="p-2 bg-stone-100 rounded-full group-hover:bg-orange-100 transition-colors">
              <Receipt className="w-5 h-5 text-stone-600 group-hover:text-orange-600" />
            </div>
            <span className="text-sm font-medium text-stone-600">정산 요청</span>
          </Button>
        </Link>
        <Link to="rules">
          <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-stone-200 hover:bg-stone-50 hover:border-orange-200 rounded-xl group">
            <div className="p-2 bg-stone-100 rounded-full group-hover:bg-orange-100 transition-colors">
              <History className="w-5 h-5 text-stone-600 group-hover:text-orange-600" />
            </div>
            <span className="text-sm font-medium text-stone-600">회비 규칙</span>
          </Button>
        </Link>
      </div>

      {/* Share Management Link (총무/모임장만) */}
      {showSharesLink && (
        <Link to="../admin/shares">
          <Card className="border-green-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <PieChart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">지분 관리</p>
                    <p className="text-xs text-green-700">전체 멤버의 지분 현황 확인</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Info Box */}
      {accountInfo.managementType === 'fair' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">공정정산형 안내</p>
                <p className="text-amber-700 mt-1">
                  탈퇴 시 지분만큼 환불받을 수 있습니다.
                  정산 금액이 안 나누어 떨어지면 올림 처리됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-stone-800 px-1">최근 내역</h3>
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          {transactions.map((tx, i) => (
            <div key={tx.id} className={`p-4 flex justify-between items-center ${i !== transactions.length - 1 ? 'border-b border-stone-100' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                  {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{tx.title}</p>
                  <p className="text-xs text-stone-400">{tx.date}</p>
                </div>
              </div>
              <span className={`font-bold ${tx.type === 'income' ? 'text-blue-600' : 'text-stone-900'}`}>
                {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()}원
              </span>
            </div>
          ))}
          <Link to="history" className="block p-3 text-center border-t border-stone-50">
            <span className="text-sm text-stone-500 hover:text-stone-800 font-medium">전체 내역 보기</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
