import { Component, ChangeDetectionStrategy, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaceSnap } from '../models/snap.model';
import { FaceSnapComponent } from '../face-snap/face-snap';
import { FaceSnapsService } from '../services/face-snaps.service';
import { StorageService } from '../services/storage.service';
import { UnsplashSearchComponent } from '../unsplash-search/unsplash-search';
import { FACE_SNAPS_UI } from '@core';

@Component({
  selector: 'app-face-snap-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, FaceSnapComponent, UnsplashSearchComponent],
  templateUrl: './face-snap-list.html',
  styleUrl: './face-snap-list.scss',
})
export class FaceSnapListComponent {
  private faceSnapsService = inject(FaceSnapsService);
  private storageService  = inject(StorageService);

  readonly ui = FACE_SNAPS_UI;

  readonly faceSnaps: Signal<FaceSnap[]> = this.faceSnapsService.getFaceSnaps();

  /** IDs des snaps likés — Set réactif, mis à jour via StorageService.likedIds signal */
  readonly likedSet = computed(() => this.storageService.likedIds());

  readonly searchQuery = signal('');
  readonly activeTag   = signal<string | null>(null);
  readonly sortBy      = signal<'date' | 'popularity' | 'alpha'>('popularity');
  readonly activeTab   = signal<'villes' | 'cuisine'>('villes');

  showCreateForm = false;
  newSnap = {
    title: '',
    description: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
  };

  readonly allTags = [
    'ville', 'cuisine', 'tradition', 'medina', 'desert', 'montagne',
    'mer', 'souk', 'culture', 'nature', 'histoire', 'architecture',
    'artisanat', 'patrimoine', 'plage', 'gastronomie', 'moderne',
  ];

  readonly filteredSnaps = computed(() => {
    let snaps = this.faceSnaps();
    const tab   = this.activeTab();
    const query = this.searchQuery();
    const tag   = this.activeTag();
    const sort  = this.sortBy();

    snaps = tab === 'cuisine'
      ? snaps.filter(s => s.tags.includes('cuisine'))
      : snaps.filter(s => s.tags.includes('ville'));

    if (query) {
      const q = query.toLowerCase();
      snaps = snaps.filter(s =>
        s.title.toLowerCase().includes(q) ||
        (s.location && s.location.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q),
      );
    }

    if (tag) snaps = snaps.filter(s => s.tags.includes(tag));

    if (sort === 'date') {
      snaps = [...snaps].sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
    } else if (sort === 'alpha') {
      snaps = [...snaps].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      snaps = [...snaps].sort((a, b) => b.likes - a.likes);
    }

    return snaps;
  });

  onSearchChange(query: string): void { this.searchQuery.set(query); }
  onTagClick(tag: string): void { this.activeTag.set(this.activeTag() === tag ? null : tag); }
  clearTag(): void { this.activeTag.set(null); }
  onSortChange(value: string): void { this.sortBy.set(value as 'date' | 'popularity' | 'alpha'); }
  toggleCreateForm(): void { this.showCreateForm = !this.showCreateForm; }
  onPhotoSelected(url: string): void { this.newSnap.imageUrl = url; }

  onLikeClick(snapId: string): void {
    this.storageService.toggleLikeSnap(snapId);
    this.faceSnapsService.likeFaceSnap(snapId);
  }

  addNewSnap(): void {
    if (!this.newSnap.title || !this.newSnap.description) return;

    const snap = new FaceSnap(this.newSnap.title, this.newSnap.description, this.newSnap.imageUrl, new Date(), 0);
    if (this.newSnap.location) snap.setLocation(this.newSnap.location);
    this.faceSnapsService.addFaceSnap(snap);
    this.newSnap = { title: '', description: '', location: '', imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800' };
    this.showCreateForm = false;
  }
}
