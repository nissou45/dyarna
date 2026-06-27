export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface Favorite {
  _id: string;
  userId: string;
  cityId: string;
  createdAt: string;
}

export interface FavoritesResponse {
  favorites: Favorite[];
}

export interface Review {
  _id: string;
  userId: { _id: string; displayName: string; avatarUrl?: string };
  cityId: string;
  rating: number;
  comment: string;
  status: 'visible' | 'pending' | 'rejected';
  editedAt?: string;
  createdAt: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: { rating: number; count: number }[];
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
}

export interface CityCultureCuisine {
  name: string;
  description: string;
}

export interface CityCultureLegend {
  title: string;
  content: string;
}

export interface CityCultureResponse {
  status: 'ready' | 'unavailable';
  cityId: string;
  history?: string;
  traditions?: string[];
  legend?: CityCultureLegend | null;
  cuisine?: CityCultureCuisine[];
  sourceUrl?: string;
  lastFetchedAt?: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string;
  conditionLabel: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface MonthScore {
  month: number;
  score: number;
  label: 'ideal' | 'good' | 'average' | 'avoid';
}

export interface BestSeasonResult {
  bestMonths: number[];
  months: MonthScore[];
}

export interface FullWeatherInfo {
  current: CurrentWeather | null;
  stale: boolean;
  bestSeason: BestSeasonResult;
}

export interface CurrentWeatherResponse {
  current: CurrentWeather;
  stale: boolean;
}

export interface GalleryPhoto {
  _id: string;
  userId: { _id: string; displayName: string; avatarUrl?: string };
  cityId: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  likesCount: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface PaginatedPhotos {
  photos: GalleryPhoto[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PhotoLikeResponse {
  likesCount: number;
}

export interface PhotoLikesBatchResponse {
  likes: Record<string, boolean>;
}

export interface ItineraryDay {
  dayNumber: number;
  cityId: string;
  nightsCount: number;
  notes?: string;
}

export interface Itinerary {
  _id: string;
  userId: string;
  title: string;
  days: ItineraryDay[];
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItinerarySegment {
  from: string;
  to: string;
  distanceKm: number;
  travelTime: { hours: number; minutes: number };
}

export interface ItineraryComputed {
  segments: ItinerarySegment[];
  totalDistance: number;
  totalNights: number;
}

export interface ItineraryResponse {
  itinerary: Itinerary;
  computed: ItineraryComputed;
}

export interface CitySuggestion {
  cityId: string;
  name: string;
  distanceKm: number;
}

export interface QuizChoice {
  id: string;
  name: string;
}

export interface CurrentQuestion {
  questionIndex: number;
  totalQuestions: number;
  type: 'photo' | 'culture_fact' | 'climate_fact';
  clue: string;
  choices: QuizChoice[];
  score: number;
}

export interface StartQuizResponse {
  sessionId: string;
  currentQuestion: CurrentQuestion;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctCityId: string;
  correctCityName: string;
  pointsGained: number;
  totalScore: number;
  questionIndex: number;
  totalQuestions: number;
  isLastQuestion: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTimeMs: number;
  isNewBestScore: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  bestScore: number;
  gamesPlayed: number;
}

export interface UserRank {
  rank: number;
  score: number;
  totalPlayers: number;
}

export interface LikeResponse {
  likesCount: number;
}

export interface LikeCheckResponse {
  liked: boolean;
}

export interface LikeBatchResponse {
  likes: Record<string, boolean>;
}
