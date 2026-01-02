import { Plus, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Link } from 'react-router-dom';

export function ScheduleListView() {
  const schedules = [
    {
      id: 1,
      title: '4월 정기 관악산 산행',
      date: '4월 12일 (토) 10:00',
      location: '사당역 4번 출구',
      attendees: 8,
      status: 'confirmed',
      dDay: 12,
      type: 'schedule'
    },
    {
      id: 2,
      title: '5월 봄소풍 장소 투표',
      date: '투표 진행중 (~4/15)',
      location: '미정',
      attendees: 12, // voters
      status: 'voting',
      dDay: null,
      type: 'vote'
    },
    {
      id: 3,
      title: '5월 정기 모임',
      date: '5월 4일 (토) 18:00',
      location: '강남역 스타벅스',
      attendees: 5,
      status: 'confirmed',
      dDay: 24,
      type: 'schedule'
    }
  ];

  return (
    <div className="space-y-4 pb-20">
      {schedules.map((item) => {
        const linkTo = item.type === 'vote' ? `../vote/${item.id}` : `${item.id}`;
        
        return (
          <Link to={linkTo} key={item.id}>
            <Card className="border-stone-100 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center">
                    {item.status === 'voting' ? (
                      <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">투표중</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">확정</Badge>
                    )}
                    {item.dDay && (
                      <span className="text-xs font-bold text-orange-500">D-{item.dDay}</span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-stone-900 mb-3">{item.title}</h3>
                
                <div className="space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-stone-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-stone-400" />
                    <span>{item.attendees}명 {item.status === 'voting' ? '투표' : '참석'}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                  <Button 
                    size="sm" 
                    variant={item.status === 'voting' ? 'default' : 'outline'} 
                    className={item.status === 'voting' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    {item.status === 'voting' ? '투표하러 가기' : '상세보기'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
      
      {/* FAB */}
      <div className="fixed bottom-24 right-4 z-40">
        <Link to="create-vote">
          <Button className="rounded-full h-12 px-6 shadow-lg bg-stone-900 hover:bg-stone-800 text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>일정 만들기</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
