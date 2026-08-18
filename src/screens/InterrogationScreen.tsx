import { useMemo } from 'react';
import { getCharacter } from '../data/characters';
import { askCharacter } from '../lib/askCharacter';
import { useInterrogation } from '../hooks/useInterrogation';
import { useTypewriter } from '../hooks/useTypewriter';
import { MAX_ASKS } from '../state/useGame';
import { CharacterStage } from '../components/character/CharacterStage';
import { DialogueBox } from '../components/dialogue/DialogueBox';
import { QuestionInput } from '../components/dialogue/QuestionInput';
import { ConversationHistory } from '../components/dialogue/ConversationHistory';
import type { CaseDefinition } from '../data/case';

interface Props {
  caseData: CaseDefinition;
  characterId: string;
  sessionId: string;
  initialAsksUsed: number;
  onClose: (id: string, asksUsed: number, completed?: boolean) => void;
}

export function InterrogationScreen({ caseData, characterId, sessionId, initialAsksUsed, onClose }: Props) {
  const character = useMemo(() => getCharacter(characterId), [characterId]);

  const {
    messages,
    initialMessage,
    asksLeft,
    isLoading,
    isCompleting,
    completed,
    suggestions,
    error,
    ask,
    completeEarly,
  } = useInterrogation({
    character,
    sessionId,
    initialAsksUsed,
    maxAsks: MAX_ASKS,
    askCharacter,
  });

  const last = messages[messages.length - 1];
  const answering = last?.role === 'character';

  const { text, isTyping, skip } = useTypewriter(answering ? last.content : '', {
    charsPerSecond: 34,
    enabled: answering,
  });

  const asksUsed = MAX_ASKS - asksLeft;

  const handleClose = async () => {
    if (completed) {
      onClose(characterId, asksUsed, true);
      return;
    }
    if (await completeEarly()) onClose(characterId, asksUsed, true);
  };

  return (
    <div className="relative flex min-h-dvh flex-col md:grid md:h-dvh md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] md:grid-rows-[auto_minmax(0,1fr)]">
      {character.backdrop && (
        <>
          <img
            src={character.backdrop}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-atelier-bg/55 via-atelier-bg/45 to-atelier-bg/85"
          />
        </>
      )}

      <header className="relative z-10 flex items-center justify-between px-5 pt-16 md:col-span-2 md:px-8 lg:px-10">
        <span className="font-mono text-caption font-semibold tracking-label text-atelier-gold">
          CASE {caseData.number} · {caseData.code}
        </span>
        <button
          type="button"
          onClick={() => void handleClose()}
          disabled={isLoading || isTyping}
          className="-mr-2 flex min-h-11 items-center gap-1.5 px-2 font-mono text-meta text-atelier-muted transition-colors hover:text-atelier-text disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden>✕</span> {isCompleting ? '종료 중…' : '종료'}
        </button>
      </header>

      <CharacterStage
        src={character.standing ?? character.portrait}
        name={character.name}
        imageScale={character.standingScale}
        className="relative z-10 mt-2 min-h-0 flex-1 px-6 md:col-start-1 md:row-start-2 md:mt-0 md:px-8 md:pb-8 lg:px-10"
      />

      <div className="relative z-10 px-5 pb-6 md:col-start-2 md:row-start-2 md:flex md:min-h-0 md:items-center md:overflow-y-auto md:px-8 md:pb-8 lg:px-10">
        <div className="relative flex w-full flex-col gap-3">
          <div className="absolute -top-14 right-0 z-20">
            <ConversationHistory characterName={character.name} messages={messages} />
          </div>

          <DialogueBox
            name={character.name}
            text={answering ? text : initialMessage}
            isTyping={answering && (isTyping || Boolean(last?.pending))}
            onAdvance={isTyping ? skip : undefined}
          />

          {error && (
            <p role="alert" className="px-1 font-mono text-meta text-atelier-alert">
              {error}
            </p>
          )}

          <QuestionInput
            asksLeft={completed ? 0 : asksLeft}
            disabled={isLoading || isTyping || completed}
            suggestions={suggestions}
            onSubmit={ask}
          />

          {completed && !isTyping && (
            <button
              type="button"
              onClick={() => onClose(characterId, asksUsed, true)}
              className="min-h-13 rounded-md border-2 border-atelier-line font-display text-body font-bold text-atelier-text transition-colors hover:border-atelier-gold"
            >
              대화 종료 · 조사실로 돌아가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
