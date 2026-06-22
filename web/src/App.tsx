import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components';
import {
  Home,
  BirthInput,
  Chat,
  Report,
  Login,
  Register,
  Profile,
  Community,
} from '@/pages';

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

// 路由内容组件
function RouteContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
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
        {/* 404页面 */}
        <Route
          path="*"
          element={
            <AnimatedPage>
              <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                  <h1 className="font-serif text-6xl text-gradient-gold mb-4">404</h1>
                  <p className="text-cream/60 mb-8">页面不存在</p>
                  <a href="/" className="btn-primary ripple">
                    返回首页
                  </a>
                </div>
              </div>
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
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