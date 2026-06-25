import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly LIKED_SNAPS_KEY = 'dyarna_liked_snaps';

  /** Signal réactif des IDs likés — permet au computed() de se mettre à jour */
  readonly likedIds = signal<Set<string>>(new Set(this.getLikedSnapIds()));

  getLikedSnapIds(): string[] {
    return this.getObject<string[]>(this.LIKED_SNAPS_KEY) ?? [];
  }

  toggleLikeSnap(snapId: string): boolean {
    const likedIds = this.getLikedSnapIds();
    const index = likedIds.indexOf(snapId);
    if (index === -1) {
      likedIds.push(snapId);
      this.saveObject(this.LIKED_SNAPS_KEY, likedIds);
      this.likedIds.set(new Set(likedIds));
      return true;
    }
    likedIds.splice(index, 1);
    this.saveObject(this.LIKED_SNAPS_KEY, likedIds);
    this.likedIds.set(new Set(likedIds));
    return false;
  }

  isSnapLiked(snapId: string): boolean {
    return this.likedIds().has(snapId);
  }

  saveObject<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }
}
