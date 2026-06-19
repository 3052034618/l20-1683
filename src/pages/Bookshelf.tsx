import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';

export default function Bookshelf() {
  const navigate = useNavigate();
  const { books, setLastReadBook } = useUserStore();

  const handleBookClick = (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setLastReadBook(bookId);
      const chapterId = book.lastReadChapter || 1;
      navigate(`/read/${bookId}/chapter/${chapterId}`);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <PageHeader title="我的书" showBack={true} />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <Card
                key={book.id}
                hoverable
                className="overflow-hidden"
                onClick={() => handleBookClick(book.id)}
              >
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ background: book.cover }}
                >
                  <BookOpen size={80} className="text-white/90" strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">{book.title}</h3>
                  <p className="text-xl text-amber-700 mb-4">{book.author}</p>
                  <div className="mb-3">
                    <div className="flex justify-between text-lg text-amber-700 mb-2">
                      <span>进度</span>
                      <span>
                        第 {book.lastReadChapter || 0} / {book.totalChapters} 章
                      </span>
                    </div>
                    <ProgressBar
                      value={book.lastReadChapter || 0}
                      max={book.totalChapters}
                    />
                  </div>
                  <p className="text-lg text-amber-600">
                    已购 {book.purchasedChapters.length} 章
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={100} className="mx-auto text-amber-300 mb-6" />
              <p className="text-2xl text-amber-600">还没有书，快去添加吧</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
