import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaceSnapsService } from '../services/face-snaps.service';
import { AuthService } from '../services/auth.service';
import { FavoritesService } from '../services/favorites.service';
import { FACE_SNAPS_UI } from '../core/constants/face-snaps.constants';

interface UserProfile {
  displayName: string;
  bio: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div>
      <div class="sn-profile__header">
        <div class="sn-avatar" style="width:72px; height:72px; font-size:28px;">{{ initials }}</div>
        <div>
          <h1 class="sn-profile__name">{{ profile.displayName || auth.currentPseudo() }}</h1>
          <p class="sn-profile__bio">{{ profile.bio || 'Carnet de voyage Maroc' }}</p>
          <p style="font-size:13px; color:var(--sn-muted); margin-top:4px;">
            {{ favoriteCount() }} favoris
          </p>
        </div>
        @if (!editing) {
          <button class="sn-btn ghost sm" (click)="startEditing()">{{ ui.SAVE }}</button>
        }
      </div>

      @if (editing) {
        <div style="padding: 24px 28px;">
          <label class="sn-field">
            <span class="sn-label">Pseudo</span>
            <input class="sn-input" [(ngModel)]="editProfile.displayName" />
          </label>
          <label class="sn-field">
            <span class="sn-label">Bio</span>
            <textarea class="sn-area" [(ngModel)]="editProfile.bio"></textarea>
          </label>
          <div style="display:flex; gap:8px; margin-top:16px;">
            <button class="sn-btn accent sm" (click)="saveEditing()">{{ ui.SAVE }}</button>
            <button class="sn-btn ghost sm" (click)="cancelEditing()">{{ ui.CANCEL }}</button>
          </div>
        </div>
      }

      <div class="sn-tabs">
        <a href="#" class="active">Mes découvertes</a>
      </div>

      <div class="sn-grid sn-stagger" style="padding: 0 28px 28px;">
        @for (snap of faceSnaps(); track snap.id) {
          <div class="sn-card sn-fade-in" style="cursor:pointer;" [routerLink]="['/decouvertes', snap.id]">
            <div class="sn-card__media">
              <img [src]="snap.imageUrl" [alt]="snap.title" loading="lazy" />
            </div>
            <div class="sn-card__body">
              <h3 class="sn-card__title">{{ snap.title }}</h3>
              @if (snap.location) {
                <div class="sn-card__location">{{ snap.location }}</div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private faceSnapsService = inject(FaceSnapsService);
  private favoritesService = inject(FavoritesService);
  readonly auth = inject(AuthService);
  readonly ui = FACE_SNAPS_UI;
  faceSnaps = this.faceSnapsService.getFaceSnaps();
  editing = false;

  readonly favoriteCount = computed(() => this.favoritesService.favorites().length);

  profile: UserProfile = {
    displayName: '',
    bio: '',
  };

  editProfile: UserProfile = {
    displayName: '',
    bio: '',
  };

  ngOnInit(): void {
    this.loadProfile();
    this.favoritesService.loadFavorites();
  }

  private loadProfile(): void {
    const stored = localStorage.getItem('dyarna-profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed.displayName || parsed.bio) {
          this.profile = parsed;
        }
      } catch {}
    }
  }

  private saveProfile(): void {
    localStorage.setItem('dyarna-profile', JSON.stringify(this.profile));
  }

  get initials(): string {
    return this.profile.displayName
      ? this.profile.displayName[0].toUpperCase()
      : this.auth.currentPseudo()[0].toUpperCase();
  }

  startEditing(): void {
    this.editProfile = { ...this.profile };
    this.editing = true;
  }

  cancelEditing(): void {
    this.editing = false;
  }

  saveEditing(): void {
    this.profile = { ...this.editProfile };
    this.saveProfile();
    this.editing = false;
  }
}
