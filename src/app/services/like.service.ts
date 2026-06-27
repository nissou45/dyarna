import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikeResponse, LikeCheckResponse, LikeBatchResponse } from '../core/types';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/likes`;

  like(targetId: string, targetType: 'city' | 'dish'): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(this.API, { targetId, targetType });
  }

  unlike(targetId: string): Observable<LikeResponse> {
    return this.http.delete<LikeResponse>(`${this.API}/${targetId}`);
  }

  check(targetId: string): Observable<LikeCheckResponse> {
    return this.http.get<LikeCheckResponse>(`${this.API}/check/${targetId}`);
  }

  getCount(targetId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API}/count/${targetId}`);
  }

  batchCheck(targetIds: string[]): Observable<LikeBatchResponse> {
    return this.http.get<LikeBatchResponse>(`${this.API}/batch?ids=${targetIds.join(',')}`);
  }
}
