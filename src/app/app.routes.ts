import { Routes } from '@angular/router';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list';
import { LandingPage } from './landing-page/landing-page';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap';
import { ProfileComponent } from './profile/profile';
import { APP_ROUTES } from './core/constants/face-snaps.constants';

export const routes: Routes = [
  {
    path: `${APP_ROUTES.FACE_SNAPS}/:id`,
    component: SingleFaceSnapComponent,
  },
  {
    path: APP_ROUTES.FACE_SNAPS,
    component: FaceSnapListComponent,
  },
  {
    path: APP_ROUTES.PROFILE,
    component: ProfileComponent,
  },
  {
    path: APP_ROUTES.LANDING,
    component: LandingPage,
  },
];
