import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaceSnap, Comment } from '../models/snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';
import { ReviewsService } from '../services/reviews.service';
import { SnapType } from '../models/snap-type-type';
import { FACE_SNAPS_UI, APP_ROUTES } from '../core/constants/face-snaps.constants';
import { CommentsSectionComponent } from '../comments-section/comments-section';
import { UnsplashSearchComponent } from '../unsplash-search/unsplash-search';
import { RatingSummaryComponent } from '../reviews/rating-summary.component';
import { ReviewListComponent } from '../reviews/review-list.component';
import { ReviewFormComponent } from '../reviews/review-form.component';
import { Review, ReviewSummary } from '../core/types';

@Component({
  selector: 'app-single-face-snap',
  standalone: true,
  imports: [
    RouterLink,
    CommentsSectionComponent,
    UnsplashSearchComponent,
    RatingSummaryComponent,
    ReviewListComponent,
    ReviewFormComponent,
  ],
  templateUrl: './single-face-snap.html',
  styleUrl: './single-face-snap.scss',
})
export class SingleFaceSnapComponent implements OnInit {
  private faceSnapsService = inject(FaceSnapsService);
  private reviewsService = inject(ReviewsService);
  private route = inject(ActivatedRoute);

  faceSnap!: FaceSnap;
  relatedCuisine: FaceSnap[] = [];
  relatedTraditions: FaceSnap[] = [];
  relatedActivities: FaceSnap[] = [];
  snapButtonText!: string;
  userHasSnapped!: boolean;
  readonly uiConstants = FACE_SNAPS_UI;
  readonly routes = APP_ROUTES;

  reviews: Review[] = [];
  reviewSummary: ReviewSummary | null = null;
  currentPage = 1;
  totalPages = 1;
  editingReview: Review | null = null;
  loadingReviews = false;

  get cityId(): string {
    return this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.prepareInterface();
    this.getFaceSnap();
    this.loadReviewSummary();
    this.loadReviews();
  }

  private prepareInterface() {
    this.snapButtonText = this.uiConstants.SNAP;
    this.userHasSnapped = false;
  }

  private getFaceSnap() {
    const faceSnapId = this.cityId;
    this.faceSnap = this.faceSnapsService.getFaceSnapById(faceSnapId);
    const related = this.faceSnapsService.getRelatedSnaps(faceSnapId);
    this.relatedCuisine = related.cuisine;
    this.relatedTraditions = related.traditions;
    this.relatedActivities = related.activities;
  }

  onSnap() {
    const snapType: SnapType = this.userHasSnapped ? 'unsnap' : 'snap';
    this.faceSnapsService.snapFaceSnapById(this.faceSnap.id, snapType);
    this.userHasSnapped = !this.userHasSnapped;
    this.snapButtonText = this.userHasSnapped ? this.uiConstants.UNSNAP : this.uiConstants.SNAP;
  }

  onPhotoSelected(url: string): void {
    this.faceSnap.imageUrl = url;
  }

  onCommentAdded(comment: Comment): void {
    this.faceSnapsService.addCommentToSnap(this.faceSnap.id, comment);
  }

  loadReviewSummary(): void {
    this.reviewsService.getSummary(this.cityId).subscribe({
      next: (s) => (this.reviewSummary = s),
      error: () => {},
    });
  }

  loadReviews(page: number = 1): void {
    this.loadingReviews = true;
    this.reviewsService.getByCity(this.cityId, page).subscribe({
      next: (res) => {
        this.reviews = this.currentPage === 1 ? res.reviews : [...this.reviews, ...res.reviews];
        this.totalPages = res.totalPages;
        this.currentPage = res.page;
        this.loadingReviews = false;
      },
      error: () => (this.loadingReviews = false),
    });
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages) {
      this.loadReviews(this.currentPage + 1);
    }
  }

  onReviewSubmitted(data: { rating: number; comment: string }): void {
    if (this.editingReview) {
      this.reviewsService.update(this.cityId, { rating: data.rating, comment: data.comment }).subscribe({
        next: () => {
          this.editingReview = null;
          this.loadReviews(1);
          this.loadReviewSummary();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.reviewsService.create(this.cityId, data.rating, data.comment).subscribe({
        next: () => {
          this.loadReviews(1);
          this.loadReviewSummary();
        },
        error: (err) => console.error(err),
      });
    }
  }

  onEditReview(review: Review): void {
    this.editingReview = review;
  }

  onCancelEdit(): void {
    this.editingReview = null;
  }

  onDeleteReview(cityId: string): void {
    this.reviewsService.delete(cityId).subscribe({
      next: () => {
        this.loadReviews(1);
        this.loadReviewSummary();
      },
      error: () => {},
    });
  }
}
