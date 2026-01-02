import { Plus, Wallet, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Link } from 'react-router-dom';

export function DuesView() {
  const transactions = [
    { id: 1, title: '4월 정기 산행 뒤풀이', amount: -150000, date: '2024.04.12', type: 'expense' },
    { id: 2, title: '홍길동 회비 입금', amount: 30000, date: '2024.04.10', type: 'income' },
    { id: 3, title: '김철수 회비 입금', amount: 30000, date: '2024.04.10', type: 'income' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Balance Card */}
      <Card className="bg-stone-900 text-white border-none shadow-lg rounded-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-stone-400 text-sm mb-1">총 모임 통장 잔액</p>
              <h2 className="text-3xl font-bold">1,250,000원</h2>
            </div>
            <div className="p-2 bg-white/10 rounded-full">
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-none h-12 rounded-xl">
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              채우기
            </Button>
            <Button variant="secondary" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none h-12 rounded-xl">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              보내기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="settlement-request">
          <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2 border-stone-200 hover:bg-stone-50 hover:border-orange-200 rounded-xl group">
            <div className="p-2 bg-stone-100 rounded-full group-hover:bg-orange-100 transition-colors">
              <Plus className="w-5 h-5 text-stone-600 group-hover:text-orange-600" />
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
