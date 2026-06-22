import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 通用请求方法
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient(config);
  return response.data;
};

// API服务
export const api = {
  // 用户相关
  auth: {
    login: (email: string, password: string) =>
      request({ method: 'POST', url: '/auth/login', data: { email, password } }),
    register: (username: string, email: string, password: string) =>
      request({ method: 'POST', url: '/auth/register', data: { username, email, password } }),
    logout: () => request({ method: 'POST', url: '/auth/logout' }),
    getProfile: () => request({ method: 'GET', url: '/auth/profile' }),
    updateProfile: (data: Record<string, unknown>) =>
      request({ method: 'PUT', url: '/auth/profile', data }),
  },

  // 命理相关
  fortune: {
    calculateBaZi: (birthData: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      gender: string;
      location: string;
    }) => request({ method: 'POST', url: '/fortune/bazi', data: birthData }),

    getFiveElements: (baziId: string) =>
      request({ method: 'GET', url: `/fortune/five-elements/${baziId}` }),

    getDaYun: (baziId: string) =>
      request({ method: 'GET', url: `/fortune/dayun/${baziId}` }),

    getLiuNian: (baziId: string, year: number) =>
      request({ method: 'GET', url: `/fortune/liunian/${baziId}/${year}` }),

    generateReport: (type: string, data: Record<string, unknown>) =>
      request({ method: 'POST', url: '/fortune/report', data: { type, ...data } }),

    getReports: () => request({ method: 'GET', url: '/fortune/reports' }),

    getReportById: (id: string) =>
      request({ method: 'GET', url: `/fortune/report/${id}` }),
  },

  // AI对话相关
  chat: {
    sendMessage: (message: string, conversationId?: string) =>
      request({
        method: 'POST',
        url: '/chat/message',
        data: { message, conversationId },
      }),

    getConversations: () => request({ method: 'GET', url: '/chat/conversations' }),

    getConversation: (id: string) =>
      request({ method: 'GET', url: `/chat/conversation/${id}` }),

    deleteConversation: (id: string) =>
      request({ method: 'DELETE', url: `/chat/conversation/${id}` }),
  },

  // 社区相关
  community: {
    getPosts: (page = 1, limit = 10) =>
      request({ method: 'GET', url: '/community/posts', params: { page, limit } }),

    getPost: (id: string) =>
      request({ method: 'GET', url: `/community/post/${id}` }),

    createPost: (data: { title: string; content: string; tags: string[] }) =>
      request({ method: 'POST', url: '/community/post', data }),

    likePost: (id: string) =>
      request({ method: 'POST', url: `/community/post/${id}/like` }),

    commentPost: (id: string, content: string) =>
      request({ method: 'POST', url: `/community/post/${id}/comment`, data: { content } }),
  },

  // 用户中心
  user: {
    getBadges: () => request({ method: 'GET', url: '/user/badges' }),
    getPoints: () => request({ method: 'GET', url: '/user/points' }),
    updateAvatar: (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return request({
        method: 'POST',
        url: '/user/avatar',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },
};

export default api;