import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useUserStore } from '@/stores';
import { Navbar } from '@/components';
import {
  BirthInput,
  Chat,
  Report,
  Login,
  Register,
  Profile,
  Community,
} from '@/pages';

// 公开页面列表（无需登录可访问）
const publicPages = ['/login', '/register'];

// 页面切换动画配置
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// 动画页面包装器
function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

// 路由守卫组件
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 如果未登录且不是公开页面，跳转登录页
    if (!isAuthenticated && !publicPages.includes(location.pathname)) {
      navigate('/login', { replace: true });
    }
    // 如果已登录且访问登录/注册页，跳转首页
    if (isAuthenticated && publicPages.includes(location.pathname)) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // 未登录且不在公开页面，显示加载状态
  if (!isAuthenticated && !publicPages.includes(location.pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-cream">加载中...</div>
      </div>
    );
  }

  return <>{children}</>;
}

// 路由内容组件
function RouteContent() {
  const location = useLocation();
  const { isAuthenticated } = useUserStore();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 默认首页 = 登录页 */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AnimatedPage>
                <Profile />
              </AnimatedPage>
            ) : (
              <AnimatedPage>
                <Login />
              </AnimatedPage>
            )
          }
        />
        <Route
          path="/birth-input"
          element={
            <AnimatedPage>
              <BirthInput />
            </AnimatedPage>
          }
        />
        <Route
          path="/chat"
          element={
            <AnimatedPage>
              <Chat />
            </AnimatedPage>
          }
        />
        <Route
          path="/report"
          element={
            <AnimatedPage>
              <Report />
            </AnimatedPage>
          }
        />
        <Route
          path="/login"
          element={
            <AnimatedPage>
              <Login />
            </AnimatedPage>
          }
        />
        <Route
          path="/register"
          element={
            <AnimatedPage>
              <Register />
            </AnimatedPage>
          }
        />
        <Route
          path="/profile"
          element={
            <AnimatedPage>
              <Profile />
            </AnimatedPage>
          }
        />
        <Route
          path="/community"
          element={
            <AnimatedPage>
              <Community />
            </AnimatedPage>
          }
        />
        {/* 重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { checkAuth } = useUserStore();
  
  // 页面加载时验证登录状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-dark relative">
        {/* 全局背景装饰 */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-gold/5 to-transparent" />
        </div>

        {/* 导航栏 */}
        <Navbar />

        {/* 页面内容 */}
        <main className="relative">
          <RouteContent />
        </main>
      </div>
    </Router>
  );
}