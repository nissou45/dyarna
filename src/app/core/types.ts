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

export interface ErrorResponse {
  error: string;
}
