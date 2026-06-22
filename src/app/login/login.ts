import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../core/constants/face-snaps.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div style="max-width:400px; margin:60px auto; padding:0 24px;">
      <h1 class="h2" style="margin-bottom:8px;">Connexion</h1>
      <p style="color:var(--sn-muted); margin-bottom:32px;">
        Connectez-vous pour retrouver vos découvertes favorites.
      </p>

      @if (error) {
        <div style="background:rgba(220,38,38,.08); color:#dc2626; padding:12px 16px; border-radius:var(--sn-r); font-size:14px; margin-bottom:16px;">
          {{ error }}
        </div>
      }

      <form (ngSubmit)="onLogin()">
        <label class="sn-field">
          <span class="sn-label">Email</span>
          <input class="sn-input" type="email" [(ngModel)]="email" name="email" placeholder="votre@email.com" required />
        </label>
        <label class="sn-field">
          <span class="sn-label">Mot de passe</span>
          <input class="sn-input" type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required />
        </label>
        <button class="sn-btn accent block" style="margin-top:8px;" type="submit" [disabled]="loading">Se connecter</button>
      </form>

      <div style="margin:20px 0; text-align:center; color:var(--sn-muted); font-size:13px;">ou</div>

      <a [href]="googleUrl" class="sn-btn block ghost" style="text-align:center;">
        <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle; margin-right:8px;">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuer avec Google
      </a>

      <p style="text-align:center; margin-top:24px; font-size:14px; color:var(--sn-muted);">
        Pas encore de compte ?
        <a routerLink="/inscription" style="color:var(--sn-ink); font-weight:500;">S'inscrire</a>
      </p>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  error = '';
  loading = false;
  googleUrl = this.auth.getGoogleLoginUrl();

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    const user = this.route.snapshot.queryParams['user'];
    if (token && user) {
      this.auth.handleGoogleCallback(token, user);
      this.router.navigateByUrl('/' + APP_ROUTES.FACE_SNAPS);
    }
  }

  onLogin(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/' + APP_ROUTES.FACE_SNAPS);
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur de connexion.';
        this.loading = false;
      },
    });
  }
}
