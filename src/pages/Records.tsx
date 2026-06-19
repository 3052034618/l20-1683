import { useMemo } from 'react';
import { Receipt, Coins, Calendar } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';

export default function Records() {
  const { records, balance, dailySpent, settings } = useUserStore();

  const groupedRecords = useMemo(() => {
    const groups: Record<string, typeof records> = {};
    records.forEach((record) => {
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
  }, [records]);

  const totalSpent = useMemo(() => {
    return records.reduce((sum, r) => sum + r.price, 0);
  }, [records]);

  const dailyRemaining = Math.max(0, settings.dailyLimit - dailySpent);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <PageHeader title="消费记录" showBack={true} />

      <main className="flex-1 p-8">
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
                  <p className="text-xl text-amber-700">累计消费</p>
                  <p className="text-4xl font-bold text-amber-900">{totalSpent}</p>
                </div>
              </div>
              <p className="text-lg text-amber-600">
                共购买 {records.filter(r => r.price > 0).length} 个章节
              </p>
            </Card>
          </div>

          <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
            <Receipt size={36} />
            购买记录
          </h2>

          {Object.keys(groupedRecords).length === 0 ? (
            <Card className="p-16 text-center">
              <Receipt size={80} className="mx-auto text-amber-300 mb-6" />
              <p className="text-2xl text-amber-600">还没有消费记录</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedRecords).map(([date, dayRecords]) => (
                <div key={date}>
                  <h3 className="text-2xl font-bold text-amber-800 mb-4 flex items-center gap-3">
                    <Calendar size={28} />
                    {date}
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
