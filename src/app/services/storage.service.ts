import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly LIKED_SNAPS_KEY = 'dyarna_liked_snaps';

  getLikedSnapIds(): string[] {
    return (this.getObject(this.LIKED_SNAPS_KEY) as string[]) ?? [];
  }

  toggleLikeSnap(snapId: string): boolean {
    const likedIds = this.getLikedSnapIds();
    const index = likedIds.indexOf(snapId);
    if (index === -1) {
      likedIds.push(snapId);
      this.saveObject(this.LIKED_SNAPS_KEY, likedIds);
      return true;
    }
    likedIds.splice(index, 1);
    this.saveObject(this.LIKED_SNAPS_KEY, likedIds);
    return false;
  }

  isSnapLiked(snapId: string): boolean {
    return this.getLikedSnapIds().includes(snapId);
  }

  saveObject(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getObject(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}
