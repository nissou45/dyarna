import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Review,
  ReviewSummary,
  PaginatedReviews,
} from '../core/types';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/reviews`;

  getByCity(
    cityId: string,
    page: number = 1,
    limit: number = 10,
    sort: 'recent' | 'highest' | 'lowest' = 'recent',
  ): Observable<PaginatedReviews> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('sort', sort);

    return this.http.get<PaginatedReviews>(`${this.API}/city/${cityId}`, { params });
  }

  getSummary(cityId: string): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.API}/city/${cityId}/summary`);
  }

  getMyReviews(): Observable<{ reviews: Review[] }> {
    return this.http.get<{ reviews: Review[] }>(`${this.API}/me`);
  }

  create(cityId: string, rating: number, comment: string): Observable<{ review: Review }> {
    return this.http.post<{ review: Review }>(`${this.API}/${cityId}`, { rating, comment });
  }

  update(cityId: string, data: { rating?: number; comment?: string }): Observable<{ review: Review }> {
    return this.http.patch<{ review: Review }>(`${this.API}/${cityId}`, data);
  }

  delete(cityId: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${cityId}`);
  }
}
