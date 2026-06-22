import { Component, Input } from '@angular/core';
import { ReviewSummary } from '../core/types';
import { StarRatingComponent } from './star-rating.component';

@Component({
  selector: 'app-rating-summary',
  standalone: true,
  template: `
    <div class="rating-summary">
      <div class="rating-summary__score">
        <span class="rating-summary__number">{{ summary.averageRating.toFixed(1) }}</span>
        <app-star-rating [value]="Math.round(summary.averageRating)" [readonly]="true" />
        <span class="rating-summary__count">{{ summary.totalReviews }} avis</span>
      </div>
      <div class="rating-summary__bars">
        @for (item of summary.distribution; track item.rating) {
          <div class="rating-summary__bar">
            <span class="rating-summary__label">{{ item.rating }}</span>
            <div class="rating-summary__track">
              <div
                class="rating-summary__fill"
                [style.width.%]="summary.totalReviews > 0 ? (item.count / summary.totalReviews * 100) : 0"
              ></div>
            </div>
            <span class="rating-summary__count">{{ item.count }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .rating-summary {
      display: flex;
      gap: 28px;
      align-items: flex-start;
      padding: 16px 0;
    }
    .rating-summary__score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 100px;
    }
    .rating-summary__number {
      font-size: 42px;
      font-weight: 600;
      line-height: 1;
      color: #1e1b16;
    }
    .rating-summary__count {
      font-size: 12px;
      color: #8a7f6e;
    }
    .rating-summary__bars {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .rating-summary__bar {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .rating-summary__label {
      width: 12px;
      text-align: right;
      color: #1e1b16;
      font-weight: 500;
    }
    .rating-summary__track {
      flex: 1;
      height: 8px;
      background: #f0e8db;
      border-radius: 999px;
      overflow: hidden;
    }
    .rating-summary__fill {
      height: 100%;
      background: #d4a03c;
      border-radius: 999px;
      transition: width .3s;
    }
    .rating-summary__bar .rating-summary__count {
      width: 24px;
      text-align: left;
    }
    @media (max-width: 640px) {
      .rating-summary { flex-direction: column; gap: 16px; }
    }
  `],
  imports: [StarRatingComponent],
})
export class RatingSummaryComponent {
  @Input({ required: true }) summary!: ReviewSummary;
  readonly Math = Math;
}
