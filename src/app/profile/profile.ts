import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FaceSnapsService } from '../services/face-snaps.service';
import { FACE_SNAPS_UI } from '@core';

interface UserProfile {
  pseudo: string;
  bio: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  private faceSnapsService = inject(FaceSnapsService);

  readonly ui = FACE_SNAPS_UI;
  faceSnaps = this.faceSnapsService.getFaceSnaps();
  editing: boolean = false;

  profile: UserProfile = {
    pseudo: '',
    bio: '',
  };

  editProfile: UserProfile = {
    pseudo: '',
    bio: '',
  };

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    const stored = localStorage.getItem('dyarna-profile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed.pseudo || parsed.bio) {
          this.profile = parsed;
        }
      } catch {}
    }
  }

  private saveProfile(): void {
    localStorage.setItem('dyarna-profile', JSON.stringify(this.profile));
  }

  get initials(): string {
    return this.profile.pseudo ? this.profile.pseudo[0].toUpperCase() : '?';
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
