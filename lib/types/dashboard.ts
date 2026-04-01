// TypeScript types for the AntarYatra Dashboard

export interface UserProfile {
  id: string
  display_name: string | null
  anonymous_name: string | null
  avatar_url: string | null
  total_points: number
  current_streak: number
  longest_streak: number
  privacy_mode: boolean
  created_at: string
  updated_at: string
}

export type MoodLabel = 'very_bad' | 'bad' | 'neutral' | 'good' | 'great'

export interface MoodEntry {
  id: string
  user_id: string
  mood_value: number // 1-5
  mood_label: MoodLabel
  energy_level: number | null // 1-5
  stress_level: number | null // 1-5
  anxiety_level: number | null // 1-5
  activities: string[] | null
  notes: string | null
  created_at: string
  date: string
}

export interface JournalEntry {
  id: string
  user_id: string
  title: string | null
  content: string
  mood_at_start: number | null
  mood_at_end: number | null
  ai_prompt: string | null
  ai_insights: string | null
  ai_sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' | null
  tags: string[] | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export type InsightType = 'weekly_summary' | 'pattern_detected' | 'recommendation' | 'milestone'

export interface AIInsight {
  id: string
  user_id: string
  insight_type: InsightType
  title: string
  content: string
  data: Record<string, any> | null
  is_read: boolean
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  achievement_name: string
  achievement_description: string | null
  points_earned: number
  icon: string | null
  unlocked_at: string
}

export interface PointTransaction {
  id: string
  user_id: string
  points: number
  reason: string
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  anonymous_name: string
  title: string | null
  content: string
  category: string | null
  tags: string[] | null
  likes_count: number
  replies_count: number
  hugs_count: number
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export interface CommunityReply {
  id: string
  post_id: string
  user_id: string
  anonymous_name: string
  content: string
  likes_count: number
  created_at: string
}

export interface CommunityLike {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface JournalingPrompt {
  id: string
  category: string
  prompt: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  tags: string[] | null
  is_active: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  metric_type: string
  metric_value: number
  period: 'daily' | 'weekly' | 'monthly'
  date: string
  created_at: string
}

// Dashboard Statistics
export interface DashboardStats {
  currentStreak: number
  totalJournals: number
  totalPoints: number
  moodAverage: number
  recentMoods: MoodEntry[]
  recentInsights: AIInsight[]
  nextAchievement: UserAchievement | null
}

// Chart Data Types
export interface MoodTrendData {
  date: string
  mood: number
  energy: number
  stress: number
  anxiety: number
}

export interface ActivityFrequency {
  activity: string
  count: number
}

// Achievement Definitions
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: number
  points: number
  type: 'journal' | 'mood' | 'streak' | 'community' | 'milestone'
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_journal',
    name: 'First Steps',
    description: 'Write your first journal entry',
    icon: '✍️',
    requirement: 1,
    points: 10,
    type: 'journal'
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Journal for 7 days in a row',
    icon: '🔥',
    requirement: 7,
    points: 50,
    type: 'streak'
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Journal for 30 days in a row',
    icon: '🏆',
    requirement: 30,
    points: 200,
    type: 'streak'
  },
  {
    id: 'mood_tracker',
    name: 'Mood Tracker',
    description: 'Track your mood for 10 days',
    icon: '😊',
    requirement: 10,
    points: 25,
    type: 'mood'
  },
  {
    id: 'community_helper',
    name: 'Community Helper',
    description: 'Post 5 replies in the community',
    icon: '🤝',
    requirement: 5,
    points: 30,
    type: 'community'
  },
  {
    id: 'journal_veteran',
    name: 'Journal Veteran',
    description: 'Write 50 journal entries',
    icon: '📚',
    requirement: 50,
    points: 100,
    type: 'journal'
  },
  {
    id: 'hundred_days',
    name: 'Hundred Days',
    description: 'Journal for 100 days in a row',
    icon: '💯',
    requirement: 100,
    points: 500,
    type: 'streak'
  },
  {
    id: 'self_aware',
    name: 'Self Aware',
    description: 'Complete mood tracking for 30 days',
    icon: '🧠',
    requirement: 30,
    points: 75,
    type: 'mood'
  },
  {
    id: 'chat_newcomer',
    name: 'Chat Newcomer',
    description: 'Send your first message in the chat room',
    icon: '💬',
    requirement: 1,
    points: 5,
    type: 'community'
  },
  {
    id: 'chat_regular',
    name: 'Chat Regular',
    description: 'Send 25 messages in the chat room',
    icon: '💭',
    requirement: 25,
    points: 30,
    type: 'community'
  },
  {
    id: 'chat_veteran',
    name: 'Chat Veteran',
    description: 'Send 100 messages in the chat room',
    icon: '🗨️',
    requirement: 100,
    points: 100,
    type: 'community'
  },
  {
    id: 'voice_communicator',
    name: 'Voice Communicator',
    description: 'Send 10 voice messages',
    icon: '🎤',
    requirement: 10,
    points: 50,
    type: 'community'
  },
]

// Mood configuration
export const MOOD_CONFIG = {
  1: {
    label: 'very_bad' as MoodLabel,
    emoji: '😢',
    color: '#ef4444',
    name: 'Very Bad'
  },
  2: {
    label: 'bad' as MoodLabel,
    emoji: '😟',
    color: '#f97316',
    name: 'Bad'
  },
  3: {
    label: 'neutral' as MoodLabel,
    emoji: '😐',
    color: '#eab308',
    name: 'Neutral'
  },
  4: {
    label: 'good' as MoodLabel,
    emoji: '😊',
    color: '#22c55e',
    name: 'Good'
  },
  5: {
    label: 'great' as MoodLabel,
    emoji: '😄',
    color: '#10b981',
    name: 'Great'
  }
}

// Common activities for mood tracking
export const COMMON_ACTIVITIES = [
  'Exercise',
  'Meditation',
  'Reading',
  'Socializing',
  'Work',
  'Sleep',
  'Hobbies',
  'Nature',
  'Music',
  'Therapy',
  'Self-care',
  'Family time'
]

// Community categories
export const COMMUNITY_CATEGORIES = [
  { value: 'anxiety', label: 'Anxiety', color: '#f59e0b' },
  { value: 'depression', label: 'Depression', color: '#6366f1' },
  { value: 'success_story', label: 'Success Story', color: '#10b981' },
  { value: 'seeking_support', label: 'Seeking Support', color: '#ec4899' },
  { value: 'coping_strategies', label: 'Coping Strategies', color: '#8b5cf6' },
  { value: 'relationships', label: 'Relationships', color: '#06b6d4' },
  { value: 'self_improvement', label: 'Self Improvement', color: '#14b8a6' },
  { value: 'general', label: 'General', color: '#64748b' }
]
