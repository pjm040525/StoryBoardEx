import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, X, UserCheck, UserX, AlertTriangle, Calculator, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Checkbox } from '../../ui/checkbox';
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

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  voteStatus: 'yes' | 'no' | 'pending'; // 투표 상태
  actualStatus: 'attended' | 'absent' | 'pending'; // 실제 참석 상태
  amountPaid: number; // 납부 금액
  amountDue: number; // 정산 금액
}

export function ScheduleFinalizeView() {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock 일정 데이터
  const schedule = {
    id: scheduleId,
    title: '4월 정기 산행',
    date: '2024.04.12',
    location: '관악산',
    totalCost: 150000, // 총 비용
    perPersonCost: 15000, // 1인당 비용
  };

  // Mock 참가자 데이터
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: '홍길동', avatar: '', voteStatus: 'yes', actualStatus: 'attended', amountPaid: 15000, amountDue: 0 },
    { id: '2', name: '김철수', avatar: '', voteStatus: 'yes', actualStatus: 'attended', amountPaid: 15000, amountDue: 0 },
    { id: '3', name: '이영희', avatar: '', voteStatus: 'yes', actualStatus: 'absent', amountPaid: 15000, amountDue: -15000 }, // 환불 대상
    { id: '4', name: '박민수', avatar: '', voteStatus: 'no', actualStatus: 'pending', amountPaid: 0, amountDue: 0 },
    { id: '5', name: '정지훈', avatar: '', voteStatus: 'pending', actualStatus: 'attended', amountPaid: 0, amountDue: 15000 }, // 추가 납부 필요
    { id: '6', name: '최유진', avatar: '', voteStatus: 'no', actualStatus: 'attended', amountPaid: 0, amountDue: 15000 }, // 추가 납부 필요
  ]);

  const toggleActualStatus = (id: string, status: 'attended' | 'absent') => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const newActualStatus = p.actualStatus === status ? 'pending' : status;
        let newAmountDue = 0;
        
        // 정산 금액 계산
        if (newActualStatus === 'attended' && p.amountPaid < schedule.perPersonCost) {
          newAmountDue = schedule.perPersonCost - p.amountPaid;
        } else if (newActualStatus === 'absent' && p.amountPaid > 0) {
          newAmountDue = -p.amountPaid; // 환불
        }
        
        return { ...p, actualStatus: newActualStatus, amountDue: newAmountDue };
      }
      return p;
    }));
  };

  // 통계
  const stats = {
    totalAttended: participants.filter(p => p.actualStatus === 'attended').length,
    totalAbsent: participants.filter(p => p.actualStatus === 'absent').length,
    totalPending: participants.filter(p => p.actualStatus === 'pending').length,
    totalRefund: participants.filter(p => p.amountDue < 0).reduce((sum, p) => sum + Math.abs(p.amountDue), 0),
    totalCollect: participants.filter(p => p.amountDue > 0).reduce((sum, p) => sum + p.amountDue, 0),
  };

  // 이상 케이스 분류
  const voteYesActualNo = participants.filter(p => p.voteStatus === 'yes' && p.actualStatus === 'absent');
  const voteNoActualYes = participants.filter(p => (p.voteStatus === 'no' || p.voteStatus === 'pending') && p.actualStatus === 'attended');

  const handleFinalize = () => {
    if (stats.totalPending > 0) {
      toast.error('모든 참가자의 참석 여부를 확인해주세요');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
      toast.success('일정이 마무리되었습니다. 정산이 처리됩니다.');
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold text-stone-800">일정 마무리</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Schedule Info */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <h2 className="font-bold text-lg text-orange-900">{schedule.title}</h2>
            <p className="text-sm text-orange-700">{schedule.date} · {schedule.location}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <span className="text-orange-600">총 비용:</span>
                <span className="font-bold text-orange-900 ml-1">{schedule.totalCost.toLocaleString()}원</span>
              </div>
              <div>
                <span className="text-orange-600">1인당:</span>
                <span className="font-bold text-orange-900 ml-1">{schedule.perPersonCost.toLocaleString()}원</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3 text-center">
              <UserCheck className="w-6 h-6 text-green-600 mx-auto" />
              <p className="text-2xl font-bold text-green-700 mt-1">{stats.totalAttended}</p>
              <p className="text-xs text-green-600">참석</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 text-center">
              <UserX className="w-6 h-6 text-red-600 mx-auto" />
              <p className="text-2xl font-bold text-red-700 mt-1">{stats.totalAbsent}</p>
              <p className="text-xs text-red-600">불참</p>
            </CardContent>
          </Card>
          <Card className="border-stone-200 bg-stone-100">
            <CardContent className="p-3 text-center">
              <AlertTriangle className="w-6 h-6 text-stone-500 mx-auto" />
              <p className="text-2xl font-bold text-stone-700 mt-1">{stats.totalPending}</p>
              <p className="text-xs text-stone-500">미확인</p>
            </CardContent>
          </Card>
        </div>

        {/* Issue Cases */}
        {(voteYesActualNo.length > 0 || voteNoActualYes.length > 0) && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4" />
                확인 필요 ({voteYesActualNo.length + voteNoActualYes.length}명)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {voteYesActualNo.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-amber-700 font-medium">투표 참여 → 실제 불참 (환불 대상)</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {voteYesActualNo.map(p => (
                      <Badge key={p.id} variant="secondary" className="bg-red-100 text-red-700">
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {voteNoActualYes.length > 0 && (
                <div>
                  <p className="text-xs text-amber-700 font-medium">투표 미참여/불참 → 실제 참석 (추가 납부 대상)</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {voteNoActualYes.map(p => (
                      <Badge key={p.id} variant="secondary" className="bg-blue-100 text-blue-700">
                        {p.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Participant List */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
            <h3 className="font-bold text-stone-900">참가자 확인</h3>
            <p className="text-xs text-stone-500">실제 참석 여부를 확인하세요</p>
          </div>
          <div className="divide-y divide-stone-100">
            {participants.map(p => (
              <div key={p.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900">{p.name}</p>
                      <Badge variant="secondary" className={
                        p.voteStatus === 'yes' ? 'bg-green-100 text-green-700' :
                        p.voteStatus === 'no' ? 'bg-red-100 text-red-700' :
                        'bg-stone-100 text-stone-600'
                      }>
                        투표: {p.voteStatus === 'yes' ? '참여' : p.voteStatus === 'no' ? '불참' : '미응답'}
                      </Badge>
                    </div>
                    {p.amountDue !== 0 && (
                      <p className={`text-xs mt-1 ${p.amountDue > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {p.amountDue > 0 ? `추가 납부: +${p.amountDue.toLocaleString()}원` : `환불: ${p.amountDue.toLocaleString()}원`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActualStatus(p.id, 'attended')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        p.actualStatus === 'attended' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-stone-100 text-stone-400 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleActualStatus(p.id, 'absent')}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        p.actualStatus === 'absent' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-stone-100 text-stone-400 hover:bg-red-100 hover:text-red-600'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement Summary */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
              <Calculator className="w-4 h-4" />
              정산 요약
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">환불 예정</span>
              <span className="font-bold text-red-600">-{stats.totalRefund.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">추가 수금</span>
              <span className="font-bold text-blue-600">+{stats.totalCollect.toLocaleString()}원</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between">
              <span className="text-blue-800 font-medium">순 정산액</span>
              <span className={`font-bold ${stats.totalCollect - stats.totalRefund >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(stats.totalCollect - stats.totalRefund >= 0 ? '+' : '')}{(stats.totalCollect - stats.totalRefund).toLocaleString()}원
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 safe-area-pb">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleFinalize}
            disabled={stats.totalPending > 0}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            일정 마무리 및 정산
          </Button>
          {stats.totalPending > 0 && (
            <p className="text-xs text-center text-red-500 mt-2">
              {stats.totalPending}명의 참석 여부를 확인해주세요
            </p>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>일정 마무리</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>아래 내용으로 일정을 마무리하시겠습니까?</p>
                <div className="bg-stone-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">참석자</span>
                    <span className="font-bold">{stats.totalAttended}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">불참자</span>
                    <span className="font-bold">{stats.totalAbsent}명</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-stone-600">환불 예정</span>
                    <span className="font-bold text-red-600">-{stats.totalRefund.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">추가 수금</span>
                    <span className="font-bold text-blue-600">+{stats.totalCollect.toLocaleString()}원</span>
                  </div>
                </div>
                <p className="text-xs text-amber-600">
                  ⚠️ 마무리 후에는 수정할 수 없습니다.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFinalize}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? '처리 중...' : '마무리하기'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

