import { Component, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { CITIES } from '../data/cities';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="max-width:1320px; margin:0 auto; padding:24px 20px;">
      <h1 class="h2" style="margin-bottom:24px;">Mes favoris</h1>

      @if (favoriteCities().length === 0) {
        <div style="text-align:center; padding:60px 0; color:var(--sn-muted);">
          <p style="font-size:18px; margin-bottom:8px;">Aucun favori pour le moment.</p>
          <p>Explore la carte et ajoute tes villes préférées à tes favoris !</p>
          <a routerLink="/carte" class="sn-btn accent" style="display:inline-block; margin-top:20px;">Explorer la carte</a>
        </div>
      }

      <div class="sn-grid sn-stagger">
        @for (city of favoriteCities(); track city.id) {
          <a class="sn-card sn-fade-in" style="cursor:pointer; text-decoration:none; color:inherit;" [routerLink]="['/decouvertes', city.id]">
            <div class="sn-card__media">
              <img [src]="city.thumbnailUrl ?? ''" [alt]="city.name" loading="lazy" />
            </div>
            <div class="sn-card__body">
              <h3 class="sn-card__title">{{ city.name }}</h3>
              @if (city.region) {
                <div class="sn-card__location">{{ city.region }}</div>
              }
              <p style="font-size:13px; color:var(--sn-muted); margin-top:8px;">{{ city.shortDescription ?? '' }}</p>
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);

  favoriteCities = computed(() => {
    const favIds = this.favoritesService.favorites().map((f) => f.cityId);
    return CITIES.filter((c) => favIds.includes(c.id));
  });

  ngOnInit(): void {
    this.favoritesService.loadFavorites();
  }
}
