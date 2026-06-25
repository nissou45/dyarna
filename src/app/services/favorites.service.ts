import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Favorite, FavoritesResponse } from '../core/types';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/favorites`;

  private favoritesSignal = signal<Favorite[]>([]);

  readonly favorites = this.favoritesSignal.asReadonly();

  loadFavorites(): void {
    this.http.get<FavoritesResponse>(this.API)
      .pipe(catchError(() => throwError(() => new Error('Erreur chargement favoris'))))
      .subscribe({
        next: (res) => this.favoritesSignal.set(res.favorites),
        error: () => {},  // silencieux si non connecté
      });
  }

  isFavorite(cityId: string): boolean {
    return this.favoritesSignal().some((f) => f.cityId === cityId);
  }

  addFavorite(cityId: string): Observable<{ favorite: Favorite }> {
    const previous = this.favoritesSignal();
    this.favoritesSignal.update((f) => [...f, { _id: 'optimistic', userId: '', cityId, createdAt: new Date().toISOString() }]);

    return this.http.post<{ favorite: Favorite }>(`${this.API}/${cityId}`, {}).pipe(
      tap((res) => {
        this.favoritesSignal.update((f) =>
          f.map((item) => (item._id === 'optimistic' ? res.favorite : item)),
        );
      }),
      catchError((err: HttpErrorResponse) => {
        this.favoritesSignal.set(previous);
        return throwError(() => err);
      }),
    );
  }

  removeFavorite(cityId: string): Observable<void> {
    const previous = this.favoritesSignal();
    this.favoritesSignal.update((f) => f.filter((item) => item.cityId !== cityId));

    return this.http.delete<void>(`${this.API}/${cityId}`).pipe(
      catchError((err: HttpErrorResponse) => {
        this.favoritesSignal.set(previous);
        return throwError(() => err);
      }),
    );
  }
}
