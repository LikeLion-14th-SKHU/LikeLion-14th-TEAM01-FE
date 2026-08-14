import { useCallback, useState } from 'react';
import type { DesignerPass } from '../types/designerPass';

const PASS_STORAGE_KEY = 'mcmDesignerPass';

const TIERS: Pick<DesignerPass, 'tier' | 'colorway'>[] = [
  { tier: '커먼', colorway: 'Heritage White' },
  { tier: '커먼', colorway: 'Cognac Brown' },
  { tier: '레어', colorway: 'Visetos Gold' },
  { tier: '레어', colorway: 'München Green' },
  { tier: '시그니처', colorway: 'Atelier Black' },
];

const isDesignerPass = (value: unknown): value is DesignerPass => {
  if (!value || typeof value !== 'object') return false;
  const pass = value as Partial<DesignerPass>;
  return Boolean(
    pass.no &&
      pass.tier &&
      pass.colorway &&
      pass.designerName &&
      pass.track &&
      pass.issueDate,
  );
};

const getStoredPass = (): DesignerPass | null => {
  try {
    const stored = window.localStorage.getItem(PASS_STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isDesignerPass(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export function useDesignerPass() {
  const [pass, setPass] = useState<DesignerPass | null>(getStoredPass);

  const issuePass = useCallback((designerName: string, track: string) => {
    const style = TIERS[Math.floor(Math.random() * TIERS.length)];
    const issued: DesignerPass = {
      ...style,
      no: 'MCM-1976-' + String(Math.floor(1000 + Math.random() * 9000)),
      designerName,
      track,
      issueDate: '1976. 08. 05',
    };

    try {
      window.localStorage.setItem(PASS_STORAGE_KEY, JSON.stringify(issued));
    } catch {
      // 저장 공간을 사용할 수 없어도 현재 세션에서는 패스를 보여준다.
    }
    setPass(issued);
  }, []);

  return { pass, issuePass };
}
