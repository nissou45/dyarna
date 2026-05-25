import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '@core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly routes = APP_ROUTES;
}
