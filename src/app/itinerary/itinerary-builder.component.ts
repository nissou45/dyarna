import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItineraryService } from '../services/itinerary.service';
import { ItinerarySummaryComponent } from './itinerary-summary.component';
import { SuggestedCitiesComponent } from './suggested-cities.component';
import { CITIES } from '../data/cities';
import { ItineraryComputed, ItineraryDay, CitySuggestion, ItinerarySegment } from '../core/types';

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeSegments(selectedIds: string[]): { segments: ItinerarySegment[]; totalDistance: number } {
  const segments: ItinerarySegment[] = [];
  let totalDistance = 0;

  for (let i = 1; i < selectedIds.length; i++) {
    const from = CITIES.find((c) => c.id === selectedIds[i - 1]);
    const to = CITIES.find((c) => c.id === selectedIds[i]);
    if (!from || !to) continue;

    const d = Math.round(haversine(from.lat, from.lng, to.lat, to.lng));
    const hours = Math.floor(d / 70);
    const minutes = Math.round((d % 70) / 70 * 60);

    totalDistance += d;
    segments.push({ from: from.name, to: to.name, distanceKm: d, travelTime: { hours, minutes } });
  }

  return { segments, totalDistance };
}

const ALL_CITIES = CITIES.map((c) => ({ id: c.id, name: c.name }));

@Component({
  selector: 'app-itinerary-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DragDropModule, ItinerarySummaryComponent, SuggestedCitiesComponent],
  template: `
    <div class="ib">
      <div class="ib__header">
        <input
          [(ngModel)]="title"
          placeholder="Titre du voyage (ex: Tour du Maroc - 10 jours)"
          class="ib__title-input"
          maxlength="120"
        />
      </div>

      <app-itinerary-summary [computed]="computed()" />

      <div class="ib__days" cdkDropList (cdkDropListDropped)="onDrop($event)">
        @for (day of days(); track day.cityId; let i = $index) {
          <div class="ib__day" cdkDrag>
            <div class="ib__day-drag" cdkDragHandle>::</div>
            <div class="ib__day-body">
              <div class="ib__day-header">
                <span class="ib__day-num">Jour {{ i + 1 }}</span>
                <button class="ib__day-remove" (click)="removeDay(i)">✕</button>
              </div>

              <select [(ngModel)]="day.cityId" (ngModelChange)="onDaysChanged()" class="ib__day-select">
                <option value="">Choisir une ville</option>
                @for (c of availableCities(i); track c.id) {
                  <option [value]="c.id">{{ c.name }}</option>
                }
              </select>

              <div class="ib__day-meta">
                <label>
                  Nuits :
                  <input
                    type="number"
                    [(ngModel)]="day.nightsCount"
                    min="1"
                    max="14"
                    class="ib__day-nights"
                    (ngModelChange)="onDaysChanged()"
                  />
                </label>
                <input
                  [(ngModel)]="day.notes"
                  placeholder="Notes (optionnel)"
                  class="ib__day-notes"
                  maxlength="500"
                />
              </div>

              @if (i > 0) {
                @let seg = computed().segments[i - 1];
                <div class="ib__day-travel">
                  ← {{ seg.distanceKm }} km ({{ seg.travelTime.hours }}h{{ seg.travelTime.minutes }})
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="ib__actions">
        <button class="sn-btn ghost" (click)="addDay()">+ Ajouter une étape</button>
      </div>

      <app-suggested-cities
        [suggestions]="suggestions()"
        (add)="addSuggested($event)"
      />

      <div class="ib__footer">
        <button class="sn-btn accent" (click)="save()" [disabled]="!isValid() || saving()">
          @if (saving()) { Sauvegarde… }
          @else { @if (editingId()) { Mettre à jour } @else { Créer l'itinéraire } }
        </button>
        <button class="sn-btn ghost" (click)="share()" [disabled]="!editingId()">
          Partager
        </button>
        <button class="sn-btn ghost" (click)="exportPdf()" [disabled]="!editingId() || exportingPdf()">
          @if (exportingPdf()) { Génération PDF… }
          @else { Exporter PDF }
        </button>
      </div>

      @if (shareLink()) {
        <div class="ib__share-link">
          Lien public : <input [value]="shareLink()" readonly (click)="$event.target.select()" />
          <button class="sn-btn ghost" (click)="copyLink()">Copier</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .ib { max-width: 640px; margin: 0 auto; }
    .ib__header { margin-bottom: 16px; }
    .ib__title-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--sn-line-3);
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      color: var(--sn-ink-2);
      box-sizing: border-box;
      background: var(--sn-surface);
    }
    .ib__days { display: flex; flex-direction: column; gap: 8px; margin: 16px 0; }
    .ib__day {
      display: flex;
      background: var(--sn-surface);
      border: 1px solid var(--sn-line);
      border-radius: 10px;
      overflow: hidden;
    }
    .ib__day.cdk-drag-preview {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .ib__day.cdk-drag-placeholder { opacity: 0.3; }
    .ib__day-drag {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      background: var(--sn-surface-4);
      cursor: grab;
      color: var(--sn-muted-2);
      font-size: 14px;
      letter-spacing: -1px;
      user-select: none;
    }
    .ib__day-body { flex: 1; padding: 12px; }
    .ib__day-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .ib__day-num { font-weight: 600; font-size: 14px; color: var(--sn-accent); }
    .ib__day-remove {
      background: none;
      border: none;
      color: var(--sn-muted-2);
      cursor: pointer;
      font-size: 14px;
    }
    .ib__day-select {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--sn-line-3);
      border-radius: 6px;
      font-size: 13px;
      background: var(--sn-white);
      color: var(--sn-ink-2);
      margin-bottom: 8px;
      box-sizing: border-box;
    }
    .ib__day-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }
    .ib__day-meta label {
      font-size: 12px;
      color: var(--sn-ink-3);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .ib__day-nights {
      width: 50px;
      padding: 4px 6px;
      border: 1px solid var(--sn-line-3);
      border-radius: 4px;
      font-size: 13px;
    }
    .ib__day-notes {
      flex: 1;
      padding: 4px 8px;
      border: 1px solid var(--sn-line-3);
      border-radius: 4px;
      font-size: 12px;
      min-width: 120px;
    }
    .ib__day-travel {
      font-size: 11px;
      color: var(--sn-muted);
      margin-top: 6px;
    }
    .ib__actions { text-align: center; margin: 8px 0 16px; }
    .ib__footer {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .ib__share-link {
      margin-top: 12px;
      padding: 10px 12px;
      background: var(--sn-surface-3);
      border: 1px solid var(--sn-line);
      border-radius: 8px;
      display: flex;
      gap: 8px;
      align-items: center;
      font-size: 12px;
    }
    .ib__share-link input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 12px;
      color: var(--sn-ink-2);
    }
    .sn-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .sn-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .sn-btn.ghost {
      background: transparent;
      color: var(--sn-accent);
      border: 1px solid var(--sn-accent);
    }
    .sn-btn.accent { background: var(--sn-accent); color: var(--sn-white); }
  `],
})
export class ItineraryBuilderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly itineraryService = inject(ItineraryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly editingId = signal<string | null>(null);
  protected readonly days = signal<ItineraryDay[]>([{ dayNumber: 1, cityId: '', nightsCount: 2 }]);
  protected readonly computed = signal<ItineraryComputed>({ segments: [], totalDistance: 0, totalNights: 0 });
  protected readonly suggestions = signal<CitySuggestion[]>([]);
  protected readonly saving = signal(false);
  protected readonly exportingPdf = signal(false);
  protected readonly shareLink = signal<string | null>(null);

  protected title = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(id);
      this.itineraryService.getById(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (res) => {
          this.title = res.itinerary.title;
          this.days.set(res.itinerary.days);
          this.computed.set(res.computed);
          this.loadSuggestions(id);
        },
        error: () => this.router.navigate(['/']),
      });
    }
  }

  availableCities(currentIndex: number): { id: string; name: string }[] {
    const used = this.days().filter((_, i) => i !== currentIndex).map((d) => d.cityId);
    return ALL_CITIES.filter((c) => !used.includes(c.id));
  }

  addDay(): void {
    this.days.update((d) => [...d, { dayNumber: d.length + 1, cityId: '', nightsCount: 1 }]);
  }

  removeDay(index: number): void {
    this.days.update((d) => {
      const updated = d.filter((_, i) => i !== index);
      return updated.map((day, i) => ({ ...day, dayNumber: i + 1 }));
    });
    this.onDaysChanged();
  }

  onDaysChanged(): void {
    this.recompute();
    this.loadSuggestionsDebounced();
  }

  onDrop(event: CdkDragDrop<ItineraryDay[]>): void {
    const arr = [...this.days()];
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.days.set(arr.map((d, i) => ({ ...d, dayNumber: i + 1 })));
    this.recompute();
  }

  addSuggested(cityId: string): void {
    this.days.update((d) => [...d, { dayNumber: d.length + 1, cityId, nightsCount: 1 }]);
    this.onDaysChanged();
  }

  private suggestionsTimer: ReturnType<typeof setTimeout> | null = null;

  private recompute(): void {
    const current = this.days();
    const selected = current.map((d) => d.cityId).filter(Boolean);
    const { segments, totalDistance } = computeSegments(selected);
    const totalNights = current.reduce((sum, d) => sum + (d.nightsCount || 1), 0);
    this.computed.set({ segments, totalDistance, totalNights });
  }

  private loadSuggestionsDebounced(): void {
    const id = this.editingId();
    if (!id) return;
    if (this.suggestionsTimer) clearTimeout(this.suggestionsTimer);
    this.suggestionsTimer = setTimeout(() => this.loadSuggestions(id), 600);
  }

  isValid(): boolean {
    return this.title.length >= 3 && this.days().every((d) => d.cityId);
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);

    const days = this.days().map((d) => ({
      cityId: d.cityId,
      nightsCount: d.nightsCount,
      notes: d.notes,
    }));

    const obs = this.editingId()
      ? this.itineraryService.update(this.editingId()!, { days })
      : this.itineraryService.create(this.title, days);

    obs.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.editingId.set(res.itinerary._id);
        this.computed.set(res.computed);
        this.saving.set(false);
        this.loadSuggestions(res.itinerary._id);
      },
      error: () => (this.saving.set(false)),
    });
  }

  share(): void {
    const id = this.editingId();
    if (!id) return;
    this.itineraryService.share(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        const origin = window.location.origin;
        this.shareLink.set(`${origin}/itineraires/partage/${res.shareToken}`);
      },
      error: () => {},
    });
  }

  copyLink(): void {
    const link = this.shareLink();
    if (!link) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link);
    } else {
      const ta = document.createElement('textarea');
      ta.value = link;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  exportPdf(): void {
    const id = this.editingId();
    if (!id) return;
    this.exportingPdf.set(true);
    this.itineraryService.exportPdf(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `itineraire-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.exportingPdf.set(false);
      },
      error: () => (this.exportingPdf.set(false)),
    });
  }

  private loadSuggestions(id: string): void {
    if (id === 'new' || !id) return;
    this.itineraryService.getSuggestions(id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => this.suggestions.set(res.suggestions),
      error: () => {},
    });
  }
}
