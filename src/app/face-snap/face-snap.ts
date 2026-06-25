import { Component, inject, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { FaceSnap } from '../models/snap.model';
import { Router } from '@angular/router';
import { FACE_SNAPS_UI, APP_ROUTES, ARABIC_CITY_NAMES } from '@core';

@Component({
  selector: 'app-face-snap',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './face-snap.html',
  styleUrl: './face-snap.scss',
})
export class FaceSnapComponent {
  readonly faceSnap = input.required<FaceSnap>();
  readonly isLiked  = input<boolean>(false);
  readonly likeClicked = output<string>();
  readonly tagClicked  = output<string>();

  readonly uiConstants = FACE_SNAPS_UI;
  private router = inject(Router);

  readonly arabicName = computed(() => ARABIC_CITY_NAMES[this.faceSnap().title] ?? null);

  onViewFaceSnap(): void {
    this.router.navigateByUrl(`${APP_ROUTES.FACE_SNAPS}/${this.faceSnap().id}`);
  }

  onLikeClick(event: Event): void {
    event.stopPropagation();
    this.likeClicked.emit(this.faceSnap().id);
  }

  onTagClick(event: Event, tag: string): void {
    event.stopPropagation();
    this.tagClicked.emit(tag);
  }
}
