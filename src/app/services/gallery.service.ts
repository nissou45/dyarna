import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map, filter } from 'rxjs';
import { PaginatedPhotos, PhotoLikeResponse, PhotoLikesBatchResponse, GalleryPhoto } from '../core/types';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/gallery';

  getByCity(cityId: string, page: number = 1, limit: number = 20) {
    return this.http.get<PaginatedPhotos>(`${this.BASE}/city/${cityId}?page=${page}&limit=${limit}`);
  }

  upload(cityId: string, file: File, caption?: string) {
    const formData = new FormData();
    formData.append('photo', file);
    if (caption) formData.append('caption', caption);
    return this.http.post<{ photo: GalleryPhoto }>(`${this.BASE}/upload/${cityId}`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  delete(photoId: string) {
    return this.http.delete(`${this.BASE}/${photoId}`);
  }

  like(photoId: string) {
    return this.http.post<PhotoLikeResponse>(`${this.BASE}/${photoId}/like`, {});
  }

  unlike(photoId: string) {
    return this.http.delete<PhotoLikeResponse>(`${this.BASE}/${photoId}/like`);
  }

  getUserLikes(photoIds: string[]) {
    return this.http.get<PhotoLikesBatchResponse>(`${this.BASE}/likes/batch?ids=${photoIds.join(',')}`);
  }
}
