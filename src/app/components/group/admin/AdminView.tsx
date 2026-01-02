import { useState, useEffect } from 'react';
import { ChevronRight, Shield, CreditCard, Users, LogOut, AlertTriangle, Crown, Globe, Lock, Wallet, PieChart, Scale } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
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
import { Button } from '../../ui/button';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Card, CardContent } from '../../ui/card';

type UserRole = 'owner' | 'treasurer' | 'manager' | 'member';
type ManagementType = 'operating' | 'fair';

export function AdminView() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<UserRole>('member');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showManagementTypeDialog, setShowManagementTypeDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [managementType, setManagementType] = useState<ManagementType>('fair');
  const groupName = '주말 등산 클럽';
  const currentVisibility = 'searchable';

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const canViewShares = userRole === 'owner' || userRole === 'treasurer';
  const canChangeManagementType = userRole === 'owner' || userRole === 'treasurer' || userRole === 'manager';

  const handleDeleteGroup = () => {
    if (deleteConfirmText !== groupName) {
      toast.error('모임 이름이 일치하지 않습니다');
      return;
    }
    toast.success('모임이 삭제되었습니다');
    setShowDeleteDialog(false);
    setTimeout(() => navigate('/'), 500);
  };

  const handleSaveManagementType = () => {
    toast.success('통장 관리 유형이 변경되었습니다');
    setShowManagementTypeDialog(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* 역할 표시 */}
      <div className="flex justify-end">
        <Badge className={
          userRole === 'owner' ? 'bg-purple-100 text-purple-700' :
          userRole === 'treasurer' ? 'bg-green-100 text-green-700' :
          userRole === 'manager' ? 'bg-blue-100 text-blue-700' :
          'bg-stone-100 text-stone-600'
        }>
          {userRole === 'owner' ? '모임장' :
           userRole === 'treasurer' ? '총무' :
           userRole === 'manager' ? '운영진' : '회원'}
        </Badge>
      </div>

      {/* 모임 관리 */}
      <div className="bg-white rounded-xl border border-stone-100 divide-y divide-stone-50 overflow-hidden">
        <div className="px-4 py-3 bg-stone-50">
          <h3 className="font-medium text-stone-700">모임 관리</h3>
        </div>
        
        <Link to="edit-group" className="block">
          <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">모임 정보 수정</p>
                <p className="text-xs text-stone-500">이름, 커버 이미지, 태그</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Link>

        <Link to="privacy" className="block">
          <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                {currentVisibility === 'private' ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Globe className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-stone-900">공개 설정</p>
                <p className="text-xs text-stone-500">
                  {currentVisibility === 'private' && '비공개'}
                  {currentVisibility === 'searchable' && '검색 허용'}
                  {currentVisibility === 'public' && '완전 공개'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Link>
        
        <Link to="dues-policy" className="block">
          <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">회비 정책 관리</p>
                <p className="text-xs text-stone-500">금액, 납부일, 중복 처리</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Link>
      </div>

      {/* 통장 관리 */}
      <div className="bg-white rounded-xl border border-stone-100 divide-y divide-stone-50 overflow-hidden">
        <div className="px-4 py-3 bg-stone-50">
          <h3 className="font-medium text-stone-700">통장 관리</h3>
        </div>

        {/* 통장 유형 변경 (모임장/총무/운영진만) */}
        {canChangeManagementType && (
          <button 
            onClick={() => setShowManagementTypeDialog(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${managementType === 'fair' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                <Scale className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-stone-900">통장 관리 유형</p>
                <div className="flex items-center gap-2">
                  <Badge className={managementType === 'fair' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                    {managementType === 'fair' ? '공정정산형' : '운영비형'}
                  </Badge>
                  <span className="text-xs text-stone-500">변경 가능</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </button>
        )}

        {/* 지분 관리 (총무/모임장만) */}
        {canViewShares && (
          <Link to="shares" className="block">
            <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-stone-900">지분 관리</p>
                  <p className="text-xs text-stone-500">멤버별 지분 현황 확인</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-300" />
            </div>
          </Link>
        )}
      </div>

      {/* 멤버/권한 관리 */}
      <div className="bg-white rounded-xl border border-stone-100 divide-y divide-stone-50 overflow-hidden">
        <div className="px-4 py-3 bg-stone-50">
          <h3 className="font-medium text-stone-700">멤버 관리</h3>
        </div>
        
        <Link to="members" className="block">
          <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">멤버 관리</p>
                <p className="text-xs text-stone-500">가입 승인, 추방, 회비 현황</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                2명 대기
              </Badge>
              <ChevronRight className="w-5 h-5 text-stone-300" />
            </div>
          </div>
        </Link>

        <Link to="roles" className="block">
          <div className="p-4 flex items-center justify-between hover:bg-stone-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">권한 관리</p>
                <p className="text-xs text-stone-500">총무, 운영진 지정 (중복 가능)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300" />
          </div>
        </Link>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white rounded-xl border border-stone-100 p-4 space-y-6">
        <h3 className="font-bold text-stone-900">알림 설정</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base text-stone-900">새 멤버 가입 알림</Label>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base text-stone-900">회비 미납 알림 자동 발송</Label>
            <div className="text-xs text-stone-500">매월 25일 오전 10시</div>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base text-stone-900">정산 요청 알림</Label>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-orange-500" />
        </div>
      </div>

      {/* 위험 영역 */}
      <button 
        onClick={() => setShowDeleteDialog(true)}
        className="w-full p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        모임 삭제하기
      </button>

      {/* Management Type Dialog */}
      <Dialog open={showManagementTypeDialog} onOpenChange={setShowManagementTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>통장 관리 유형 변경</DialogTitle>
            <DialogDescription>
              관리 유형에 따라 탈퇴/가입 시 정산 방식이 달라집니다
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup value={managementType} onValueChange={(v) => setManagementType(v as ManagementType)}>
              <Card className={`border-2 cursor-pointer ${managementType === 'operating' ? 'border-blue-500 bg-blue-50' : 'border-stone-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="operating" id="operating" className="mt-1" />
                    <Label htmlFor="operating" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-bold">운영비형</span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">인원 변동이 적은 모임에 적합</p>
                      <ul className="text-xs text-stone-500 space-y-1">
                        <li>• 탈퇴 시 환불 없음</li>
                        <li>• 간단한 운영비 관리</li>
                      </ul>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border-2 cursor-pointer ${managementType === 'fair' ? 'border-green-500 bg-green-50' : 'border-stone-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="fair" id="fair" className="mt-1" />
                    <Label htmlFor="fair" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="w-4 h-4 text-green-600" />
                        <span className="font-bold">공정정산형</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">추천</Badge>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">인원 변동이 많은 모임에 적합</p>
                      <ul className="text-xs text-stone-500 space-y-1">
                        <li>• 탈퇴 시 지분만큼 환불</li>
                        <li>• 개인별 지분 자동 계산</li>
                      </ul>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                ⚠️ 유형 변경 시 기존 지분 계산 방식이 변경됩니다. 
                신중하게 결정해주세요.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManagementTypeDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSaveManagementType} className="bg-orange-500 hover:bg-orange-600">
              변경하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">모임 삭제</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4">
              <p>
                이 작업은 되돌릴 수 없습니다. 모든 일정, 회비 내역, 스토리가 
                영구적으로 삭제됩니다.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  삭제를 확인하려면 아래에 <strong>"{groupName}"</strong>을 입력하세요.
                </p>
              </div>
              <Input
                placeholder="모임 이름을 입력하세요"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="border-stone-300"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              disabled={deleteConfirmText !== groupName}
              className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
