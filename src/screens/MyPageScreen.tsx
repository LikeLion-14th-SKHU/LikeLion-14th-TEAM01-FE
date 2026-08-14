import type { DesignerPass } from '../types/designerPass';
import { DesignerPassCard } from '../components/pass/DesignerPassCard';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Reveal } from '../components/motion/Reveal';

interface Props {
  pass: DesignerPass | null;
  onBack: () => void;
}

export function MyPageScreen({ pass, onBack }: Props) {
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
    </ScreenShell>
  );
}
