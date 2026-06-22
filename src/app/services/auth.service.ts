import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, AuthResponse, RefreshResponse } from '../core/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API = `${environment.apiUrl}/auth`;
  private readonly STORAGE_KEY = 'dyarna_user_data';
  private accessToken: string | null = null;

  private userSignal = signal<User | null>(this.loadStoredUser());
  private readySignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);
  readonly currentPseudo = computed(() => this.userSignal()?.displayName ?? 'Voyageur');
  readonly ready = this.readySignal.asReadonly();

  constructor() {
    const stored = this.loadStoredUser();
    const savedToken = sessionStorage.getItem('dyarna_access_token');
    if (stored && savedToken) {
      this.accessToken = savedToken;
    } else if (stored && !savedToken) {
      this.userSignal.set(null);
      this.clearStorage();
    }
    this.readySignal.set(true);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  register(email: string, password: string, displayName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/register`, { email, password, displayName })
      .pipe(
        tap((res) => this.handleAuthResponse(res)),
        catchError((err) => throwError(() => err)),
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => this.handleAuthResponse(res)),
        catchError((err) => throwError(() => err)),
      );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${this.API}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.accessToken = res.accessToken;
          sessionStorage.setItem('dyarna_access_token', res.accessToken);
        }),
        catchError((err) => {
          this.logout();
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    if (this.accessToken) {
      this.http.post(`${this.API}/logout`, {}, { withCredentials: true }).subscribe({
        error: () => {},
      });
    }
    this.accessToken = null;
    this.userSignal.set(null);
    this.clearStorage();
    this.router.navigateByUrl('/');
  }

  getGoogleLoginUrl(): string {
    return `${this.API}/google`;
  }

  handleGoogleCallback(token: string, userJson: string): void {
    try {
      const user: User = JSON.parse(decodeURIComponent(userJson));
      this.accessToken = token;
      sessionStorage.setItem('dyarna_access_token', token);
      this.storeUser(user);
      this.userSignal.set(user);
    } catch {
      this.router.navigateByUrl('/connexion?error=invalid_google_data');
    }
  }

  private handleAuthResponse(res: AuthResponse): void {
    this.accessToken = res.accessToken;
    sessionStorage.setItem('dyarna_access_token', res.accessToken);
    this.storeUser(res.user);
    this.userSignal.set(res.user);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private loadStoredUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem('dyarna_access_token');
  }
}
