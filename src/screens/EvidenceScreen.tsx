import type { CaseDefinition } from '../data/case';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/motion/Reveal';

interface Props {
  caseData: CaseDefinition;
  onBack: () => void;
  onDeduce: () => void;
}

export function EvidenceScreen({ caseData, onBack, onDeduce }: Props) {
  return (
    <ScreenShell
      onBack={onBack}
      backLabel="조사로 돌아가기"
      caseLabel={`CASE ${caseData.number} · ${caseData.code}`}
      footer={
        <Button fullWidth onClick={onDeduce}>
          최종 추리하기
        </Button>
      }
      className="flex items-center justify-center"
    >
      <Reveal className="w-full max-w-lg text-center">
        <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
          FIELD EVIDENCE
        </p>
        <h2 className="mt-4 font-display text-display-md font-bold">현장 증거</h2>
        <p className="mt-4 text-body text-atelier-muted">
          현장에서 QR 코드를 스캔하여 증거를 확인해 보세요.
        </p>
      </Reveal>
    </ScreenShell>
  );
}
