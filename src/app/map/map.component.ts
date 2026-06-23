import { Component, AfterViewInit, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as L from 'leaflet';
import { City, CITIES } from '../data/cities';
import { ReviewsService } from '../services/reviews.service';
import { ReviewSummary } from '../core/types';
import { APP_ROUTES } from '../core/constants/face-snaps.constants';
import { CitySearchComponent } from '../components/city-search/city-search.component';

const ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SEARCH_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -40],
  className: 'marker-search',
});

@Component({
  selector: 'app-map',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CitySearchComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private reviewsService = inject(ReviewsService);

  readonly allCities = CITIES;
  readonly featuredCities = CITIES.filter((c) => c.featured);
  readonly regions = [...new Set(CITIES.map(c => c.region))].sort();
  readonly categories: City['category'][] = ['imperiale', 'cotiere', 'montagne', 'desert', 'moderne'];

  private readonly CATEGORY_LABELS: Record<City['category'], string> = {
    imperiale: 'Ville impériale',
    cotiere: 'Ville côtière',
    montagne: 'Montagne',
    desert: 'Désert',
    moderne: 'Moderne',
  };

  readonly categoryOptions = this.categories.map(c => ({
    value: c,
    label: this.CATEGORY_LABELS[c],
  }));

  selectedRegion = '';
  selectedCategory = '';

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup = L.layerGroup();
  private searchMarker: L.Marker | null = null;
  private clickHandler: ((e: Event) => void) | null = null;
  private ratingCache = new Map<string, ReviewSummary>();

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  onRegionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRegion = value;
    this.onFilterChange();
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory = value;
    this.onFilterChange();
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
    const concurrency = 6;
    const ids = CITIES.map((c) => c.id);
    for (let i = 0; i < ids.length; i += concurrency) {
      const batch = ids.slice(i, i + concurrency).map((id) =>
        this.reviewsService.getSummary(id).pipe(
          catchError(() => of(null)),
        )
      );
      forkJoin(batch).subscribe((results) => {
        for (let j = 0; j < results.length; j++) {
          const s = results[j];
          if (s) {
            this.ratingCache.set(ids[i + j], s);
          }
        }
        this.updateMarkers();
      });
    }
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
    const name = this.escapeHtml(city.name);
    const region = this.escapeHtml(city.region);
    const desc = this.escapeHtml(city.shortDescription);
    const label = this.CATEGORY_LABELS[city.category];

    return `
      <div class="map-popup">
        <img src="${city.thumbnailUrl}" alt="${name}" class="map-popup__img" loading="lazy" />
        <div class="map-popup__body">
          <h3 class="map-popup__title">${name}</h3>
          <span class="map-popup__region">${region} · ${label}</span>
          ${ratingHtml}
          <p class="map-popup__desc">${desc}</p>
          <button class="map-popup__btn" data-city-id="${city.id}">
            Voir la fiche complète
          </button>
        </div>
      </div>
    `;
  }

  private getFilteredCities(): City[] {
    return this.allCities.filter(city => {
      if (!city.featured) return false;
      if (this.selectedRegion && city.region !== this.selectedRegion) return false;
      if (this.selectedCategory && city.category !== this.selectedCategory) return false;
      return true;
    });
  }

  onSearchSelected(city: City): void {
    this.removeSearchMarker();

    const marker = L.marker([city.lat, city.lng], { icon: SEARCH_ICON });
    marker.bindPopup(this.buildPopupContent(city));
    marker.addTo(this.map!);
    marker.openPopup();
    this.searchMarker = marker;

    this.map!.flyTo([city.lat, city.lng], 11, { duration: 1 });
  }

  private removeSearchMarker(): void {
    if (this.searchMarker) {
      this.searchMarker.remove();
      this.searchMarker = null;
    }
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
