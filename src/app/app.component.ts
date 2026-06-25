import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService, Toast } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly auth = inject(AuthService);
  readonly toast = inject(ToastService);
  private router = inject(Router);

  trackToast(_: number, t: Toast) { return t.id; }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
