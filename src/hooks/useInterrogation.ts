import { useCallback, useEffect, useRef, useState } from 'react';
import { completeConversation, getConversation } from '../lib/askCharacter';
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
  isCompleting: boolean;
  completed: boolean;
  error: string | null;
  suggestions: string[];
  ask: (question: string) => Promise<void>;
  completeEarly: () => Promise<boolean>;
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
  const [conversationCompleted, setConversationCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    let active = true;

    getConversation(character.id)
      .then((conversation) => {
        if (!active) return;
        setAsksUsed(Math.min(conversation.questionCount, maxAsks));
        setConversationCompleted(conversation.status === 'COMPLETED');
        setMessages(
          conversation.messages.map((message) => ({
            id: `${character.id}-${message.sequenceNumber}`,
            role: message.senderType === 'USER' ? 'detective' : 'character',
            content: message.content,
          })),
        );
      })
      .catch((caught) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : '대화 내역을 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [character.id, maxAsks]);

  const asksLeft = Math.max(0, maxAsks - asksUsed);

  const ask = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || inFlight.current || conversationCompleted || asksLeft === 0) return;

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
        setMessages((prev) =>
          prev.filter((m) => m.id !== answerId && !(m.role === 'detective' && m.content === question)),
        );
        setAsksUsed((n) => Math.max(0, n - 1)); // 실패한 질문은 횟수에서 되돌린다
      } finally {
        setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, pending: false } : m)));
        setIsLoading(false);
        inFlight.current = false;
      }
    },
    [askCharacter, asksLeft, character.id, conversationCompleted, sessionId],
  );

  const completeEarly = useCallback(async (): Promise<boolean> => {
    if (conversationCompleted || asksLeft === 0) return true;
    if (inFlight.current) return false;

    inFlight.current = true;
    setError(null);
    setIsLoading(true);
    setIsCompleting(true);
    try {
      const conversation = await completeConversation(character.id);
      const completed = conversation.status === 'COMPLETED';
      setAsksUsed(Math.min(conversation.questionCount, maxAsks));
      setConversationCompleted(completed);
      return completed;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '대화를 종료하지 못했습니다.');
      return false;
    } finally {
      setIsCompleting(false);
      setIsLoading(false);
      inFlight.current = false;
    }
  }, [asksLeft, character.id, conversationCompleted, maxAsks]);

  return {
    messages,
    asksLeft,
    isLoading,
    isCompleting,
    completed: conversationCompleted || asksLeft === 0,
    error,
    suggestions:
      conversationCompleted
        ? []
        : fallbackQuestions.length >= maxAsks
          ? fallbackQuestions.slice(asksUsed, asksUsed + 1)
          : asksLeft === 1
            ? fallbackQuestions.slice(0, 2)
            : [],
    ask,
    completeEarly,
  };
}

export type { Params as UseInterrogationParams, Result as UseInterrogationResult };
