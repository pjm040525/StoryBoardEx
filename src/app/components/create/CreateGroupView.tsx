import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export function CreateGroupView() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Form State
  const [type, setType] = useState('club');
  const [isPublic, setIsPublic] = useState(true);
  const [allowSearch, setAllowSearch] = useState(true);
  
  const [name, setName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [maxMembers, setMaxMembers] = useState(20);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleNext = () => setStep(2);
  
  const handleSubmit = () => {
    // Logic to create group would go here
    console.log({ type, isPublic, allowSearch, name, tags, maxMembers });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-stone-100 sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="-ml-2">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </Button>
        <h1 className="text-lg font-semibold ml-2 text-stone-800">모임 만들기 ({step}/2)</h1>
      </header>

      <div className="p-6 space-y-8">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-stone-900">어떤 모임인가요?</Label>
              <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-1 gap-3">
                <div className={`flex items-center space-x-3 border p-4 rounded-xl transition-all ${type === 'club' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}>
                  <RadioGroupItem value="club" id="club" className="text-orange-500" />
                  <Label htmlFor="club" className="flex-1 cursor-pointer">
                    <div className="font-medium text-stone-900">동아리</div>
                    <div className="text-sm text-stone-500">취미, 운동 등 지속적인 활동</div>
                  </Label>
                </div>
                <div className={`flex items-center space-x-3 border p-4 rounded-xl transition-all ${type === 'meetup' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}>
                  <RadioGroupItem value="meetup" id="meetup" className="text-orange-500" />
                  <Label htmlFor="meetup" className="flex-1 cursor-pointer">
                    <div className="font-medium text-stone-900">정모 / 번개</div>
                    <div className="text-sm text-stone-500">일회성 만남, 친목 도모</div>
                  </Label>
                </div>
                <div className={`flex items-center space-x-3 border p-4 rounded-xl transition-all ${type === 'study' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}>
                  <RadioGroupItem value="study" id="study" className="text-orange-500" />
                  <Label htmlFor="study" className="flex-1 cursor-pointer">
                    <div className="font-medium text-stone-900">스터디</div>
                    <div className="text-sm text-stone-500">자기계발, 학습 목표 달성</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Public/Private & Search */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-stone-900">공개 모임</Label>
                  <div className="text-sm text-stone-500">누구나 모임을 검색하고 참여할 수 있습니다</div>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} className="data-[state=checked]:bg-orange-500" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base text-stone-900">검색 허용</Label>
                  <div className="text-sm text-stone-500">모임 리스트에 노출됩니다</div>
                </div>
                <Switch checked={allowSearch} onCheckedChange={setAllowSearch} className="data-[state=checked]:bg-orange-500" />
              </div>
            </div>

            <Button onClick={handleNext} className="w-full h-12 text-lg bg-stone-900 hover:bg-stone-800 mt-8 rounded-xl">
              다음
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Image Upload */}
            <div className="flex justify-center py-4">
              <div className="w-28 h-28 bg-stone-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-stone-300 text-stone-400 cursor-pointer hover:bg-stone-50 hover:border-orange-300 transition-colors">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs">대표 이미지</span>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-medium">모임 이름</Label>
              <Input 
                id="name" 
                placeholder="멋진 모임 이름을 입력하세요" 
                className="h-12 text-lg bg-stone-50 border-stone-200 focus-visible:ring-orange-500 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-base font-medium">관심사 태그</Label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm rounded-full flex items-center gap-1 bg-orange-100 text-orange-700 hover:bg-orange-200">
                    #{tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 hover:text-orange-900">×</button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="태그 입력 (예: 맛집)" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="rounded-xl"
                />
                <Button variant="outline" onClick={handleAddTag} className="rounded-xl border-stone-300">추가</Button>
              </div>
            </div>

            {/* Max Members */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">최대 인원</Label>
                <span className="text-lg font-bold text-orange-600">{maxMembers}명</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="100" 
                value={maxMembers} 
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full accent-orange-500 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-stone-500">
                * 인원이 가득 차면 더 이상 참여할 수 없습니다.
              </p>
            </div>

            <Button onClick={handleSubmit} className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 mt-8 rounded-xl shadow-lg shadow-orange-200 text-white">
              <Check className="w-5 h-5 mr-2" />
              모임 만들기 완료
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
