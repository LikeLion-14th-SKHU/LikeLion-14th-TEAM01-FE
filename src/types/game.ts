export type CaseId = 'signature' | 'function';

export interface Character {
  id: string;
  name: string;
  role: string;
  portrait: string;
  standing?: string;
  standingScale?: number;
  backdrop?: string;
  openingStatement?: string;
}

export type MessageRole = 'detective' | 'character';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt?: string;
  pending?: boolean;
}

export interface AskRequest {
  characterId: string;
  sessionId: string;
  question: string;
}

export interface AskResponse {
  reply: string;
  questionCount: number;
  completed: boolean;
  recommendedQuestions: string[];
}

export type AskCharacter = (req: AskRequest) => Promise<AskResponse>;
