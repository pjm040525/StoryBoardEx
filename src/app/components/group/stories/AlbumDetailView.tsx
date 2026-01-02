import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Heart, MessageCircle, Plus, Grid, List, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

interface Story {
  id: string;
  images: string[];
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  location?: string;
}

export function AlbumDetailView() {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock album data
  const album = {
    id: albumId,
    title: '4월 관악산 산행',
    cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop',
    date: '2024.04.12',
    description: '봄꽃이 만발한 관악산 정기 산행 사진들입니다.',
    eventTitle: '4월 정기 산행',
    location: '관악산',
    photoCount: 24,
  };

  // Mock stories in album
  const stories: Story[] = [
    {
      id: '1',
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&auto=format&fit=crop',
      ],
      content: '정상에서 찍은 사진! 날씨가 너무 좋았어요 ☀️',
      author: { id: '1', name: '홍길동', avatar: '' },
      likes: 15,
      comments: 5,
      createdAt: '4월 12일',
      location: '관악산 정상',
    },
    {
      id: '2',
      images: [
        'https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop',
      ],
      content: '올라가는 길에 본 봄꽃들 🌸',
      author: { id: '2', name: '김철수', avatar: '' },
      likes: 12,
      comments: 3,
      createdAt: '4월 12일',
      location: '관악산 등산로',
    },
    {
      id: '3',
      images: [
        'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511632765486-a01980968a0c?w=600&auto=format&fit=crop',
      ],
      content: '산행 후 뒤풀이 사진입니다! 다들 고생하셨어요 🍻',
      author: { id: '3', name: '이영희', avatar: '' },
      likes: 20,
      comments: 8,
      createdAt: '4월 12일',
    },
    {
      id: '4',
      images: [
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop',
      ],
      content: '오늘의 단체 사진 📸',
      author: { id: '1', name: '홍길동', avatar: '' },
      likes: 25,
      comments: 10,
      createdAt: '4월 12일',
      location: '관악산 정상',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header with Cover */}
      <div className="relative h-48 bg-stone-300">
        <img
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/20 hover:bg-black/40 text-white rounded-full"
              >
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>앨범 수정</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">앨범 삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Album Info */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h1 className="text-2xl font-bold mb-1">{album.title}</h1>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {album.date}
            </span>
            {album.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {album.location}
              </span>
            )}
            <span>{album.photoCount}장</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {album.description && (
        <div className="p-4 bg-white border-b border-stone-100">
          <p className="text-sm text-stone-600">{album.description}</p>
          {album.eventTitle && (
            <span className="inline-block mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
              📅 {album.eventTitle}
            </span>
          )}
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="p-4 bg-white border-b border-stone-100 flex items-center justify-between">
        <span className="text-sm text-stone-500">게시글 {stories.length}개</span>
        <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' ? 'bg-white shadow-sm' : 'text-stone-500'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-stone-500'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stories */}
      {viewMode === 'list' ? (
        <div className="divide-y divide-stone-100">
          {stories.map(story => (
            <Link to={`../stories/${story.id}`} key={story.id}>
              <div className="bg-white">
                {/* Author */}
                <div className="p-4 flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={story.author.avatar} />
                    <AvatarFallback>{story.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-stone-900">{story.author.name}</p>
                    <p className="text-xs text-stone-500">{story.createdAt}</p>
                  </div>
                </div>

                {/* Images */}
                <div className={`${story.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
                  {story.images.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className={`aspect-square bg-stone-100 relative ${
                        story.images.length === 3 && i === 0 ? 'row-span-2' : ''
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {i === 3 && story.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">+{story.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Content & Actions */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-4 text-stone-600">
                    <span className="flex items-center gap-1">
                      <Heart className="w-5 h-5" />
                      {story.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-5 h-5" />
                      {story.comments}
                    </span>
                  </div>
                  <p className="text-stone-800 line-clamp-2">{story.content}</p>
                  {story.location && (
                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {story.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-2 grid grid-cols-3 gap-0.5">
          {stories.flatMap(story => 
            story.images.map((img, i) => (
              <Link to={`../stories/${story.id}`} key={`${story.id}-${i}`}>
                <div className="aspect-square bg-stone-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-40">
        <Link to="../stories/create">
          <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 text-white p-0">
            <Plus className="w-7 h-7" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

