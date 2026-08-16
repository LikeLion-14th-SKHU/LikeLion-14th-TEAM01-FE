import { api } from '../api/client';
import type { CharacterType, ConversationResponse } from '../api/types';
import type { AskCharacter } from '../types/game';

const characterTypes: Record<string, CharacterType> = {
  clara: 'CLARA',
  johannes: 'JOHANNES',
  felix: 'FELIX',
  emil: 'EMIL',
};

const getCharacterType = (characterId: string): CharacterType => {
  const type = characterTypes[characterId];
  if (!type) throw new Error('지원하지 않는 캐릭터입니다.');
  return type;
};

export const getConversation = (characterId: string): Promise<ConversationResponse> =>
  api.getConversation(getCharacterType(characterId));

export const askCharacter: AskCharacter = async function* ({ characterId, question }) {
  const conversation = await api.askCharacter(getCharacterType(characterId), question);
  const answer = [...conversation.messages]
    .reverse()
    .find((message) => message.senderType === 'CHARACTER')?.content;

  if (!answer) throw new Error('용의자의 답변이 비어 있습니다.');
  yield answer;
};
