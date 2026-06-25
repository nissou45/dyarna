import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { GalleryPhoto } from '../core/types';
import { GalleryService } from '../services/gallery.service';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-photo-lightbox',
  standalone: true,
  templateUrl: './photo-lightbox.component.html',
  styleUrl: './photo-lightbox.component.scss',
})
export class PhotoLightboxComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly auth = inject(AuthService);
  private readonly toastService = inject(ToastService);

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
      error: () => this.toastService.error('Impossible d\'aimer cette photo.'),
    });
  }

  unlike(): void {
    this.galleryService.unlike(this.photo._id).subscribe({
      next: (res) => {
        this.isLiked.set(false);
        this.likesCount = res.likesCount;
        this.liked.emit({ photoId: this.photo._id, likesCount: res.likesCount });
      },
      error: () => this.toastService.error('Impossible de retirer le like.'),
    });
  }

  deletePhoto(): void {
    if (!confirm('Supprimer cette photo ?')) return;
    this.galleryService.delete(this.photo._id).subscribe({
      next: () => {
        this.deleted.emit(this.photo._id);
        this.close.emit();
      },
      error: () => this.toastService.error('Impossible de supprimer la photo.'),
    });
  }
}
