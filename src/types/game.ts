export type CaseId = 'signature' | 'blueprint' | 'studio';

export interface Character {
  id: string;
  name: string;
  role: string;
  portrait: string;
  standing?: string;
}

export type MessageRole = 'detective' | 'character';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  pending?: boolean;
}

export interface AskRequest {
  characterId: string;
  sessionId: string;
  question: string;
}

export interface AskResponse {
  reply: string;
}

export type AskCharacter = (req: AskRequest) => AsyncIterable<string>;
