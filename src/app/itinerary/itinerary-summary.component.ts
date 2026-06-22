import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ItineraryComputed } from '../core/types';

@Component({
  selector: 'app-itinerary-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (computed) {
      <div class="it-summary">
        <div class="it-summary__stat">
          <span class="it-summary__value">{{ computed.totalNights }}</span>
          <span class="it-summary__label">Nuits</span>
        </div>
        <div class="it-summary__stat">
          <span class="it-summary__value">{{ computed.totalDistance }}</span>
          <span class="it-summary__label">Km</span>
        </div>
        <div class="it-summary__stat">
          <span class="it-summary__value">{{ computed.segments.length }}</span>
          <span class="it-summary__label">Trajets</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .it-summary {
      display: flex;
      gap: 16px;
      padding: 12px 16px;
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 10px;
    }
    .it-summary__stat {
      flex: 1;
      text-align: center;
    }
    .it-summary__value {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #c8613c;
    }
    .it-summary__label {
      display: block;
      font-size: 10px;
      color: #8a7f6e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `],
})
export class ItinerarySummaryComponent {
  @Input({ required: true }) computed!: ItineraryComputed;
}
