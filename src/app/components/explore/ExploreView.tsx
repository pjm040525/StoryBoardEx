import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Users, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface PublicGroup {
  id: string;
  name: string;
  image: string;
  description: string;
  tags: string[];
  memberCount: number;
  maxMembers: number;
  type: 'club' | 'meetup' | 'study';
  location?: string;
  nextEvent?: {
    title: string;
    date: string;
  };
}

export function ExploreView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data for public groups
  const publicGroups: PublicGroup[] = [
    {
      id: '1',
      name: '주말 등산 클럽',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60',
      description: '매주 토요일 서울 근교 산행합니다. 초보자 환영!',
      tags: ['등산', '운동', '친목'],
      memberCount: 15,
      maxMembers: 50,
      type: 'club',
      location: '서울',
      nextEvent: { title: '관악산 정기 산행', date: '4/12' },
    },
    {
      id: '3',
      name: '개발자 네트워킹',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
      description: 'IT 업계 종사자들의 네트워킹 모임입니다.',
      tags: ['개발', 'IT', '네트워킹'],
      memberCount: 25,
      maxMembers: 30,
      type: 'meetup',
      location: '강남',
      nextEvent: { title: '4월 정기 밋업', date: '4/20' },
    },
    {
      id: '4',
      name: '요가 & 명상 클럽',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60',
      description: '바쁜 일상 속 마음의 평화를 찾아요.',
      tags: ['요가', '명상', '건강'],
      memberCount: 12,
      maxMembers: 20,
      type: 'club',
      location: '여의도',
      nextEvent: { title: '일요일 모닝 요가', date: '4/14' },
    },
    {
      id: '6',
      name: '주말 러닝 크루',
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=500&auto=format&fit=crop&q=60',
      description: '함께 뛰면 더 즐거워요! 러닝 크루 멤버 모집',
      tags: ['러닝', '운동', '건강'],
      memberCount: 35,
      maxMembers: 50,
      type: 'club',
      location: '서울숲',
      nextEvent: { title: '서울숲 10km 러닝', date: '4/13' },
    },
    {
      id: '7',
      name: '사진 동호회',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=60',
      description: '출사와 사진 리뷰를 함께하는 모임',
      tags: ['사진', '출사', '취미'],
      memberCount: 18,
      maxMembers: 25,
      type: 'club',
      location: '서울',
    },
    {
      id: '8',
      name: '주식 스터디',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60',
      description: '주식 투자 공부를 함께 해요',
      tags: ['주식', '투자', '스터디'],
      memberCount: 8,
      maxMembers: 12,
      type: 'study',
      location: '온라인',
    },
  ];

  const allTags = Array.from(new Set(publicGroups.flatMap(g => g.tags)));

  const filteredGroups = publicGroups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(group.type);
    const matchesTags = selectedTags.length === 0 || group.tags.some(tag => selectedTags.includes(tag));
    
    return matchesSearch && matchesType && matchesTags;
  });

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedTags([]);
  };

  const activeFilterCount = selectedTypes.length + selectedTags.length;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-stone-900">모임 둘러보기</h1>
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full">
                로그인
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <Input
                placeholder="모임 이름, 태그로 검색"
                className="pl-10 pr-10 h-11 bg-stone-50 border-stone-200 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl relative">
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>필터</SheetTitle>
                  <SheetDescription>원하는 조건으로 모임을 찾아보세요</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Type Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">모임 유형</Label>
                    <div className="space-y-2">
                      {[
                        { value: 'club', label: '동아리' },
                        { value: 'study', label: '스터디' },
                        { value: 'meetup', label: '정모' },
                      ].map(type => (
                        <div key={type.value} className="flex items-center gap-2">
                          <Checkbox
                            id={type.value}
                            checked={selectedTypes.includes(type.value)}
                            onCheckedChange={() => toggleType(type.value)}
                            className="data-[state=checked]:bg-orange-500"
                          />
                          <Label htmlFor={type.value} className="cursor-pointer">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">관심사</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-orange-500 text-white'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      필터 초기화
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="p-4">
        <p className="text-sm text-stone-500 mb-4">
          {filteredGroups.length}개의 공개 모임
        </p>

        {filteredGroups.length > 0 ? (
          <div className="space-y-4">
            {filteredGroups.map(group => (
              <Link to={`/explore/${group.id}`} key={group.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow border-stone-100">
                  <div className="flex">
                    <div className="w-28 h-28 bg-stone-200 flex-shrink-0">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-stone-900">{group.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs bg-stone-100">
                              {group.type === 'club' ? '동아리' : group.type === 'study' ? '스터디' : '정모'}
                            </Badge>
                            {group.location && (
                              <span className="text-xs text-stone-500 flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {group.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-300" />
                      </div>
                      <p className="text-xs text-stone-500 mt-2 line-clamp-1">
                        {group.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-stone-500">
                          <Users className="w-3 h-3" />
                          {group.memberCount}/{group.maxMembers}명
                        </div>
                        {group.nextEvent && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                            {group.nextEvent.date} {group.nextEvent.title}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">모임을 찾을 수 없습니다</h3>
            <p className="text-sm text-stone-500">다른 검색어나 필터로 시도해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

