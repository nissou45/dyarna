import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItineraryService } from '../services/itinerary.service';
import { Itinerary, ItineraryComputed } from '../core/types';
import { ItinerarySummaryComponent } from './itinerary-summary.component';

@Component({
  selector: 'app-itinerary-public',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ItinerarySummaryComponent],
  template: `
    @let it = itinerary();
    @let comp = computed();

    @if (!it) {
      @if (error()) {
        <div class="ip-error">
          <p>Cet itinéraire est introuvable ou a expiré.</p>
          <a routerLink="/">Retour à l'accueil</a>
        </div>
      } @else {
        <div class="ip-loading">Chargement…</div>
      }
    } @else {
      <div class="ip">
        <h2 class="ip__title">{{ it.title }}</h2>
        <p class="ip__subtitle">Itinéraire partagé · {{ it.days.length }} étapes</p>

        <app-itinerary-summary [computed]="comp" />

        <div class="ip__days">
          @for (day of it.days; track day.cityId; let i = $index) {
            <div class="ip__day">
              <div class="ip__day-num">Jour {{ i + 1 }}</div>
              <div class="ip__day-body">
                <strong>{{ day.cityId }}</strong>
                @if (day.notes) {
                  <p class="ip__day-notes">{{ day.notes }}</p>
                }
                <span class="ip__day-nights">{{ day.nightsCount }} nuit{{ day.nightsCount > 1 ? 's' : '' }}</span>
              </div>
              @let seg = comp.segments[i - 1];
              @if (seg) {
                <div class="ip__day-travel">
                  ← {{ seg.distanceKm }} km ({{ seg.travelTime.hours }}h{{ seg.travelTime.minutes }})
                </div>
              }
            </div>
          }
        </div>

        <div class="ip__meta">
          <span>{{ comp.totalDistance }} km au total</span>
          <span>{{ comp.totalNights }} nuits</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .ip { max-width: 640px; margin: 32px auto; padding: 0 16px; }
    .ip__title { font-size: 24px; color: #3d352c; margin: 0 0 4px; }
    .ip__subtitle { color: #8a7f6e; font-size: 14px; margin: 0 0 20px; }
    .ip__days { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .ip__day {
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 10px;
      padding: 12px 16px;
    }
    .ip__day-num { font-weight: 600; font-size: 13px; color: #c8613c; }
    .ip__day-body { margin: 4px 0 0; }
    .ip__day-body strong { font-size: 16px; color: #3d352c; text-transform: capitalize; }
    .ip__day-notes { font-size: 13px; color: #5a4a3a; margin: 4px 0 0; }
    .ip__day-nights { font-size: 12px; color: #8a7f6e; }
    .ip__day-travel { font-size: 11px; color: #8a7f6e; margin-top: 6px; }
    .ip__meta {
      display: flex;
      gap: 16px;
      margin-top: 20px;
      font-size: 13px;
      color: #5a4a3a;
    }
    .ip-error { text-align: center; margin-top: 48px; color: #8a7f6e; }
    .ip-loading { text-align: center; margin-top: 48px; color: #8a7f6e; }
    .ip-error a { color: #c8613c; text-decoration: underline; cursor: pointer; }
  `],
})
export class ItineraryPublicComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly itineraryService = inject(ItineraryService);

  protected readonly itinerary = signal<Itinerary | null>(null);
  protected readonly computed = signal<ItineraryComputed>({ segments: [], totalDistance: 0, totalNights: 0 });
  protected readonly error = signal(false);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) { this.error.set(true); return; }

    this.itineraryService.getByShareToken(token).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.itinerary.set(res.itinerary);
        this.computed.set(res.computed);
      },
      error: () => this.error.set(true),
    });
  }
}
