import { useCallback, useState } from 'react';
import { api } from '../api/client';
import type { DesignerPassGrade } from '../api/types';
import type { DesignerPass, DesignerPassVariant } from '../types/designerPass';

const GRADE_VARIANTS: Record<DesignerPassGrade, DesignerPassVariant> = {
  BROWN: 'brown',
  IVORY: 'ivory',
  NAVY: 'navy',
  GOLDEN: 'gold',
};

export function useDesignerPass() {
  const [pass, setPass] = useState<DesignerPass | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const myPage = await api.getMyPage();
      const issued = myPage.designerPass;
      const grade = issued?.grade ?? 'BROWN';
      setPass(
        issued
          ? {
              no: issued.passCode,
              variant: GRADE_VARIANTS[grade],
              designerName: myPage.designerName?.trim() || 'MCM 디자이너',
              issueDate: issued.issuedDate.replaceAll('-', '. '),
            }
          : null,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Designer Pass를 불러오지 못했습니다.');
    }
  }, []);

  const clear = useCallback(() => {
    setPass(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { pass, error, refresh, clear, clearError };
}
