import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { City } from '../data/cities';

@Injectable({ providedIn: 'root' })
export class CitiesApiService {
  private readonly http = inject(HttpClient);
  private cities$: Observable<{ cities: City[] }> | null = null;

  getCities(): Observable<{ cities: City[] }> {
    if (!this.cities$) {
      this.cities$ = this.http.get<{ cities: City[] }>('/api/cities').pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.cities$;
  }
}
