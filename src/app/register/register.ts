import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ROUTES } from '../core/constants/face-snaps.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div style="max-width:400px; margin:60px auto; padding:0 24px;">
      <h1 class="h2" style="margin-bottom:8px;">Créer un compte</h1>
      <p style="color:var(--sn-muted); margin-bottom:32px;">
        Rejoignez MarocGuide et partagez vos découvertes.
      </p>

      @if (error) {
        <div style="background:rgba(220,38,38,.08); color:#dc2626; padding:12px 16px; border-radius:var(--sn-r); font-size:14px; margin-bottom:16px;">
          {{ error }}
        </div>
      }

      <form (ngSubmit)="onRegister()">
        <label class="sn-field">
          <span class="sn-label">Pseudo</span>
          <input class="sn-input" [(ngModel)]="pseudo" name="pseudo" placeholder="Votre pseudo" required />
        </label>
        <label class="sn-field">
          <span class="sn-label">Email</span>
          <input class="sn-input" type="email" [(ngModel)]="email" name="email" placeholder="votre@email.com" required />
        </label>
        <label class="sn-field">
          <span class="sn-label">Mot de passe</span>
          <input class="sn-input" type="password" [(ngModel)]="password" name="password" placeholder="Au moins 6 caractères" required minlength="6" />
        </label>
        <button class="sn-btn accent block" style="margin-top:8px;" type="submit">Créer mon compte</button>
      </form>

      <p style="text-align:center; margin-top:24px; font-size:14px; color:var(--sn-muted);">
        Déjà un compte ?
        <a routerLink="/connexion" style="color:var(--sn-ink); font-weight:500;">Se connecter</a>
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  pseudo = '';
  email = '';
  password = '';
  error = '';

  onRegister(): void {
    this.error = '';
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit faire au moins 6 caractères.';
      return;
    }
    const result = this.auth.register(this.email, this.pseudo, this.password);
    if (result.success) {
      this.router.navigateByUrl('/' + APP_ROUTES.FACE_SNAPS);
    } else {
      this.error = result.error ?? 'Erreur inconnue';
    }
  }
}
