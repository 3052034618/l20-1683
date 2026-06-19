import { BookOpen, Library, Receipt, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import BigButton from '@/components/BigButton';

export default function Home() {
  const navigate = useNavigate();
  const { balance, lastReadBookId, books } = useUserStore();

  const handleContinue = () => {
    if (lastReadBookId) {
      const book = books.find((b) => b.id === lastReadBookId);
      if (book) {
        const chapterId = book.lastReadChapter || 1;
        navigate(`/read/${lastReadBookId}/chapter/${chapterId}`);
      } else {
        navigate('/books');
      }
    } else {
      navigate('/books');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="px-10 py-8 bg-gradient-to-b from-amber-100 to-amber-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-amber-900 mb-3">银发悦读</h1>
            <p className="text-2xl text-amber-700">字大清晰，看书不累</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-2xl shadow-lg">
              <span className="text-2xl">我的书币：</span>
              <span className="text-4xl font-bold">{balance}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-10 py-8 gap-8 max-w-4xl mx-auto w-full">
        <BigButton
          variant="primary"
          size="xlarge"
          icon={<BookOpen size={56} strokeWidth={2} />}
          fullWidth
          onClick={handleContinue}
          className="h-40"
        >
          继续读
        </BigButton>

        <BigButton
          variant="secondary"
          size="xlarge"
          icon={<Library size={56} strokeWidth={2} />}
          fullWidth
          onClick={() => navigate('/books')}
          className="h-40"
        >
          我的书
        </BigButton>

        <BigButton
          variant="secondary"
          size="xlarge"
          icon={<Receipt size={56} strokeWidth={2} />}
          fullWidth
          onClick={() => navigate('/records')}
          className="h-40"
        >
          消费记录
        </BigButton>
      </main>

      <footer className="px-10 py-6 text-center">
        <button
          onClick={() => navigate('/family/verify')}
          className="inline-flex items-center gap-3 px-8 py-4 text-xl text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-xl transition-colors"
        >
          <Settings size={28} />
          <span>家属管理</span>
        </button>
      </footer>
    </div>
  );
}
