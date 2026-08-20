import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Direction } from '../../data/directions';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReduceMotion';

export type DesignProgressStage = 'function' | 'signature';

interface Props {
  direction: Direction;
  stage: DesignProgressStage;
}

const COPY: Record<
  DesignProgressStage,
  { label: string; title: string; description: string; status: string }
> = {
  function: {
    label: '기능 시안 · 1 / 2',
    title: '기능 시안이 복원되었습니다',
    description: '실루엣 위에 스트랩과 수납 구조가 더해져 가방의 형태가 구현되었습니다.',
    status: '기능 시안 복원 완료',
  },
  signature: {
    label: '패턴 시안 · 2 / 2',
    title: '패턴 시안이 복원되었습니다',
    description: '복원한 패턴이 가방에 적용되어 최종 디자인이 완성되었습니다.',
    status: 'DESIGN COMPLETE',
  },
};

export function DesignProgressReveal({ direction, stage }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const copy = COPY[stage];
  const fromImage = stage === 'function' ? direction.artwork.silhouette : direction.artwork.patternless;
  const toImage = stage === 'function' ? direction.artwork.patternless : direction.artwork.complete;
  const [targetReady, setTargetReady] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-atelier-gold-dim/70 bg-atelier-card">
      <div className="border-b border-atelier-line px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-micro font-semibold tracking-eyebrow text-atelier-gold">
            {copy.label}
          </p>
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-atelier-gold text-small font-bold text-atelier-bg">
            ✓
          </span>
        </div>
        <h3 className="mt-2 font-display text-card-title font-bold">{copy.title}</h3>
        <p className="mt-1.5 text-small text-atelier-muted text-pretty">{copy.description}</p>
      </div>

      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden bg-[#f4f2ee]"
        style={{ aspectRatio: direction.artwork.frameAspectRatio }}
        role="img"
        aria-label={`${direction.title} 가방의 ${copy.title}`}
      >
        <motion.img
          src={fromImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: targetReady ? 0 : 1,
            scale: targetReady && !reducedMotion ? 0.98 : 1,
          }}
          transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 1.2 }}
        />

        <motion.img
          src={toImage}
          alt=""
          aria-hidden
          onLoad={() => setTargetReady(true)}
          className="absolute inset-0 h-full w-full object-contain"
          initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
          animate={{ opacity: targetReady ? 1 : 0, scale: targetReady ? 1 : 0.96 }}
          transition={{
            duration: reducedMotion ? 0 : 1.1,
            delay: reducedMotion ? 0 : 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {targetReady && !reducedMotion && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-atelier-gold/25 to-transparent blur-xl"
            initial={{ left: '-45%', opacity: 0 }}
            animate={{ left: '110%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, delay: 0.65, ease: 'easeInOut' }}
          />
        )}

      </div>

      <div className="flex min-h-12 items-center justify-center border-t border-atelier-line px-4 py-2.5">
        <div>
          <motion.div
            className="whitespace-nowrap rounded-full bg-atelier-bg/85 px-3 py-1.5 font-mono text-micro font-semibold tracking-label text-atelier-gold backdrop-blur-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: targetReady ? 1 : 0, y: targetReady ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: reducedMotion ? 0 : 1.65 }}
          >
            {direction.title} · {copy.status}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
