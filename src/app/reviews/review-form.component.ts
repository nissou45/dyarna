import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StarRatingComponent } from './star-rating.component';
import { AuthService } from '../services/auth.service';
import { Review } from '../core/types';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [FormsModule, RouterLink, StarRatingComponent],
  template: `
    <div class="review-form">
      @if (!auth.isLoggedIn()) {
        <p style="color:var(--sn-muted); font-size:14px; padding:16px 0;">
          <a routerLink="/connexion" style="color:var(--sn-ink); font-weight:500;">Connectez-vous</a> pour laisser un avis.
        </p>
      } @else {
        @if (existingReview) {
          <p style="font-size:14px; color:var(--sn-muted); margin-bottom:12px;">
            Vous avez déjà noté cette ville. Modifiez votre avis ci-dessous.
          </p>
        }
        <form (ngSubmit)="onSubmit()">
          <div style="margin-bottom:12px;">
            <label style="font-size:13px; font-weight:500; display:block; margin-bottom:4px; color:var(--sn-ink);">Note</label>
            <app-star-rating [(value)]="rating" />
            @if (ratingError) {
              <span style="font-size:12px; color:#dc2626; margin-left:8px;">{{ ratingError }}</span>
            }
          </div>
          <label class="sn-field">
            <span class="sn-label">Commentaire</span>
            <textarea
              class="sn-area"
              [(ngModel)]="comment"
              name="comment"
              rows="4"
              placeholder="Partagez votre expérience (min 10 caractères)"
              required
            ></textarea>
            <span style="font-size:11px; color:var(--sn-muted);">{{ comment.length }}/1000</span>
          </label>
          @if (error) {
            <div style="color:#dc2626; font-size:13px; margin-bottom:8px;">{{ error }}</div>
          }
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="sn-btn accent sm" type="submit" [disabled]="submitting">
              {{ existingReview ? 'Modifier mon avis' : 'Publier mon avis' }}
            </button>
            @if (existingReview) {
              <button class="sn-btn ghost sm" type="button" (click)="cancelEdit.emit()">Annuler</button>
            }
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .review-form { padding: 16px 0; }
  `],
})
export class ReviewFormComponent {
  @Input() existingReview: Review | null = null;
  @Output() submitted = new EventEmitter<{ rating: number; comment: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  readonly auth = inject(AuthService);

  rating = 0;
  comment = '';
  error = '';
  ratingError = '';
  submitting = false;

  ngOnInit(): void {
    if (this.existingReview) {
      this.rating = this.existingReview.rating;
      this.comment = this.existingReview.comment;
    }
  }

  onSubmit(): void {
    this.error = '';
    this.ratingError = '';

    if (this.rating < 1 || this.rating > 5) {
      this.ratingError = 'Veuillez sélectionner une note.';
      return;
    }
    if (this.comment.trim().length < 10) {
      this.error = 'Le commentaire doit faire au moins 10 caractères.';
      return;
    }
    if (this.comment.trim().length > 1000) {
      this.error = 'Le commentaire ne doit pas dépasser 1000 caractères.';
      return;
    }

    this.submitting = true;
    this.submitted.emit({ rating: this.rating, comment: this.comment.trim() });
  }
}
