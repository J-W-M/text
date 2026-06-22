import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '@/stores';
import { Loading } from '@/components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error, setError } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }

    await login(email, password);
    
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gold to-primary 
                       flex items-center justify-center shadow-glow mb-4"
          >
            <Sparkles className="w-8 h-8 text-dark" />
          </motion.div>
          <h1 className="font-serif text-3xl text-gradient-gold mb-2">灵犀命理</h1>
          <p className="text-cream/60">登录您的账户</p>
        </div>

        {/* 登录表单 */}
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱 */}
            <div>
              <label className="block text-cream/70 mb-2">邮箱地址</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* 密码 */}
            <div>
              <label className="block text-cream/70 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* 记住密码 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-cream/60 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-cream/30 bg-white/5" />
                记住密码
              </label>
              <Link to="/forgot-password" className="text-gold text-sm hover:underline">
                忘记密码？
              </Link>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary ripple w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loading text="" />
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>登录</span>
                </>
              )}
            </button>
          </form>

          {/* 分隔线 */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-cream/40 text-sm">或</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* 注册链接 */}
          <div className="text-center">
            <p className="text-cream/60 text-sm mb-2">还没有账户？</p>
            <Link to="/register" className="btn-secondary ripple w-full">
              创建账户
            </Link>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-cream/40 text-xs">
          <Link to="/" className="hover:text-gold transition-colors">返回首页</Link>
        </div>
      </motion.div>
    </div>
  );
}