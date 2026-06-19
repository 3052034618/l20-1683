import type { Book, Chapter, UserData } from '@/types';

const generateChapterContent = (chapterNum: number, title: string): string => {
  const paragraphs = [
    `　　${title}，故事从这里开始。这是一个宁静的午后，阳光透过窗户洒在书桌上，主人公静静地坐在那里，思考着人生的种种。`,
    '　　窗外的树叶随风轻轻摇曳，发出沙沙的声响。远处传来几声鸟鸣，打破了这份宁静，却又让人感到更加安详。',
    '　　主人公缓缓站起身来，走到窗前，望着远方的山峦。那里有他童年的回忆，有他曾经的梦想，也有他无法忘记的人。',
    '　　"时间过得真快啊。"他轻声说道，语气中带着一丝感慨。一转眼，已经过去了这么多年，那些曾经以为永远不会忘记的事情，却在不知不觉中渐渐模糊。',
    '　　他摇了摇头，像是要把这些思绪都甩开。现在不是想这些的时候，他还有更重要的事情要做。',
    '　　桌上放着一封泛黄的信，那是很久以前收到的。他一直没有勇气打开，因为他知道，信里写的内容可能会改变他的一生。',
    '　　终于，他下定了决心，伸出手，慢慢拿起了那封信。信封上的字迹依然清晰，是他再熟悉不过的笔迹。',
    '　　深吸一口气，他拆开了信封。里面是一张泛黄的信纸，上面写满了密密麻麻的字。他逐字逐句地读着，眼眶渐渐湿润了。',
    '　　原来这么多年过去了，那个人一直都在。只是他不知道，或者说，他不敢知道。',
    '　　信的末尾写着一行字："如果你愿意，我会一直等你。" 看到这句话，他再也控制不住自己的泪水，任由它们滑落脸颊。',
  ];
  
  return paragraphs.join('\n\n');
};

const generateChapters = (bookId: string, count: number): Chapter[] => {
  const chapters: Chapter[] = [];
  const titles = [
    '第一章 初遇',
    '第二章 相识',
    '第三章 相知',
    '第四章 别离',
    '第五章 重逢',
    '第六章 风雨',
    '第七章 彩虹',
    '第八章 抉择',
    '第九章 归途',
    '第十章 相守',
    '第十一章 岁月',
    '第十二章 山河',
    '第十三章 星辰',
    '第十四章 朝暮',
    '第十五章 白首',
  ];
  
  for (let i = 1; i <= count; i++) {
    const title = titles[i - 1] || `第${i}章 无题`;
    const isFree = i <= 3;
    const price = isFree ? 0 : (i % 5 === 0 ? 5 : 3);
    
    chapters.push({
      id: i,
      title,
      content: generateChapterContent(i, title),
      price,
      isFree,
    });
  }
  
  return chapters;
};

export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: '岁月长河',
    author: '李明远',
    cover: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)',
    description: '一部关于时光与记忆的长篇小说，讲述了主人公跨越半个世纪的人生故事。从青春年少到白发苍苍，那些被岁月沉淀的情感，终将在记忆深处闪光。',
    totalChapters: 15,
    lastReadChapter: 1,
    purchasedChapters: [1, 2, 3],
  },
  {
    id: 'book-2',
    title: '山那边的云',
    author: '张晓风',
    cover: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    description: '乡村题材的温情小说，描绘了大山深处人们的生活与梦想。朴实的文字下，是对故乡最深沉的眷恋。',
    totalChapters: 12,
    lastReadChapter: 0,
    purchasedChapters: [],
  },
  {
    id: 'book-3',
    title: '海上明月',
    author: '王思远',
    cover: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)',
    description: '一部关于海洋与探险的小说，主人公在茫茫大海上寻找失落的宝藏，也寻找着真正的自己。',
    totalChapters: 10,
    lastReadChapter: 0,
    purchasedChapters: [],
  },
];

export const bookChapters: Record<string, Chapter[]> = {
  'book-1': generateChapters('book-1', 15),
  'book-2': generateChapters('book-2', 12),
  'book-3': generateChapters('book-3', 10),
};

const today = new Date().toISOString().split('T')[0];

export const initialUserData: UserData = {
  balance: 50,
  books: mockBooks,
  records: [
    {
      id: 'record-1',
      bookId: 'book-1',
      bookTitle: '岁月长河',
      chapterId: 1,
      chapterTitle: '第一章 初遇',
      price: 0,
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      id: 'record-2',
      bookId: 'book-1',
      bookTitle: '岁月长河',
      chapterId: 2,
      chapterTitle: '第二章 相识',
      price: 0,
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'record-3',
      bookId: 'book-1',
      bookTitle: '岁月长河',
      chapterId: 3,
      chapterTitle: '第三章 相知',
      price: 0,
      timestamp: Date.now() - 3600000,
    },
  ],
  settings: {
    fontSize: 'xlarge',
    dailyLimit: 20,
    autoUnlock: false,
    askFamilyAbove: 10,
    rememberPerBook: false,
  },
  familyPassword: '1234',
  dailySpent: 0,
  lastSpentDate: today,
  lastReadBookId: 'book-1',
  familyApprovalRequests: [],
};
