import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  onStart: () => void;
}

export function IntroScreen({ onStart }: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-7 text-center">
      <img
        src="/art/intro-desk.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-atelier-bg/85 via-atelier-bg/80 to-atelier-bg" />

      <RevealGroup onView={false} stagger={0.09} className="relative z-10 flex w-full flex-col items-center">
        <Reveal>
          <p className="rounded-full border border-atelier-gold-dim px-5 py-2.5 font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
            EST. 1976 · MUNICH
          </p>
        </Reveal>
        <Reveal className="mt-7">
          <h1 className="font-display text-hero font-bold text-atelier-text">1976,</h1>
        </Reveal>
        <Reveal>
          <p className="font-display text-hero font-bold text-atelier-gold">München</p>
        </Reveal>
        <Reveal className="mt-8">
          <p className="text-body text-atelier-text/90 text-pretty">
            당신은 새로운 여행용 제품을 개발하는{' '}
            <strong className="font-bold text-atelier-gold">MCM 아틀리에</strong>의 수습 디자이너입니다.
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="text-body text-atelier-text/90 text-pretty">
            내일 첫 프레젠테이션을 앞두고 완성했던{' '}
            <strong className="font-bold text-atelier-gold">디자인 시안 두 장</strong>이 사라졌습니다.
          </p>
        </Reveal>
        <Reveal className="mt-10 w-full">
          <Button fullWidth onClick={onStart}>
            디자인 시작 →
          </Button>
        </Reveal>
        <Reveal className="mt-4">
          <p className="text-meta text-atelier-muted">패턴실, 설계실, 촬영실을 조사해 시안을 되찾으세요.</p>
        </Reveal>
      </RevealGroup>
    </div>
  );
}
