import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Calendar, Send, Trash2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { NoPermissionView } from '../../common/NoPermissionView';

interface Comment {
  id: string;
  author: { name: string; avatar: string };
  content: string;
  createdAt: string;
  likes: number;
}

export function StoryDetailView() {
  const navigate = useNavigate();
  const { storyId, groupId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreviewMode = searchParams.get('preview') === 'true';
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [comment, setComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: { name: '김철수', avatar: '' },
      content: '정말 좋은 추억이네요! 다음에도 함께해요 😊',
      createdAt: '1시간 전',
      likes: 3,
    },
    {
      id: '2',
      author: { name: '이영희', avatar: '' },
      content: '사진 너무 잘 나왔어요!',
      createdAt: '30분 전',
      likes: 1,
    },
  ]);

  // Mock data
  const story = {
    id: storyId,
    author: { name: '홍길동', avatar: '' },
    content: '오늘 정기 모임에서 찍은 사진들입니다! 다들 즐거운 시간 보내셨죠? 날씨도 좋고 음식도 맛있었어요. 다음 달에도 꼭 참석해주세요! 🎉',
    images: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=600&fit=crop',
    ],
    location: '강남역 스타벅스 리저브',
    linkedEvent: '4월 정기 모임',
    taggedMembers: ['김철수', '이영희', '박민수'],
    createdAt: '2024.04.12',
    isMyStory: !isPreviewMode, // 미리보기 모드면 내 스토리 아님
    groupName: '주말 등산 클럽',
  };

  // 권한 체크 (실제로는 API에서 확인)
  useEffect(() => {
    setIsLoading(true);
    
    // 미리보기 모드에서는 공개된 게시글만 볼 수 있음
    // 실제 구현에서는 API로 권한 확인
    const checkPermission = () => {
      // 미리보기 모드: 해당 모임의 게시글이 공개인지 확인 필요
      // 여기서는 mock으로 처리 - 실제로는 모임의 privacySettings.showPostsToNonMembers 확인
      if (isPreviewMode) {
        // 모임의 게시글 공개 설정에 따라 결정
        // 여기서는 공개로 가정 (실제로는 API에서 받아옴)
        const isPostPublic = true; // 이 값이 false면 권한 없음
        setHasPermission(isPostPublic);
      } else {
        // 일반 모드: 회원인지 확인 (여기서는 회원이라고 가정)
        setHasPermission(true);
      }
      setIsLoading(false);
    };

    // 약간의 지연 후 권한 확인 (실제 API 호출 시뮬레이션)
    setTimeout(checkPermission, 300);
  }, [isPreviewMode, groupId, storyId]);

  const handleLike = () => {
    if (isPreviewMode) {
      toast.info('좋아요를 누르려면 모임에 가입해주세요');
      return;
    }
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('링크가 복사되었습니다');
  };

  const handleAddComment = () => {
    if (isPreviewMode) {
      toast.info('댓글을 작성하려면 모임에 가입해주세요');
      return;
    }
    if (!comment.trim()) return;
    
    setComments([
      ...comments,
      {
        id: String(Date.now()),
        author: { name: '나', avatar: '' },
        content: comment,
        createdAt: '방금 전',
        likes: 0,
      },
    ]);
    setComment('');
    toast.success('댓글이 등록되었습니다');
  };

  const handleDelete = () => {
    toast.success('스토리가 삭제되었습니다');
    navigate(-1);
  };

  const handleJoinClick = () => {
    navigate(`/explore/${groupId}`);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 권한 없음
  if (!hasPermission) {
    return (
      <NoPermissionView 
        type="posts" 
        groupName={story.groupName}
        showJoinButton={true}
        onJoinClick={handleJoinClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm">
          <span>미리보기 모드입니다. 가입 후 더 많은 기능을 이용하세요!</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="-ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-stone-800" />
            </Button>
            <h1 className="ml-2 text-lg font-semibold text-stone-800">스토리</h1>
          </div>
          {story.isMyStory && !isPreviewMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5 text-stone-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Author Info */}
      <div className="flex items-center gap-3 p-4 border-b border-stone-100">
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
      {story.images.length > 0 && (
        <div className="relative">
          <div className="aspect-square bg-stone-100">
            <img
              src={story.images[currentImageIndex]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          {story.images.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {story.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1}/{story.images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-4 border-b border-stone-100">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5"
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
            <span className="text-sm font-medium text-stone-600">{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5">
            <MessageCircle className="w-6 h-6 text-stone-600" />
            <span className="text-sm font-medium text-stone-600">{comments.length}</span>
          </button>
        </div>
        <button onClick={handleShare}>
          <Share2 className="w-6 h-6 text-stone-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-stone-800 leading-relaxed">{story.content}</p>

        {/* Tagged Members */}
        {story.taggedMembers.length > 0 && (
          <p className="text-sm">
            {story.taggedMembers.map((name, i) => (
              <span key={name}>
                <span className="text-orange-600">@{name}</span>
                {i < story.taggedMembers.length - 1 && ' '}
              </span>
            ))}
          </p>
        )}

        {/* Location & Event */}
        <div className="flex flex-wrap gap-2">
          {story.location && (
            <span className="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {story.location}
            </span>
          )}
          {story.linkedEvent && (
            <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              <Calendar className="w-3 h-3" />
              {story.linkedEvent}
            </span>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="border-t border-stone-100">
        <div className="p-4">
          <h3 className="font-bold text-stone-900 mb-4">댓글 {comments.length}</h3>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={c.author.avatar} />
                    <AvatarFallback>{c.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-900">{c.author.name}</span>
                      <span className="text-xs text-stone-400">{c.createdAt}</span>
                    </div>
                    <p className="text-sm text-stone-700 mt-0.5">{c.content}</p>
                    <button className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {c.likes > 0 && c.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500 text-center py-4">아직 댓글이 없습니다</p>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 safe-area-pb">
        <div className="max-w-md mx-auto">
          {isPreviewMode ? (
            <Button
              onClick={handleJoinClick}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 rounded-xl"
            >
              <Lock className="w-4 h-4 mr-2" />
              모임에 가입하고 댓글 작성하기
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="댓글을 입력하세요..."
                className="flex-1 h-11 bg-stone-50 border-stone-200 rounded-xl"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                size="icon"
                className="h-11 w-11 bg-orange-500 hover:bg-orange-600 rounded-xl"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>스토리 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 이 스토리를 삭제하시겠습니까?
              삭제된 스토리는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
