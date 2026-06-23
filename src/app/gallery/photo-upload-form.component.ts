import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { GalleryService } from '../services/gallery.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-photo-upload-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (auth.user()) {
      <div class="photo-upload">
        <h4 class="photo-upload__title">Ajouter une photo</h4>

        <div
          class="photo-upload__dropzone"
          [class.photo-upload__dropzone--active]="dragging()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop($event)"
        >
          @if (previewUrl()) {
            <img [src]="previewUrl()" alt="Aperçu" class="photo-upload__preview" />
          } @else {
            <p>Glissez-déposez une photo ici ou cliquez pour choisir</p>
          }
          <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/webp"
            (change)="onFileSelected($event)"
            hidden
          />
          <button type="button" class="sn-btn ghost" (click)="fileInput.click()" [disabled]="uploading()">
            Choisir un fichier
          </button>
        </div>

        @if (error()) {
          <p class="photo-upload__error">{{ error() }}</p>
        }

        @if (file()) {
          <div class="photo-upload__caption">
            <input
              [(ngModel)]="caption"
              placeholder="Ajouter une légende (optionnelle, 200 car. max)"
              maxlength="200"
              class="photo-upload__input"
              [disabled]="uploading()"
            />
          </div>

          <button class="sn-btn block accent" (click)="submit()" [disabled]="uploading()">
            @if (uploading()) {
              @if (progress() > 0) {
                Upload… {{ progress() }}%
              } @else {
                Upload en cours…
              }
            } @else {
              Publier la photo
            }
          </button>
        }

        @if (success()) {
          <p class="photo-upload__success">Photo envoyée ! En attente de modération.</p>
        }
      </div>
    } @else {
      <div class="photo-upload photo-upload--disabled">
        <p>Connectez-vous pour ajouter vos photos.</p>
      </div>
    }
  `,
  styles: [`
    .photo-upload {
      background: var(--sn-surface);
      border: 1px solid var(--sn-line);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .photo-upload--disabled {
      opacity: 0.6;
      text-align: center;
      color: var(--sn-muted);
      font-size: 14px;
      padding: 24px;
    }
    .photo-upload__title {
      font-size: 15px;
      font-weight: 600;
      color: var(--sn-ink-2);
      margin: 0 0 12px;
    }
    .photo-upload__dropzone {
      border: 2px dashed var(--sn-line-3);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .photo-upload__dropzone:hover,
    .photo-upload__dropzone--active {
      border-color: var(--sn-accent);
      background: var(--sn-surface-3);
    }
    .photo-upload__dropzone p {
      margin: 0;
      font-size: 13px;
      color: var(--sn-muted);
    }
    .photo-upload__preview {
      max-width: 100%;
      max-height: 240px;
      border-radius: 6px;
      object-fit: contain;
    }
    .photo-upload__error {
      font-size: 13px;
      color: var(--sn-error-bright);
      margin: 8px 0 0;
    }
    .photo-upload__success {
      font-size: 13px;
      color: var(--sn-chart-success);
      margin: 8px 0 0;
    }
    .photo-upload__caption {
      margin: 12px 0;
    }
    .photo-upload__input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--sn-line-3);
      border-radius: 6px;
      font-size: 13px;
      color: var(--sn-ink-2);
      background: var(--sn-white);
      box-sizing: border-box;
    }
    .photo-upload__input:disabled {
      opacity: 0.5;
    }
  `],
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
