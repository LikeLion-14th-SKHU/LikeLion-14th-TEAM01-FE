import { useCallback, useState } from 'react';
import { api } from '../api/client';
import type { DesignerPass } from '../types/designerPass';

export function useDesignerPass() {
  const [pass, setPass] = useState<DesignerPass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (track: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const myPage = await api.getMyPage();
      const issued = myPage.designerPass;
      setPass(
        issued
          ? {
              no: issued.passCode,
              tier: 'OFFICIAL',
              colorway: 'MCM Heritage',
              designerName: myPage.designerName ?? 'MCM 디자이너',
              track,
              issueDate: issued.issuedDate.replaceAll('-', '. '),
            }
          : null,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Designer Pass를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setPass(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { pass, isLoading, error, refresh, clear, clearError };
}
