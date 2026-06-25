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
import { ToastService } from '../services/toast.service';

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
  templateUrl: './itinerary-builder.component.html',
  styleUrl: './itinerary-builder.component.scss',
})
export class ItineraryBuilderComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly itineraryService = inject(ItineraryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

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
      error: () => this.toastService.error('Impossible de générer le lien de partage.'),
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
      error: () => {},  // silencieux : suggestions optionnelles
    });
  }
}
