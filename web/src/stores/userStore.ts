import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePoints: (points: number) => void;
  addBadge: (badge: Badge) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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

      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const mockUser: User = {
            id: '1',
            username: email.split('@')[0],
            email,
            points: 1000,
            level: 5,
            badges: [
              {
                id: '1',
                name: '初入命理',
                description: '完成首次八字排盘',
                icon: '🌟',
                earnedAt: new Date().toISOString(),
              }
            ],
            createdAt: new Date().toISOString(),
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: '登录失败，请检查邮箱和密码', isLoading: false });
        }
      },

      register: async (username: string, email: string, _password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: Date.now().toString(),
            username,
            email,
            points: 100,
            level: 1,
            badges: [],
            createdAt: new Date().toISOString(),
          };
          
          set({ user: mockUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: '注册失败，请稍后重试', isLoading: false });
        }
      },

      logout: () => set({ 
        user: null, 
        profile: {}, 
        isAuthenticated: false,
        error: null 
      }),

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