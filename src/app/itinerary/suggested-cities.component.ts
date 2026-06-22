import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CitySuggestion } from '../core/types';

@Component({
  selector: 'app-suggested-cities',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (suggestions.length > 0) {
      <div class="suggested">
        <h4 class="suggested__title">Suggestions à proximité</h4>
        <div class="suggested__list">
          @for (s of suggestions; track s.cityId) {
            <div class="suggested__card" (click)="add.emit(s.cityId)">
              <strong>{{ s.name }}</strong>
              <span>à {{ s.distanceKm }} km</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .suggested {
      margin-top: 16px;
    }
    .suggested__title {
      font-size: 13px;
      font-weight: 600;
      color: #3d352c;
      margin: 0 0 8px;
    }
    .suggested__list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .suggested__card {
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 8px;
      padding: 10px 14px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .suggested__card:hover {
      border-color: #c8613c;
    }
    .suggested__card strong {
      display: block;
      font-size: 13px;
      color: #3d352c;
    }
    .suggested__card span {
      font-size: 11px;
      color: #8a7f6e;
    }
  `],
})
export class SuggestedCitiesComponent {
  @Input({ required: true }) suggestions: CitySuggestion[] = [];
  @Output() add = new EventEmitter<string>();
}
