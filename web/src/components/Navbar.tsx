import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import { useUserStore } from '@/stores';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUserStore();

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/birth-input', label: '八字排盘' },
    { path: '/chat', label: 'AI对话' },
    { path: '/report', label: '命理报告' },
    { path: '/community', label: '社区' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-dark" />
            </motion.div>
            <span className="font-serif text-xl font-bold text-gradient-gold">
              灵犀命理
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-1 text-sm font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-gold'
                    : 'text-cream/80 hover:text-gold'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-dark" />
                  </div>
                  <span className="text-sm text-cream">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5 text-cream/60 hover:text-gold" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-cream" />
            ) : (
              <Menu className="w-6 h-6 text-cream" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-gold/20 text-gold'
                        : 'text-cream/80 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 mt-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/5"
                      >
                        <User className="w-5 h-5" />
                        <span>{user?.username}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-left hover:bg-white/5"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>退出登录</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-white/5"
                      >
                        登录
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="block px-4 py-3 mt-2 text-center btn-primary"
                      >
                        注册
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}