import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItineraryResponse, CitySuggestion } from '../core/types';

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/itineraries';

  create(title: string, days: { cityId: string; nightsCount: number; notes?: string }[]) {
    return this.http.post<ItineraryResponse>(this.BASE, { title, days });
  }

  getById(id: string) {
    return this.http.get<ItineraryResponse>(`${this.BASE}/${id}`);
  }

  getMyItineraries() {
    return this.http.get<{ itineraries: import('../core/types').Itinerary[] }>(`${this.BASE}/mine`);
  }

  update(id: string, data: { title?: string; days?: { cityId: string; nightsCount: number; notes?: string }[] }) {
    return this.http.patch<ItineraryResponse>(`${this.BASE}/${id}`, data);
  }

  reorder(id: string, dayIds: string[]) {
    return this.http.patch<ItineraryResponse>(`${this.BASE}/${id}/reorder`, { dayIds });
  }

  delete(id: string) {
    return this.http.delete(`${this.BASE}/${id}`);
  }

  getSuggestions(id: string, limit: number = 3) {
    return this.http.get<{ suggestions: CitySuggestion[] }>(`${this.BASE}/${id}/suggestions?limit=${limit}`);
  }

  share(id: string) {
    return this.http.patch<{ shareToken: string }>(`${this.BASE}/${id}/share`, {});
  }

  unshare(id: string) {
    return this.http.patch(`${this.BASE}/${id}/unshare`, {});
  }

  getByShareToken(token: string) {
    return this.http.get<ItineraryResponse>(`${this.BASE}/public/${token}`);
  }

  exportPdf(id: string) {
    return this.http.get(`${this.BASE}/${id}/export-pdf`, { responseType: 'blob' });
  }
}
