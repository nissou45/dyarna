import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StarRatingComponent } from './star-rating.component';
import { AuthService } from '../services/auth.service';
import { Review } from '../core/types';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [DatePipe, StarRatingComponent],
  template: `
    <div class="reviews-list">
      @for (review of reviews; track review._id) {
        <div class="review-item">
          <div class="review-item__header">
            <div class="review-item__avatar">{{ review.userId.displayName[0] }}</div>
            <div>
              <strong style="font-size:14px;">{{ review.userId.displayName }}</strong>
              <app-star-rating [value]="review.rating" [readonly]="true" />
            </div>
            @if (auth.user()?._id === review.userId._id) {
              <div style="margin-left:auto; display:flex; gap:6px;">
                <button class="sn-btn ghost sm" (click)="edit.emit(review)">Modifier</button>
                <button class="sn-btn ghost sm" style="color:var(--sn-error-bright);" (click)="delete.emit(review.cityId)">Supprimer</button>
              </div>
            }
          </div>
          <p class="review-item__comment">{{ review.comment }}</p>
          <span class="review-item__date">
            {{ review.createdAt | date:'longDate' }}
            @if (review.editedAt) { <span>· modifié</span> }
          </span>
        </div>
      }

      @if (reviews.length === 0) {
        <p style="color:var(--sn-muted); font-size:14px; text-align:center; padding:24px 0;">
          Aucun avis pour le moment.
        </p>
      }
    </div>
  `,
  styles: [`
    .reviews-list { display: flex; flex-direction: column; gap: 16px; }
    .review-item {
      background: var(--sn-surface);
      border: 1px solid var(--sn-line);
      border-radius: 10px;
      padding: 16px;
    }
    .review-item__header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .review-item__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--sn-accent);
      color: var(--sn-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      flex-shrink: 0;
    }
    .review-item__comment {
      font-size: 14px;
      line-height: 1.6;
      color: var(--sn-ink-2);
      margin: 0 0 6px;
    }
    .review-item__date {
      font-size: 12px;
      color: var(--sn-muted);
    }
  `],
})
export class ReviewListComponent {
  @Input({ required: true }) reviews: Review[] = [];
  @Output() edit = new EventEmitter<Review>();
  @Output() delete = new EventEmitter<string>();

  readonly auth = inject(AuthService);
}
