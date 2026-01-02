import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Send, MoreVertical, Trash2, Flag, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
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

interface Comment {
  id: string;
  user: string;
  userImg: string;
  content: string;
  date: string;
  isMyComment?: boolean;
}

export function StoryDetailView() {
  const { groupId, storyId } = useParams();
  const navigate = useNavigate();
  const permissions = useUserPermissions(groupId || '1');
  
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);
  const [newComment, setNewComment] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'post' | 'comment'>('post');
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');

  const post = {
    id: storyId,
    user: '김산악',
    userImg: 'https://github.com/shadcn.png',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
    content: '날씨가 너무 좋았던 하루! 다들 고생하셨습니다 ㅎㅎ 정말 즐거운 시간이었어요. 다음에도 꼭 함께해요!',
    likes: likeCount,
    date: '2024.04.12 14:00',
    isMyPost: false,
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: '이영희',
      userImg: '',
      content: '정말 즐거웠어요! 다음에도 함께해요~',
      date: '2시간 전',
      isMyComment: false,
    },
    {
      id: '2',
      user: '홍길동 (나)',
      userImg: '',
      content: '다들 고생하셨습니다!',
      date: '1시간 전',
      isMyComment: true,
    },
    {
      id: '3',
      user: '박철수',
      userImg: '',
      content: '사진 잘 찍으셨네요 👍',
      date: '30분 전',
      isMyComment: false,
    },
  ]);

  const reportReasons = [
    { value: 'spam', label: '스팸/광고' },
    { value: 'inappropriate', label: '부적절한 콘텐츠' },
    { value: 'harassment', label: '괴롭힘/혐오 발언' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' },
  ];

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: String(Date.now()),
      user: '홍길동 (나)',
      userImg: '',
      content: newComment,
      date: '방금',
      isMyComment: true,
    };
    setComments([...comments, comment]);
    setNewComment('');
    toast.success('댓글이 등록되었습니다');
  };

  const handleDeletePost = () => {
    toast.success('게시글이 삭제되었습니다');
    setShowDeleteDialog(false);
    navigate(-1);
  };

  const handleDeleteComment = () => {
    if (!selectedComment) return;
    setComments(comments.filter(c => c.id !== selectedComment.id));
    toast.success('댓글이 삭제되었습니다');
    setShowDeleteDialog(false);
    setSelectedComment(null);
  };

  const handleReport = () => {
    if (!reportReason) {
      toast.error('신고 사유를 선택해주세요');
      return;
    }
    toast.success('신고가 접수되었습니다');
    setShowReportDialog(false);
    setReportReason('');
    setReportDetail('');
  };

  const canDeletePost = post.isMyPost || permissions.canDeletePosts;
  const canDeleteComment = (comment: Comment) => comment.isMyComment || permissions.canDeleteComments;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg z-10 border-b border-stone-100">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium">게시글</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canDeletePost && (
                <>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => {
                      setDeleteTarget('post');
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    게시글 삭제
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem 
                className="text-orange-600"
                onClick={() => setShowReportDialog(true)}
              >
                <Flag className="w-4 h-4 mr-2" />
                신고하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Content */}
      <div className="pb-32">
        {/* Author */}
        <div className="p-4 flex items-center gap-3">
          <img 
            src={post.userImg} 
            alt="" 
            className="w-10 h-10 rounded-full bg-stone-200" 
          />
          <div>
            <p className="font-bold text-stone-900">{post.user}</p>
            <p className="text-xs text-stone-400">{post.date}</p>
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square bg-stone-100">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Actions */}
        <div className="p-4 flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1">
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
            <span className="font-medium">{likeCount}</span>
          </button>
          <div className="flex items-center gap-1 text-stone-600">
            <MessageCircle className="w-6 h-6" />
            <span className="font-medium">{comments.length}</span>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4">
          <p className="text-stone-800 leading-relaxed">{post.content}</p>
        </div>

        {/* Divider */}
        <div className="h-2 bg-stone-100"></div>

        {/* Comments */}
        <div className="p-4 space-y-4">
          <h3 className="font-bold text-stone-900">댓글 {comments.length}개</h3>
          
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img 
                src={comment.userImg || `https://api.dicebear.com/7.x/initials/svg?seed=${comment.user}`}
                alt="" 
                className="w-8 h-8 rounded-full bg-stone-200 shrink-0" 
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-stone-900">{comment.user}</span>
                    <span className="text-xs text-stone-400">{comment.date}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-stone-400">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canDeleteComment(comment) && (
                        <>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedComment(comment);
                              setDeleteTarget('comment');
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem 
                        className="text-orange-600"
                        onClick={() => {
                          setSelectedComment(comment);
                          setShowReportDialog(true);
                        }}
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        신고
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-stone-700 mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4">
        <div className="max-w-[500px] mx-auto flex gap-2">
          <Input
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            className="flex-1"
          />
          <Button onClick={handleAddComment} className="bg-orange-500 hover:bg-orange-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                {deleteTarget === 'post' ? '게시글 삭제' : '댓글 삭제'}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {deleteTarget === 'post' 
                ? '이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.'
                : '이 댓글을 삭제하시겠습니까?'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTarget === 'post' ? handleDeletePost : handleDeleteComment}
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
              {selectedComment ? '댓글 신고' : '게시글 신고'}
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
                    <RadioGroupItem value={reason.value} id={`detail-${reason.value}`} />
                    <Label htmlFor={`detail-${reason.value}`} className="cursor-pointer">
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
            <Button onClick={handleReport} className="bg-orange-500 hover:bg-orange-600">
              신고하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
