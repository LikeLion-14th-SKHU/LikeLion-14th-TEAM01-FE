import { motion, type HTMLMotionProps } from 'framer-motion';
import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

const GroupContext = createContext(false);

interface GroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  onView?: boolean;
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0.1,
  onView = true,
}: GroupProps) {
  return (
    <GroupContext.Provider value={true}>
      <motion.div
        className={className}
        initial="hidden"
        {...(onView
          ? { whileInView: 'shown', viewport: { once: true, amount: 0.25 } }
          : { animate: 'shown' })}
        variants={{ shown: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {children}
      </motion.div>
    </GroupContext.Provider>
  );
}

type RevealProps = Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'animate'> & {
  distance?: number;
  delay?: number;
  as?: 'div' | 'section' | 'p' | 'h1' | 'h2' | 'span';
};

export function Reveal({ distance = 20, delay = 0, className, children, ...rest }: RevealProps) {
  const inGroup = useContext(GroupContext);
  const variants = {
    hidden: { opacity: 0, y: distance },
    shown: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: inGroup ? 0 : delay },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      {...(inGroup ? {} : { whileInView: 'shown', viewport: { once: true, amount: 0.3 } })}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
