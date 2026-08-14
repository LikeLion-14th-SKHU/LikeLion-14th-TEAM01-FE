import type { DesignerPass } from '../types/designerPass';
import { DesignerPassCard } from '../components/pass/DesignerPassCard';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  pass: DesignerPass | null;
  onIssue: () => void;
  onRestart: () => void;
}

export function PassScreen({ pass, onIssue, onRestart }: Props) {
  if (!pass) {
    return (
      <ScreenShell className="flex items-center">
        <RevealGroup onView={false} stagger={0.08} className="flex w-full flex-col items-center text-center">
          <Reveal>
            <div className="grid size-16 place-items-center rounded-full border border-atelier-gold-dim text-display-sm text-atelier-gold">
              ◈
            </div>
          </Reveal>
          <Reveal className="mt-5">
            <h2 className="font-display text-display-md font-bold">Designer Pass</h2>
          </Reveal>
          <Reveal className="mt-3">
            <p className="text-small text-atelier-muted">
              MCM 뮌헨 아틀리에의 공식 디자이너 패스입니다.
              <br />
              어떤 디자인이 나올지 두근거리지 않나요?
            </p>
          </Reveal>
          <Reveal className="mt-8 w-full">
            <Button fullWidth onClick={onIssue}>
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
          <p className="mt-2.5 text-center text-caption text-atelier-muted">
            발급된 패스는 마이페이지에서 다시 볼 수 있어요
          </p>
        </>
      }
      className="flex items-center"
    >
      <DesignerPassCard pass={pass} />
    </ScreenShell>
  );
}
