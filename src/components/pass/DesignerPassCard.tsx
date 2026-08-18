import { useState } from 'react';
import { motion } from 'framer-motion';
import type {
  DesignerPass as DesignerPassData,
  DesignerPassVariant,
} from '../../types/designerPass';
import { cn } from '../../lib/cn';
import { DesignerPass } from './DesignerPass';

interface Props {
  pass: DesignerPassData;
  variant?: DesignerPassVariant;
  className?: string;
}

export function DesignerPassCard({ pass, variant, className }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={cn('mx-auto w-full max-w-sm', className)}>
      <motion.button
        type="button"
        onClick={() => setFlipped((current) => !current)}
        aria-label={`Designer Pass ${flipped ? '앞면' : '혜택'} 보기`}
        aria-pressed={flipped}
        initial={{ opacity: 0, rotateY: -8 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="block w-full rounded-[9%] text-left focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-atelier-gold"
      >
        {!flipped ? (
          <DesignerPass username={pass.designerName} variant={variant ?? pass.variant} />
        ) : (
          <div className="flex aspect-[1086/1448] w-full flex-col justify-center rounded-[9%] border border-atelier-text/30 bg-linear-to-br from-[#312719] via-[#171208] to-[#0e0b08] p-7 shadow-2xl md:p-9">
            <p className="font-mono text-micro tracking-eyebrow text-atelier-muted">PASS BENEFITS</p>
            <div className="mt-5 grid aspect-square w-24 place-items-center rounded-lg bg-atelier-text font-mono text-micro text-atelier-bg md:w-28">
              QR CODE
            </div>
            <p className="mt-5 text-small text-atelier-text/90 text-pretty">
              매장 직원에게 이 화면을 보여주세요. 1976 아카이브 존 입장과 각인 서비스를 이용할 수
              있습니다.
            </p>
            <div className="mt-5 border-t border-atelier-text/20 pt-4 font-mono text-meta/7 text-atelier-muted">
              <p>· 유효기간: 팝업 기간 내</p>
              <p>· 1인 1회 · 양도 불가</p>
              <p>· {pass.no}</p>
              <p>· {pass.issueDate}</p>
            </div>
          </div>
        )}
      </motion.button>

      <p className="mt-3 text-center font-mono text-caption text-atelier-muted">
        패스를 탭하면 {flipped ? '앞면' : '혜택'}을 볼 수 있어요
      </p>
    </div>
  );
}
