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
      <ScreenShell className="flex items-center md:max-w-xl">
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
              두 사건 완료 시 서버에서 자동 발급되는 공식 디자이너 패스입니다.
              <br />
              발급 정보를 다시 확인해 주세요.
            </p>
          </Reveal>
          <Reveal className="mt-8 w-full">
            <Button fullWidth onClick={onIssue}>
              발급 정보 새로고침
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
            마이페이지에서 확인하기
          </Button>
          <p className="mt-2.5 text-center text-caption text-atelier-muted">
            발급된 패스는 마이페이지에서 다시 볼 수 있어요
          </p>
        </>
      }
      className="flex items-center md:max-w-2xl"
    >
      <DesignerPassCard pass={pass} />
    </ScreenShell>
  );
}
