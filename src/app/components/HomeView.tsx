import { useState } from 'react';
import { Plus, Bell, Search, X, Users, Compass, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_GROUPS } from '../data/mockData';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

// 전체 공개 모임 (탐색용 mock)
const PUBLIC_GROUPS = [
  {
    id: 'public1',
    name: '서울 러닝 크루',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=200&fit=crop',
    tags: ['러닝', '운동'],
    memberCount: 42,
    maxMembers: 100,
    type: 'club' as const,
    isPublic: true,
    nextEvent: { title: '한강 러닝', date: '4/14', location: '여의도' },
  },
  {
    id: 'public2',
    name: '독서 모임',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    tags: ['독서', '토론'],
    memberCount: 18,
    maxMembers: 30,
    type: 'study' as const,
    isPublic: true,
    nextEvent: { title: '4월 독서 토론', date: '4/20', location: '강남' },
  },
];

export function HomeView() {
  const unreadNotifications = 2;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'club' | 'meetup' | 'study'>('all');
  const [searchScope, setSearchScope] = useState<'my' | 'all'>('my');

  // 내 모임 필터링
  const filteredMyGroups = MOCK_GROUPS.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || group.type === filterType;
    return matchesSearch && matchesType;
  });

  // 전체 모임 필터링 (검색어가 있을 때만)
  const filteredAllGroups = searchQuery 
    ? [...MOCK_GROUPS, ...PUBLIC_GROUPS].filter(group => {
        const matchesSearch = 
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'all' || group.type === filterType;
        return matchesSearch && matchesType;
      })
    : [];

  const displayGroups = searchScope === 'my' ? filteredMyGroups : filteredAllGroups;

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="모임" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-stone-800">나의 모임</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="text-stone-500 relative">
              <span className="sr-only">알림</span>
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/profile">
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback>홍</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Link to="/explore" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-orange-200 hover:bg-orange-50 hover:border-orange-300">
            <Compass className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-stone-700">모임 둘러보기</span>
          </Button>
        </Link>
        <Link to="/invite-code" className="flex-1">
          <Button variant="outline" className="w-full h-12 rounded-xl border-stone-200 hover:bg-stone-50">
            <KeyRound className="w-5 h-5 mr-2 text-stone-500" />
            <span className="text-stone-700">초대코드 입력</span>
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <Input
            placeholder="모임 이름 또는 태그로 검색"
            className="pl-10 pr-10 h-11 bg-white border-stone-200 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Scope Toggle - 검색어가 있을 때만 표시 */}
        {searchQuery && (
          <Tabs value={searchScope} onValueChange={(v) => setSearchScope(v as 'my' | 'all')} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-10 bg-stone-100 rounded-lg p-1">
              <TabsTrigger 
                value="my" 
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                내 모임
              </TabsTrigger>
              <TabsTrigger 
                value="all"
                className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                전체 모임
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { value: 'all', label: '전체' },
            { value: 'club', label: '동아리' },
            { value: 'study', label: '스터디' },
            { value: 'meetup', label: '정모' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as typeof filterType)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === filter.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Scope Info */}
      {searchQuery && (
        <div className="text-sm text-stone-500">
          {searchScope === 'my' 
            ? `내 모임에서 "${searchQuery}" 검색 결과 ${displayGroups.length}개`
            : `전체 모임에서 "${searchQuery}" 검색 결과 ${displayGroups.length}개`
          }
        </div>
      )}

      {/* Group List */}
      {displayGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayGroups.map((group) => (
          <Link 
            to={searchScope === 'all' && !MOCK_GROUPS.find(g => g.id === group.id) 
              ? `/explore/${group.id}` 
              : `/group/${group.id}`
            } 
            key={group.id} 
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-md transition-shadow border-stone-100 bg-white">
              <div className="relative h-32 bg-stone-200">
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Yzk3OTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {searchScope === 'all' && !MOCK_GROUPS.find(g => g.id === group.id) && (
                    <Badge variant="secondary" className="bg-blue-500 text-white text-xs">
                      공개
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-stone-800 hover:bg-white">
                    {group.type === 'club' ? '동아리' : group.type === 'study' ? '스터디' : '정모'}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-stone-900">{group.name}</h3>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
                    {group.memberCount}/{group.maxMembers}명
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {group.tags.map((tag) => (
                    <span key={tag} className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                {group.nextEvent && (
                  <div className="flex items-center text-sm text-stone-600 mt-3 pt-3 border-t border-stone-100">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="truncate">{group.nextEvent.title} ({group.nextEvent.date})</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-semibold text-stone-700 mb-2">
            {searchQuery ? '검색 결과가 없습니다' : '모임이 없습니다'}
          </h3>
          <p className="text-sm text-stone-500 mb-4">
            {searchQuery 
              ? searchScope === 'my' 
                ? '전체 모임에서 검색해보세요.' 
                : '다른 검색어로 시도해보세요.'
              : '새로운 모임을 만들거나 둘러보세요!'}
          </p>
          {!searchQuery && (
            <div className="flex gap-3">
              <Link to="/explore">
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  <Compass className="w-4 h-4 mr-2" />
                  모임 둘러보기
                </Button>
              </Link>
              <Link to="/create-group">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  모임 만들기
                </Button>
              </Link>
            </div>
          )}
          {searchQuery && searchScope === 'my' && (
            <Button 
              variant="outline" 
              onClick={() => setSearchScope('all')}
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              전체 모임에서 검색
            </Button>
          )}
        </div>
      )}

      {/* FAB for Creating Group */}
      <div className="fixed bottom-20 right-4 md:right-[calc(50%-220px+1rem)] z-40">
        <Link to="/create-group" aria-label="새 모임 만들기">
          <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 text-white p-0 transition-transform hover:scale-110 active:scale-95">
            <Plus className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
