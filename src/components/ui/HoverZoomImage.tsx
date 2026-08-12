import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

interface Props {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  scale?: number;
  useGroupHover?: boolean;
}

export function HoverZoomImage({
  src,
  alt,
  className,
  imageClassName,
  scale = 1.05,
  useGroupHover = false,
}: Props) {
  const common = cn('h-full w-full object-cover', imageClassName);

  return (
    <div className={cn('overflow-hidden', className)}>
      {useGroupHover ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ ['--zoom' as string]: String(scale) }}
          className={cn(
            common,
            'transition-transform duration-[700ms] ease-atelier',
            'group-hover:scale-[var(--zoom)] motion-reduce:transform-none',
          )}
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className={common}
          whileHover={{ scale }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  );
}
