import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CityCultureResponse } from '../core/types';

@Injectable({ providedIn: 'root' })
export class CultureService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/culture';

  getCultureContent(cityId: string): Observable<{
    state: 'loading' | 'ready' | 'unavailable';
    data: CityCultureResponse | null;
  }> {
    return this.http.get<CityCultureResponse>(`${this.BASE}/${cityId}`).pipe(
      map((response) => ({
        state: response.status as 'ready' | 'unavailable',
        data: response,
      })),
      catchError(() => of({ state: 'unavailable' as const, data: null })),
    );
  }
}
