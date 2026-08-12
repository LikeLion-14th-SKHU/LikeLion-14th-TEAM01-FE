import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost' | 'paper';

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-atelier-gold text-atelier-bg hover:brightness-105',
  outline: 'border border-atelier-gold text-atelier-gold hover:bg-atelier-gold/10',
  ghost: 'text-atelier-muted hover:text-atelier-text',
  paper: 'bg-paper-ink text-paper-bg hover:brightness-110',
};

export function Button({ variant = 'primary', fullWidth, className, children, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'inline-flex min-h-13 items-center justify-center gap-2 rounded-md px-6',
        'font-display text-body font-bold tracking-wide transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-40',
        'focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-atelier-gold',
        VARIANTS[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
