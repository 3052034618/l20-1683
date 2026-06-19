import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserData, PurchaseRecord, Book, UserSettings, FamilyApprovalRequest } from '@/types';
import { initialUserData, bookChapters } from '@/data/mockData';

interface UserStore extends UserData {
  setBalance: (balance: number) => void;
  addBalance: (amount: number) => void;
  purchaseChapter: (bookId: string, chapterId: number, price: number, bookTitle: string, chapterTitle: string, approvedBy?: 'user' | 'family') => boolean;
  updateBookProgress: (bookId: string, chapterId: number) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setFamilyPassword: (password: string) => void;
  getDailySpent: () => number;
  resetDailySpentIfNeeded: () => void;
  setLastReadBook: (bookId: string) => void;
  requestFamilyApproval: (bookId: string, chapterId: number, price: number, bookTitle: string, chapterTitle: string) => string;
  approveFamilyRequest: (requestId: string) => boolean;
  rejectFamilyRequest: (requestId: string) => void;
  getPendingFamilyRequests: () => FamilyApprovalRequest[];
  getRequestById: (requestId: string) => FamilyApprovalRequest | undefined;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialUserData,

      setBalance: (balance) => set({ balance }),

      addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),

      purchaseChapter: (bookId, chapterId, price, bookTitle, chapterTitle, approvedBy = 'user') => {
        const state = get();
        state.resetDailySpentIfNeeded();

        const currentState = get();
        
        if (currentState.balance < price) {
          return false;
        }

        if (currentState.dailySpent + price > currentState.settings.dailyLimit) {
          return false;
        }

        const newRecord: PurchaseRecord = {
          id: `record-${Date.now()}`,
          bookId,
          bookTitle,
          chapterId,
          chapterTitle,
          price,
          timestamp: Date.now(),
          approvedBy,
        };

        const updatedBooks = currentState.books.map((book) => {
          if (book.id === bookId) {
            return {
              ...book,
              purchasedChapters: [...book.purchasedChapters, chapterId],
              lastReadChapter: chapterId,
            };
          }
          return book;
        });

        set({
          balance: currentState.balance - price,
          books: updatedBooks,
          records: [newRecord, ...currentState.records],
          dailySpent: currentState.dailySpent + price,
        });

        return true;
      },

      updateBookProgress: (bookId, chapterId) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, lastReadChapter: chapterId } : book
          ),
        }));
      },

      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },

      setFamilyPassword: (password) => set({ familyPassword: password }),

      getDailySpent: () => {
        const state = get();
        state.resetDailySpentIfNeeded();
        return get().dailySpent;
      },

      resetDailySpentIfNeeded: () => {
        const today = new Date().toLocaleDateString('zh-CN');
        const state = get();
        if (state.lastSpentDate !== today) {
          set({
            dailySpent: 0,
            lastSpentDate: today,
          });
        }
      },

      setLastReadBook: (bookId) => set({ lastReadBookId: bookId }),

      requestFamilyApproval: (bookId, chapterId, price, bookTitle, chapterTitle) => {
        const request: FamilyApprovalRequest = {
          id: `req-${Date.now()}`,
          bookId,
          chapterId,
          price,
          bookTitle,
          chapterTitle,
          status: 'pending',
          requestTime: Date.now(),
        };

        set((state) => ({
          familyApprovalRequests: [request, ...state.familyApprovalRequests],
        }));

        return request.id;
      },

      approveFamilyRequest: (requestId) => {
        const state = get();
        const request = state.familyApprovalRequests.find((r) => r.id === requestId);
        
        if (!request || request.status !== 'pending') {
          return false;
        }

        state.resetDailySpentIfNeeded();
        const currentState = get();

        if (currentState.balance < request.price) {
          return false;
        }

        if (currentState.dailySpent + request.price > currentState.settings.dailyLimit) {
          return false;
        }

        const success = currentState.purchaseChapter(
          request.bookId,
          request.chapterId,
          request.price,
          request.bookTitle,
          request.chapterTitle,
          'family'
        );

        if (success) {
          set((s) => ({
            familyApprovalRequests: s.familyApprovalRequests.map((r) =>
              r.id === requestId
                ? { ...r, status: 'approved' as const, handledTime: Date.now() }
                : r
            ),
          }));
        }

        return success;
      },

      rejectFamilyRequest: (requestId) => {
        set((state) => ({
          familyApprovalRequests: state.familyApprovalRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'rejected' as const, handledTime: Date.now() }
              : r
          ),
        }));
      },

      getPendingFamilyRequests: () => {
        return get().familyApprovalRequests.filter((r) => r.status === 'pending');
      },

      getRequestById: (requestId) => {
        return get().familyApprovalRequests.find((r) => r.id === requestId);
      },
    }),
    {
      name: 'yinyue-reader-storage',
    }
  )
);

export const getChapter = (bookId: string, chapterId: number) => {
  const chapters = bookChapters[bookId];
  if (!chapters) return null;
  return chapters.find((c) => c.id === chapterId) || null;
};

export const getBookById = (bookId: string): Book | undefined => {
  return useUserStore.getState().books.find((b) => b.id === bookId);
};

export const isChapterPurchased = (bookId: string, chapterId: number): boolean => {
  const book = getBookById(bookId);
  if (!book) return false;
  return book.purchasedChapters.includes(chapterId);
};
