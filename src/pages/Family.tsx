import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Coins,
  AlertTriangle,
  Settings,
  Clock,
  BookOpen,
  TrendingUp,
  Minus,
  Plus,
  Power,
} from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import BigSwitch from '@/components/BigSwitch';
import BigButton from '@/components/BigButton';
import ProgressBar from '@/components/ProgressBar';
import BigModal from '@/components/BigModal';

export default function Family() {
  const navigate = useNavigate();
  const {
    balance,
    records,
    settings,
    dailySpent,
    updateSettings,
    addBalance,
    setFamilyPassword,
    resetDailySpentIfNeeded,
  } = useUserStore();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState(50);

  resetDailySpentIfNeeded();

  const dailyRemaining = Math.max(0, settings.dailyLimit - dailySpent);

  const recentRecords = records.slice(0, 10);

  const handleDailyLimitChange = (delta: number) => {
    const newLimit = Math.max(5, Math.min(100, settings.dailyLimit + delta));
    updateSettings({ dailyLimit: newLimit });
  };

  const handleAskFamilyChange = (delta: number) => {
    const newValue = Math.max(0, Math.min(50, settings.askFamilyAbove + delta));
    updateSettings({ askFamilyAbove: newValue });
  };

  const handleRecharge = () => {
    addBalance(rechargeAmount);
    setShowRechargeModal(false);
  };

  const handlePasswordChange = () => {
    if (newPassword.length >= 4) {
      setFamilyPassword(newPassword);
      setShowPasswordModal(false);
      setNewPassword('');
    }
  };

  const dailyLimitOptions = [5, 10, 20, 30, 50, 100];

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <PageHeader title="家属管理" showBack={true}>
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
          <Shield size={24} />
          <span className="text-lg font-bold">家属模式</span>
        </div>
      </PageHeader>

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <BigButton
                variant="primary"
                size="normal"
                fullWidth
                onClick={() => setShowRechargeModal(true)}
              >
                充值书币
              </BigButton>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                  <TrendingUp size={32} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xl text-amber-700">今日已消费</p>
                  <p className="text-4xl font-bold text-green-600">{dailySpent}</p>
                </div>
              </div>
              <ProgressBar value={dailySpent} max={settings.dailyLimit} color="green" />
              <p className="text-lg text-amber-600 mt-3">
                剩余额度：{dailyRemaining} 书币
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <BookOpen size={32} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xl text-amber-700">累计购买</p>
                  <p className="text-4xl font-bold text-amber-900">
                    {records.filter((r) => r.price > 0).length}
                  </p>
                </div>
              </div>
              <p className="text-lg text-amber-600">
                共花费 {records.reduce((s, r) => s + r.price, 0)} 书币
              </p>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
              <Settings size={32} />
              消费设置
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-amber-50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-amber-900">每日消费上限</p>
                    <p className="text-lg text-amber-700">每天最多可以花多少书币</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDailyLimitChange(-5)}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                    >
                      <Minus size={28} strokeWidth={2.5} />
                    </button>
                    <span className="text-4xl font-bold text-orange-500 min-w-[80px] text-center">
                      {settings.dailyLimit}
                    </span>
                    <button
                      onClick={() => handleDailyLimitChange(5)}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                    >
                      <Plus size={28} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dailyLimitOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateSettings({ dailyLimit: opt })}
                      className={`px-6 py-3 rounded-xl text-lg font-bold transition-colors ${
                        settings.dailyLimit === opt
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {opt} 书币
                    </button>
                  ))}
                </div>
              </div>

              <BigSwitch
                checked={!settings.autoUnlock}
                onChange={(val) => updateSettings({ autoUnlock: !val })}
                label="禁止自动解锁"
                description="开启后，所有付费章节都需要手动确认才能解锁"
              />

              <div className="p-6 bg-amber-50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-amber-900">高价章节需家属确认</p>
                    <p className="text-lg text-amber-700">超过此价格的章节需要家属同意</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleAskFamilyChange(-5)}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                    >
                      <Minus size={28} strokeWidth={2.5} />
                    </button>
                    <span className="text-4xl font-bold text-orange-500 min-w-[80px] text-center">
                      {settings.askFamilyAbove}
                    </span>
                    <button
                      onClick={() => handleAskFamilyChange(5)}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center justify-center"
                    >
                      <Plus size={28} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <p className="text-lg text-amber-600">
                  设置为 0 表示所有章节都需要家属确认
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
              <Clock size={32} />
              近期购买记录
            </h2>

            {recentRecords.length === 0 ? (
              <p className="text-xl text-amber-600 text-center py-10">暂无购买记录</p>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-5 bg-amber-50 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xl font-bold text-amber-900">{record.bookTitle}</p>
                      <p className="text-lg text-amber-700">{record.chapterTitle}</p>
                      <p className="text-base text-amber-500">
                        {new Date(record.timestamp).toLocaleString('zh-CN')}
                      </p>
                    </div>
                    <div className="text-right">
                      {record.price === 0 ? (
                        <span className="text-2xl font-bold text-green-500">免费</span>
                      ) : (
                        <span className="text-2xl font-bold text-orange-500">
                          -{record.price} 书币
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {records.length > 10 && (
              <div className="mt-6 text-center">
                <BigButton
                  variant="secondary"
                  size="normal"
                  onClick={() => navigate('/records')}
                >
                  查看全部记录
                </BigButton>
              </div>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-6 flex items-center gap-3">
              <Shield size={32} />
              安全设置
            </h2>

            <div className="space-y-6">
              <div className="p-6 bg-amber-50 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-900">修改家属密码</p>
                  <p className="text-lg text-amber-700">定期更换密码更安全</p>
                </div>
                <BigButton
                  variant="secondary"
                  size="normal"
                  onClick={() => setShowPasswordModal(true)}
                >
                  修改密码
                </BigButton>
              </div>

              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <AlertTriangle size={36} className="text-red-500 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-red-700 mb-2">紧急关闭</p>
                    <p className="text-lg text-red-600 mb-4">
                      如果发现异常消费，可以一键关闭所有付费功能，只保留已购买章节的阅读。
                    </p>
                    <BigButton
                      variant="danger"
                      size="normal"
                      icon={<Power size={28} />}
                      onClick={() => updateSettings({ autoUnlock: false, askFamilyAbove: 0 })}
                    >
                      关闭所有付费
                    </BigButton>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <BigModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        title="充值书币"
      >
        <div className="space-y-6">
          <p className="text-xl text-amber-700">选择充值金额：</p>
          <div className="grid grid-cols-3 gap-4">
            {[10, 30, 50, 100, 200, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setRechargeAmount(amount)}
                className={`p-6 rounded-2xl text-center transition-all ${
                  rechargeAmount === amount
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-amber-50 border-2 border-amber-200 text-amber-900 hover:border-orange-300'
                }`}
              >
                <p className="text-3xl font-bold">{amount}</p>
                <p className="text-lg">书币</p>
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <BigButton
              variant="secondary"
              size="large"
              className="flex-1"
              onClick={() => setShowRechargeModal(false)}
            >
              取消
            </BigButton>
            <BigButton
              variant="primary"
              size="large"
              className="flex-1"
              onClick={handleRecharge}
            >
              确认充值
            </BigButton>
          </div>
        </div>
      </BigModal>

      <BigModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="修改家属密码"
      >
        <div className="space-y-6">
          <p className="text-xl text-amber-700">请输入新密码（4-6位数字）：</p>
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center ${
                  newPassword.length > idx
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-amber-200 bg-white'
                }`}
              >
                {newPassword.length > idx && (
                  <div className="w-6 h-6 rounded-full bg-amber-900" />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item === 'del') setNewPassword(newPassword.slice(0, -1));
                  else if (item && newPassword.length < 6) setNewPassword(newPassword + item);
                }}
                disabled={item === ''}
                className={`h-16 rounded-xl text-2xl font-bold transition-all ${
                  item === ''
                    ? 'invisible'
                    : item === 'del'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-white border-2 border-amber-200 text-amber-900 hover:bg-amber-50'
                }`}
              >
                {item === 'del' ? '删除' : item}
              </button>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <BigButton
              variant="secondary"
              size="large"
              className="flex-1"
              onClick={() => setShowPasswordModal(false)}
            >
              取消
            </BigButton>
            <BigButton
              variant="primary"
              size="large"
              className="flex-1"
              onClick={handlePasswordChange}
              disabled={newPassword.length < 4}
            >
              确认修改
            </BigButton>
          </div>
        </div>
      </BigModal>
    </div>
  );
}
