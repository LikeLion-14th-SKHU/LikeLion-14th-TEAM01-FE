import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  scaleFrom?: number;
}

export function FadeIn({
  children,
  className,
  duration = 0.9,
  delay = 0.15,
  scaleFrom = 0.98,
}: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: scaleFrom }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
