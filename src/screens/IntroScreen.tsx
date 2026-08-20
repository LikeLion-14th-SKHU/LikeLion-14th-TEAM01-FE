import { Button } from '../components/ui/Button';
import { Reveal, RevealGroup } from '../components/motion/Reveal';

interface Props {
  isLoggedIn: boolean;
  isAuthLoading?: boolean;
  onLogin: () => void;
  onJudgeLogin: () => void;
  onStart: () => void;
}

const KAKAO_LOGIN_BUTTON =
  'https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_large_wide.png';

export function IntroScreen({
  isLoggedIn,
  isAuthLoading = false,
  onLogin,
  onJudgeLogin,
  onStart,
}: Props) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-7 text-center md:px-12">
      <RevealGroup onView={false} stagger={0.09} className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <Reveal>
          <p className="rounded-full border border-atelier-gold-dim px-5 py-2.5 font-mono text-caption font-semibold tracking-eyebrow text-atelier-gold">
            EST. 1976 · MUNICH
          </p>
        </Reveal>
        <Reveal className="mt-7">
          <h1 className="font-display text-hero font-bold text-atelier-text md:text-[3.5rem]">1976년,</h1>
        </Reveal>
        <Reveal>
          <p className="font-display text-hero font-bold text-atelier-gold md:text-[3.5rem]">뮌헨.</p>
        </Reveal>
        <Reveal className="mt-8">
          <p className="text-body text-atelier-text/90 text-pretty">
            당신은 새로운 여행용 제품을 개발하는{' '}
            <strong className="font-bold text-atelier-gold">MCM 아틀리에</strong>의 수습 디자이너다.
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="text-body text-atelier-text/90 text-pretty">
            내일 첫 프레젠테이션을 앞두고 완성했던{' '}
            <strong className="font-bold text-atelier-gold">디자인 시안 두 장</strong>이 사라졌다.
          </p>
        </Reveal>
        <Reveal className="mt-4">
          <p className="text-body text-atelier-text/90 text-pretty">
            패턴실, 설계실, 촬영실을 조사해 시안을 되찾고 제품을 완성해야 한다.
          </p>
        </Reveal>
        <Reveal className="mt-10 w-full md:max-w-md">
          {isLoggedIn ? (
            <Button fullWidth onClick={onStart}>
              디자인 시작 →
            </Button>
          ) : (
            <Button
              fullWidth
              onClick={onLogin}
              disabled={isAuthLoading}
              aria-label={isAuthLoading ? '카카오 로그인 확인 중' : '카카오 로그인'}
              className="min-h-0 overflow-hidden rounded-xl bg-[#fee500] p-0 hover:brightness-100"
            >
              {isAuthLoading ? (
                <span className="flex min-h-14 items-center justify-center font-sans text-body font-semibold text-[#191919]">
                  카카오 로그인 확인 중…
                </span>
              ) : (
                <img
                  src={KAKAO_LOGIN_BUTTON}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="h-auto w-full"
                />
              )}
            </Button>
          )}
        </Reveal>
        {!isLoggedIn && (
          <Reveal className="mt-3 w-full md:max-w-md">
            <button
              type="button"
              onClick={onJudgeLogin}
              disabled={isAuthLoading}
              className="min-h-11 w-full rounded-md border border-atelier-line px-6 font-mono text-meta text-atelier-muted transition-colors hover:border-atelier-gold-dim hover:text-atelier-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              관리자 로그인
            </button>
          </Reveal>
        )}
        <Reveal className="mt-4">
          <p className="text-meta text-atelier-muted">사라진 두 시안을 찾아 디자인을 완성하세요.</p>
        </Reveal>
      </RevealGroup>
    </div>
  );
}
