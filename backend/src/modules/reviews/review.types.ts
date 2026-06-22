export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: { rating: number; count: number }[];
}
