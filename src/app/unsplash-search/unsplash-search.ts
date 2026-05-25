import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnsplashService, UnsplashPhoto } from '../services/unsplash.service';
import { FACE_SNAPS_UI } from '@core';

@Component({
  selector: 'app-unsplash-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './unsplash-search.html',
  styleUrl: './unsplash-search.scss',
})
export class UnsplashSearchComponent {
  private unsplashService = inject(UnsplashService);

  @Output() photoSelected = new EventEmitter<string>();

  readonly ui = FACE_SNAPS_UI;
  query = '';
  photos: UnsplashPhoto[] = [];
  loading = false;
  searched = false;

  async search(): Promise<void> {
    if (!this.query.trim()) return;

    this.loading = true;
    this.searched = true;
    this.photos = await this.unsplashService.searchPhotos(this.query.trim());
    this.loading = false;
  }

  selectPhoto(url: string): void {
    this.photoSelected.emit(url);
  }
}
