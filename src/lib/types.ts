// Shared API types mirrored from the Django serializers (camelCase responses).

export type User = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  /** Free-form cross-device settings synced via me/. */
  preferences?: Record<string, unknown>;
};

/** Daily rewards activity point (GET rewards/history/). */
export type HistoryPoint = { ymd: string; points: number; count: number };

/** Per-set progress analytics (GET progress/me/). */
export type ProgressAnalytics = {
  secondsSpent?: number;
  sectionsCompleted?: number;
  sectionsTotal?: number;
  studySets?: {
    id: string;
    title: string;
    sectionsTotal: number;
    sectionsCompleted: number;
    secondsSpent: number;
    avgScorePct: number | null;
  }[];
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

/** Instant, no-LLM preview the backend builds before generation runs. */
export type StudyPreview = {
  outline?: string[];
  keyTerms?: string[];
  summary?: string;
  readingMinutes?: number;
  wordCount?: number;
};

export type StudyStatus =
  | "pending"
  | "processing"
  | "partial"
  | "ready"
  | "failed";

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
  preview?: StudyPreview;
  status: StudyStatus;
  createdAt: string;
};

export type StudySetStatus = {
  id: string;
  status: StudyStatus;
  error: string | null;
  preview?: StudyPreview;
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
  /** Target score: a great run scores this many in-game points. */
  maxScore?: number;
  /** Profile points earned for hitting maxScore (proportional below it). */
  rewardCap?: number;
};

export type ExamStatus =
  | "draft"
  | "generating"
  | "proposed"
  | "active"
  | "completed";

export type ExamPlan = {
  id: string;
  materialId: string;
  materialTitle: string;
  examTitle: string;
  examDate: string;
  questionsPerDay: number;
  topics: string[];
  status: ExamStatus;
  approvedAt: string | null;
  excludedTopics: string[];
  frequencyMultiplier: number;
  emailReminders: boolean;
  createdAt: string;
  results: Record<string, { correct: number; total: number; completed?: boolean }>;
  progress?: { totalDays: number; completedDays: number };
  /** Present on the generate/ response. */
  days?: ExamDaySummary[];
};

export type ExamDaySummary = {
  ymd: string;
  dayIndex: number;
  sectionIndex: number;
  sectionTitle: string;
  questionCount: number;
};

export type ExamToday = {
  date: string;
  dayIndex: number;
  status: ExamStatus;
  section: { title: string; content: string; example: string };
  questions: QuizQuestion[];
  reviewQuestions: QuizQuestion[];
  result: { correct: number; total: number; completed: boolean } | null;
} | null;

export type ExamReminder = {
  planId: string;
  planTitle: string;
  ymd: string;
  sessionDone: boolean;
  dueReview: number;
  daysLeft: number;
};

export type ExamSettings = {
  frequencyMultiplier: number;
  excludedTopics: string[];
  questionsPerDay: number;
  emailReminders: boolean;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

/** progress/activity/ — timestamped analytics for the Activity page. */
export type ActivityAnalytics = {
  days: number;
  daily: {
    date: string;
    seconds: number;
    correct: number;
    total: number;
    events: number;
  }[];
  hourlySeconds: number[];
  totals: {
    seconds: number;
    activeDays: number;
    avgSecondsPerActiveDay: number;
    accuracyPct: number | null;
    answered: number;
    sectionsCompleted: number;
  };
  recent: {
    kind: "heartbeat" | "section" | "quiz";
    studySetTitle: string;
    seconds: number;
    correct: number;
    total: number;
    createdAt: string;
  }[];
};

/** Supervisor channel (schools): guardian links + pushed content. */
export type GuardianStatus = {
  isParent: boolean;
  children: { linkId: number; id: string; name: string; email: string }[];
  parents: { linkId: number; id: string; name: string; email: string }[];
};

export type Assignment = {
  id: number;
  studySetId: string;
  title: string;
  note: string;
  createdAt: string;
  openedAt: string | null;
  sectionsTotal: number;
  sectionsCompleted: number;
  student?: { id: string; name: string };
  supervisor?: { id: string; name: string };
};
