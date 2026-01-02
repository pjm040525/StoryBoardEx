import { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, CheckCircle2, ClipboardCheck, Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Link } from 'react-router-dom';

type UserRole = 'owner' | 'treasurer' | 'manager' | 'member';

interface Schedule {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
  status: 'voting' | 'confirmed' | 'ongoing' | 'completed';
  dDay: number | null;
  type: 'schedule' | 'vote';
  // 일정 진행 상태
  isToday: boolean;
  isPast: boolean;
}

export function ScheduleListView() {
  const [userRole, setUserRole] = useState<UserRole>('member');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const canFinalize = userRole === 'owner' || userRole === 'treasurer' || userRole === 'manager';

  const schedules: Schedule[] = [
    {
      id: 1,
      title: '4월 정기 관악산 산행',
      date: '오늘 10:00',
      location: '사당역 4번 출구',
      attendees: 8,
      status: 'ongoing',
      dDay: 0,
      type: 'schedule',
      isToday: true,
      isPast: false,
    },
    {
      id: 4,
      title: '3월 봄나들이',
      date: '3월 20일 (수) 종료됨',
      location: '여의도 한강공원',
      attendees: 12,
      status: 'completed',
      dDay: null,
      type: 'schedule',
      isToday: false,
      isPast: true,
    },
    {
      id: 2,
      title: '5월 봄소풍 장소 투표',
      date: '투표 진행중 (~4/15)',
      location: '미정',
      attendees: 12,
      status: 'voting',
      dDay: null,
      type: 'vote',
      isToday: false,
      isPast: false,
    },
    {
      id: 3,
      title: '5월 정기 모임',
      date: '5월 4일 (토) 18:00',
      location: '강남역 스타벅스',
      attendees: 5,
      status: 'confirmed',
      dDay: 24,
      type: 'schedule',
      isToday: false,
      isPast: false,
    },
  ];

  const getStatusBadge = (item: Schedule) => {
    switch (item.status) {
      case 'voting':
        return <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">투표중</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500 text-white animate-pulse">진행중</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-stone-100 text-stone-600">종료됨</Badge>;
      default:
        return <Badge variant="secondary" className="bg-green-100 text-green-700">확정</Badge>;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {schedules.map((item) => {
        const linkTo = item.type === 'vote' ? `../vote/${item.id}` : `${item.id}`;
        
        return (
          <Card 
            key={item.id}
            className={`border-stone-100 shadow-sm bg-white ${
              item.status === 'ongoing' ? 'border-blue-300 border-2' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center">
                  {getStatusBadge(item)}
                  {item.dDay !== null && item.dDay > 0 && (
                    <span className="text-xs font-bold text-orange-500">D-{item.dDay}</span>
                  )}
                  {item.isToday && (
                    <Badge className="bg-red-500 text-white text-xs">오늘</Badge>
                  )}
                </div>
              </div>
              
              <Link to={linkTo}>
                <h3 className="text-lg font-bold text-stone-900 mb-3 hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
              </Link>
              
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
              
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center">
                <div className="flex gap-2">
                  {/* 일정 마무리 버튼 - 운영진/총무/모임장만 보임 */}
                  {canFinalize && (item.isToday || item.isPast) && item.status !== 'voting' && (
                    <Link to={`${item.id}/finalize`} onClick={(e) => e.stopPropagation()}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-1" />
                        {item.isPast && item.status === 'completed' ? '정산 확인' : '일정 마무리'}
                      </Button>
                    </Link>
                  )}
                </div>
                
                <Link to={linkTo}>
                  <Button 
                    size="sm" 
                    variant={item.status === 'voting' ? 'default' : 'outline'} 
                    className={item.status === 'voting' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    {item.status === 'voting' ? '투표하러 가기' : '상세보기'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
