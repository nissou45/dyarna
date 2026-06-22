import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { GalleryPhoto } from '../core/types';
import { GalleryService } from '../services/gallery.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-photo-lightbox',
  standalone: true,
  template: `
    @if (photo) {
      <div class="lightbox" (click)="close.emit()">
        <div class="lightbox__content" (click)="$event.stopPropagation()">
          <button class="lightbox__close" (click)="close.emit()">✕</button>

          <img [src]="photo.url" [alt]="photo.caption || 'Photo'" class="lightbox__img" />

          <div class="lightbox__info">
            <div class="lightbox__meta">
              <span class="lightbox__author">{{ photo.userId.displayName }}</span>
              @if (photo.caption) {
                <p class="lightbox__caption">{{ photo.caption }}</p>
              }
            </div>

            <div class="lightbox__actions">
              @if (isLiked()) {
                <button class="lightbox__btn liked" (click)="unlike()">♥ {{ likesCount }}</button>
              } @else {
                <button class="lightbox__btn" (click)="like()">♡ {{ likesCount }}</button>
              }

              @if (canDelete()) {
                <button class="lightbox__btn lightbox__btn--danger" (click)="deletePhoto()">
                  Supprimer
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 24px;
    }
    .lightbox__content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .lightbox__close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      opacity: 0.7;
    }
    .lightbox__close:hover { opacity: 1; }
    .lightbox__img {
      max-width: 100%;
      max-height: 70vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .lightbox__info {
      position: absolute;
      bottom: -60px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      padding: 8px 0;
    }
    .lightbox__meta {
      flex: 1;
    }
    .lightbox__author {
      font-size: 14px;
      font-weight: 600;
    }
    .lightbox__caption {
      font-size: 13px;
      opacity: 0.8;
      margin: 4px 0 0;
    }
    .lightbox__actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .lightbox__btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .lightbox__btn:hover { background: rgba(255,255,255,0.25); }
    .lightbox__btn.liked {
      background: rgba(200, 97, 60, 0.4);
      border-color: #c8613c;
    }
    .lightbox__btn--danger {
      border-color: rgba(220, 38, 38, 0.5);
      color: #fca5a5;
    }
  `],
})
export class PhotoLightboxComponent {
  private readonly galleryService = inject(GalleryService);
  private readonly auth = inject(AuthService);

  @Input({ required: true }) photo!: GalleryPhoto;
  @Output() close = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();
  @Output() liked = new EventEmitter<{ photoId: string; likesCount: number }>();

  @Input() set initialLiked(value: boolean) {
    this.isLiked.set(value);
  }

  protected readonly isLiked = signal(false);
  protected likesCount = 0;

  ngOnInit(): void {
    this.likesCount = this.photo.likesCount;
  }

  canDelete(): boolean {
    const user = this.auth.user();
    return user?._id === this.photo.userId._id || user?.role === 'admin';
  }

  like(): void {
    this.galleryService.like(this.photo._id).subscribe({
      next: (res) => {
        this.isLiked.set(true);
        this.likesCount = res.likesCount;
        this.liked.emit({ photoId: this.photo._id, likesCount: res.likesCount });
      },
      error: () => {},
    });
  }

  unlike(): void {
    this.galleryService.unlike(this.photo._id).subscribe({
      next: (res) => {
        this.isLiked.set(false);
        this.likesCount = res.likesCount;
        this.liked.emit({ photoId: this.photo._id, likesCount: res.likesCount });
      },
      error: () => {},
    });
  }

  deletePhoto(): void {
    if (!confirm('Supprimer cette photo ?')) return;
    this.galleryService.delete(this.photo._id).subscribe({
      next: () => {
        this.deleted.emit(this.photo._id);
        this.close.emit();
      },
      error: () => {},
    });
  }
}
