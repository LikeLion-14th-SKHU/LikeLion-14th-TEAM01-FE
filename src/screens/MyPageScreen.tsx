import { useState } from 'react';
import type { DesignerPass } from '../types/designerPass';
import { DesignerPassCard } from '../components/pass/DesignerPassCard';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/motion/Reveal';
import { Button } from '../components/ui/Button';

interface Props {
  pass: DesignerPass | null;
  onBack: () => void;
  onWithdraw: () => Promise<void>;
}

export function MyPageScreen({ pass, onBack, onWithdraw }: Props) {
  const [isConfirmingWithdrawal, setIsConfirmingWithdrawal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    setIsWithdrawing(true);
    setWithdrawalError(null);
    try {
      await onWithdraw();
    } catch (error) {
      setWithdrawalError(error instanceof Error ? error.message : '회원탈퇴를 완료하지 못했습니다.');
      setIsWithdrawing(false);
    }
  };

  return (
    <ScreenShell onBack={onBack} backLabel="이전 화면" className="md:max-w-2xl">
      <SectionHeading
        eyebrow="MY PAGE"
        title="마이페이지"
        description="발급받은 Designer Pass를 확인하고 이미지로 저장할 수 있습니다."
      />

      <Reveal delay={0.2} className="mt-9">
        <h3 className="font-display text-card-title font-bold">Designer Pass</h3>
        <div className="mt-4">
          {pass ? (
            <DesignerPassCard pass={pass} />
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-atelier-line bg-atelier-card/30 px-8 text-center">
              <div>
                <span aria-hidden className="text-display-md text-atelier-line">
                  ◈
                </span>
                <p className="mt-4 text-small text-atelier-muted">
                  아직 발급된 Designer Pass가 없습니다.
                  <br />
                  두 사건을 해결한 뒤 패스를 발급받아 주세요.
                </p>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-12 border-t border-atelier-line pt-8">
        <h3 className="font-display text-card-title font-bold">계정 관리</h3>
        <p className="mt-2 text-small text-atelier-muted">
          회원탈퇴 시 게임 진행 기록, 대화 내역과 Designer Pass가 모두 삭제됩니다.
        </p>

        {isConfirmingWithdrawal ? (
          <div className="mt-5 rounded-xl border border-atelier-alert/60 bg-atelier-alert/5 p-4 md:p-5">
            <p className="font-display text-body font-bold text-atelier-alert">
              정말 회원탈퇴를 진행하시겠습니까?
            </p>
            <p className="mt-2 text-small text-atelier-muted">
              삭제된 MCM 활동 데이터는 복구할 수 없습니다. 카카오 계정 자체는 삭제되지 않습니다.
            </p>

            {withdrawalError && (
              <p role="alert" className="mt-3 font-mono text-caption text-atelier-alert">
                {withdrawalError}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmingWithdrawal(false);
                  setWithdrawalError(null);
                }}
                disabled={isWithdrawing}
              >
                취소
              </Button>
              <Button
                onClick={() => void handleWithdraw()}
                disabled={isWithdrawing}
                className="bg-atelier-alert text-white hover:brightness-105"
              >
                {isWithdrawing ? '처리 중…' : '탈퇴하기'}
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirmingWithdrawal(true)}
            className="mt-5 min-h-11 font-mono text-meta text-atelier-alert underline decoration-atelier-alert/40 underline-offset-4 transition-colors hover:text-atelier-text"
          >
            회원탈퇴
          </button>
        )}
      </Reveal>
    </ScreenShell>
  );
}
