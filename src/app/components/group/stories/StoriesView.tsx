import { Folder, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

export function StoriesView() {
  const folders = [
    { id: 1, title: '4월 관악산 산행', count: 24, date: '2024.04.12', cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop' },
    { id: 2, title: '3월 신입환영회', count: 15, date: '2024.03.20', cover: 'https://images.unsplash.com/photo-1511632765486-a01980968a0c?w=400&h=400&fit=crop' },
  ];

  const recentPosts = [
    { 
      id: 1, 
      user: '김산악', 
      userImg: 'https://github.com/shadcn.png',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop',
      content: '날씨가 너무 좋았던 하루! 다들 고생하셨습니다 ㅎㅎ',
      likes: 12,
      comments: 4,
      date: '2시간 전'
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Albums / Folders */}
      <section>
        <h3 className="font-bold text-lg text-stone-800 px-1 mb-3">앨범</h3>
        <div className="grid grid-cols-2 gap-4">
          {folders.map(folder => (
            <Card key={folder.id} className="border-none shadow-none group cursor-pointer">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-2">
                <img src={folder.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Folder className="w-3 h-3" /> {folder.count}
                </div>
              </div>
              <h4 className="font-medium text-stone-900 truncate px-1">{folder.title}</h4>
              <p className="text-xs text-stone-500 px-1">{folder.date}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section>
        <h3 className="font-bold text-lg text-stone-800 px-1 mb-3">최근 게시글</h3>
        <div className="space-y-6">
          {recentPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                <img src={post.userImg} alt="" className="w-8 h-8 rounded-full bg-stone-200" />
                <div>
                  <p className="font-bold text-sm text-stone-900">{post.user}</p>
                  <p className="text-xs text-stone-400">{post.date}</p>
                </div>
              </div>
              <div className="aspect-[4/3] bg-stone-100">
                <img src={post.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-4">
                  <button className="flex items-center gap-1 text-stone-600 hover:text-red-500 transition-colors">
                    <Heart className="w-6 h-6" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-stone-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
                <p className="text-stone-800 text-sm leading-relaxed">
                  {post.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
