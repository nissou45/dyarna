import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish, DishIngredient } from '../../models/dish.model';
import { FaceSnapsService } from '../../services/face-snaps.service';

@Component({
  selector: 'app-dish-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dish-detail.component.html',
  styleUrl: './dish-detail.component.scss',
})
export class DishDetailComponent {
  @Input({ required: true }) dish!: Dish;

  private faceSnapsService = inject(FaceSnapsService);

  formatAmount(ing: DishIngredient): string {
    const unit = ing.unit || '';
    const unitLabels: Record<string, string> = {
      g: 'g', kg: 'kg', ml: 'ml', l: 'l',
      tsp: 'c. à café', tbsp: 'c. à soupe',
      cup: 'tasse', pinch: 'pincée',
    };
    const label = unit ? (unitLabels[unit] || unit) : '';
    return label ? `${ing.amount} ${label}` : `${ing.amount}`;
  }

  formatTimer(seconds: number): string {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.round((seconds % 3600) / 60);
      return m > 0 ? `${h}h ${m}min` : `${h}h`;
    }
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} sec`;
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  }

  getCityId(cityName: string): string {
    const snap = this.faceSnapsService.getSnapByTitle(cityName);
    return snap ? snap.id : '';
  }
}
