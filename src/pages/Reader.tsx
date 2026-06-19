import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, List, Type, Home, Clock, CheckCircle } from 'lucide-react';
import { useUserStore, getChapter, isChapterPurchased } from '@/store/useUserStore';
import { bookChapters } from '@/data/mockData';
import UnlockModal from '@/components/UnlockModal';
import BigButton from '@/components/BigButton';
import BigModal from '@/components/BigModal';
import ProgressBar from '@/components/ProgressBar';

const fontSizeMap = {
  large: 'text-2xl leading-loose',
  xlarge: 'text-3xl leading-loose',
  xxlarge: 'text-4xl leading-relaxed',
};

export default function Reader() {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();
  
  const { books, settings, updateBookProgress, setLastReadBook, balance, familyApprovalRequests } = useUserStore();
  
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);

  const book = books.find((b) => b.id === bookId);
  const currentChapterId = chapterId ? parseInt(chapterId) : 1;
  const chapter = getChapter(bookId || '', currentChapterId);
  const chapters = bookChapters[bookId || ''] || [];
  
  const isPurchased = book ? book.purchasedChapters.includes(currentChapterId) : false;
  const isFree = chapter?.isFree || false;
  const canRead = isPurchased || isFree;

  const pendingTargetChapter = pendingChapter ? getChapter(bookId || '', pendingChapter) : null;
  const pendingRequest = pendingChapter
    ? familyApprovalRequests.find(
        (r) => r.bookId === bookId && r.chapterId === pendingChapter && r.status === 'pending'
      )
    : null;

  useEffect(() => {
    if (bookId && currentChapterId && canRead) {
      updateBookProgress(bookId, currentChapterId);
      setLastReadBook(bookId);
    }
  }, [bookId, currentChapterId, canRead, updateBookProgress, setLastReadBook]);

  const goToChapter = (chId: number) => {
    if (chId < 1 || chId > chapters.length) return;
    
    const ch = getChapter(bookId || '', chId);
    const purchased = book?.purchasedChapters.includes(chId);
    
    if (ch?.isFree || purchased) {
      navigate(`/read/${bookId}/chapter/${chId}`);
      setShowChapters(false);
    } else {
      setPendingChapter(chId);
      setShowUnlockModal(true);
    }
  };

  const handlePrevChapter = () => {
    goToChapter(currentChapterId - 1);
  };

  const handleNextChapter = () => {
    goToChapter(currentChapterId + 1);
  };

  const handleUnlockSuccess = () => {
    if (pendingChapter) {
      navigate(`/read/${bookId}/chapter/${pendingChapter}`);
      setPendingChapter(null);
      setShowUnlockModal(false);
    }
  };

  const handleFontSizeChange = (size: 'large' | 'xlarge' | 'xxlarge') => {
    useUserStore.getState().updateSettings({ fontSize: size });
  };

  if (!book || !chapter) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-2xl text-amber-700">未找到这本书</p>
      </div>
    );
  }

  const displayChapter = pendingTargetChapter || chapter;
  const displayPrice = pendingTargetChapter?.price ?? chapter.price;
  const displayTitle = pendingTargetChapter?.title ?? chapter.title;

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="sticky top-0 z-10 bg-amber-50/95 backdrop-blur-sm border-b-2 border-amber-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-3 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
            aria-label="返回首页"
          >
            <Home size={32} strokeWidth={2} />
          </button>
          
          <div className="text-center flex-1 px-4">
            <h2 className="text-2xl font-bold text-amber-900">{book.title}</h2>
            <p className="text-lg text-amber-700">{chapter.title}</p>
          </div>
          
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-3 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
            aria-label="菜单"
          >
            <List size={32} strokeWidth={2} />
          </button>
        </div>
      </header>

      {showMenu && (
        <div className="absolute top-20 right-6 z-20 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-4 w-80">
          <div className="space-y-4">
            <button
              onClick={() => { setShowChapters(true); setShowMenu(false); }}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50 transition-colors"
            >
              <List size={28} className="text-amber-600" />
              <span className="text-xl font-bold text-amber-900">章节目录</span>
            </button>
            
            <div className="border-t-2 border-amber-100 pt-4">
              <p className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-3">
                <Type size={28} />
                字体大小
              </p>
              <div className="flex gap-3">
                {(['large', 'xlarge', 'xxlarge'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`flex-1 py-3 rounded-xl text-lg font-bold transition-colors ${
                      settings.fontSize === size
                        ? 'bg-orange-500 text-white'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                  >
                    {size === 'large' ? '大' : size === 'xlarge' ? '很大' : '特别大'}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-amber-100 pt-4">
              <p className="text-lg text-amber-700">
                余额：<span className="font-bold text-orange-500">{balance} 书币</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex">
        <button
          onClick={handlePrevChapter}
          disabled={currentChapterId <= 1}
          className="w-24 flex items-center justify-center text-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="上一章"
        >
          <ChevronLeft size={48} strokeWidth={2} />
        </button>

        <div className="flex-1 overflow-y-auto py-10 px-8">
          <div className="max-w-3xl mx-auto">
            {canRead ? (
              <article className={`${fontSizeMap[settings.fontSize]} text-amber-900`}>
                <h1 className="text-3xl font-bold mb-10 text-center">{chapter.title}</h1>
                <div className="space-y-6">
                  {chapter.content.split('\n\n').map((para, idx) => (
                    <p key={idx} className="indent-8">
                      {para}
                    </p>
                  ))}
                </div>
              </article>
            ) : pendingRequest ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock size={64} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-amber-900 mb-4">等待家属确认</h2>
                <p className="text-2xl text-amber-700 mb-2">{chapter.title}</p>
                <p className="text-xl text-amber-600 mb-10">
                  已向家属发起申请，请耐心等待...
                </p>
                <div className="bg-amber-50 rounded-2xl p-6 max-w-md mx-auto mb-10">
                  <p className="text-lg text-amber-700 mb-2">申请时间</p>
                  <p className="text-xl font-bold text-amber-900">
                    {new Date(pendingRequest.requestTime).toLocaleString('zh-CN')}
                  </p>
                </div>
                <BigButton
                  variant="secondary"
                  size="large"
                  onClick={() => setShowUnlockModal(true)}
                  className="max-w-md mx-auto"
                >
                  查看申请详情
                </BigButton>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-amber-200 flex items-center justify-center">
                  <List size={64} className="text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-amber-900 mb-4">本章需要解锁</h2>
                <p className="text-2xl text-amber-700 mb-2">{chapter.title}</p>
                <p className="text-5xl font-bold text-orange-500 mb-10">{chapter.price} 书币</p>
                <BigButton
                  variant="primary"
                  size="xlarge"
                  onClick={() => { setPendingChapter(currentChapterId); setShowUnlockModal(true); }}
                  className="max-w-md mx-auto"
                >
                  解锁本章
                </BigButton>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleNextChapter}
          disabled={currentChapterId >= chapters.length}
          className="w-24 flex items-center justify-center text-amber-400 hover:text-amber-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="下一章"
        >
          <ChevronRight size={48} strokeWidth={2} />
        </button>
      </main>

      <footer className="border-t-2 border-amber-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between text-lg text-amber-700 mb-3">
            <span>第 {currentChapterId} 章</span>
            <span>共 {chapters.length} 章</span>
          </div>
          <ProgressBar value={currentChapterId} max={chapters.length} />
        </div>
      </footer>

      <UnlockModal
        isOpen={showUnlockModal}
        onClose={() => { setShowUnlockModal(false); setPendingChapter(null); }}
        bookId={bookId || ''}
        bookTitle={book.title}
        chapterId={pendingChapter || currentChapterId}
        chapterTitle={displayTitle}
        price={displayPrice}
        onSuccess={handleUnlockSuccess}
        hasPendingRequest={!!pendingRequest}
        requestStatus={pendingRequest?.status}
      />

      <BigModal
        isOpen={showChapters}
        onClose={() => setShowChapters(false)}
        title="章节目录"
      >
        <div className="space-y-3">
          {chapters.map((ch) => {
            const purchased = book.purchasedChapters.includes(ch.id);
            const isCurrent = ch.id === currentChapterId;
            const hasPending = familyApprovalRequests.some(
              (r) => r.bookId === bookId && r.chapterId === ch.id && r.status === 'pending'
            );
            
            return (
              <button
                key={ch.id}
                onClick={() => goToChapter(ch.id)}
                className={`w-full text-left px-6 py-5 rounded-xl text-2xl font-bold transition-colors ${
                  isCurrent
                    ? 'bg-orange-500 text-white'
                    : ch.isFree || purchased
                    ? 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                    : 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{ch.title}</span>
                  <div className="flex items-center gap-3">
                    {hasPending && (
                      <span className="text-lg text-amber-500 flex items-center gap-1">
                        <Clock size={20} />
                        待确认
                      </span>
                    )}
                    {!ch.isFree && !purchased && !hasPending && (
                      <span className="text-xl text-orange-500">{ch.price}书币</span>
                    )}
                    {purchased && (
                      <span className="text-xl text-green-500">已购</span>
                    )}
                    {ch.isFree && (
                      <span className="text-xl text-green-500">免费</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </BigModal>
    </div>
  );
}
