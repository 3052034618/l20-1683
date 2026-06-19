import { useState } from 'react';
import { Lock, Check, AlertTriangle } from 'lucide-react';
import BigModal from '@/components/BigModal';
import BigButton from '@/components/BigButton';
import BigSwitch from '@/components/BigSwitch';
import { useUserStore } from '@/store/useUserStore';
import { useNavigate } from 'react-router-dom';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  chapterId: number;
  chapterTitle: string;
  price: number;
  onSuccess: () => void;
}

export default function UnlockModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  chapterId,
  chapterTitle,
  price,
  onSuccess,
}: UnlockModalProps) {
  const navigate = useNavigate();
  const { balance, settings, dailySpent, purchaseChapter, updateSettings } = useUserStore();
  const [step, setStep] = useState<'confirm' | 'success' | 'failed'>('confirm');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberChoice, setRememberChoice] = useState(false);
  const [askFamilyAbove, setAskFamilyAbove] = useState(false);

  const canAfford = balance >= price;
  const withinDailyLimit = dailySpent + price <= settings.dailyLimit;
  const needFamilyConfirm = price > settings.askFamilyAbove && settings.askFamilyAbove > 0;

  const handleUnlock = () => {
    if (!canAfford) {
      setErrorMsg('书币不足，请先充值');
      setStep('failed');
      return;
    }

    if (!withinDailyLimit) {
      setErrorMsg('已超过今日消费上限，请联系家属');
      setStep('failed');
      return;
    }

    if (needFamilyConfirm) {
      setErrorMsg('此章节价格较高，需要家属确认');
      setStep('failed');
      return;
    }

    const success = purchaseChapter(bookId, chapterId, price, bookTitle, chapterTitle);
    
    if (success) {
      if (rememberChoice) {
        updateSettings({ rememberPerBook: true });
      }
      if (askFamilyAbove) {
        updateSettings({ askFamilyAbove: 10 });
      }
      setStep('success');
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 1500);
    } else {
      setErrorMsg('解锁失败，请稍后重试');
      setStep('failed');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setErrorMsg('');
    onClose();
  };

  return (
    <BigModal isOpen={isOpen} onClose={handleClose} hideCloseButton>
      {step === 'confirm' && (
        <div className="text-center">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-orange-100 flex items-center justify-center">
            <Lock size={56} className="text-orange-500" strokeWidth={2} />
          </div>

          <h3 className="text-3xl font-bold text-amber-900 mb-3">{chapterTitle}</h3>
          <p className="text-xl text-amber-700 mb-8">{bookTitle}</p>

          <div className="bg-amber-100 rounded-2xl p-8 mb-8">
            <p className="text-2xl text-amber-800 mb-4">解锁本章需要</p>
            <p className="text-6xl font-bold text-orange-500 mb-4">{price} <span className="text-3xl">书币</span></p>
            <p className="text-2xl text-amber-700">
              当前余额：<span className="font-bold text-amber-900">{balance} 书币</span>
            </p>
          </div>

          {!canAfford && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-red-600">
                <AlertTriangle size={32} />
                <span className="text-2xl font-bold">余额不足</span>
              </div>
            </div>
          )}

          {!withinDailyLimit && canAfford && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-red-600">
                <AlertTriangle size={32} />
                <span className="text-2xl font-bold">已超过今日消费上限</span>
              </div>
              <p className="text-xl text-red-500 mt-2">今日已消费 {dailySpent} 书币，上限 {settings.dailyLimit} 书币</p>
            </div>
          )}

          {needFamilyConfirm && canAfford && withinDailyLimit && (
            <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-amber-700">
                <AlertTriangle size={32} />
                <span className="text-2xl font-bold">需要家属确认</span>
              </div>
              <p className="text-xl text-amber-600 mt-2">超过 {settings.askFamilyAbove} 书币的消费需家属确认</p>
              <button
                onClick={() => navigate('/family/verify')}
                className="mt-4 text-xl text-orange-500 font-bold underline"
              >
                联系家属
              </button>
            </div>
          )}

          <div className="space-y-4 mb-10">
            <BigSwitch
              checked={rememberChoice}
              onChange={setRememberChoice}
              label="以后这本书每次都问我"
              description="每次遇到付费章节都会弹出确认"
            />
            <BigSwitch
              checked={askFamilyAbove}
              onChange={setAskFamilyAbove}
              label="超过 10 书币让家属确认"
              description="贵的章节需要家属同意才能买"
            />
          </div>

          <div className="flex gap-4">
            <BigButton
              variant="secondary"
              size="large"
              className="flex-1"
              onClick={handleClose}
            >
              再想想
            </BigButton>
            <BigButton
              variant="primary"
              size="large"
              className="flex-1"
              onClick={handleUnlock}
              disabled={!canAfford || !withinDailyLimit || needFamilyConfirm}
            >
              解锁本章
            </BigButton>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center py-8">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={56} className="text-green-500" strokeWidth={2.5} />
          </div>
          <h3 className="text-4xl font-bold text-green-600 mb-4">解锁成功！</h3>
          <p className="text-2xl text-amber-700">现在可以继续阅读了</p>
        </div>
      )}

      {step === 'failed' && (
        <div className="text-center">
          <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={56} className="text-red-500" strokeWidth={2} />
          </div>
          <h3 className="text-3xl font-bold text-red-600 mb-4">解锁失败</h3>
          <p className="text-2xl text-amber-700 mb-10">{errorMsg}</p>
          <BigButton
            variant="primary"
            size="large"
            fullWidth
            onClick={handleClose}
          >
            知道了
          </BigButton>
        </div>
      )}
    </BigModal>
  );
}
