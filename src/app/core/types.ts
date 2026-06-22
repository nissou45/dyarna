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
