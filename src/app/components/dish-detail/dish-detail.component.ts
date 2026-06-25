import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish, DishIngredient } from '../../models/dish.model';
import { FaceSnapsService } from '../../services/face-snaps.service';

const UNIT_LABELS: Record<string, string> = {
  g: 'g', kg: 'kg', ml: 'ml', l: 'l',
  tsp: 'c. à café', tbsp: 'c. à soupe',
  cup: 'tasse', pinch: 'pincée',
};

function formatAmount(ing: DishIngredient): string {
  const label = ing.unit ? (UNIT_LABELS[ing.unit] || ing.unit) : '';
  return label ? `${ing.amount} ${label}` : `${ing.amount}`;
}

function formatTimer(seconds: number): string {
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

@Component({
  selector: 'app-dish-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './dish-detail.component.html',
  styleUrl: './dish-detail.component.scss',
})
export class DishDetailComponent {
  readonly dish = input.required<Dish>();

  private faceSnapsService = inject(FaceSnapsService);

  readonly vm = computed(() => {
    const d = this.dish();
    if (!d) return null;
    return {
      ingredients: d.ingredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        displayAmount: formatAmount(ing),
      })),
      steps: d.steps.map(step => ({
        id: step.id,
        title: step.title,
        content: step.content,
        displayTimer: step.timerSeconds ? formatTimer(step.timerSeconds) : null,
      })),
      cityLinks: d.relatedCityNames.map(name => ({
        name,
        id: this.faceSnapsService.getSnapByTitle(name)?.id ?? '',
      })),
    };
  });
}
