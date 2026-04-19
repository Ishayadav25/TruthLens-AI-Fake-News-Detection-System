export interface BaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
}

export interface NewsVerificationResult {
  truthScore: number; // 0-100
  verdict: 'True' | 'Mostly True' | 'Partially True' | 'Misleading' | 'False';
  explanation: string;
  keyPoints: string[];
  sourcesNeeded?: string[];
}

export interface VerificationHistory {
  id: string;
  userId: string;
  content: string;
  result: NewsVerificationResult;
  timestamp: Date;
}
