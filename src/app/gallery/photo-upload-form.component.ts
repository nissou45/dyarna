import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { GalleryService } from '../services/gallery.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-photo-upload-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './photo-upload-form.component.html',
  styleUrl: './photo-upload-form.component.scss',
})
export class PhotoUploadFormComponent {
  private readonly galleryService = inject(GalleryService);
  readonly auth = inject(AuthService);

  @Input({ required: true }) cityId!: string;
  @Output() uploaded = new EventEmitter<void>();

  protected readonly file = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly uploading = signal(false);
  protected readonly progress = signal(0);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal(false);
  protected readonly dragging = signal(false);

  protected caption = '';

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragging.set(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) this.setFile(f);
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    if (f) this.setFile(f);
  }

  private setFile(f: File): void {
    this.error.set(null);
    this.success.set(false);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
      this.error.set('Format non autorisé. Utilisez JPEG, PNG ou WebP.');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      this.error.set('L\'image ne doit pas dépasser 8 Mo.');
      return;
    }

    this.file.set(f);
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(f);
  }

  protected submit(): void {
    const file = this.file();
    if (!file) return;

    this.uploading.set(true);
    this.progress.set(0);
    this.error.set(null);
    this.success.set(false);

    this.galleryService.upload(this.cityId, file, this.caption || undefined).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((event.loaded / event.total) * 100));
        }
        if (event.type === HttpEventType.Response && event.body) {
          this.uploading.set(false);
          this.success.set(true);
          this.file.set(null);
          this.previewUrl.set(null);
          this.caption = '';
          this.uploaded.emit();
        }
      },
      error: (err) => {
        this.uploading.set(false);
        this.error.set(err.error?.error || 'Échec de l\'upload. Réessayez.');
      },
    });
  }
}
