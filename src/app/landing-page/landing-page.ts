import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FACE_SNAPS_UI, APP_ROUTES } from '../core/constants/face-snaps.constants';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  readonly uiConstants = FACE_SNAPS_UI;
  private router = inject(Router);

  onContinue() {
    this.router.navigateByUrl(`/${APP_ROUTES.FACE_SNAPS}`);
  }
}
