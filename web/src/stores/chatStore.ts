import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  
  // Actions
  createConversation: () => string;
  setCurrentConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
  deleteConversation: (id: string) => void;
  clearConversations: () => void;
  setLoading: (loading: boolean) => void;
  getCurrentConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,

  createConversation: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: newConversation.id,
    }));
    
    return newConversation.id;
  },

  setCurrentConversation: (id) => set({ currentConversationId: id }),

  addMessage: (conversationId, message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date().toISOString(),
              title: conv.messages.length === 0 ? message.content.slice(0, 20) + '...' : conv.title,
            }
          : conv
      ),
    }));
  },

  updateMessage: (conversationId, messageId, content) => {
    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === messageId ? { ...msg, content, isTyping: false } : msg
              ),
            }
          : conv
      ),
    }));
  },

  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter(conv => conv.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
    }));
  },

  clearConversations: () => set({ conversations: [], currentConversationId: null }),

  setLoading: (isLoading) => set({ isLoading }),

  getCurrentConversation: () => {
    const state = get();
    return state.conversations.find(conv => conv.id === state.currentConversationId);
  },
}));