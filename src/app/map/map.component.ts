import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { City, CITIES } from '../data/cities';
import { ReviewsService } from '../services/reviews.service';
import { ReviewSummary } from '../core/types';
import { APP_ROUTES } from '../core/constants/face-snaps.constants';

const ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private reviewsService = inject(ReviewsService);

  readonly allCities = CITIES;
  readonly regions = [...new Set(CITIES.map(c => c.region))].sort();
  readonly categories: City['category'][] = ['imperiale', 'cotiere', 'montagne', 'desert', 'moderne'];

  selectedRegion = '';
  selectedCategory = '';

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup = L.layerGroup();
  private clickHandler: ((e: Event) => void) | null = null;
  private ratingCache = new Map<string, ReviewSummary>();

  private readonly CATEGORY_LABELS: Record<City['category'], string> = {
    imperiale: 'Ville impériale',
    cotiere: 'Ville côtière',
    montagne: 'Montagne',
    desert: 'Désert',
    moderne: 'Moderne',
  };

  categoryLabel(cat: City['category']): string {
    return this.CATEGORY_LABELS[cat];
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.preloadRatings();
  }

  ngOnDestroy(): void {
    this.removePopupHandler();
    this.map?.remove();
  }

  private preloadRatings(): void {
    CITIES.forEach((city) => {
      this.reviewsService.getSummary(city.id).subscribe({
        next: (s) => {
          this.ratingCache.set(city.id, s);
          this.updateMarkers();
        },
        error: () => {},
      });
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [31.7917, -7.0926],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
    this.updateMarkers();

    this.setupPopupHandler();
  }

  private setupPopupHandler(): void {
    const container = this.map!.getContainer();
    this.clickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.map-popup__btn') as HTMLElement | null;
      if (btn) {
        const cityId = btn.getAttribute('data-city-id');
        if (cityId) {
          this.router.navigateByUrl(`/${APP_ROUTES.FACE_SNAPS}/${cityId}`);
        }
      }
    };
    container.addEventListener('click', this.clickHandler);
  }

  private removePopupHandler(): void {
    if (this.map && this.clickHandler) {
      this.map.getContainer().removeEventListener('click', this.clickHandler);
    }
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers();

    const filtered = this.getFilteredCities();

    filtered.forEach(city => {
      const marker = L.marker([city.lat, city.lng], { icon: ICON });
      marker.bindPopup(this.buildPopupContent(city));
      this.markersLayer!.addLayer(marker);
    });

    if (filtered.length > 0 && this.map) {
      const group = L.featureGroup(
        filtered.map(c => L.marker([c.lat, c.lng])),
      );
      this.map.fitBounds(group.getBounds().pad(0.15));
    }
  }

  private buildPopupContent(city: City): string {
    const rating = this.ratingCache.get(city.id);
    const ratingHtml = rating && rating.totalReviews > 0
      ? `<span style="font-size:12px; color:#8a7f6e;">★ ${rating.averageRating}/5 (${rating.totalReviews} avis)</span>`
      : '';

    return `
      <div class="map-popup">
        <img src="${city.thumbnailUrl}" alt="${city.name}" class="map-popup__img" loading="lazy" />
        <div class="map-popup__body">
          <h3 class="map-popup__title">${city.name}</h3>
          <span class="map-popup__region">${city.region} · ${this.CATEGORY_LABELS[city.category]}</span>
          ${ratingHtml}
          <p class="map-popup__desc">${city.shortDescription}</p>
          <button class="map-popup__btn" data-city-id="${city.id}">
            Voir la fiche complète
          </button>
        </div>
      </div>
    `;
  }

  private getFilteredCities(): City[] {
    return this.allCities.filter(city => {
      if (this.selectedRegion && city.region !== this.selectedRegion) return false;
      if (this.selectedCategory && city.category !== this.selectedCategory) return false;
      return true;
    });
  }

  onFilterChange(): void {
    this.updateMarkers();
  }

  resetFilters(): void {
    this.selectedRegion = '';
    this.selectedCategory = '';
    this.updateMarkers();
  }
}
