import { useState, type FormEvent } from 'react';
import { ScreenShell } from '../components/ui/ScreenShell';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/motion/Reveal';

interface Props {
  isSubmitting?: boolean;
  onBack: () => void;
  onSubmit: (loginId: string, password: string) => Promise<void>;
}

const FIELD_CLASS =
  'min-h-11 w-full border-b-2 border-atelier-line bg-transparent pb-2 font-display text-display-sm text-atelier-text outline-hidden transition-colors placeholder:text-atelier-muted/60 focus:border-atelier-gold';

export function JudgeLoginScreen({ isSubmitting = false, onBack, onSubmit }: Props) {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const canSubmit = loginId.trim().length > 0 && password.length > 0 && !isSubmitting;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);
    onSubmit(loginId.trim(), password).catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : '로그인에 실패했습니다.');
    });
  };

  return (
    <ScreenShell onBack={onBack} className="md:max-w-xl">
      <SectionHeading
        eyebrow="JUDGE ACCESS · 심사위원 전용"
        title={<>관리자 로그인</>}
        description="심사위원 계정 아이디와 비밀번호로 로그인하면 카카오 로그인 없이 바로 체험할 수 있습니다."
      />

      <Reveal delay={0.25} className="mt-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-7">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption font-semibold tracking-label text-atelier-muted">
              아이디
            </span>
            <input
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="loginId"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-caption font-semibold tracking-label text-atelier-muted">
              비밀번호
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              autoComplete="current-password"
              className={FIELD_CLASS}
            />
          </label>

          {error && (
            <p role="alert" className="font-mono text-meta text-atelier-alert">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth disabled={!canSubmit}>
            {isSubmitting ? '로그인 중…' : '로그인 →'}
          </Button>
        </form>

        <p className="mt-3 text-center font-mono text-caption text-atelier-muted">
          일반 참가자는 인트로 화면의 카카오 로그인을 이용해 주세요
        </p>
      </Reveal>
    </ScreenShell>
  );
}
