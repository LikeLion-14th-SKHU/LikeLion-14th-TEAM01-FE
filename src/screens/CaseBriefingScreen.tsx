import { Reveal, RevealGroup } from '../components/motion/Reveal';
import { Button } from '../components/ui/Button';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { STORY_OVERVIEW, type CaseDefinition } from '../data/case';

interface Props {
  caseData: CaseDefinition;
  onBack: () => void;
  onStart: () => void;
}

export function CaseBriefingScreen({ caseData, onBack, onStart }: Props) {
  return (
    <ScreenShell
      onBack={onBack}
      backLabel="시안 선택"
      caseLabel={`CASE ${caseData.number} · ${caseData.code}`}
      footer={
        <Button fullWidth onClick={onStart}>
          용의자 조사 시작하기
        </Button>
      }
      className="mx-auto max-w-3xl"
    >
      <SectionHeading
        eyebrow="CASE BRIEFING"
        title={`${caseData.briefingTitle} 사건 개요`}
        description="용의자들의 증언을 듣기 전에 사건의 배경과 현재까지 확인된 정황을 살펴보세요."
      />

      <RevealGroup onView={false} stagger={0.12} delay={0.2} className="mt-8 space-y-4">
        <Reveal>
          <section className="rounded-xl border border-atelier-line bg-atelier-card/85 p-5 md:p-6">
            <p className="font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
              MUNICH · 1976
            </p>
            <div className="mt-4 space-y-3 text-small leading-7 text-atelier-muted md:text-body">
              {STORY_OVERVIEW.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="overflow-hidden rounded-xl border border-atelier-gold-dim bg-atelier-surface">
            <header className="border-b border-atelier-line px-5 py-4 md:px-6">
              <p className="font-mono text-caption font-semibold tracking-label text-atelier-gold">
                {caseData.code} · INCIDENT REPORT
              </p>
              <h3 className="mt-2 font-display text-card-title font-bold text-atelier-text">
                사라진 {caseData.briefingTitle}
              </h3>
            </header>
            <div className="space-y-4 px-5 py-5 text-body leading-7 text-atelier-text/90 md:px-6 md:py-6">
              {caseData.briefing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        </Reveal>
      </RevealGroup>
    </ScreenShell>
  );
}

