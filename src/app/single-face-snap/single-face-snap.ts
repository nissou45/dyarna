import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaceSnap, Comment } from '../models/snap.model';
import { FaceSnapsService } from '../services/face-snaps.service';
import { ReviewsService } from '../services/reviews.service';
import { SnapType } from '../models/snap-type-type';
import { FACE_SNAPS_UI, APP_ROUTES, ARABIC_CITY_NAMES } from '@core';
import { ToastService } from '../services/toast.service';
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
export class SingleFaceSnapComponent implements OnInit {
  private readonly destroyRef     = inject(DestroyRef);
  private readonly faceSnapsService = inject(FaceSnapsService);
  private readonly reviewsService = inject(ReviewsService);
  private readonly weatherService = inject(WeatherService);
  private readonly galleryService = inject(GalleryService);
  private readonly route          = inject(ActivatedRoute);
  private readonly dishService    = inject(DishService);
  private readonly toastService   = inject(ToastService);

  faceSnap!: FaceSnap;
  relatedCuisine: FaceSnap[]    = [];
  relatedTraditions: FaceSnap[] = [];
  relatedActivities: FaceSnap[] = [];
  snapButtonText!: string;
  userHasSnapped!: boolean;
  readonly uiConstants = FACE_SNAPS_UI;
  readonly routes      = APP_ROUTES;

  get arabicName(): string | null {
    return this.faceSnap ? (ARABIC_CITY_NAMES[this.faceSnap.title] ?? null) : null;
  }

  isDish = false;
  dish: ReturnType<DishService['getByTitle']> = undefined;

  /** Plats liés au snap actif — pré-calculé pour éviter getDishByTitle() dans le template */
  cuisineDishes: Array<{ snap: FaceSnap; dish: ReturnType<DishService['getByTitle']> }> = [];

  activeCuisineIndex = 0;

  reviews: Review[]              = [];
  reviewSummary: ReviewSummary | null = null;
  currentPage  = 1;
  totalPages   = 1;
  editingReview: Review | null   = null;
  loadingReviews = false;

  weatherInfo: FullWeatherInfo | null = null;

  galleryPhotos: GalleryPhoto[]  = [];
  galleryPage      = 1;
  galleryTotalPages = 1;
  selectedPhoto: GalleryPhoto | null = null;
  currentUserId = '';

  private _cityId = '';
  get cityId(): string { return this._cityId; }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params => {
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

  private resetState(): void {
    this.reviews          = [];
    this.reviewSummary    = null;
    this.currentPage      = 1;
    this.totalPages       = 1;
    this.editingReview    = null;
    this.weatherInfo      = null;
    this.galleryPhotos    = [];
    this.galleryPage      = 1;
    this.galleryTotalPages = 1;
    this.selectedPhoto    = null;
    this.activeCuisineIndex = 0;
    this.isDish           = false;
    this.dish             = undefined;
    this.cuisineDishes    = [];
  }

  private prepareInterface(): void {
    this.snapButtonText = this.uiConstants.SNAP;
    this.userHasSnapped = false;
  }

  private getFaceSnap(): void {
    this.faceSnap  = this.faceSnapsService.getFaceSnapById(this.cityId);
    this.isDish    = this.faceSnap.tags.includes('cuisine');
    if (this.isDish) {
      this.dish = this.dishService.getByTitle(this.faceSnap.title);
    }

    const related = this.faceSnapsService.getRelatedSnaps(this.cityId);
    this.relatedCuisine    = related.cuisine;
    this.relatedTraditions = related.traditions;
    this.relatedActivities = related.activities;
    this.activeCuisineIndex = 0;

    // Pré-calculer les dishes liés pour éviter les appels dans le template
    this.cuisineDishes = related.cuisine.map(snap => ({
      snap,
      dish: this.dishService.getByTitle(snap.title),
    }));
  }

  onSnap(): void {
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

  onPhotoSelected(url: string): void { this.faceSnap.imageUrl = url; }

  onCommentAdded(comment: Comment): void {
    this.faceSnapsService.addCommentToSnap(this.faceSnap.id, comment);
  }

  loadReviewSummary(): void {
    this.reviewsService.getSummary(this.cityId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (s) => (this.reviewSummary = s),
      error: () => {},  // silencieux : résumé optionnel
    });
  }

  loadReviews(page: number = 1): void {
    this.loadingReviews = true;
    this.reviewsService.getByCity(this.cityId, page).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.reviews      = page === 1 ? res.reviews : [...this.reviews, ...res.reviews];
        this.totalPages   = res.totalPages;
        this.currentPage  = res.page;
        this.loadingReviews = false;
      },
      error: () => (this.loadingReviews = false),
    });
  }

  loadMore(): void {
    if (this.currentPage < this.totalPages) this.loadReviews(this.currentPage + 1);
  }

  onReviewSubmitted(data: { rating: number; comment: string }): void {
    if (this.editingReview) {
      this.reviewsService.update(this.cityId, { rating: data.rating, comment: data.comment }).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => { this.editingReview = null; this.loadReviews(1); this.loadReviewSummary(); },
        error: () => this.toastService.error('Impossible de modifier l\'avis. Réessayez.'),
      });
    } else {
      this.reviewsService.create(this.cityId, data.rating, data.comment).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: () => { this.loadReviews(1); this.loadReviewSummary(); },
        error: () => this.toastService.error('Impossible de publier l\'avis. Réessayez.'),
      });
    }
  }

  onEditReview(review: Review): void   { this.editingReview = review; }
  onCancelEdit(): void                 { this.editingReview = null; }

  onDeleteReview(cityId: string): void {
    this.reviewsService.delete(cityId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => { this.loadReviews(1); this.loadReviewSummary(); },
      error: () => this.toastService.error('Impossible de supprimer l\'avis.'),
    });
  }

  private loadWeather(): void {
    this.weatherService.getFullWeatherInfo(this.cityId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (info) => (this.weatherInfo = info),
      error: () => {},  // silencieux : météo optionnelle
    });
  }

  private loadGallery(page: number = 1): void {
    this.galleryService.getByCity(this.cityId, page).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.galleryPhotos    = page === 1 ? res.photos : [...this.galleryPhotos, ...res.photos];
        this.galleryPage      = res.page;
        this.galleryTotalPages = res.totalPages;
      },
      error: () => {},  // silencieux : galerie optionnelle
    });
  }

  loadMorePhotos(): void {
    if (this.galleryPage < this.galleryTotalPages) this.loadGallery(this.galleryPage + 1);
  }

  onPhotoDeleted(photoId: string): void {
    this.galleryPhotos = this.galleryPhotos.filter(p => p._id !== photoId);
  }

  onPhotoLiked(e: { photoId: string; likesCount: number }): void {
    const photo = this.galleryPhotos.find(p => p._id === e.photoId);
    if (photo) photo.likesCount = e.likesCount;
  }

  onPhotoUploaded(): void   { this.loadGallery(1); }
  setSelectedPhoto(photo: GalleryPhoto): void { this.selectedPhoto = photo; }
  closeLightbox(): void     { this.selectedPhoto = null; }
}
