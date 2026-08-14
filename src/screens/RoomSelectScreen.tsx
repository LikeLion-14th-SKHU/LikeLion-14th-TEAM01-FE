import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { HoverZoomImage } from '../components/ui/HoverZoomImage';
import { Reveal, RevealGroup } from '../components/motion/Reveal';
import type { CaseId } from '../types/game';
import type { RoomId } from '../state/useGame';

interface Room {
  id: RoomId;
  caseId: CaseId;
  name: string;
  code: string;
  summary: string;
  image: string;
}

const ROOMS: Room[] = [
  {
    id: 'pattern',
    caseId: 'signature',
    name: '패턴실',
    code: 'SIGNATURE',
    summary: '비세토스 패턴과 외관 디자인',
    image: '/art/signature.jpg',
  },
  {
    id: 'drafting',
    caseId: 'function',
    name: '설계실',
    code: 'FUNCTION',
    summary: '스트랩과 내부 수납 설계',
    image: '/art/function.jpg',
  },
];

interface Props {
  completedCases: CaseId[];
  onSelect: (roomId: RoomId) => void;
}

export function RoomSelectScreen({ completedCases, onSelect }: Props) {
  return (
    <ScreenShell>
      <SectionHeading
        eyebrow="INVESTIGATION PHASE"
        title="사라진 시안"
        description="두 사건을 해결해 디자인을 완성하세요."
      />

      <RevealGroup
        onView={false}
        stagger={0.09}
        delay={0.25}
        className="mt-7 grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5"
      >
        {ROOMS.map((room) => {
          const completed = completedCases.includes(room.caseId);
          const locked = room.caseId === 'function' && !completedCases.includes('signature');

          return (
            <Reveal key={room.id}>
              <button
                type="button"
                disabled={locked || completed}
                onClick={() => onSelect(room.id)}
                className={cn(
                  'group block h-full w-full overflow-hidden rounded-xl border text-left transition-colors duration-300',
                  locked
                    ? 'cursor-not-allowed border-atelier-line bg-atelier-surface opacity-50'
                    : completed
                      ? 'cursor-default border-atelier-gold-dim bg-atelier-card/70 opacity-70'
                      : 'border-atelier-gold bg-atelier-card',
                )}
              >
                <div className="relative">
                  <HoverZoomImage
                    src={room.image}
                    alt={room.name}
                    useGroupHover={!locked && !completed}
                    className={cn(
                      'w-full',
                      locked || completed ? 'h-24 md:h-32' : 'h-37.5 md:h-48',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-3 top-3 rounded-full px-3 py-1.5 font-mono text-micro font-semibold',
                      locked
                        ? 'border border-atelier-line bg-atelier-bg/70 text-atelier-muted'
                        : 'bg-atelier-gold text-atelier-bg',
                    )}
                  >
                    {locked ? 'LOCKED' : completed ? 'COMPLETE' : 'OPEN'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-card-title font-bold">{room.name}</p>
                  {!locked && (
                    <>
                      <p className="mt-1.5 font-mono text-caption font-semibold text-atelier-gold">
                        {room.code}
                      </p>
                      <p className="mt-2 text-small text-atelier-muted">{room.summary}</p>
                    </>
                  )}
                </div>
              </button>
            </Reveal>
          );
        })}
      </RevealGroup>
    </ScreenShell>
  );
}
