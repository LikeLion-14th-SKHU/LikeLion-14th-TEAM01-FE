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

export default function App() {
  const { state, go, setDesignerName, chooseDirection, enterRoom, openCharacter, closeCharacter, submitAnswer, reset } =
    useGame();
  const { isLoggedIn, loginWithKakao, logout } = useAuth();

  const designerName = state.designerName.trim() || '수습 디자이너';
  const track = DIRECTIONS.find((d) => d.id === state.direction)?.track ?? '디자인 트랙';

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-md overflow-x-hidden bg-atelier-bg">
      {isLoggedIn && (
        <AppHeader
          onLogout={() => {
            logout();
            reset();
          }}
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen + (state.activeCharacterId ?? '')}
          className="min-h-dvh"
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

        {state.screen === 'rooms' && <RoomSelectScreen onSelect={enterRoom} />}

        {state.screen === 'characters' && (
          <CharacterSelectScreen
            asked={state.asked}
            onBack={() => go('rooms')}
            onSelect={openCharacter}
            onEvidence={() => go('evidence')}
          />
        )}

        {state.screen === 'interrogation' && state.activeCharacterId && (
          <InterrogationScreen
            characterId={state.activeCharacterId}
            sessionId={state.sessionId}
            initialAsksUsed={state.asked[state.activeCharacterId] ?? 0}
            onClose={closeCharacter}
          />
        )}

        {state.screen === 'evidence' && (
          <EvidenceScreen onBack={() => go('characters')} onDeduce={() => go('deduction')} />
        )}

        {state.screen === 'deduction' && (
          <DeductionScreen onBack={() => go('evidence')} onSubmit={submitAnswer} />
        )}

        {state.screen === 'result' && state.answer && (
          <ResultScreen answer={state.answer} onNext={() => go('heritage')} />
        )}

        {state.screen === 'heritage' && (
          <HeritageScreen designerName={designerName} onPass={() => go('pass')} />
        )}

        {state.screen === 'pass' && (
          <PassScreen designerName={designerName} track={track} onRestart={reset} />
        )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
