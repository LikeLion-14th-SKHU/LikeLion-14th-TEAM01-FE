import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { StepDots } from '../components/ui/StepDots';
import { Reveal } from '../components/motion/Reveal';

interface Props {
  name: string;
  onChange: (name: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const MAX = 20;

export function RegisterScreen({ name, onChange, onBack, onNext }: Props) {
  return (
    <ScreenShell onBack={onBack} backdrop="/art/room-drafting.jpg">
      <StepDots total={3} current={1} className="mb-8" />

      <SectionHeading
        eyebrow="STEP 1 · DESIGNER REGISTRATION"
        title={<>아틀리에에 오신 것을<br />환영합니다</>}
        description="당신의 첫 번째 여행용 제품을 디자인하세요."
      />

      <Reveal delay={0.3} className="mt-12">
        <label className="flex items-end gap-3 border-b-2 border-atelier-gold pb-2.5">
          <input
            value={name}
            onChange={(e) => onChange(e.target.value.slice(0, MAX))}
            placeholder="디자이너 이름"
            aria-label="디자이너 이름"
            className="min-h-11 flex-1 bg-transparent text-[22px] text-atelier-text outline-none placeholder:text-atelier-muted/60"
          />
          <span className="font-mono text-[13px] text-atelier-muted">
            {name.length}/{MAX}
          </span>
        </label>

        <Button fullWidth onClick={onNext} disabled={name.trim().length === 0} className="mt-7">
          등록 완료 →
        </Button>
        <p className="mt-3 text-center font-mono text-[11.5px] text-atelier-muted">
          이름은 결과 화면과 Designer Pass에 사용됩니다
        </p>
      </Reveal>
    </ScreenShell>
  );
}
