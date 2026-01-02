import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

export function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    // 실제로는 API 호출
    setTimeout(() => {
      setIsLoading(false);
      toast.success('로그인 성공!');
      navigate('/');
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} 로그인은 준비 중입니다`);
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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-orange-50 via-white to-stone-100 text-stone-500">
                또는
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('카카오')}
              className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD800] border-none text-[#191919] font-medium rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.74 1.813 5.143 4.543 6.486-.146.537-.946 3.428-.978 3.664 0 0-.02.166.087.229.107.063.232.014.232.014.306-.043 3.54-2.314 4.103-2.713.655.097 1.33.147 2.013.147 5.523 0 10-3.463 10-7.714C22 6.463 17.523 3 12 3z"/>
              </svg>
              카카오로 시작하기
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('Google')}
              className="w-full h-12 bg-white hover:bg-stone-50 border-stone-200 text-stone-700 font-medium rounded-xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 시작하기
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-stone-600">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-medium">
              회원가입
            </Link>
          </p>

          {/* Guest Browse */}
          <div className="mt-4 text-center">
            <Link to="/explore" className="text-sm text-stone-500 hover:text-stone-700 underline">
              로그인 없이 둘러보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

