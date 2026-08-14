import { useMemo } from 'react';
import { FALLBACK_QUESTIONS, getCharacter } from '../data/characters';
import { askCharacter } from '../lib/askCharacter';
import { useInterrogation } from '../hooks/useInterrogation';
import { useTypewriter } from '../hooks/useTypewriter';
import { MAX_ASKS } from '../state/useGame';
import { CharacterStage } from '../components/character/CharacterStage';
import { DialogueBox } from '../components/dialogue/DialogueBox';
import { QuestionInput } from '../components/dialogue/QuestionInput';
import type { CaseDefinition } from '../data/case';

interface Props {
  caseData: CaseDefinition;
  characterId: string;
  sessionId: string;
  initialAsksUsed: number;
  onClose: (id: string, asksUsed: number) => void;
}

export function InterrogationScreen({ caseData, characterId, sessionId, initialAsksUsed, onClose }: Props) {
  const character = useMemo(() => getCharacter(characterId), [characterId]);

  const { messages, asksLeft, isLoading, suggestions, error, ask } = useInterrogation({
    character,
    sessionId,
    initialAsksUsed,
    maxAsks: MAX_ASKS,
    askCharacter,
    fallbackQuestions: FALLBACK_QUESTIONS[characterId] ?? [],
  });

  const last = messages[messages.length - 1];
  const answering = last?.role === 'character';

  const { text, isTyping, skip } = useTypewriter(answering ? last.content : '', {
    charsPerSecond: 34,
    enabled: answering,
  });

  const idle = character.openingStatement ?? '무엇이든 물어보세요. 기억나는 대로 답하겠습니다.';

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 pt-16">
        <span className="font-mono text-caption font-semibold tracking-label text-atelier-gold">
          CASE {caseData.number} · {caseData.code}
        </span>
        <button
          type="button"
          onClick={() => onClose(characterId, MAX_ASKS - asksLeft)}
          className="-mr-2 flex min-h-11 items-center gap-1.5 px-2 font-mono text-meta text-atelier-muted transition-colors hover:text-atelier-text"
        >
          <span aria-hidden>✕</span> 종료
        </button>
      </header>

      <CharacterStage
        src={character.standing ?? character.portrait}
        name={character.name}
        className="mt-2 min-h-0 flex-1 px-6"
      />

      <div className="flex flex-col gap-3 px-5 pb-6">
        <DialogueBox
          name={character.name}
          text={answering ? text : idle}
          isTyping={answering && (isTyping || Boolean(last?.pending))}
          onAdvance={isTyping ? skip : undefined}
        />

        {error && (
          <p role="alert" className="px-1 font-mono text-meta text-atelier-alert">
            {error} — 다시 질문해 주세요.
          </p>
        )}

        <QuestionInput
          asksLeft={asksLeft}
          disabled={isLoading || isTyping}
          suggestions={suggestions}
          onSubmit={ask}
        />

        {asksLeft === 0 && !isTyping && (
          <button
            type="button"
            onClick={() => onClose(characterId, MAX_ASKS)}
            className="min-h-13 rounded-md border-2 border-atelier-line font-display text-body font-bold text-atelier-text transition-colors hover:border-atelier-gold"
          >
            대화 종료 · 조사실로 돌아가기
          </button>
        )}
      </div>
    </div>
  );
}
