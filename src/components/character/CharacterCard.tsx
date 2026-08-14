import { cn } from '../../lib/cn';
import type { Character } from '../../types/game';
import { HoverZoomImage } from '../ui/HoverZoomImage';
import { Reveal } from '../motion/Reveal';

interface Props {
  character: Character;
  asked: number;
  completed?: boolean;
  total: number;
  onSelect: (id: string) => void;
  className?: string;
}

export function CharacterCard({ character, asked, completed = false, total, onSelect, className }: Props) {
  const done = completed || asked >= total;

  return (
    <Reveal className={className}>
      <button
        type="button"
        onClick={() => onSelect(character.id)}
        className={cn(
          'group block w-full overflow-hidden rounded-xl border text-left transition-colors duration-300',
          done
            ? 'border-atelier-line bg-atelier-card/60'
            : 'border-atelier-line bg-atelier-card hover:border-atelier-gold/60',
        )}
      >
        <HoverZoomImage
          src={character.portrait}
          alt={character.name}
          useGroupHover
          className={cn('w-full', done ? 'h-28' : 'h-56')}
        />
        <div className="flex items-end justify-between gap-4 p-4">
          <div>
            <p className="font-display text-card-title font-bold">{character.name}</p>
            <p className="mt-1 font-mono text-caption font-semibold text-atelier-gold">{character.role}</p>
            <p className="mt-2 font-mono text-small text-atelier-muted">
              {completed
                ? '대화를 완료했습니다.'
                : done
                  ? '모든 질문을 완료했습니다.'
                  : asked + ' / ' + total + ' 질문 완료'}
            </p>
          </div>
          <span
            aria-hidden
            className={cn(
              'font-mono text-base transition-colors',
              done ? 'text-atelier-gold' : 'text-atelier-line group-hover:text-atelier-gold',
            )}
          >
            •••
          </span>
        </div>
      </button>
    </Reveal>
  );
}
