import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Folder, Heart, MessageCircle, Plus, Camera, ArrowUpDown, MoreVertical, Trash2, Flag, AlertTriangle } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { useUserPermissions } from '../../../data/userRoles';

type SortType = 'latest' | 'oldest' | 'popular';

interface Post {
  id: string;
  user: string;
  userImg: string;
  image: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  dateDisplay: string;
  isMyPost?: boolean;
}

export function StoriesView() {
  const { groupId } = useParams();
  const permissions = useUserPermissions(groupId || '1');
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');

  const folders = [
    { id: '1', title: '4월 관악산 산행', count: 24, date: '2024.04.12', cover: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop' },
    { id: '2', title: '3월 신입환영회', count: 15, date: '2024.03.20', cover: 'https://images.unsplash.com/photo-1511632765486-a01980968a0c?w=400&h=400&fit=crop' },
  ];

  const [allPosts, setAllPosts] = useState<Post[]>([
    { 
      id: '1', 
      user: '김산악', 
      userImg: 'https://github.com/shadcn.png',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop',
      content: '날씨가 너무 좋았던 하루! 다들 고생하셨습니다 ㅎㅎ',
      likes: 12,
      comments: 4,
      date: '2024-04-12T14:00:00',
      dateDisplay: '2시간 전',
      isMyPost: false,
    },
    { 
      id: '2', 
      user: '이영희', 
      userImg: '',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop',
      content: '정말 즐거웠어요! 다음 모임도 기대됩니다 🎉',
      likes: 8,
      comments: 2,
      date: '2024-04-12T09:00:00',
      dateDisplay: '5시간 전',
      isMyPost: false,
    },
    { 
      id: '3', 
      user: '홍길동 (나)', 
      userImg: '',
      image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=600&auto=format&fit=crop',
      content: '첫 참여인데 너무 재밌었어요~ 다음에도 꼭 갈게요!',
      likes: 25,
      comments: 7,
      date: '2024-04-11T18:00:00',
      dateDisplay: '어제',
      isMyPost: true,
    },
    { 
      id: '4', 
      user: '박철수', 
      userImg: '',
      image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&auto=format&fit=crop',
      content: '단체 사진입니다~ 모두 수고하셨어요 👏',
      likes: 30,
      comments: 10,
      date: '2024-04-10T20:00:00',
      dateDisplay: '2일 전',
      isMyPost: false,
    },
  ]);

  // 정렬된 게시글
  const sortedPosts = [...allPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'popular':
        return (b.likes + b.comments) - (a.likes + a.comments);
      default:
        return 0;
    }
  });

  const sortLabels: Record<SortType, string> = {
    latest: '최신순',
    oldest: '오래된순',
    popular: '인기순',
  };

  const reportReasons = [
    { value: 'spam', label: '스팸/광고' },
    { value: 'inappropriate', label: '부적절한 콘텐츠' },
    { value: 'harassment', label: '괴롭힘/혐오 발언' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' },
  ];

  const handleDeletePost = () => {
    if (!selectedPost) return;
    setAllPosts(posts => posts.filter(p => p.id !== selectedPost.id));
    toast.success('게시글이 삭제되었습니다');
    setShowDeleteDialog(false);
    setSelectedPost(null);
  };

  const handleReportPost = () => {
    if (!reportReason) {
      toast.error('신고 사유를 선택해주세요');
      return;
    }
    toast.success('신고가 접수되었습니다');
    setShowReportDialog(false);
    setSelectedPost(null);
    setReportReason('');
    setReportDetail('');
  };

  const canDeletePost = (post: Post) => {
    return post.isMyPost || permissions.canDeletePosts;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Create Story Button */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-lg text-stone-800">스토리</h3>
        <Link to="create">
          <Button className="bg-orange-500 hover:bg-orange-600 rounded-full">
            <Camera className="w-4 h-4 mr-2" />
            스토리 작성
          </Button>
        </Link>
      </div>

      {/* Albums / Folders */}
      <section>
        <h3 className="font-bold text-lg text-stone-800 px-1 mb-3">앨범</h3>
        <div className="grid grid-cols-2 gap-4">
          {folders.map(folder => (
            <Link to={`../albums/${folder.id}`} key={folder.id}>
              <Card className="border-none shadow-none group cursor-pointer">
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
            </Link>
          ))}
        </div>
      </section>

      {/* Feed */}
      <section>
        <div className="flex justify-between items-center px-1 mb-3">
          <h3 className="font-bold text-lg text-stone-800">게시글</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ArrowUpDown className="w-4 h-4" />
                {sortLabels[sortBy]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('latest')}>
                최신순
                {sortBy === 'latest' && ' ✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                오래된순
                {sortBy === 'oldest' && ' ✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('popular')}>
                인기순 (좋아요+댓글)
                {sortBy === 'popular' && ' ✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-6">
          {sortedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-3 flex items-center justify-between">
                <Link to={post.id} className="flex items-center gap-3">
                  <img 
                    src={post.userImg || `https://api.dicebear.com/7.x/initials/svg?seed=${post.user}`} 
                    alt="" 
                    className="w-8 h-8 rounded-full bg-stone-200" 
                  />
                  <div>
                    <p className="font-bold text-sm text-stone-900">{post.user}</p>
                    <p className="text-xs text-stone-400">{post.dateDisplay}</p>
                  </div>
                </Link>
                
                {/* 더보기 메뉴 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canDeletePost(post) && (
                      <>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제하기
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem 
                      className="text-orange-600"
                      onClick={() => {
                        setSelectedPost(post);
                        setShowReportDialog(true);
                      }}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      신고하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Link to={post.id}>
                <div className="aspect-[4/3] bg-stone-100">
                  <img src={post.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-stone-600">
                      <Heart className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 text-stone-600">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </span>
                  </div>
                  <p className="text-stone-800 text-sm leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-20 right-4 md:right-[calc(50%-220px+1rem)] z-40">
        <Link to="create">
          <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600 text-white p-0">
            <Plus className="w-7 h-7" />
          </Button>
        </Link>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">게시글 삭제</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 신고 다이얼로그 */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-500" />
              게시글 신고
            </DialogTitle>
            <DialogDescription>
              신고 사유를 선택하고 상세 내용을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-3">
              <Label>신고 사유</Label>
              <RadioGroup value={reportReason} onValueChange={setReportReason}>
                {reportReasons.map(reason => (
                  <div key={reason.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.value} id={reason.value} />
                    <Label htmlFor={reason.value} className="cursor-pointer">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label>상세 내용 (선택)</Label>
              <Textarea
                placeholder="추가로 알려주실 내용이 있다면 입력해주세요"
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              취소
            </Button>
            <Button onClick={handleReportPost} className="bg-orange-500 hover:bg-orange-600">
              신고하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
