import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 五行数据
export interface FiveElements {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

// 八字数据
export interface BaZi {
  yearPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  monthPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  dayPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
  hourPillar: {
    heavenlyStem: string;
    earthlyBranch: string;
  };
}

// 大运
export interface DaYun {
  id: string;
  startAge: number;
  endAge: number;
  heavenlyStem: string;
  earthlyBranch: string;
  description: string;
}

// 流年
export interface LiuNian {
  id: string;
  year: number;
  heavenlyStem: string;
  earthlyBranch: string;
  description: string;
  fortune: 'good' | 'neutral' | 'bad';
}

// 命理报告
export interface FortuneReport {
  id: string;
  title: string;
  type: 'bazi' | 'ziwei' | 'qimen' | 'liuyao';
  createdAt: string;
  summary: string;
  sections: {
    title: string;
    content: string;
  }[];
}

interface FortuneState {
  // 生辰信息
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: 'male' | 'female';
    location: string;
  } | null;
  
  // 八字数据
  baZi: BaZi | null;
  
  // 五行分布
  fiveElements: FiveElements | null;
  
  // 大运
  daYunList: DaYun[];
  
  // 流年
  liuNianList: LiuNian[];
  
  // 报告列表
  reports: FortuneReport[];
  
  // 当前选中的大运索引
  currentDaYunIndex: number;
  
  // 当前选中的流年
  currentLiuNian: LiuNian | null;
  
  // 加载状态
  isLoading: boolean;
  
  // Actions
  setBirthInfo: (info: FortuneState['birthInfo']) => void;
  setBaZi: (baZi: BaZi) => void;
  setFiveElements: (elements: FiveElements) => void;
  setDaYunList: (list: DaYun[]) => void;
  setLiuNianList: (list: LiuNian[]) => void;
  addReport: (report: FortuneReport) => void;
  setCurrentDaYunIndex: (index: number) => void;
  setCurrentLiuNian: (liuNian: LiuNian | null) => void;
  setLoading: (loading: boolean) => void;
  calculateBaZi: () => Promise<void>;
  clearData: () => void;
}

export const useFortuneStore = create<FortuneState>()(
  persist(
    (set, get) => ({
      birthInfo: null,
      baZi: null,
      fiveElements: null,
      daYunList: [],
      liuNianList: [],
      reports: [],
      currentDaYunIndex: 0,
      currentLiuNian: null,
      isLoading: false,

      setBirthInfo: (birthInfo) => set({ birthInfo }),
      setBaZi: (baZi) => set({ baZi }),
      setFiveElements: (fiveElements) => set({ fiveElements }),
      setDaYunList: (daYunList) => set({ daYunList }),
      setLiuNianList: (liuNianList) => set({ liuNianList }),
      addReport: (report) => set((state) => ({ 
        reports: [report, ...state.reports] 
      })),
      setCurrentDaYunIndex: (currentDaYunIndex) => set({ currentDaYunIndex }),
      setCurrentLiuNian: (currentLiuNian) => set({ currentLiuNian }),
      setLoading: (isLoading) => set({ isLoading }),

      calculateBaZi: async () => {
        const { birthInfo } = get();
        if (!birthInfo) return;

        set({ isLoading: true });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Mock data
          const mockBaZi: BaZi = {
            yearPillar: { heavenlyStem: '甲', earthlyBranch: '子' },
            monthPillar: { heavenlyStem: '丙', earthlyBranch: '寅' },
            dayPillar: { heavenlyStem: '戊', earthlyBranch: '辰' },
            hourPillar: { heavenlyStem: '庚', earthlyBranch: '午' },
          };

          const mockFiveElements: FiveElements = {
            wood: 25,
            fire: 20,
            earth: 18,
            metal: 15,
            water: 22,
          };

          const mockDaYunList: DaYun[] = [
            { id: '1', startAge: 8, endAge: 17, heavenlyStem: '乙', earthlyBranch: '丑', description: '早年运势平稳' },
            { id: '2', startAge: 18, endAge: 27, heavenlyStem: '丁', earthlyBranch: '卯', description: '学业事业有成' },
            { id: '3', startAge: 28, endAge: 37, heavenlyStem: '己', earthlyBranch: '巳', description: '事业上升期' },
            { id: '4', startAge: 38, endAge: 47, heavenlyStem: '辛', earthlyBranch: '未', description: '事业稳定发展' },
            { id: '5', startAge: 48, endAge: 57, heavenlyStem: '癸', earthlyBranch: '酉', description: '财运亨通' },
          ];

          const mockLiuNianList: LiuNian[] = [
            { id: '1', year: 2024, heavenlyStem: '甲', earthlyBranch: '辰', description: '龙年运势', fortune: 'good' },
            { id: '2', year: 2025, heavenlyStem: '乙', earthlyBranch: '巳', description: '蛇年运势', fortune: 'neutral' },
            { id: '3', year: 2026, heavenlyStem: '丙', earthlyBranch: '午', description: '马年运势', fortune: 'good' },
            { id: '4', year: 2027, heavenlyStem: '丁', earthlyBranch: '未', description: '羊年运势', fortune: 'neutral' },
            { id: '5', year: 2028, heavenlyStem: '戊', earthlyBranch: '申', description: '猴年运势', fortune: 'bad' },
          ];

          set({
            baZi: mockBaZi,
            fiveElements: mockFiveElements,
            daYunList: mockDaYunList,
            liuNianList: mockLiuNianList,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
        }
      },

      clearData: () => set({
        birthInfo: null,
        baZi: null,
        fiveElements: null,
        daYunList: [],
        liuNianList: [],
        currentDaYunIndex: 0,
        currentLiuNian: null,
      }),
    }),
    {
      name: 'fortune-storage',
      partialize: (state) => ({
        birthInfo: state.birthInfo,
        baZi: state.baZi,
        fiveElements: state.fiveElements,
        daYunList: state.daYunList,
        liuNianList: state.liuNianList,
        reports: state.reports,
      }),
    }
  )
);