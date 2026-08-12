import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface PassData {
  no: string;
  tier: string;
  colorway: string;
}

const TIERS: Omit<PassData, 'no'>[] = [
  { tier: '커먼', colorway: 'Heritage White' },
  { tier: '커먼', colorway: 'Cognac Brown' },
  { tier: '레어', colorway: 'Visetos Gold' },
  { tier: '레어', colorway: 'München Green' },
  { tier: '시그니처', colorway: 'Atelier Black' },
];

const drawPass = (): PassData => {
  const pick = TIERS[Math.floor(Math.random() * TIERS.length)];
  return { ...pick, no: 'MCM-1976-' + String(Math.floor(1000 + Math.random() * 9000)) };
};

interface Props {
  designerName: string;
  track: string;
  onRestart: () => void;
}

export function PassScreen({ designerName, track, onRestart }: Props) {
  const [pass, setPass] = useState<PassData | null>(null);
  const [flipped, setFlipped] = useState(false);

  if (!pass) {
    return (
      <ScreenShell className="flex items-center">
        <RevealGroup onView={false} stagger={0.08} className="flex w-full flex-col items-center text-center">
          <Reveal>
            <div className="grid h-16 w-16 place-items-center rounded-full border border-atelier-goldDim text-[20px] text-atelier-gold">
              ◈
            </div>
          </Reveal>
          <Reveal className="mt-5">
            <h2 className="font-display text-[26px] font-bold">Designer Pass</h2>
          </Reveal>
          <Reveal className="mt-3">
            <p className="text-[14px] leading-[1.7] text-atelier-muted">
              MCM 뮌헨 아틀리에의 공식 디자이너 패스입니다.
              <br />
              어떤 디자인이 나올지 두근거리지 않나요?
            </p>
          </Reveal>
          <Reveal className="mt-8 w-full">
            <Button fullWidth onClick={() => setPass(drawPass())}>
              랜덤 패스 뽑기
            </Button>
          </Reveal>
        </RevealGroup>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      footer={
        <>
          <Button fullWidth onClick={onRestart}>
            다시 시작하기
          </Button>
          <p className="mt-2.5 text-center text-[11.5px] text-atelier-muted">
            다시 플레이하면 다른 디자인의 패스를 얻을 수 있어요
          </p>
        </>
      }
      className="flex items-center"
    >
      <div className="w-full">
        <motion.button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          initial={{ opacity: 0, rotateY: -12 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-2xl border border-atelier-text/30 bg-linear-to-br from-atelier-text/[0.14] to-atelier-text/[0.04] p-6 text-left"
        >
          {!flipped ? (
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-atelier-muted">MCM · MÜNCHEN ATELIER</p>
                  <p className="mt-2 font-display text-[20px] font-bold">Designer Pass</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-atelier-gold/20 text-atelier-gold">◈</span>
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-atelier-muted">ISSUED TO</p>
              <p className="mt-1.5 font-display text-[20px] font-bold">{designerName}</p>
              <p className="mt-1 font-mono text-[12px] text-atelier-muted">{track}</p>
              <div className="mt-5 flex gap-2.5">
                <div className="flex-1 rounded-lg bg-atelier-bg/40 px-3.5 py-3">
                  <p className="font-mono text-[9.5px] text-atelier-muted">PASS NO.</p>
                  <p className="mt-1.5 font-mono text-[13px]">{pass.no}</p>
                </div>
                <div className="flex-1 rounded-lg bg-atelier-bg/40 px-3.5 py-3">
                  <p className="font-mono text-[9.5px] text-atelier-muted">ISSUE DATE</p>
                  <p className="mt-1.5 font-mono text-[13px]">1976. 08. 05</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full border border-atelier-text/40 px-3 py-1.5 font-mono text-[11px]">
                  {pass.tier}
                </span>
                <span className="font-display text-[14px] font-bold">{pass.colorway}</span>
              </div>
            </div>
          ) : (
            <div className="animate-rise-in">
              <p className="font-mono text-[10px] tracking-[0.16em] text-atelier-muted">PASS BENEFITS</p>
              <div className="mt-4 flex items-start gap-4">
                <div className="grid h-23 w-23 shrink-0 place-items-center rounded-lg bg-atelier-text font-mono text-[9px] text-atelier-bg">
                  QR CODE
                </div>
                <p className="text-[13px] leading-[1.7] text-atelier-text/90">
                  매장 직원에게 이 화면을 보여주세요. 1976 아카이브 존 입장과 각인 서비스를 이용할 수 있습니다.
                </p>
              </div>
              <div className="mt-4 border-t border-atelier-text/20 pt-3.5 font-mono text-[12px] leading-[1.9] text-atelier-muted">
                <p>· 유효기간: 팝업 기간 내</p>
                <p>· 1인 1회 · 양도 불가</p>
                <p>· {pass.no}</p>
              </div>
            </div>
          )}
        </motion.button>
        <p className="mt-3 text-center font-mono text-[11.5px] text-atelier-muted">
          카드를 탭하면 {flipped ? '앞면' : '뒷면'}을 볼 수 있어요
        </p>
      </div>
    </ScreenShell>
  );
}
