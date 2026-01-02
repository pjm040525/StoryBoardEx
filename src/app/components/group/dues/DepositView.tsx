import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard, Building2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent } from '../../ui/card';

export function DepositView() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'card' | 'cash'>('transfer');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // 모임 계좌 정보 (실제로는 API에서)
  const groupAccount = {
    bank: '카카오뱅크',
    accountNumber: '3333-01-1234567',
    accountHolder: '주말등산클럽',
  };

  // 회비 정책 (실제로는 API에서)
  const duesPolicy = {
    monthlyAmount: 10000,
    currentMonth: '2024년 4월',
  };

  // 퀵 금액 선택
  const quickAmounts = [
    { label: '1개월', amount: duesPolicy.monthlyAmount },
    { label: '3개월', amount: duesPolicy.monthlyAmount * 3 },
    { label: '6개월', amount: duesPolicy.monthlyAmount * 6 },
    { label: '1년', amount: duesPolicy.monthlyAmount * 12 },
  ];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(groupAccount.accountNumber.replace(/-/g, ''));
    setCopied(true);
    toast.success('계좌번호가 복사되었습니다');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    const amountNum = parseInt(amount.replace(/,/g, ''));
    if (!amountNum || amountNum <= 0) {
      toast.error('금액을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('입금 내역이 등록되었습니다');
      navigate(-1);
    }, 1000);
  };

  const formatAmount = (value: string) => {
    const num = value.replace(/[^0-9]/g, '');
    return num ? parseInt(num).toLocaleString() : '';
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
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
          <h1 className="ml-2 text-lg font-semibold text-stone-800">회비 입금하기</h1>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Current Status */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700">이번 달 회비</p>
                <p className="text-2xl font-bold text-orange-900">
                  {duesPolicy.monthlyAmount.toLocaleString()}원
                </p>
                <p className="text-xs text-orange-600">{duesPolicy.currentMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Input */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-4">
          <h3 className="font-bold text-stone-900">입금 금액</h3>
          
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="0"
              className="h-14 text-2xl font-bold text-right pr-12 bg-stone-50 border-stone-200 rounded-xl"
              value={amount}
              onChange={(e) => setAmount(formatAmount(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-stone-500">
              원
            </span>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((qa) => (
              <button
                key={qa.label}
                onClick={() => setAmount(qa.amount.toLocaleString())}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  amount === qa.amount.toLocaleString()
                    ? 'bg-orange-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {qa.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-4">
          <h3 className="font-bold text-stone-900">결제 방법</h3>
          
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'transfer' ? 'border-orange-500 bg-orange-50' : 'border-stone-100'
              }`}>
                <RadioGroupItem value="transfer" className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500" />
                <Building2 className="w-5 h-5 text-stone-600" />
                <div className="flex-1">
                  <p className="font-medium text-stone-900">계좌이체</p>
                  <p className="text-xs text-stone-500">모임 계좌로 직접 이체</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-stone-100'
              }`}>
                <RadioGroupItem value="card" className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500" />
                <CreditCard className="w-5 h-5 text-stone-600" />
                <div className="flex-1">
                  <p className="font-medium text-stone-900">카드 결제</p>
                  <p className="text-xs text-stone-500">신용/체크카드로 결제</p>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-stone-100'
              }`}>
                <RadioGroupItem value="cash" className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500" />
                <Wallet className="w-5 h-5 text-stone-600" />
                <div className="flex-1">
                  <p className="font-medium text-stone-900">현금</p>
                  <p className="text-xs text-stone-500">모임장/총무에게 직접 전달</p>
                </div>
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Account Info (for transfer) */}
        {paymentMethod === 'transfer' && (
          <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-3">
            <h3 className="font-bold text-stone-900">모임 계좌</h3>
            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">은행</span>
                <span className="font-medium text-stone-900">{groupAccount.bank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-stone-900 font-mono">{groupAccount.accountNumber}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyAccount}
                    className="h-8 px-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">예금주</span>
                <span className="font-medium text-stone-900">{groupAccount.accountHolder}</span>
              </div>
            </div>
            <p className="text-xs text-stone-500">
              💡 이체 후 아래 버튼을 눌러 입금 내역을 등록해주세요.
            </p>
          </div>
        )}

        {/* Note */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 space-y-3">
          <Label>메모 (선택)</Label>
          <Textarea
            placeholder="입금 관련 메모를 남겨주세요"
            className="min-h-20 resize-none bg-stone-50 border-stone-200 rounded-xl"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 safe-area-pb">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!amount || isSubmitting}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl disabled:opacity-50"
          >
            {isSubmitting ? '처리 중...' : `${amount || '0'}원 입금 완료`}
          </Button>
        </div>
      </div>
    </div>
  );
}

