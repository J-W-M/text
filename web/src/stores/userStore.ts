import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  points: number;
  level: number;
  badges: Badge[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserProfile {
  birthDate?: string;
  birthTime?: string;
  gender?: 'male' | 'female';
  location?: string;
  zodiac?: string;
  chineseZodiac?: string;
}

interface UserState {
  user: User | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string, phone?: string) => Promise<void>;
  logout: () => void;
  updatePoints: (points: number) => void;
  addBadge: (badge: Badge) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: {},
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setProfile: (profile) => set((state) => ({ 
        profile: { ...state.profile, ...profile } 
      })),

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            username,
            password,
          });
          
          const { token, user: userData } = response.data.data;
          
          // 保存Token
          localStorage.setItem('token', token);
          
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            nickname: userData.nickname,
            avatar: userData.avatar,
            points: userData.points || 0,
            level: userData.level || 1,
            badges: [],
            createdAt: userData.createdAt,
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message = error.response?.data?.message || '登录失败，请检查用户名和密码';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      register: async (username: string, password: string, email?: string, phone?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            username,
            password,
            email,
            phone,
          });
          
          const { token, user: userData } = response.data.data;
          
          // 保存Token
          localStorage.setItem('token', token);
          
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            nickname: userData.nickname,
            avatar: userData.avatar,
            points: 100, // 新用户赠送积分
            level: 1,
            badges: [],
            createdAt: userData.createdAt,
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message = error.response?.data?.message || '注册失败，请稍后重试';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ 
          user: null, 
          profile: {}, 
          isAuthenticated: false,
          error: null 
        });
      },

      updatePoints: (points) => set((state) => ({
        user: state.user ? { ...state.user, points: state.user.points + points } : null
      })),

      addBadge: (badge) => set((state) => ({
        user: state.user 
          ? { ...state.user, badges: [...state.user.badges, badge] }
          : null
      })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        
        try {
          const response = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userData = response.data.data;
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            nickname: userData.nickname,
            avatar: userData.avatar,
            points: userData.points || 0,
            level: userData.level || 1,
            badges: [],
            createdAt: userData.createdAt,
          };
          
          set({ user, isAuthenticated: true });
        } catch (error) {
          localStorage.removeItem('token');
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        profile: state.profile,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);