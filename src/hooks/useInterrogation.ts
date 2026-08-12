import { useCallback, useRef, useState } from 'react';
import type { AskCharacter, Character, Message } from '../types/game';

interface Params {
  character: Character;
  sessionId: string;
  initialAsksUsed?: number;
  maxAsks?: number;
  askCharacter: AskCharacter;
  fallbackQuestions?: string[];
}

interface Result {
  messages: Message[];
  asksLeft: number;
  isLoading: boolean;
  completed: boolean;
  error: string | null;
  suggestions: string[];
  ask: (question: string) => Promise<void>;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function useInterrogation({
  character,
  sessionId,
  initialAsksUsed = 0,
  maxAsks = 3,
  askCharacter,
  fallbackQuestions = [],
}: Params): Result {
  const [messages, setMessages] = useState<Message[]>([]);
  const [asksUsed, setAsksUsed] = useState(() => Math.min(initialAsksUsed, maxAsks));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const asksLeft = Math.max(0, maxAsks - asksUsed);

  const ask = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || inFlight.current || asksLeft === 0) return;

      inFlight.current = true;
      setError(null);
      setIsLoading(true);
      setAsksUsed((n) => n + 1);

      const answerId = uid();
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'detective', content: question },
        { id: answerId, role: 'character', content: '', pending: true },
      ]);

      try {
        for await (const chunk of askCharacter({
          characterId: character.id,
          sessionId,
          question,
        })) {
          setMessages((prev) =>
            prev.map((m) => (m.id === answerId ? { ...m, content: m.content + chunk } : m)),
          );
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : '답변을 가져오지 못했습니다.');
        setMessages((prev) => prev.filter((m) => m.id !== answerId));
        setAsksUsed((n) => Math.max(0, n - 1)); // 실패한 질문은 횟수에서 되돌린다
      } finally {
        setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, pending: false } : m)));
        setIsLoading(false);
        inFlight.current = false;
      }
    },
    [askCharacter, asksLeft, character.id, sessionId],
  );

  return {
    messages,
    asksLeft,
    isLoading,
    completed: asksLeft === 0 && !isLoading,
    error,
    suggestions: asksLeft === 1 ? fallbackQuestions.slice(0, 2) : [],
    ask,
  };
}

export type { Params as UseInterrogationParams, Result as UseInterrogationResult };
