import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaceSnap, Comment } from '../models/snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';
import { ReviewsService } from '../services/reviews.service';
import { SnapType } from '../models/snap-type-type';
import { FACE_SNAPS_UI, APP_ROUTES, ARABIC_CITY_NAMES } from '@core';
import { CommentsSectionComponent } from '../comments-section/comments-section';
import { RatingSummaryComponent } from '../reviews/rating-summary.component';
import { ReviewListComponent } from '../reviews/review-list.component';
import { ReviewFormComponent } from '../reviews/review-form.component';
import { CityCultureSectionComponent } from '../culture/city-culture-section.component';
import { WeatherWidgetComponent } from '../weather/weather-widget.component';
import { BestSeasonChartComponent } from '../weather/best-season-chart.component';
import { PhotoUploadFormComponent } from '../gallery/photo-upload-form.component';
import { PhotoGridComponent } from '../gallery/photo-grid.component';
import { PhotoLightboxComponent } from '../gallery/photo-lightbox.component';
import { WeatherService } from '../services/weather.service';
import { GalleryService } from '../services/gallery.service';
import { Review, ReviewSummary, FullWeatherInfo, GalleryPhoto } from '../core/types';
import { DishDetailComponent } from '../components/dish-detail/dish-detail.component';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-single-face-snap',
  standalone: true,
  imports: [
    RouterLink,
    CommentsSectionComponent,
    RatingSummaryComponent,
    ReviewListComponent,
    ReviewFormComponent,
    CityCultureSectionComponent,
    WeatherWidgetComponent,
    BestSeasonChartComponent,
    PhotoUploadFormComponent,
    PhotoGridComponent,
    PhotoLightboxComponent,
    DishDetailComponent,
  ],
  templateUrl: './single-face-snap.html',
  styleUrl: './single-face-snap.scss',
})
export class SingleFaceSnapComponent implements OnInit, OnDestroy {
  private routeSub!: Subscription;
  private faceSnapsService = inject(FaceSnapsService);
  private reviewsService = inject(ReviewsService);
  private weatherService = inject(WeatherService);
  private galleryService = inject(GalleryService);
  private route = inject(ActivatedRoute);
  private dishService = inject(DishService);

  faceSnap!: FaceSnap;
  relatedCuisine: FaceSnap[] = [];
  relatedTraditions: FaceSnap[] = [];
  relatedActivities: FaceSnap[] = [];
  snapButtonText!: string;
  userHasSnapped!: boolean;
  readonly uiConstants = FACE_SNAPS_UI;
  readonly routes = APP_ROUTES;

  get arabicName(): string | null {
    return this.faceSnap ? (ARABIC_CITY_NAMES[this.faceSnap.title] ?? null) : null;
  }

  isDish = false;
  dish = this.dishService.getByTitle('');
  activeCuisineIndex = 0;

  getDishByTitle(title: string) {
    return this.dishService.getByTitle(title);
  }

  reviews: Review[] = [];
  reviewSummary: ReviewSummary | null = null;
  currentPage = 1;
  totalPages = 1;
  editingReview: Review | null = null;
  loadingReviews = false;

  weatherInfo: FullWeatherInfo | null = null;

  galleryPhotos: GalleryPhoto[] = [];
  galleryPage = 1;
  galleryTotalPages = 1;
  selectedPhoto: GalleryPhoto | null = null;
  photoLikes: Record<string, boolean> = {};
  currentUserId = '';

  private _cityId = '';

  get cityId(): string {
    return this._cityId;
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this._cityId = params.get('id') ?? '';
      this.resetState();
      this.prepareInterface();
      this.getFaceSnap();
      this.loadReviewSummary();
      this.loadReviews();
      this.loadWeather();
      this.loadGallery();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private resetState(): void {
    this.reviews = [];
    this.reviewSummary = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.editingReview = null;
    this.weatherInfo = null;
    this.galleryPhotos = [];
    this.galleryPage = 1;
    this.galleryTotalPages = 1;
    this.selectedPhoto = null;
    this.activeCuisineIndex = 0;
    this.isDish = false;
    this.dish = undefined;
  }

  private prepareInterface() {
    this.snapButtonText = this.uiConstants.SNAP;
    this.userHasSnapped = false;
  }

  private getFaceSnap() {
    const faceSnapId = this.cityId;
    this.faceSnap = this.faceSnapsService.getFaceSnapById(faceSnapId);

    // Detect if this is a dish
    this.isDish = this.faceSnap.tags.includes('cuisine');
    if (this.isDish) {
      this.dish = this.dishService.getByTitle(this.faceSnap.title);
    }

    const related = this.faceSnapsService.getRelatedSnaps(faceSnapId);
    this.relatedCuisine = related.cuisine;
    this.relatedTraditions = related.traditions;
    this.relatedActivities = related.activities;
    this.activeCuisineIndex = 0;
  }

  onSnap() {
    const snapType: SnapType = this.userHasSnapped ? 'unsnap' : 'snap';
    this.faceSnapsService.snapFaceSnapById(this.faceSnap.id, snapType);
    this.userHasSnapped = !this.userHasSnapped;
    this.snapButtonText = this.userHasSnapped ? this.uiConstants.UNSNAP : this.uiConstants.SNAP;
  }

  onShare(): void {
    if (navigator.share) {
      navigator.share({ title: this.faceSnap.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
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

  private loadWeather(): void {
    this.weatherService.getFullWeatherInfo(this.cityId).subscribe({
      next: (info) => (this.weatherInfo = info),
      error: () => {},
    });
  }

  private loadGallery(page: number = 1): void {
    this.galleryService.getByCity(this.cityId, page).subscribe({
      next: (res) => {
        this.galleryPhotos = page === 1 ? res.photos : [...this.galleryPhotos, ...res.photos];
        this.galleryPage = res.page;
        this.galleryTotalPages = res.totalPages;
      },
      error: () => {},
    });
  }

  loadMorePhotos(): void {
    if (this.galleryPage < this.galleryTotalPages) {
      this.loadGallery(this.galleryPage + 1);
    }
  }

  onPhotoDeleted(photoId: string): void {
    this.galleryPhotos = this.galleryPhotos.filter((p) => p._id !== photoId);
  }

  onPhotoLiked(e: { photoId: string; likesCount: number }): void {
    const photo = this.galleryPhotos.find((p) => p._id === e.photoId);
    if (photo) photo.likesCount = e.likesCount;
  }

  onPhotoUploaded(): void {
    this.loadGallery(1);
  }

  setSelectedPhoto(photo: GalleryPhoto): void {
    this.selectedPhoto = photo;
  }

  closeLightbox(): void {
    this.selectedPhoto = null;
  }
}
