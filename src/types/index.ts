export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  totalChapters: number;
  lastReadChapter: number;
  purchasedChapters: number[];
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
  price: number;
  isFree: boolean;
}

export interface PurchaseRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  chapterId: number;
  chapterTitle: string;
  price: number;
  timestamp: number;
}

export interface UserSettings {
  fontSize: 'large' | 'xlarge' | 'xxlarge';
  dailyLimit: number;
  autoUnlock: boolean;
  askFamilyAbove: number;
  rememberPerBook: boolean;
}

export interface UserData {
  balance: number;
  books: Book[];
  records: PurchaseRecord[];
  settings: UserSettings;
  familyPassword: string;
  dailySpent: number;
  lastSpentDate: string;
  lastReadBookId: string | null;
}
