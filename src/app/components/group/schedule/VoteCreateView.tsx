import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Calendar } from '../../ui/calendar'; // Assuming we have this or use simple input
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { format } from 'date-fns';

export function VoteCreateView() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [dates, setDates] = useState<string[]>(['']);
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());

  const addDate = () => setDates([...dates, '']);
  const removeDate = (index: number) => setDates(dates.filter((_, i) => i !== index));
  const updateDate = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleSubmit = () => {
    // Submit logic
    navigate('..'); // Go back to schedule list
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <header className="flex items-center p-4 border-b border-stone-100 sticky top-0 bg-white z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </Button>
        <h1 className="text-lg font-semibold ml-2 text-stone-800">투표 만들기</h1>
      </header>

      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">투표 제목</Label>
          <Input 
            id="title" 
            placeholder="어떤 일정인가요?" 
            className="h-12 bg-stone-50 border-stone-200 rounded-xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">후보 날짜/시간</Label>
          {dates.map((date, index) => (
            <div key={index} className="flex gap-2">
              <Input 
                type="datetime-local" 
                value={date} 
                onChange={(e) => updateDate(index, e.target.value)}
                className="h-12 bg-stone-50 border-stone-200 rounded-xl flex-1"
              />
              {dates.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeDate(index)} className="text-red-400 hover:text-red-500 hover:bg-red-50">
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addDate} className="w-full border-dashed border-stone-300 text-stone-500 hover:bg-stone-50 rounded-xl h-12">
            <Plus className="w-4 h-4 mr-2" />
            후보 추가하기
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">투표 마감일</Label>
          <Input 
            type="datetime-local" 
            className="h-12 bg-stone-50 border-stone-200 rounded-xl"
          />
        </div>

        <div className="pt-4">
          <Button onClick={handleSubmit} className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 rounded-xl text-white shadow-md">
            투표 올리기
          </Button>
        </div>
      </div>
    </div>
  );
}
