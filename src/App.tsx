import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from './state/useGame';
import { DIRECTIONS } from './data/directions';
import { IntroScreen } from './screens/IntroScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DirectionScreen } from './screens/DirectionScreen';
import { RoomSelectScreen } from './screens/RoomSelectScreen';
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

export default function App() {
  const {
    state,
    go,
    setDesignerName,
    chooseDirection,
    enterRoom,
    openCharacter,
    closeCharacter,
    submitAnswer,
    completeCase,
    endGameWithoutPass,
    openMyPage,
    closeMyPage,
    reset,
  } = useGame();
  const { isLoggedIn, loginWithKakao, logout } = useAuth();
  const { pass, issuePass } = useDesignerPass();

  const designerName = state.designerName.trim() || '수습 디자이너';
  const selectedDirection = DIRECTIONS.find((d) => d.id === state.direction) ?? null;
  const track = selectedDirection?.track ?? '디자인 트랙';
  const activeCase = state.caseId ? getCase(state.caseId) : null;

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
          onMyPage={openMyPage}
          onLogout={() => {
            logout();
            reset();
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
              onLogin={loginWithKakao}
              onStart={() => go('register')}
            />
          )}

          {state.screen === 'register' && (
            <RegisterScreen
              name={state.designerName}
              onChange={setDesignerName}
              onBack={() => go('intro')}
              onNext={() => go('direction')}
            />
          )}

          {state.screen === 'direction' && (
            <DirectionScreen onBack={() => go('register')} onSelect={chooseDirection} />
          )}

          {state.screen === 'rooms' && (
            <RoomSelectScreen completedCases={state.completedCases} onSelect={enterRoom} />
          )}

          {state.screen === 'characters' && activeCase && (
            <CharacterSelectScreen
              caseData={activeCase}
              asked={state.asked}
              interviewed={state.interviewed}
              onBack={() => go('rooms')}
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
              onSubmit={submitAnswer}
            />
          )}

          {state.screen === 'result' && activeCase && state.answer && (
            <ResultScreen
              caseData={activeCase}
              answer={state.answer}
              direction={selectedDirection}
              isLastCase={
                activeCase.id === 'signature' && state.completedCases.includes('function')
              }
              onNext={
                state.answer !== activeCase.correctAnswer
                  ? endGameWithoutPass
                  : completeCase
              }
            />
          )}

          {state.screen === 'heritage' && (
            <HeritageScreen
              designerName={designerName}
              passEligible={state.passEligible}
              onPass={() => go('pass')}
            />
          )}

          {state.screen === 'pass' && (
            <PassScreen
              pass={pass}
              onIssue={() => issuePass(designerName, track)}
              onRestart={reset}
            />
          )}

          {state.screen === 'mypage' && (
            <MyPageScreen pass={pass} onBack={closeMyPage} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
