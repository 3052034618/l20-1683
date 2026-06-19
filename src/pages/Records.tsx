import { useMemo, useState } from 'react';
import { Receipt, Coins, Calendar, Filter, BarChart3, BookOpen } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';

type FilterType = 'all' | 'paid';

export default function Records() {
  const { records, balance, dailySpent, settings } = useUserStore();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let result = [...records];
    
    if (filterType === 'paid') {
      result = result.filter((r) => r.price > 0);
    }
    
    if (selectedBookId) {
      result = result.filter((r) => r.bookId === selectedBookId);
    }
    
    return result;
  }, [records, filterType, selectedBookId]);

  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof filteredRecords> = {};
    filteredRecords.forEach((record) => {
      const date = new Date(record.timestamp).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
    });
    return groups;
  }, [filteredRecords]);

  const bookStats = useMemo(() => {
    const stats: Record<string, { bookId: string; bookTitle: string; totalSpent: number; chapterCount: number; freeCount: number }> = {};
    records.forEach((record) => {
      if (!stats[record.bookId]) {
        stats[record.bookId] = {
          bookId: record.bookId,
          bookTitle: record.bookTitle,
          totalSpent: 0,
          chapterCount: 0,
          freeCount: 0,
        };
      }
      if (record.price > 0) {
        stats[record.bookId].totalSpent += record.price;
        stats[record.bookId].chapterCount += 1;
      } else {
        stats[record.bookId].freeCount += 1;
      }
    });
    return Object.values(stats).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [records]);

  const totalSpent = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + r.price, 0);
  }, [filteredRecords]);

  const totalPaidChapters = useMemo(() => {
    return filteredRecords.filter((r) => r.price > 0).length;
  }, [filteredRecords]);

  const dailyRemaining = Math.max(0, settings.dailyLimit - dailySpent);

  const uniqueBooks = useMemo(() => {
    const bookSet = new Set(records.map((r) => r.bookId));
    return Array.from(bookSet).map((bookId) => {
      const record = records.find((r) => r.bookId === bookId);
      return { bookId, bookTitle: record?.bookTitle || '' };
    });
  }, [records]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <PageHeader title="消费记录" showBack={true} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <Coins size={32} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xl text-amber-700">当前余额</p>
                  <p className="text-4xl font-bold text-orange-500">{balance}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                  <Calendar size={32} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xl text-amber-700">今日已消费</p>
                  <p className="text-4xl font-bold text-green-600">{dailySpent}</p>
                </div>
              </div>
              <ProgressBar value={dailySpent} max={settings.dailyLimit} color="green" />
              <p className="text-lg text-amber-600 mt-3">
                今日剩余额度：{dailyRemaining} 书币
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <Receipt size={32} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xl text-amber-700">
                    {filterType === 'paid' ? '付费消费' : '累计消费'}
                  </p>
                  <p className="text-4xl font-bold text-amber-900">{totalSpent}</p>
                </div>
              </div>
              <p className="text-lg text-amber-600">
                共 {totalPaidChapters} 个付费章节
              </p>
            </Card>
          </div>

          {bookStats.length > 0 && (
            <Card className="p-8 mb-10">
              <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
                <BarChart3 size={32} />
                按书名统计
              </h2>

              <div className="space-y-4">
                {bookStats.map((stat, index) => (
                  <button
                    key={stat.bookId}
                    onClick={() => setSelectedBookId(selectedBookId === stat.bookId ? null : stat.bookId)}
                    className={`w-full p-5 rounded-2xl text-left transition-all ${
                      selectedBookId === stat.bookId
                        ? 'bg-orange-100 border-2 border-orange-400'
                        : 'bg-amber-50 border-2 border-transparent hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-2xl font-bold text-amber-900">{stat.bookTitle}</p>
                          <p className="text-lg text-amber-700">
                            付费 {stat.chapterCount} 章 · 免费 {stat.freeCount} 章
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-orange-500">
                          {stat.totalSpent} 书币
                        </p>
                      </div>
                    </div>
                    <ProgressBar
                      value={stat.totalSpent}
                      max={bookStats[0]?.totalSpent || 1}
                    />
                  </button>
                ))}
              </div>

              {selectedBookId && (
                <p className="mt-4 text-center text-lg text-amber-600">
                  已筛选《{bookStats.find((s) => s.bookId === selectedBookId)?.bookTitle}》
                  <button
                    onClick={() => setSelectedBookId(null)}
                    className="ml-3 text-orange-500 font-bold underline"
                  >
                    清除筛选
                  </button>
                </p>
              )}
            </Card>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-amber-900 flex items-center gap-3">
              <Receipt size={36} />
              购买记录
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setFilterType('all')}
                className={`px-6 py-3 rounded-xl text-xl font-bold transition-colors ${
                  filterType === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterType('paid')}
                className={`px-6 py-3 rounded-xl text-xl font-bold transition-colors ${
                  filterType === 'paid'
                    ? 'bg-orange-500 text-white'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                仅付费
              </button>
            </div>
          </div>

          {Object.keys(groupedRecords).length === 0 ? (
            <Card className="p-16 text-center">
              <Receipt size={80} className="mx-auto text-amber-300 mb-6" />
              <p className="text-2xl text-amber-600">
                {filterType === 'paid' ? '还没有付费记录' : '还没有消费记录'}
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedRecords).map(([date, dayRecords]) => (
                <div key={date}>
                  <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-3">
                    <Calendar size={28} />
                    {date}
                    <span className="text-lg font-normal text-amber-600">
                      ({dayRecords.filter((r) => r.price > 0).length} 笔付费)
                    </span>
                  </h3>
                  <Card>
                    <div className="divide-y-2 divide-amber-100">
                      {dayRecords.map((record) => (
                        <div
                          key={record.id}
                          className="p-6 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="text-2xl font-bold text-amber-900 mb-2">
                              {record.bookTitle}
                            </p>
                            <p className="text-xl text-amber-700">
                              {record.chapterTitle}
                            </p>
                            <p className="text-lg text-amber-500 mt-2">
                              {new Date(record.timestamp).toLocaleTimeString('zh-CN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            {record.price === 0 ? (
                              <span className="text-2xl font-bold text-green-500">免费</span>
                            ) : (
                              <span className="text-3xl font-bold text-orange-500">
                                -{record.price}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
