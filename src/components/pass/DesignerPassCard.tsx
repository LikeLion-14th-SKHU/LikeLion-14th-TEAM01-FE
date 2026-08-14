import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DesignerPass } from '../../types/designerPass';
import { Button } from '../ui/Button';

type PassSide = 'front' | 'back';

interface Props {
  pass: DesignerPass;
}

const drawCardBase = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#312719');
  gradient.addColorStop(0.55, '#171208');
  gradient.addColorStop(1, '#0e0b08');

  context.beginPath();
  context.roundRect(16, 16, width - 32, height - 32, 48);
  context.fillStyle = gradient;
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = 'rgba(245, 239, 230, 0.32)';
  context.stroke();
};

const drawFront = (context: CanvasRenderingContext2D, pass: DesignerPass) => {
  context.fillStyle = '#b9a88f';
  context.font = '600 22px "IBM Plex Mono", monospace';
  context.letterSpacing = '3px';
  context.fillText('MCM · MÜNCHEN ATELIER', 80, 92);

  context.fillStyle = '#f5efe6';
  context.font = '700 48px "Noto Serif KR", serif';
  context.letterSpacing = '0px';
  context.fillText('Designer Pass', 80, 156);

  context.beginPath();
  context.arc(1070, 112, 54, 0, Math.PI * 2);
  context.fillStyle = 'rgba(229, 165, 10, 0.18)';
  context.fill();
  context.fillStyle = '#e5a50a';
  context.font = '42px serif';
  context.textAlign = 'center';
  context.fillText('◈', 1070, 127);
  context.textAlign = 'left';

  context.fillStyle = '#b9a88f';
  context.font = '600 20px "IBM Plex Mono", monospace';
  context.letterSpacing = '3px';
  context.fillText('ISSUED TO', 80, 258);

  context.fillStyle = '#f5efe6';
  context.font = '700 50px "Noto Serif KR", serif';
  context.letterSpacing = '0px';
  context.fillText(pass.designerName, 80, 322);

  context.fillStyle = '#b9a88f';
  context.font = '26px "IBM Plex Mono", monospace';
  context.fillText(pass.track, 80, 368);

  context.fillStyle = 'rgba(14, 11, 8, 0.55)';
  context.beginPath();
  context.roundRect(80, 424, 500, 136, 22);
  context.fill();
  context.beginPath();
  context.roundRect(604, 424, 516, 136, 22);
  context.fill();

  context.fillStyle = '#b9a88f';
  context.font = '600 18px "IBM Plex Mono", monospace';
  context.fillText('PASS NO.', 112, 468);
  context.fillText('ISSUE DATE', 636, 468);

  context.fillStyle = '#f5efe6';
  context.font = '28px "IBM Plex Mono", monospace';
  context.fillText(pass.no, 112, 516);
  context.fillText(pass.issueDate, 636, 516);

  context.strokeStyle = 'rgba(245, 239, 230, 0.4)';
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(80, 614, 150, 58, 29);
  context.stroke();
  context.fillStyle = '#f5efe6';
  context.font = '600 23px "Noto Sans KR", sans-serif';
  context.textAlign = 'center';
  context.fillText(pass.tier, 155, 652);

  context.textAlign = 'right';
  context.font = '700 28px "Noto Serif KR", serif';
  context.fillText(pass.colorway, 1120, 652);
  context.textAlign = 'left';
};

const drawBack = (context: CanvasRenderingContext2D, pass: DesignerPass) => {
  context.fillStyle = '#b9a88f';
  context.font = '600 22px "IBM Plex Mono", monospace';
  context.letterSpacing = '4px';
  context.fillText('PASS BENEFITS', 80, 104);

  context.fillStyle = '#f5efe6';
  context.beginPath();
  context.roundRect(80, 158, 250, 250, 24);
  context.fill();
  context.fillStyle = '#0e0b08';
  context.font = '700 26px "IBM Plex Mono", monospace';
  context.letterSpacing = '0px';
  context.textAlign = 'center';
  context.fillText('QR CODE', 205, 294);
  context.textAlign = 'left';

  context.fillStyle = '#f5efe6';
  context.font = '32px "Noto Sans KR", sans-serif';
  context.fillText('매장 직원에게 이 화면을 보여주세요.', 390, 210);
  context.fillText('1976 아카이브 존 입장과', 390, 264);
  context.fillText('각인 서비스를 이용할 수 있습니다.', 390, 318);

  context.strokeStyle = 'rgba(245, 239, 230, 0.2)';
  context.beginPath();
  context.moveTo(80, 490);
  context.lineTo(1120, 490);
  context.stroke();

  context.fillStyle = '#b9a88f';
  context.font = '26px "IBM Plex Mono", "Noto Sans KR", monospace';
  context.fillText('· 유효기간: 팝업 기간 내', 80, 554);
  context.fillText('· 1인 1회 · 양도 불가', 80, 608);
  context.fillText(`· ${pass.no}`, 80, 662);

  context.fillStyle = '#e5a50a';
  context.font = '700 30px "Noto Serif KR", serif';
  context.textAlign = 'right';
  context.fillText('MCM · MÜNCHEN ATELIER', 1120, 662);
  context.textAlign = 'left';
};

const downloadPassImage = async (pass: DesignerPass, side: PassSide) => {
  await document.fonts.ready;

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 760;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('이미지를 만들 수 없습니다.');

  drawCardBase(context, canvas.width, canvas.height);
  if (side === 'front') drawFront(context, pass);
  else drawBack(context, pass);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('이미지를 저장할 수 없습니다.'));
    }, 'image/png');
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `MCM-Designer-Pass-${pass.no}-${side}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

export function DesignerPassCard({ pass }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const side: PassSide = flipped ? 'back' : 'front';

  const saveAsImage = async () => {
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      await downloadPassImage(pass, side);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : '이미지를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <motion.button
        type="button"
        onClick={() => setFlipped((current) => !current)}
        initial={{ opacity: 0, rotateY: -12 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="w-full rounded-2xl border border-atelier-text/30 bg-linear-to-br from-atelier-text/15 to-atelier-text/4 p-6 text-left"
      >
        {!flipped ? (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-micro tracking-eyebrow text-atelier-muted">
                  MCM · MÜNCHEN ATELIER
                </p>
                <p className="mt-2 font-display text-display-sm font-bold">Designer Pass</p>
              </div>
              <span className="grid size-11 place-items-center rounded-full bg-atelier-gold/20 text-atelier-gold">
                ◈
              </span>
            </div>
            <p className="mt-6 font-mono text-micro tracking-label text-atelier-muted">ISSUED TO</p>
            <p className="mt-1.5 font-display text-display-sm font-bold">{pass.designerName}</p>
            <p className="mt-1 font-mono text-meta text-atelier-muted">{pass.track}</p>
            <div className="mt-5 flex gap-2.5">
              <div className="flex-1 rounded-lg bg-atelier-bg/40 px-3.5 py-3">
                <p className="font-mono text-micro text-atelier-muted">PASS NO.</p>
                <p className="mt-1.5 font-mono text-small">{pass.no}</p>
              </div>
              <div className="flex-1 rounded-lg bg-atelier-bg/40 px-3.5 py-3">
                <p className="font-mono text-micro text-atelier-muted">ISSUE DATE</p>
                <p className="mt-1.5 font-mono text-small">{pass.issueDate}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-atelier-text/40 px-3 py-1.5 font-mono text-caption">
                {pass.tier}
              </span>
              <span className="font-display text-small font-bold">{pass.colorway}</span>
            </div>
          </div>
        ) : (
          <div className="animate-rise-in">
            <p className="font-mono text-micro tracking-eyebrow text-atelier-muted">PASS BENEFITS</p>
            <div className="mt-4 flex items-start gap-4">
              <div className="grid size-23 shrink-0 place-items-center rounded-lg bg-atelier-text font-mono text-micro text-atelier-bg">
                QR CODE
              </div>
              <p className="text-small text-atelier-text/90">
                매장 직원에게 이 화면을 보여주세요. 1976 아카이브 존 입장과 각인 서비스를 이용할 수
                있습니다.
              </p>
            </div>
            <div className="mt-4 border-t border-atelier-text/20 pt-3.5 font-mono text-meta/7 text-atelier-muted">
              <p>· 유효기간: 팝업 기간 내</p>
              <p>· 1인 1회 · 양도 불가</p>
              <p>· {pass.no}</p>
            </div>
          </div>
        )}
      </motion.button>

      <p className="mt-3 text-center font-mono text-caption text-atelier-muted">
        카드를 탭하면 {flipped ? '앞면' : '뒷면'}을 볼 수 있어요
      </p>
      <Button
        fullWidth
        variant="outline"
        onClick={saveAsImage}
        disabled={saving}
        className="mt-5"
      >
        {saving ? '이미지 만드는 중...' : `${flipped ? '뒷면' : '앞면'} 이미지로 저장`}
      </Button>
      {saveError && (
        <p role="alert" className="mt-2 text-center font-mono text-caption text-atelier-alert">
          {saveError}
        </p>
      )}
    </div>
  );
}
