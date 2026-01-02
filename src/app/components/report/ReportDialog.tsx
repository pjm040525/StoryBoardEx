import { useState } from 'react';
import { AlertTriangle, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: 'user' | 'group' | 'post';
  targetId: string;
  targetName: string;
}

export function ReportDialog({ open, onOpenChange, targetType, targetId, targetName }: ReportDialogProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetLabels = {
    user: '사용자',
    group: '모임',
    post: '게시글',
  };

  const reasons = [
    { value: 'spam', label: '스팸/광고' },
    { value: 'abuse', label: '욕설/비방' },
    { value: 'illegal', label: '불법 콘텐츠' },
    { value: 'fraud', label: '사기/허위 정보' },
    { value: 'harassment', label: '괴롭힘/위협' },
    { value: 'inappropriate', label: '부적절한 콘텐츠' },
    { value: 'other', label: '기타' },
  ];

  const handleSubmit = () => {
    if (!reason) {
      toast.error('신고 사유를 선택해주세요');
      return;
    }

    setIsSubmitting(true);
    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
      onOpenChange(false);
      setReason('');
      setDetails('');
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Flag className="w-5 h-5" />
            <DialogTitle>{targetLabels[targetType]} 신고</DialogTitle>
          </div>
          <DialogDescription>
            <span className="font-medium text-stone-900">"{targetName}"</span>을(를) 신고합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">신고 사유 <span className="text-red-500">*</span></Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
              {reasons.map(r => (
                <div 
                  key={r.value} 
                  className={`flex items-center space-x-3 border p-3 rounded-lg transition-all cursor-pointer ${
                    reason === r.value ? 'border-red-300 bg-red-50' : 'border-stone-200 hover:border-stone-300'
                  }`}
                  onClick={() => setReason(r.value)}
                >
                  <RadioGroupItem value={r.value} id={r.value} className="text-red-500" />
                  <Label htmlFor={r.value} className="cursor-pointer text-sm">{r.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">상세 내용 (선택)</Label>
            <Textarea
              id="details"
              placeholder="추가로 알려주실 내용이 있다면 작성해주세요"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                허위 신고 시 서비스 이용에 제한이 있을 수 있습니다.
                신고 내용은 관리자에게만 공개됩니다.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isSubmitting ? '제출 중...' : '신고하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

