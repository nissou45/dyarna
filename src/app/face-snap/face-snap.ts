import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FaceSnap } from '../models/snap.model';
import { Router } from '@angular/router';
import { FACE_SNAPS_UI, APP_ROUTES } from '../core/constants/face-snaps.constants';

@Component({
  selector: 'app-face-snap',
  standalone: true,
  imports: [],
  templateUrl: './face-snap.html',
  styleUrl: './face-snap.scss',
})
export class FaceSnapComponent {
  @Input() faceSnap!: FaceSnap;
  @Input() isLiked: boolean = false;
  @Output() likeClicked = new EventEmitter<string>();
  @Output() tagClicked = new EventEmitter<string>();
  readonly uiConstants = FACE_SNAPS_UI;
  private router = inject(Router);

  onViewFaceSnap(): void {
    this.router.navigateByUrl(`${APP_ROUTES.FACE_SNAPS}/${this.faceSnap.id}`);
  }

  onLikeClick(): void {
    this.likeClicked.emit(this.faceSnap.id);
  }

  onTagClick(tag: string): void {
    this.tagClicked.emit(tag);
  }
}
