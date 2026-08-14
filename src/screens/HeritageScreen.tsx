import { HERITAGE } from '../data/heritage';
import { ScreenShell } from '../components/ui/ScreenShell';
import { Button } from '../components/ui/Button';
import { HoverZoomImage } from '../components/ui/HoverZoomImage';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  designerName: string;
  onPass: () => void;
}

export function HeritageScreen({ designerName, onPass }: Props) {
  return (
    <ScreenShell
      footer={
        <>
          <p className="mb-3 text-center text-meta text-atelier-muted">
            수사에 기여한 당신을 위해 특별한 보상이 준비되어 있습니다.
          </p>
          <Button fullWidth onClick={onPass}>
            Designer Pass 받기
          </Button>
        </>
      }
    >
      <RevealGroup onView={false} stagger={0.08} className="flex flex-col items-center text-center">
        <Reveal>
          <p className="rounded-full border border-atelier-gold-dim px-4 py-2 font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
            CASE CLOSED
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="font-mono text-small text-atelier-muted">디자이너 {designerName}</p>
        </Reveal>
        <Reveal className="mt-5">
          <h2 className="font-display text-display-sm font-bold">
            MCM의 디자인은
            <br />
            <span className="text-atelier-gold">한눈에 알아볼 수 있는 시그니처</span>와
            <br />
            <span className="text-atelier-gold">이동을 위한 기능</span>이
            <br />
            결합될 때 완성됩니다.
          </h2>
        </Reveal>
      </RevealGroup>

      <RevealGroup
        stagger={0.1}
        className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4"
      >
        {HERITAGE.map((item) => (
          <Reveal key={item.id}>
            <article className="group h-full overflow-hidden rounded-xl border border-atelier-line bg-atelier-card">
              <div className="relative">
                <HoverZoomImage
                  src={item.image}
                  alt={item.title}
                  useGroupHover
                  className="h-35 w-full md:h-44"
                />
                <span className="absolute bottom-3 left-3 font-mono text-micro font-semibold tracking-label text-atelier-text/80">
                  {item.label}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-card-title font-bold">{item.title}</h3>
                <p className="mt-2 text-small text-atelier-muted text-pretty">{item.body}</p>
                <a
                  href={item.href}
                  className="mt-3 inline-block font-mono text-meta font-semibold text-atelier-gold hover:text-atelier-text"
                >
                  실제 제품 보기 ↗
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </RevealGroup>
    </ScreenShell>
  );
}
