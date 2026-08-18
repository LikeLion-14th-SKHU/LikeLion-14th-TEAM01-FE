import { useCallback, useEffect, useRef, useState } from 'react';
import { completeConversation, getConversation } from '../lib/askCharacter';
import type { AskCharacter, Character, Message } from '../types/game';

interface Params {
  character: Character;
  sessionId: string;
  initialAsksUsed?: number;
  maxAsks?: number;
  askCharacter: AskCharacter;
}

interface Result {
  messages: Message[];
  initialMessage: string;
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
const DEFAULT_INITIAL_MESSAGE = '무엇이든 물어보세요. 기억나는 대로 답하겠습니다.';

const normalizeSuggestions = (questions: string[] | undefined): string[] =>
  (questions ?? []).map((question) => question.trim()).filter(Boolean);

export function useInterrogation({
  character,
  sessionId,
  initialAsksUsed = 0,
  maxAsks = 3,
  askCharacter,
}: Params): Result {
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialMessage, setInitialMessage] = useState(
    character.openingStatement ?? DEFAULT_INITIAL_MESSAGE,
  );
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);
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
        setInitialMessage(
          conversation.initialMessage?.trim() ||
            character.openingStatement ||
            DEFAULT_INITIAL_MESSAGE,
        );
        setRecommendedQuestions(normalizeSuggestions(conversation.recommendedQuestions));
        setMessages(
          conversation.messages.map((message) => ({
            id: `${character.id}-${message.sequenceNumber}`,
            role: message.senderType === 'USER' ? 'detective' : 'character',
            content: message.content,
            createdAt: message.createdAt,
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
  }, [character.id, character.openingStatement, maxAsks]);

  const asksLeft = Math.max(0, maxAsks - asksUsed);

  const ask = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || inFlight.current || conversationCompleted || asksLeft === 0) return;

      inFlight.current = true;
      setError(null);
      setIsLoading(true);

      const questionId = uid();
      const answerId = uid();
      const createdAt = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { id: questionId, role: 'detective', content: question, createdAt },
        { id: answerId, role: 'character', content: '', createdAt, pending: true },
      ]);

      try {
        const response = await askCharacter({
          characterId: character.id,
          sessionId,
          question,
        });
        setMessages((prev) =>
          prev.map((message) =>
            message.id === answerId ? { ...message, content: response.reply } : message,
          ),
        );
        setAsksUsed(Math.min(response.questionCount, maxAsks));
        setConversationCompleted(response.completed);
        setRecommendedQuestions(normalizeSuggestions(response.recommendedQuestions));
      } catch (e) {
        setError(e instanceof Error ? e.message : '답변을 가져오지 못했습니다.');
        setMessages((prev) =>
          prev.filter((message) => message.id !== questionId && message.id !== answerId),
        );
      } finally {
        setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, pending: false } : m)));
        setIsLoading(false);
        inFlight.current = false;
      }
    },
    [askCharacter, asksLeft, character.id, conversationCompleted, maxAsks, sessionId],
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
    initialMessage,
    asksLeft,
    isLoading,
    isCompleting,
    completed: conversationCompleted || asksLeft === 0,
    error,
    suggestions: conversationCompleted || asksLeft === 0 ? [] : recommendedQuestions,
    ask,
    completeEarly,
  };
}

export type { Params as UseInterrogationParams, Result as UseInterrogationResult };
