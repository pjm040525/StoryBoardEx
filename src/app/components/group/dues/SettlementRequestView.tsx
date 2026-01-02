import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, CreditCard, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface SettlementItem {
  id: string;
  title: string;
  amount: number;
  date: string;
  receipt?: string;
}

export function SettlementRequestView() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);
  const [items, setItems] = useState<SettlementItem[]>([]);
  const [itemTitle, setItemTitle] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemDate, setItemDate] = useState('');

  const handleAddItem = () => {
    if (itemTitle && itemAmount && itemDate) {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          title: itemTitle,
          amount: parseInt(itemAmount),
          date: itemDate,
        },
      ]);
      setItemTitle('');
      setItemAmount('');
      setItemDate('');
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('정산 제목을 입력해주세요');
      return;
    }
    if (items.length === 0) {
      toast.error('최소 1개 이상의 지출 내역을 추가해주세요');
      return;
    }
    // 실제로는 API 호출
    console.log({
      title,
      date,
      description,
      receipt,
      items,
      totalAmount,
    });
    toast.success('정산 요청이 등록되었습니다');
    setTimeout(() => navigate(-1), 500);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="font-bold text-lg text-stone-800">정산 요청</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Basic Info */}
        <Card className="border-stone-200">
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">정산 제목</Label>
              <Input
                id="title"
                placeholder="예: 4월 정기 산행 뒤풀이"
                className="h-12 bg-white border-stone-200 focus-visible:ring-orange-500 rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-medium">지출 일자</Label>
              <Input
                id="date"
                type="date"
                className="h-12 bg-white border-stone-200 focus-visible:ring-orange-500 rounded-xl"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">상세 설명</Label>
              <Textarea
                id="description"
                placeholder="정산 내용에 대한 상세 설명을 입력하세요"
                className="min-h-24 bg-white border-stone-200 focus-visible:ring-orange-500 rounded-xl resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items List */}
        <Card className="border-stone-200">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">지출 내역</Label>
              <Badge variant="secondary" className="bg-stone-100 text-stone-600">
                총 {items.length}건
              </Badge>
            </div>

            {items.length > 0 && (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-stone-900">{item.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="font-semibold text-stone-900">
                          {item.amount.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 text-stone-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Item Form */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">항목명</Label>
                  <Input
                    placeholder="항목명"
                    className="h-10 bg-white border-stone-200 rounded-lg"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">금액</Label>
                  <Input
                    type="number"
                    placeholder="금액"
                    className="h-10 bg-white border-stone-200 rounded-lg"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">일자</Label>
                <Input
                  type="date"
                  className="h-10 bg-white border-stone-200 rounded-lg"
                  value={itemDate}
                  onChange={(e) => setItemDate(e.target.value)}
                />
              </div>
              <Button
                onClick={handleAddItem}
                variant="outline"
                className="w-full h-10 border-stone-300 hover:bg-stone-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                내역 추가
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-900">총 정산 금액</span>
              <span className="text-2xl font-bold text-orange-600">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Upload */}
        <Card className="border-stone-200">
          <CardContent className="p-5 space-y-4">
            <Label className="text-base font-medium">영수증 첨부 (선택)</Label>
            {receipt ? (
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-stone-600" />
                  <span className="text-sm text-stone-700">영수증이 첨부되었습니다</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReceipt(null)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 hover:border-orange-300 transition-colors">
                <CreditCard className="w-8 h-8 text-stone-400 mb-2" />
                <span className="text-sm text-stone-500">영수증 이미지를 업로드하세요</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setReceipt(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!title || items.length === 0 || totalAmount === 0}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            정산 요청하기
          </Button>
        </div>
      </div>
    </div>
  );
}

