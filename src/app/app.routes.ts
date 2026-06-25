import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { APP_ROUTES } from './core/constants/face-snaps.constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.LANDING,
    loadComponent: () => import('./landing-page/landing-page').then(m => m.LandingPage),
  },
  {
    path: APP_ROUTES.FACE_SNAPS,
    loadComponent: () => import('./face-snap-list/face-snap-list').then(m => m.FaceSnapListComponent),
  },
  {
    path: `${APP_ROUTES.FACE_SNAPS}/:id`,
    loadComponent: () => import('./single-face-snap/single-face-snap').then(m => m.SingleFaceSnapComponent),
  },
  {
    path: APP_ROUTES.LOGIN,
    loadComponent: () => import('./login/login').then(m => m.LoginComponent),
  },
  {
    path: APP_ROUTES.REGISTER,
    loadComponent: () => import('./register/register').then(m => m.RegisterComponent),
  },
  {
    path: APP_ROUTES.PROFILE,
    loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: APP_ROUTES.MAP,
    loadComponent: () => import('./map/map.component').then(m => m.MapComponent),
  },
  {
    path: APP_ROUTES.FAVORITES,
    loadComponent: () => import('./favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/partage/:token`,
    loadComponent: () => import('./itinerary/itinerary-public.component').then(m => m.ItineraryPublicComponent),
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/nouveau`,
    loadComponent: () => import('./itinerary/itinerary-builder.component').then(m => m.ItineraryBuilderComponent),
    canActivate: [authGuard],
  },
  {
    path: `${APP_ROUTES.ITINERARIES}/:id`,
    loadComponent: () => import('./itinerary/itinerary-builder.component').then(m => m.ItineraryBuilderComponent),
    canActivate: [authGuard],
  },
  {
    path: 'quiz',
    loadComponent: () => import('./quiz/quiz-game.component').then(m => m.QuizGameComponent),
  },
  {
    path: 'classement',
    loadComponent: () => import('./quiz/leaderboard.component').then(m => m.LeaderboardComponent),
  },
  { path: '**', redirectTo: '' },
];
