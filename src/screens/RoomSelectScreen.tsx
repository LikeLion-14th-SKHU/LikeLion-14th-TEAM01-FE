import { cn } from '../lib/cn';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { HoverZoomImage } from '../components/ui/HoverZoomImage';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Room {
  id: string;
  name: string;
  code: string;
  summary: string;
  image: string;
  locked: boolean;
}

const ROOMS: Room[] = [
  { id: 'pattern', name: '패턴실', code: 'SIGNATURE', summary: '비세토스 패턴과 외관 디자인', image: '/art/room-pattern.jpg', locked: false },
  { id: 'drafting', name: '설계실', code: 'STRUCTURE', summary: '스트랩과 내부 수납 설계', image: '/art/room-drafting.jpg', locked: true },
  { id: 'studio', name: '촬영실', code: 'STUDIO', summary: '완성 샘플 촬영과 기록', image: '/art/room-studio.jpg', locked: true },
];

interface Props {
  onSelect: (roomId: string) => void;
}

export function RoomSelectScreen({ onSelect }: Props) {
  return (
    <ScreenShell>
      <SectionHeading
        eyebrow="INVESTIGATION PHASE"
        title="작업실을 선택하세요"
        description={<>시안을 되찾으려면 세 작업실을 조사해야 합니다. <strong className="font-bold text-atelier-gold">패턴실</strong>부터 시작하세요.</>}
      />

      <RevealGroup onView={false} stagger={0.09} delay={0.25} className="mt-7 flex flex-col gap-3.5">
        {ROOMS.map((room) => (
          <Reveal key={room.id}>
            <button
              type="button"
              disabled={room.locked}
              onClick={() => onSelect(room.id)}
              className={cn(
                'group block w-full overflow-hidden rounded-xl border text-left transition-colors duration-300',
                room.locked
                  ? 'cursor-not-allowed border-atelier-line bg-atelier-surface opacity-50'
                  : 'border-atelier-gold bg-atelier-card',
              )}
            >
              <div className="relative">
                <HoverZoomImage
                  src={room.image}
                  alt={room.name}
                  useGroupHover={!room.locked}
                  className={cn('w-full', room.locked ? 'h-24' : 'h-37.5')}
                />
                <span
                  className={cn(
                    'absolute left-3 top-3 rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold',
                    room.locked
                      ? 'border border-atelier-line bg-atelier-bg/70 text-atelier-muted'
                      : 'bg-atelier-gold text-atelier-bg',
                  )}
                >
                  {room.locked ? 'LOCKED' : 'OPEN'}
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-[19px] font-bold">{room.name}</p>
                {!room.locked && (
                  <>
                    <p className="mt-1.5 font-mono text-[11px] font-semibold text-atelier-gold">{room.code}</p>
                    <p className="mt-2 text-[13.5px] text-atelier-muted">{room.summary}</p>
                  </>
                )}
              </div>
            </button>
          </Reveal>
        ))}
      </RevealGroup>
    </ScreenShell>
  );
}
