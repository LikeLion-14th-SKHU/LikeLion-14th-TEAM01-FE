import { api } from '../api/client';
import type { CharacterType, ConversationResponse } from '../api/types';
import { CHARACTER_TYPES } from '../data/characters';
import type { AskCharacter } from '../types/game';

const getCharacterType = (characterId: string): CharacterType => {
  const type = CHARACTER_TYPES[characterId];
  if (!type) throw new Error('지원하지 않는 캐릭터입니다.');
  return type;
};

export const getConversation = (characterId: string): Promise<ConversationResponse> =>
  api.getConversation(getCharacterType(characterId));

export const completeConversation = (characterId: string): Promise<ConversationResponse> =>
  api.completeConversation(getCharacterType(characterId));

export const askCharacter: AskCharacter = async ({ characterId, question }) => {
  const conversation = await api.askCharacter(getCharacterType(characterId), question);
  const latestMessage = conversation.messages.at(-1);
  const answer = latestMessage?.senderType === 'CHARACTER' ? latestMessage.content.trim() : '';

  if (!answer) throw new Error('용의자의 답변이 비어 있습니다.');
  return {
    reply: answer,
    questionCount: conversation.questionCount,
    completed: conversation.status === 'COMPLETED',
    recommendedQuestions: conversation.recommendedQuestions ?? [],
  };
};
