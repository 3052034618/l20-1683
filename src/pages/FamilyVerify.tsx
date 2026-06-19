import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import PageHeader from '@/components/PageHeader';
import BigButton from '@/components/BigButton';
import Card from '@/components/Card';

export default function FamilyVerify() {
  const navigate = useNavigate();
  const { familyPassword } = useUserStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (password.length < 6) {
      setPassword(password + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
    setError('');
  };

  const handleConfirm = () => {
    if (password === familyPassword) {
      navigate('/family');
    } else {
      setError('密码错误，请重试');
      setPassword('');
    }
  };

  const numberPad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <PageHeader title="家属管理" showBack={true} />

      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-10">
          <div className="text-center mb-10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield size={48} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-amber-900 mb-3">请输入家属密码</h2>
            <p className="text-xl text-amber-700">默认密码：1234</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center ${
                    password.length > idx
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-amber-200 bg-white'
                  }`}
                >
                  {password.length > idx && (
                    <div className="w-5 h-5 rounded-full bg-amber-900" />
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-center text-xl text-red-500 font-bold">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {numberPad.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item === 'del') handleDelete();
                  else if (item) handleNumberClick(item);
                }}
                disabled={item === ''}
                className={`h-20 rounded-2xl text-3xl font-bold transition-all active:scale-95 ${
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

          <BigButton
            variant="primary"
            size="large"
            fullWidth
            onClick={handleConfirm}
            disabled={password.length < 4}
            icon={<Lock size={28} />}
          >
            确认进入
          </BigButton>

          <button
            onClick={() => navigate(-1)}
            className="w-full mt-6 py-4 text-xl text-amber-600 hover:text-amber-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={24} />
            返回
          </button>
        </Card>
      </main>
    </div>
  );
}
