import type { CSSProperties } from 'react';
import { cn } from '../../lib/cn';
import type { DesignerPassVariant } from '../../types/designerPass';

export interface DesignerPassProps {
  username: string;
  variant?: DesignerPassVariant;
  className?: string;
  imageClassName?: string;
}

const PASS_IMAGES: Record<DesignerPassVariant, string> = {
  brown: '/art/brown-Photoroom.png',
  gold: '/art/gold-Photoroom.png',
  ivory: '/art/ivory-Photoroom.png',
  navy: '/art/navy-Photoroom.png',
};

const NAME_COLORS: Record<DesignerPassVariant, string> = {
  brown: '#4a2b16',
  gold: '#4d2d08',
  ivory: '#55483d',
  navy: '#14233a',
};

const getNameLength = (name: string) =>
  Array.from(name).reduce((length, character) => {
    if (character === ' ') return length + 0.55;
    return length + (/[^\p{ASCII}]/u.test(character) ? 1.7 : 1);
  }, 0);

const getNameStyle = (name: string, variant: DesignerPassVariant): CSSProperties => {
  const length = getNameLength(name);
  const fontSize =
    length <= 10
      ? 'clamp(0.75rem, 4.3cqw, 1.5rem)'
      : length <= 18
        ? 'clamp(0.6875rem, 3.5cqw, 1.25rem)'
        : 'clamp(0.625rem, 2.8cqw, 1rem)';

  return {
    color: NAME_COLORS[variant],
    fontSize,
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.3)',
  };
};

export function DesignerPass({
  username,
  variant = 'brown',
  className,
  imageClassName,
}: DesignerPassProps) {
  const displayName = username.trim() || 'GUEST';

  return (
    <div
      data-designer-pass
      className={cn('relative w-full max-w-md', className)}
      style={{ containerType: 'inline-size' }}
    >
      <img
        data-designer-pass-image
        src={PASS_IMAGES[variant]}
        alt={`${displayName}님의 Designer Pass`}
        className={cn('block h-auto w-full select-none', imageClassName)}
      />
      <span
        data-designer-pass-name
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[calc(86.9%_+_6px)] w-[43%] -translate-x-1/2 -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-display font-bold leading-none tracking-[0.04em]"
        style={getNameStyle(displayName, variant)}
      >
        {displayName}
      </span>
    </div>
  );
}
