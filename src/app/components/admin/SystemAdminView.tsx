import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Flag, 
  Users, 
  UserX, 
  Ban, 
  Search,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface Report {
  id: string;
  type: 'user' | 'group' | 'post';
  targetId: string;
  targetName: string;
  reporterName: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface BannedItem {
  id: string;
  type: 'user' | 'group';
  name: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
}

export function SystemAdminView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [banTarget, setBanTarget] = useState<{ type: 'user' | 'group'; id: string; name: string } | null>(null);

  // Mock 신고 데이터
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      type: 'user',
      targetId: 'user1',
      targetName: '악성유저123',
      reporterName: '홍길동',
      reason: '욕설/비방',
      details: '댓글에서 지속적으로 욕설을 사용합니다.',
      status: 'pending',
      createdAt: '2024-04-12 14:30',
    },
    {
      id: '2',
      type: 'group',
      targetId: 'group1',
      targetName: '수상한 투자 모임',
      reporterName: '김철수',
      reason: '사기/허위 정보',
      details: '가상화폐 투자 사기로 의심됩니다.',
      status: 'reviewing',
      createdAt: '2024-04-11 10:15',
    },
    {
      id: '3',
      type: 'post',
      targetId: 'post1',
      targetName: '광고 게시글',
      reporterName: '이영희',
      reason: '스팸/광고',
      status: 'resolved',
      createdAt: '2024-04-10 09:00',
    },
  ]);

  // Mock 밴 목록
  const [bannedItems, setBannedItems] = useState<BannedItem[]>([
    {
      id: '1',
      type: 'user',
      name: '스패머99',
      reason: '반복적인 스팸 게시',
      bannedAt: '2024-04-05',
      bannedBy: '관리자1',
    },
    {
      id: '2',
      type: 'group',
      name: '불법 도박 모임',
      reason: '불법 콘텐츠',
      bannedAt: '2024-04-01',
      bannedBy: '관리자1',
    },
  ]);

  const statusLabels: Record<string, string> = {
    pending: '대기 중',
    reviewing: '검토 중',
    resolved: '처리 완료',
    dismissed: '기각',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    reviewing: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    dismissed: 'bg-stone-100 text-stone-600',
  };

  const typeLabels: Record<string, string> = {
    user: '사용자',
    group: '모임',
    post: '게시글',
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (reportId: string, newStatus: Report['status']) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: newStatus } : r
    ));
    toast.success('상태가 업데이트되었습니다');
    setSelectedReport(null);
  };

  const handleBan = () => {
    if (!banTarget) return;

    setBannedItems(prev => [...prev, {
      id: Date.now().toString(),
      type: banTarget.type,
      name: banTarget.name,
      reason: '관리자 제재',
      bannedAt: new Date().toISOString().split('T')[0],
      bannedBy: '시스템관리자',
    }]);

    toast.success(`${banTarget.name}이(가) 밴 처리되었습니다`);
    setShowBanDialog(false);
    setBanTarget(null);
  };

  const handleUnban = (id: string) => {
    setBannedItems(prev => prev.filter(item => item.id !== id));
    toast.success('밴이 해제되었습니다');
  };

  const stats = {
    totalReports: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    totalBanned: bannedItems.length,
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-100">
        <div className="flex items-center px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
            <ArrowLeft className="w-6 h-6 text-stone-800" />
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h1 className="text-lg font-semibold text-stone-800">시스템 관리자</h1>
          </div>
        </div>
      </header>

      <div className="p-5 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="border-stone-100">
            <CardContent className="p-3 text-center">
              <Flag className="w-5 h-5 text-stone-400 mx-auto" />
              <p className="text-xl font-bold text-stone-900 mt-1">{stats.totalReports}</p>
              <p className="text-xs text-stone-500">전체 신고</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-3 text-center">
              <Clock className="w-5 h-5 text-amber-600 mx-auto" />
              <p className="text-xl font-bold text-amber-700 mt-1">{stats.pending}</p>
              <p className="text-xs text-amber-600">대기 중</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3 text-center">
              <Eye className="w-5 h-5 text-blue-600 mx-auto" />
              <p className="text-xl font-bold text-blue-700 mt-1">{stats.reviewing}</p>
              <p className="text-xs text-blue-600">검토 중</p>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-3 text-center">
              <Ban className="w-5 h-5 text-red-600 mx-auto" />
              <p className="text-xl font-bold text-red-700 mt-1">{stats.totalBanned}</p>
              <p className="text-xs text-red-600">밴 처리</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">신고 관리</TabsTrigger>
            <TabsTrigger value="banned">밴 목록</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  placeholder="검색..."
                  className="pl-10 h-11 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-28 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기 중</SelectItem>
                  <SelectItem value="reviewing">검토 중</SelectItem>
                  <SelectItem value="resolved">처리 완료</SelectItem>
                  <SelectItem value="dismissed">기각</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  <Flag className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                  <p>신고 내역이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredReports.map(report => (
                    <div 
                      key={report.id} 
                      className="p-4 hover:bg-stone-50 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          report.type === 'user' ? 'bg-purple-100' : 
                          report.type === 'group' ? 'bg-blue-100' : 'bg-orange-100'
                        }`}>
                          {report.type === 'user' ? <UserX className="w-5 h-5 text-purple-600" /> :
                           report.type === 'group' ? <Users className="w-5 h-5 text-blue-600" /> :
                           <Flag className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {typeLabels[report.type]}
                            </Badge>
                            <Badge className={`text-xs ${statusColors[report.status]}`}>
                              {statusLabels[report.status]}
                            </Badge>
                          </div>
                          <p className="font-medium text-stone-900 truncate">{report.targetName}</p>
                          <p className="text-sm text-stone-500">{report.reason}</p>
                          <p className="text-xs text-stone-400 mt-1">
                            신고자: {report.reporterName} · {report.createdAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Banned Tab */}
          <TabsContent value="banned" className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              {bannedItems.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  <Ban className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                  <p>밴 처리된 항목이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {bannedItems.map(item => (
                    <div key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.type === 'user' ? 'bg-red-100' : 'bg-red-100'
                          }`}>
                            {item.type === 'user' ? <UserX className="w-5 h-5 text-red-600" /> :
                             <Users className="w-5 h-5 text-red-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-stone-900">{item.name}</p>
                              <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                                {item.type === 'user' ? '사용자' : '모임'}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-500">{item.reason}</p>
                            <p className="text-xs text-stone-400">
                              {item.bannedAt} · {item.bannedBy}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnban(item.id)}
                          className="text-green-600 hover:bg-green-50"
                        >
                          해제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Detail Dialog */}
      <AlertDialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>신고 상세</AlertDialogTitle>
            <AlertDialogDescription asChild>
              {selectedReport && (
                <div className="space-y-4">
                  <div className="bg-stone-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-500">유형</span>
                      <span className="font-medium">{typeLabels[selectedReport.type]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">대상</span>
                      <span className="font-medium">{selectedReport.targetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">신고자</span>
                      <span className="font-medium">{selectedReport.reporterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">사유</span>
                      <span className="font-medium">{selectedReport.reason}</span>
                    </div>
                    {selectedReport.details && (
                      <div>
                        <span className="text-stone-500 text-sm">상세 내용</span>
                        <p className="text-stone-700 mt-1">{selectedReport.details}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      처리 완료
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      기각
                    </Button>
                  </div>

                  {selectedReport.type !== 'post' && (
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        setBanTarget({
                          type: selectedReport.type as 'user' | 'group',
                          id: selectedReport.targetId,
                          name: selectedReport.targetName,
                        });
                        setSelectedReport(null);
                        setShowBanDialog(true);
                      }}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {selectedReport.type === 'user' ? '사용자 밴' : '모임 밴'}
                    </Button>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>닫기</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Ban Confirm Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Ban className="w-5 h-5" />
              밴 처리 확인
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banTarget && (
                <p>
                  <span className="font-medium text-stone-900">"{banTarget.name}"</span>을(를) 
                  밴 처리하시겠습니까? 이 작업은 취소할 수 있습니다.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleBan} className="bg-red-500 hover:bg-red-600">
              밴 처리
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

