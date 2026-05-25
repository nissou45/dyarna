import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly auth = inject(AuthService);
  private router = inject(Router);

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
