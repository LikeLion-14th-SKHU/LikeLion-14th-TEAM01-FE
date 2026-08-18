export type DesignDirection = 'TRAVEL' | 'HANDS_FREE' | 'DAILY_TRAVEL';
export type CaseType = 'SIGNATURE' | 'FUNCTION';
export type CharacterType = 'CLARA' | 'JOHANNES' | 'FELIX' | 'EMIL';
export type GameStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'FAILED' | 'COMPLETED';
export type ConversationStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface TokenResponse {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
}

export interface LoginExchangeResponse {
  memberId: number;
  newMember: boolean;
  nickname: string;
  tokens: TokenResponse;
}

export interface GameProgressResponse {
  status: GameStatus;
  designDirection: DesignDirection | null;
  currentCase: CaseType | null;
  signatureSucceeded: boolean;
  functionSucceeded: boolean;
}

export interface ConversationMessageResponse {
  senderType: 'USER' | 'CHARACTER';
  sequenceNumber: number;
  content: string;
  createdAt: string;
}

export interface ConversationResponse {
  characterType: CharacterType;
  status: ConversationStatus;
  questionCount: number;
  maxQuestionCount: number;
  remainingQuestionCount: number;
  startedAt: string | null;
  completedAt: string | null;
  messages: ConversationMessageResponse[];
}

export interface FinalDeductionResponse {
  correct: boolean;
  progress: GameProgressResponse;
}

export interface DesignerPassResponse {
  passCode: string;
  issuedDate: string;
}

export interface MyPageResponse {
  designerName: string | null;
  designerPass: DesignerPassResponse | null;
}

export interface RecommendedProductResponse {
  id: number;
  name: string;
  imageUrl: string;
  detailUrl: string;
  displayOrder: number;
}

export interface ProductRecommendationResponse {
  designDirection: DesignDirection;
  products: RecommendedProductResponse[];
}
