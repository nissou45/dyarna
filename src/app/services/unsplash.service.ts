import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  async searchPhotos(query: string): Promise<UnsplashPhoto[]> {
    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${environment.unsplashAccessKey}`,
        },
      });

      if (!response.ok) {
        console.error('Unsplash API error:', response.status, response.statusText);
        return [];
      }

      const data: UnsplashSearchResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Unsplash search failed:', error);
      return [];
    }
  }
}
