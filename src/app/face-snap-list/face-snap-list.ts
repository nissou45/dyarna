import { Component, computed, inject, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaceSnap } from '../models/snap.model';
import { FaceSnapComponent } from '../face-snap/face-snap';
import { FaceSnapsService } from '../services/face-snaps.service';
import { StorageService } from '../services/storage.service';
import { SearchBarComponent } from '../search-bar/search-bar';
import { UnsplashSearchComponent } from '../unsplash-search/unsplash-search';
import { InfiniteScrollDirective } from '../directives/infinite-scroll.directive';
import { FACE_SNAPS_UI } from '@core';

@Component({
  selector: 'app-face-snap-list',
  standalone: true,
  imports: [
    FormsModule,
    FaceSnapComponent,
    SearchBarComponent,
    UnsplashSearchComponent,
    InfiniteScrollDirective,
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
  sortBy: 'date' | 'popularity' = 'date';
  filterBySnapType = 'all';
  currentPage = 1;
  pageSize = 6;

  showCreateForm = false;
  newSnap = {
    title: '',
    description: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  };

  filteredSnaps = computed(() => {
    let snaps = this.faceSnaps();

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      snaps = snaps.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          (s.location && s.location.toLowerCase().includes(q)),
      );
    }

    if (this.activeTag) {
      snaps = snaps.filter(s => s.tags.includes(this.activeTag!));
    }

    if (this.filterBySnapType !== 'all') {
      const tag = this.filterBySnapType.toLowerCase();
      snaps = snaps.filter(s => s.tags.some(t => t.toLowerCase() === tag));
    }

    if (this.sortBy === 'date') {
      snaps = [...snaps].sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
    } else {
      snaps = [...snaps].sort((a, b) => b.likes - a.likes);
    }

    return snaps;
  });

  displayedSnaps = computed(() =>
    this.filteredSnaps().slice(0, this.pageSize * this.currentPage),
  );

  hasMore = computed(() => this.displayedSnaps().length < this.filteredSnaps().length);

  loadMore(): void {
    this.currentPage++;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onTagClick(tag: string): void {
    this.activeTag = this.activeTag === tag ? null : tag;
    this.currentPage = 1;
  }

  clearTag(): void {
    this.activeTag = null;
    this.currentPage = 1;
  }

  onLikeClick(snapId: string): void {
    this.storageService.toggleLikeSnap(snapId);
    this.faceSnapsService.likeFaceSnap(snapId);
  }

  isLiked(snapId: string): boolean {
    return this.storageService.isSnapLiked(snapId);
  }

  onSortChange(value: string): void {
    this.sortBy = value as 'date' | 'popularity';
    this.currentPage = 1;
  }

  onFilterChange(value: string): void {
    this.filterBySnapType = value;
    this.currentPage = 1;
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
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    };
    this.showCreateForm = false;
    this.currentPage = 1;
  }
}
