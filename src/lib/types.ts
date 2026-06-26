// Shared API types mirrored from the Django serializers (camelCase responses).

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type Rank = { name: string; emoji: string; threshold: number };

export type Rewards = {
  points: number;
  streak: number;
  rank: Rank;
  nextRank: Rank | null;
  rankProgress: number;
  pointsToNextRank: number;
  lastAward: number;
  lastReason: string | null;
};

export type Subscription = {
  isPremium: boolean;
  usageCount: number;
  usageLimit: number;
  usageResetsAt: string | null;
  remainingFree: number;
  canGenerate: boolean;
  expiresAt: string | null;
};

export type Me = {
  user: User;
  rewards: Rewards;
  subscription: Subscription;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
  topic?: string;
  difficulty?: string;
};

export type StudySection = { title: string; content: string; order: number };

export type WordChallenge = { word: string; clue: string };

export type StudySet = {
  id: string;
  title: string;
  sourceKind: "link" | "text" | "file";
  sourceRef?: string;
  summary?: string;
  keyPoints?: string[];
  topics?: string[];
  sections: StudySection[];
  quiz: QuizQuestion[];
  wordGame: WordChallenge[];
  preview?: string;
  status: "pending" | "generating" | "ready" | "failed";
  createdAt: string;
};

export type StudySetStatus = {
  id: string;
  status: StudySet["status"];
  error: string | null;
  preview?: string;
  keyPoints?: string[];
  batchesTotal?: number;
  batchesDone?: number;
  progress: number;
};

export type GameManifestEntry = {
  key: string;
  slug: string;
  version: string;
  name: string;
  description?: string;
  icon?: string;
  emoji?: string;
  coverColors?: string[];
  difficulty?: string;
  requires?: string[];
  minAppVersion?: string;
  sdkVersion?: string;
};

export type ExamPlan = {
  id: number;
  materialId: string;
  materialTitle: string;
  examTitle: string;
  examDate: string;
  questionsPerDay: number;
  topics: string[];
  createdAt: string;
  results: Record<string, { correct: number; total: number; completed?: boolean }>;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
