import { BookOpen, Library, Receipt, Settings, Bell, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import BigButton from '@/components/BigButton';
import BigModal from '@/components/BigModal';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const { balance, lastReadBookId, books, familyApprovalRequests } = useUserStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingRequests = familyApprovalRequests.filter((r) => r.status === 'pending');
  const recentRequests = familyApprovalRequests.slice(0, 5);

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-4 rounded-2xl bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              <Bell size={36} className="text-amber-700" />
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-red-500 text-white text-xl font-bold flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </button>
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

      <BigModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="申请通知"
      >
        <div className="space-y-4">
          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={64} className="mx-auto text-amber-300 mb-4" />
              <p className="text-2xl text-amber-600">暂无申请记录</p>
            </div>
          ) : (
            recentRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => {
                  setShowNotifications(false);
                  navigate(`/read/${request.bookId}/chapter/${request.chapterId}`);
                }}
                className="w-full p-5 bg-amber-50 rounded-2xl text-left hover:bg-amber-100 transition-colors border-2 border-transparent hover:border-amber-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-amber-900 mb-2">
                      {request.bookTitle}
                    </p>
                    <p className="text-xl text-amber-700 mb-3">
                      {request.chapterTitle}
                    </p>
                    <div className="flex items-center gap-6 text-lg text-amber-600">
                      <span className="flex items-center gap-2">
                        <Clock size={20} />
                        {new Date(request.requestTime).toLocaleString('zh-CN')}
                      </span>
                      <span className="text-2xl font-bold text-orange-500">
                        {request.price} 书币
                      </span>
                    </div>
                  </div>
                  <div className="ml-6">
                    {request.status === 'pending' ? (
                      <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xl font-bold flex items-center gap-2">
                        <Clock size={24} />
                        待确认
                      </span>
                    ) : request.status === 'approved' ? (
                      <span className="px-4 py-2 bg-green-100 text-green-600 rounded-xl text-xl font-bold flex items-center gap-2">
                        <CheckCircle size={24} />
                        已同意
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xl font-bold flex items-center gap-2">
                        <XCircle size={24} />
                        已拒绝
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </BigModal>
    </div>
  );
}
