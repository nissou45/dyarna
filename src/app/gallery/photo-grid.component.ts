import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GalleryPhoto } from '../core/types';

@Component({
  selector: 'app-photo-grid',
  standalone: true,
  template: `
    <div class="photo-grid">
      @for (photo of photos; track photo._id) {
        <div class="photo-grid__item" (click)="open.emit(photo)">
          <img
            [src]="photo.thumbnailUrl"
            [alt]="photo.caption || 'Photo'"
            class="photo-grid__img"
            loading="lazy"
          />
          <div class="photo-grid__overlay">
            <span>♥ {{ photo.likesCount }}</span>
            @if (photo.userId._id === currentUserId) {
              <span class="photo-grid__pending" title="En attente de modération">⏳</span>
            }
          </div>
        </div>
      }
    </div>

    @if (photos.length === 0) {
      <div class="photo-grid__empty">
        <p>Aucune photo pour le moment. Soyez le premier à partager !</p>
      </div>
    }
  `,
  styles: [`
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;
    }
    .photo-grid__item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      aspect-ratio: 4 / 3;
    }
    .photo-grid__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.2s;
    }
    .photo-grid__item:hover .photo-grid__img {
      transform: scale(1.05);
    }
    .photo-grid__overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 6px 10px;
      background: linear-gradient(transparent, rgba(0,0,0,0.5));
      color: #fff;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .photo-grid__item:hover .photo-grid__overlay {
      opacity: 1;
    }
    .photo-grid__pending {
      font-size: 14px;
    }
    .photo-grid__empty {
      padding: 32px;
      text-align: center;
      color: #8a7f6e;
      font-size: 14px;
    }
  `],
})
export class PhotoGridComponent {
  @Input({ required: true }) photos: GalleryPhoto[] = [];
  @Input() currentUserId = '';
  @Output() open = new EventEmitter<GalleryPhoto>();
}
