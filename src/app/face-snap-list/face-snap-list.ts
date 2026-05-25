import { Component, computed, inject, Signal } from '@angular/core';
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
  imports: [
    FormsModule,
    FaceSnapComponent,
    UnsplashSearchComponent,
  ],
  templateUrl: './face-snap-list.html',
  styleUrl: './face-snap-list.scss',
})
export class FaceSnapListComponent {
  private faceSnapsService = inject(FaceSnapsService);
  private storageService = inject(StorageService);

  readonly ui = FACE_SNAPS_UI;

  faceSnaps: Signal<FaceSnap[]> = this.faceSnapsService.getFaceSnaps();

  searchQuery = '';
  activeTag: string | null = null;
  sortBy: 'date' | 'popularity' | 'alpha' = 'popularity';

  showCreateForm = false;
  newSnap = {
    title: '',
    description: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
  };

  /** Tous les tags disponibles dans les données */
  readonly allTags = [
    'ville', 'cuisine', 'tradition', 'medina', 'desert', 'montagne',
    'mer', 'souk', 'culture', 'nature', 'histoire', 'architecture',
    'artisanat', 'patrimoine', 'plage', 'gastronomie', 'moderne',
  ];

  /** Snaps filtrés + triés — TOUS affichés (pas de pagination) */
  filteredSnaps = computed(() => {
    let snaps = this.faceSnaps();

    // Filtre recherche
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      snaps = snaps.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          (s.location && s.location.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q),
      );
    }

    // Filtre par tag
    if (this.activeTag) {
      snaps = snaps.filter(s => s.tags.includes(this.activeTag!));
    }

    // Tri
    if (this.sortBy === 'date') {
      snaps = [...snaps].sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
    } else if (this.sortBy === 'alpha') {
      snaps = [...snaps].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      snaps = [...snaps].sort((a, b) => b.likes - a.likes);
    }

    return snaps;
  });

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  onTagClick(tag: string): void {
    this.activeTag = this.activeTag === tag ? null : tag;
  }

  clearTag(): void {
    this.activeTag = null;
  }

  onLikeClick(snapId: string): void {
    this.storageService.toggleLikeSnap(snapId);
    this.faceSnapsService.likeFaceSnap(snapId);
  }

  isLiked(snapId: string): boolean {
    return this.storageService.isSnapLiked(snapId);
  }

  onSortChange(value: string): void {
    this.sortBy = value as 'date' | 'popularity' | 'alpha';
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  onPhotoSelected(url: string): void {
    this.newSnap.imageUrl = url;
  }

  addNewSnap(): void {
    if (!this.newSnap.title || !this.newSnap.description) return;

    const snap = new FaceSnap(
      this.newSnap.title,
      this.newSnap.description,
      this.newSnap.imageUrl,
      new Date(),
      0,
    );
    if (this.newSnap.location) {
      snap.setLocation(this.newSnap.location);
    }
    this.faceSnapsService.addFaceSnap(snap);
    this.newSnap = {
      title: '',
      description: '',
      location: '',
      imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
    };
    this.showCreateForm = false;
  }
}
