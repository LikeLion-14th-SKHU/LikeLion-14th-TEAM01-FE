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
          <p className="mb-3 text-center text-[12.5px] text-atelier-muted">
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
          <p className="rounded-full border border-atelier-goldDim px-4 py-2 font-mono text-[10.5px] font-semibold tracking-[0.18em] text-atelier-gold">
            CASE CLOSED
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="font-mono text-[13px] text-atelier-muted">디자이너 {designerName}</p>
        </Reveal>
        <Reveal className="mt-5">
          <h2 className="font-display text-[22px] font-bold leading-[1.5]">
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

      <RevealGroup stagger={0.1} className="mt-9 flex flex-col gap-4">
        {HERITAGE.map((item) => (
          <Reveal key={item.id}>
            <article className="group overflow-hidden rounded-xl border border-atelier-line bg-atelier-card">
              <div className="relative">
                <HoverZoomImage src={item.image} alt={item.title} useGroupHover className="h-[140px] w-full" />
                <span className="absolute bottom-3 left-3 font-mono text-[10px] font-semibold tracking-[0.12em] text-atelier-text/80">
                  {item.label}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-[17px] font-bold">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-atelier-muted text-pretty">{item.body}</p>
                <a
                  href={item.href}
                  className="mt-3 inline-block font-mono text-[12.5px] font-semibold text-atelier-gold hover:text-atelier-text"
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
