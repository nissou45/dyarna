import { Injectable } from '@angular/core';

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    thumb: string;
    small: string;
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
  /** The Unsplash API key. Configure via localStorage or set a default. */
  private get apiKey(): string {
    return ''; // Set your Unsplash Access Key here or configure via env
  }

  private get isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'VOTRE_CLE_API_UNSPLASH';
  }

  /**
   * Search Unsplash for photos matching a query.
   * Returns an empty array if the API key is not configured.
   */
  async searchPhotos(query: string, perPage: number = 20): Promise<UnsplashPhoto[]> {
    if (!this.isConfigured) {
      console.warn('[UnsplashService] No API key configured. Skipping search.');
      return [];
    }

    try {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`;
      const response = await fetch(url, {
        headers: { Authorization: `Client-ID ${this.apiKey}` },
      });

      if (!response.ok) {
        console.error('[UnsplashService] API error:', response.status, response.statusText);
        return [];
      }

      const data: UnsplashSearchResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('[UnsplashService] Search failed:', error);
      return [];
    }
  }

  /**
   * Get the best single photo URL for a search term.
   * Returns null if no photos found or API not configured.
   */
  async getPhotoUrl(term: string, size: 'regular' | 'small' | 'thumb' = 'regular'): Promise<string | null> {
    const results = await this.searchPhotos(term, 1);
    if (results.length === 0) return null;
    return results[0].urls[size];
  }
}
