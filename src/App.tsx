import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './state/useGame';
import { DIRECTIONS } from './data/directions';
import { IntroScreen } from './screens/IntroScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DirectionScreen } from './screens/DirectionScreen';
import { RoomSelectScreen } from './screens/RoomSelectScreen';
import { CaseBriefingScreen } from './screens/CaseBriefingScreen';
import { CharacterSelectScreen } from './screens/CharacterSelectScreen';
import { InterrogationScreen } from './screens/InterrogationScreen';
import { EvidenceScreen } from './screens/EvidenceScreen';
import { DeductionScreen } from './screens/DeductionScreen';
import { ResultScreen } from './screens/ResultScreen';
import { HeritageScreen } from './screens/HeritageScreen';
import { PassScreen } from './screens/PassScreen';
import { AppHeader } from './components/layout/AppHeader';
import { useAuth } from './state/useAuth';
import { getCase } from './data/case';
import { useDesignerPass } from './state/useDesignerPass';
import { MyPageScreen } from './screens/MyPageScreen';
import { useProductRecommendations } from './hooks/useProductRecommendations';
import { FieldEvidenceScreen } from './screens/FieldEvidenceScreen';
import { FIELD_EVIDENCE } from './data/fieldEvidence';
import {
  getFieldEvidenceCharacterId,
  getRequestedEvidenceDirection,
  getStoredEvidenceDirection,
} from './lib/fieldEvidenceRoute';

export default function App() {
  const {
    state,
    hydrate,
    clearError,
    go,
    setDesignerName,
    registerDesigner,
    chooseDirection,
    enterRoom,
    startInvestigation,
    openCharacter,
    closeCharacter,
    submitAnswer,
    completeCase,
    endGameWithoutPass,
    openMyPage,
    closeMyPage,
    reset,
  } = useGame();
  const { isLoggedIn, isAuthLoading, authError, loginWithKakao, logout, clearAuthError } = useAuth();
  const {
    pass,
    error: passError,
    refresh: refreshPass,
    clear: clearPass,
    clearError: clearPassError,
  } = useDesignerPass();
  const {
    recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    refresh: refreshRecommendations,
    clear: clearRecommendations,
  } = useProductRecommendations();

  const designerName = state.designerName.trim() || '수습 디자이너';
  const selectedDirection = DIRECTIONS.find((d) => d.id === state.direction) ?? null;
  const track = selectedDirection?.track ?? '디자인 트랙';
  const activeCase = state.caseId ? getCase(state.caseId) : null;
  const fieldEvidenceId = getFieldEvidenceCharacterId();
  const fieldEvidence = fieldEvidenceId ? FIELD_EVIDENCE[fieldEvidenceId] : null;
  const evidenceDirection =
    getRequestedEvidenceDirection() ?? state.direction ?? getStoredEvidenceDirection() ?? 'daily';

  useEffect(() => {
    if (isLoggedIn) hydrate().catch(() => undefined);
  }, [hydrate, isLoggedIn]);

  useEffect(() => {
    const completed =
      state.passEligible &&
      state.completedCases.includes('function') &&
      state.completedCases.includes('signature');
    if (isLoggedIn && state.screen === 'heritage' && completed) {
      refreshRecommendations().catch(() => undefined);
    }
  }, [isLoggedIn, refreshRecommendations, state.completedCases, state.passEligible, state.screen]);

  const showPass = () => {
    refreshPass(track)
      .catch(() => undefined)
      .finally(() => go('pass'));
  };

  const showMyPage = () => {
    refreshPass(track).catch(() => undefined);
    openMyPage();
  };

  if (fieldEvidence) {
    return (
      <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-x-hidden bg-atelier-bg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]">
        <img
          src="/art/designer-name.jpg"
          alt=""
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 h-dvh w-full max-w-md -translate-x-1/2 object-cover object-center md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-linear-to-b from-atelier-bg/60 via-atelier-bg/75 to-atelier-bg/95 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]"
        />
        <div className="relative z-10 min-h-dvh">
          <FieldEvidenceScreen evidence={fieldEvidence} direction={evidenceDirection} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-x-hidden bg-atelier-bg md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]">
      <img
        src="/art/designer-name.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-1/2 h-dvh w-full max-w-md -translate-x-1/2 object-cover object-center md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-linear-to-b from-atelier-bg/60 via-atelier-bg/75 to-atelier-bg/95 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1440px]"
      />
      {isLoggedIn && (
        <AppHeader
          onMyPage={showMyPage}
          onLogout={() => {
            logout()
              .catch(() => undefined)
              .finally(() => {
                clearPass();
                clearRecommendations();
                reset();
              });
          }}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen + (state.caseId ?? '') + (state.activeCharacterId ?? '')}
          className="relative z-10 min-h-dvh"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {state.screen === 'intro' && (
            <IntroScreen
              isLoggedIn={isLoggedIn}
              isAuthLoading={isAuthLoading}
              onLogin={loginWithKakao}
              onStart={() =>
                go(state.designerName.trim() ? (state.direction ? 'rooms' : 'direction') : 'register')
              }
            />
          )}

          {state.screen === 'register' && (
            <RegisterScreen
              name={state.designerName}
              onChange={setDesignerName}
              onBack={() => go('intro')}
              onNext={() => registerDesigner().catch(() => undefined)}
            />
          )}

          {state.screen === 'direction' && (
            <DirectionScreen onBack={() => go('intro')} onSelect={chooseDirection} />
          )}

          {state.screen === 'rooms' && (
            <RoomSelectScreen
              completedCases={state.completedCases}
              onSelect={(roomId) => {
                enterRoom(roomId).catch(() => undefined);
              }}
            />
          )}

          {state.screen === 'briefing' && activeCase && (
            <CaseBriefingScreen
              caseData={activeCase}
              onBack={() => go('rooms')}
              onStart={startInvestigation}
            />
          )}

          {state.screen === 'characters' && activeCase && (
            <CharacterSelectScreen
              caseData={activeCase}
              asked={state.asked}
              interviewed={state.interviewed}
              onSelect={openCharacter}
              onEvidence={() => go('evidence')}
            />
          )}

          {state.screen === 'interrogation' && activeCase && state.activeCharacterId && (
            <InterrogationScreen
              caseData={activeCase}
              characterId={state.activeCharacterId}
              sessionId={state.sessionId}
              initialAsksUsed={state.asked[state.activeCharacterId] ?? 0}
              onClose={closeCharacter}
            />
          )}

          {state.screen === 'evidence' && activeCase && (
            <EvidenceScreen
              caseData={activeCase}
              onBack={() => go('characters')}
              onDeduce={() => go('deduction')}
            />
          )}

          {state.screen === 'deduction' && activeCase && (
            <DeductionScreen
              caseData={activeCase}
              onBack={() => go('evidence')}
              onSubmit={(answer) => {
                submitAnswer(answer).catch(() => undefined);
              }}
            />
          )}

          {state.screen === 'result' && activeCase && state.answer && (
            <ResultScreen
              caseData={activeCase}
              answer={state.answer}
              correct={Boolean(state.deductionCorrect)}
              direction={selectedDirection}
              isLastCase={
                activeCase.id === 'signature' && state.completedCases.includes('function')
              }
              onNext={
                !state.deductionCorrect
                  ? endGameWithoutPass
                  : completeCase
              }
            />
          )}

          {state.screen === 'heritage' && (
            <HeritageScreen
              designerName={designerName}
              passEligible={state.passEligible}
              direction={selectedDirection}
              recommendations={recommendations}
              recommendationsLoading={recommendationsLoading}
              recommendationsError={recommendationsError}
              onRetryRecommendations={() => {
                refreshRecommendations().catch(() => undefined);
              }}
              onPass={showPass}
            />
          )}

          {state.screen === 'pass' && (
            <PassScreen
              pass={pass}
              onIssue={() => refreshPass(track)}
              onRestart={showMyPage}
            />
          )}

          {(state.error || passError || authError) && (
            <div
              role="alert"
              className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-start justify-between gap-4 rounded-lg border border-atelier-alert/50 bg-atelier-bg/95 px-4 py-3 font-mono text-meta text-atelier-alert shadow-xl backdrop-blur"
            >
              <span>{state.error ?? passError ?? authError}</span>
              <button
                type="button"
                onClick={() => {
                  clearError();
                  clearPassError();
                  clearAuthError();
                }}
                className="shrink-0 text-atelier-text"
              >
                닫기
              </button>
            </div>
          )}

          {state.isBusy && (
            <div className="fixed inset-0 z-40 grid place-items-center bg-atelier-bg/55 backdrop-blur-[2px]">
              <p className="rounded-full border border-atelier-gold-dim bg-atelier-card px-5 py-3 font-mono text-caption text-atelier-gold">
                서버와 동기화 중…
              </p>
            </div>
          )}

          {state.screen === 'mypage' && (
            <MyPageScreen pass={pass} onBack={closeMyPage} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
