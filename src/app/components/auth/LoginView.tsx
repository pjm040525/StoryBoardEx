import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Crown, Wallet, Shield, User, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

// 테스트 계정 정보
const TEST_ACCOUNTS = [
  { id: 'admin', email: 'admin@moim.com', password: 'admin1234', role: '시스템 관리자', icon: ShieldAlert, color: 'bg-red-100 text-red-600', isSystem: true },
  { id: 'owner', email: 'owner@test.com', password: 'test1234', role: '모임장', icon: Crown, color: 'bg-orange-100 text-orange-600', isSystem: false },
  { id: 'treasurer', email: 'treasurer@test.com', password: 'test1234', role: '총무', icon: Wallet, color: 'bg-green-100 text-green-600', isSystem: false },
  { id: 'manager', email: 'manager@test.com', password: 'test1234', role: '운영진', icon: Shield, color: 'bg-blue-100 text-blue-600', isSystem: false },
  { id: 'member', email: 'member@test.com', password: 'test1234', role: '일반회원', icon: User, color: 'bg-stone-100 text-stone-600', isSystem: false },
];

export function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    
    // 테스트 계정 확인
    const testAccount = TEST_ACCOUNTS.find(acc => acc.email === email && acc.password === password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (testAccount) {
        // 테스트 계정 로그인 - 역할 정보 저장
        localStorage.setItem('userRole', testAccount.id);
        localStorage.setItem('userEmail', testAccount.email);
        localStorage.setItem('isSystemAdmin', testAccount.isSystem ? 'true' : 'false');
        
        if (testAccount.isSystem) {
          toast.success(`시스템 관리자로 로그인되었습니다!`, {
            description: '모든 모임과 회원을 관리할 수 있습니다.'
          });
          navigate('/system-admin');
        } else {
          toast.success(`${testAccount.role}(으)로 로그인되었습니다!`);
          navigate('/');
        }
      } else {
        // 일반 로그인
        localStorage.setItem('userRole', 'member');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isSystemAdmin', 'false');
        toast.success('로그인 성공!');
        navigate('/');
      }
    }, 1000);
  };

  const handleTestLogin = (account: typeof TEST_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowTestAccounts(false);
    toast.info(`${account.role} 계정이 입력되었습니다. 로그인 버튼을 눌러주세요.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-stone-100 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img 
            src="/logo.svg" 
            alt="모임" 
            className="w-16 h-16 mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold text-stone-900">모임</h1>
          <p className="text-stone-500 mt-1">일정, 회비, 스토리를 한 곳에서</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="pl-10 h-12 bg-white border-stone-200 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  className="pl-10 pr-10 h-12 bg-white border-stone-200 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label htmlFor="remember" className="text-sm text-stone-600 cursor-pointer">
                  로그인 유지
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700">
                비밀번호 찾기
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium rounded-xl"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* Test Account Button */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTestAccounts(true)}
              className="w-full h-10 border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 rounded-xl"
            >
              🧪 테스트 계정으로 로그인
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-stone-600">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
              회원가입
            </Link>
          </p>

          {/* Guest Browse */}
          <div className="mt-4 text-center">
            <Link 
              to="/explore" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-600 hover:text-orange-600 bg-stone-100 hover:bg-orange-50 rounded-full transition-colors"
            >
              🔍 로그인 없이 모임 둘러보기
            </Link>
          </div>
        </div>
      </div>

      {/* Test Accounts Dialog */}
      <Dialog open={showTestAccounts} onOpenChange={setShowTestAccounts}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>테스트 계정 선택</DialogTitle>
            <DialogDescription>
              각 역할별로 다른 기능을 확인해보세요
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {/* 시스템 관리자 (분리) */}
            <div className="pb-2 mb-2 border-b border-stone-200">
              <p className="text-xs text-stone-500 mb-2">🛡️ 시스템 관리</p>
              {TEST_ACCOUNTS.filter(a => a.isSystem).map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleTestLogin(account)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-red-200 hover:border-red-400 hover:bg-red-50 transition-colors text-left"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.color}`}>
                    <account.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-stone-900">{account.role}</p>
                      <Badge className="bg-red-500 text-white text-[10px]">ADMIN</Badge>
                    </div>
                    <p className="text-xs text-stone-500">{account.email}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* 일반 테스트 계정 */}
            <p className="text-xs text-stone-500 mb-2">👤 모임 역할</p>
            {TEST_ACCOUNTS.filter(a => !a.isSystem).map((account) => (
              <button
                key={account.id}
                onClick={() => handleTestLogin(account)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.color}`}>
                  <account.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-stone-900">{account.role}</p>
                  <p className="text-xs text-stone-500">{account.email}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="space-y-1 text-center">
            <p className="text-xs text-stone-400">
              일반 계정 비밀번호: <code className="bg-stone-100 px-1 rounded">test1234</code>
            </p>
            <p className="text-xs text-stone-400">
              관리자 비밀번호: <code className="bg-red-100 px-1 rounded">admin1234</code>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
