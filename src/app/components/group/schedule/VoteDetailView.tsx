import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Check, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

interface VoteOption {
  id: string;
  date: string;
  time: string;
  votes: { id: string; name: string; avatar: string }[];
}

export function VoteDetailView() {
  const navigate = useNavigate();
  const { voteId } = useParams();
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['1', '2']);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock data
  const vote = {
    id: voteId,
    title: '5월 정기 모임 일정 투표',
    description: '5월 정기 모임 일정을 정해요! 가능한 일정을 모두 선택해주세요.',
    createdBy: { name: '홍길동', avatar: '' },
    createdAt: '2024.04.10',
    deadline: '2024.04.15 23:59',
    daysLeft: 3,
    totalParticipants: 12,
    isMultipleChoice: true,
    isAnonymous: false,
    options: [
      {
        id: '1',
        date: '5월 4일 (토)',
        time: '오후 6:00',
        votes: [
          { id: '1', name: '홍길동', avatar: '' },
          { id: '2', name: '김철수', avatar: '' },
          { id: '3', name: '이영희', avatar: '' },
          { id: '4', name: '박민수', avatar: '' },
          { id: '5', name: '정지훈', avatar: '' },
        ],
      },
      {
        id: '2',
        date: '5월 11일 (토)',
        time: '오후 6:00',
        votes: [
          { id: '1', name: '홍길동', avatar: '' },
          { id: '2', name: '김철수', avatar: '' },
          { id: '6', name: '최유진', avatar: '' },
        ],
      },
      {
        id: '3',
        date: '5월 18일 (토)',
        time: '오후 7:00',
        votes: [
          { id: '3', name: '이영희', avatar: '' },
          { id: '7', name: '강민호', avatar: '' },
        ],
      },
    ] as VoteOption[],
  };

  const maxVotes = Math.max(...vote.options.map(o => o.votes.length));

  const toggleOption = (optionId: string) => {
    if (hasVoted) return;
    
    if (vote.isMultipleChoice) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length === 0) {
      toast.error('최소 하나의 일정을 선택해주세요');
      return;
    }
    setHasVoted(true);
    toast.success('투표가 완료되었습니다!');
  };

  const handleChangeVote = () => {
    setHasVoted(false);
    toast.info('투표를 수정할 수 있습니다');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="-ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold text-stone-800">투표</h1>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* Title & Info */}
        <div className="bg-white rounded-2xl p-4 border border-stone-100">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-purple-100 text-purple-700">일정 투표</Badge>
            {vote.isMultipleChoice && (
              <Badge variant="outline" className="text-stone-500">복수 선택</Badge>
            )}
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">{vote.title}</h2>
          <p className="text-sm text-stone-600 mb-4">{vote.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={vote.createdBy.avatar} />
                <AvatarFallback className="text-xs">{vote.createdBy.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-stone-500">{vote.createdBy.name}</span>
            </div>
            <div className="flex items-center gap-4 text-stone-500">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {vote.totalParticipants}명 참여
              </span>
              <span className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                {vote.daysLeft}일 남음
              </span>
            </div>
          </div>
        </div>

        {/* Vote Options */}
        <div className="space-y-3">
          {vote.options.map(option => {
            const isSelected = selectedOptions.includes(option.id);
            const percentage = vote.totalParticipants > 0 
              ? Math.round((option.votes.length / vote.totalParticipants) * 100)
              : 0;
            const isLeading = option.votes.length === maxVotes && maxVotes > 0;

            return (
              <button
                key={option.id}
                onClick={() => toggleOption(option.id)}
                disabled={hasVoted}
                className={`w-full text-left bg-white rounded-2xl p-4 border-2 transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-stone-100 hover:border-stone-200'
                } ${hasVoted ? 'cursor-default' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">{option.date}</p>
                      <p className="text-sm text-stone-500">{option.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLeading && (
                      <Badge className="bg-green-100 text-green-700">
                        <BarChart2 className="w-3 h-3 mr-1" />
                        1위
                      </Badge>
                    )}
                    <span className="text-sm font-medium text-stone-600">
                      {option.votes.length}표
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <Progress 
                    value={percentage} 
                    className="h-2 bg-stone-100"
                  />
                </div>

                {/* Voters */}
                {!vote.isAnonymous && option.votes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {option.votes.slice(0, 5).map(voter => (
                        <Avatar key={voter.id} className="w-6 h-6 border-2 border-white">
                          <AvatarImage src={voter.avatar} />
                          <AvatarFallback className="text-xs">{voter.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {option.votes.length > 5 && (
                      <span className="text-xs text-stone-500">
                        +{option.votes.length - 5}명
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Vote Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            💡 마감일: {vote.deadline}
            <br />
            {vote.isMultipleChoice ? '가능한 일정을 모두 선택해주세요.' : '하나의 일정만 선택할 수 있습니다.'}
          </p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-4 safe-area-pb">
        <div className="max-w-md mx-auto">
          {hasVoted ? (
            <Button
              onClick={handleChangeVote}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              투표 수정하기
            </Button>
          ) : (
            <Button
              onClick={handleVote}
              disabled={selectedOptions.length === 0}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50"
            >
              투표하기 ({selectedOptions.length}개 선택)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

