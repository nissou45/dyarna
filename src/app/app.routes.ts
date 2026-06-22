import { Routes } from '@angular/router';
import { FaceSnapListComponent } from './face-snap-list/face-snap-list';
import { LandingPage } from './landing-page/landing-page';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap';
import { ProfileComponent } from './profile/profile';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { MapComponent } from './map/map.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ItineraryBuilderComponent } from './itinerary/itinerary-builder.component';
import { ItineraryPublicComponent } from './itinerary/itinerary-public.component';
import { QuizGameComponent } from './quiz/quiz-game.component';
import { LeaderboardComponent } from './quiz/leaderboard.component';
import { authGuard } from './guards/auth.guard';
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
    canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.LOGIN,
    component: LoginComponent,
  },
  {
    path: APP_ROUTES.REGISTER,
    component: RegisterComponent,
  },
  {
    path: APP_ROUTES.LANDING,
    component: LandingPage,
  },
  {
    path: APP_ROUTES.MAP,
    component: MapComponent,
  },
  {
    path: APP_ROUTES.FAVORITES,
    component: FavoritesComponent,
    canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/partage/:token`,
    component: ItineraryPublicComponent,
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/nouveau`,
    component: ItineraryBuilderComponent,
    canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/:id`,
    component: ItineraryBuilderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'quiz',
    component: QuizGameComponent,
  },
  {
    path: 'classement',
    component: LeaderboardComponent,
  },
];
