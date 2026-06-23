import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish, DishIngredient, DishStep } from '../../models/dish.model';
import { FaceSnapsService } from '../../services/face-snaps.service';

@Component({
  selector: 'app-dish-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (dish) {
      <div class="dish-detail">
        <!-- Hero image -->
        @if (dish.imageUrl) {
          <div class="dish-hero" [style.background-image]="'url(' + dish.imageUrl + ')'"></div>
        }

        <div class="dish-body">
          <!-- Header -->
          <h1 class="dish-title">{{ dish.name }}</h1>
          @if (dish.region) {
            <div class="dish-region">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {{ dish.region }}
            </div>
          }

          <div class="dish-tags">
            @for (tag of dish.tags; track tag) {
              <span class="sn-tag cuisine">{{ tag }}</span>
            }
          </div>

          <!-- Description -->
          <p class="dish-lede">{{ dish.description }}</p>

          <!-- Recipe section -->
          <div class="dish-recipe">
            <h2 class="dish-section-title">Recette</h2>
            <p class="dish-servings">Pour {{ dish.baseServings }} personnes</p>

            <!-- Ingredients -->
            <div class="dish-ingredients">
              <h3 class="dish-subtitle">Ingrédients</h3>
              <ul class="dish-ingredient-list">
                @for (ing of dish.ingredients; track ing.id) {
                  <li class="dish-ingredient-item">
                    <span class="dish-ingredient-amount">{{ formatAmount(ing) }}</span>
                    <span class="dish-ingredient-name">{{ ing.name }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Steps -->
            <div class="dish-steps">
              <h3 class="dish-subtitle">Préparation</h3>
              <ol class="dish-step-list">
                @for (step of dish.steps; track step.id; let i = $index) {
                  <li class="dish-step-item">
                    <div class="dish-step-number">{{ i + 1 }}</div>
                    <div class="dish-step-content">
                      <h4 class="dish-step-title">{{ step.title }}</h4>
                      <p class="dish-step-text">{{ step.content }}</p>
                      @if (step.timerSeconds) {
                        <div class="dish-step-timer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {{ formatTimer(step.timerSeconds) }}
                        </div>
                      }
                    </div>
                  </li>
                }
              </ol>
            </div>

            <!-- Notes -->
            @if (dish.notes) {
              <div class="dish-notes">
                <h3 class="dish-subtitle">Notes & astuces</h3>
                <p>{{ dish.notes }}</p>
              </div>
            }
          </div>

          <!-- Related cities -->
          @if (dish.relatedCityNames.length > 0) {
            <div class="dish-related">
              <h3 class="dish-subtitle">Emblématique de</h3>
              <p class="dish-related-text">
                @for (cityName of dish.relatedCityNames; track cityName; let last = $last) {
                  <a [routerLink]="'/decouvertes/' + getCityId(cityName)" class="dish-city-link">
                    {{ cityName }}
                  </a>@if (!last) {, }
                }
              </p>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; max-width: 800px; margin: 0 auto; }
    .dish-hero {
      height: 340px; background-size: cover; background-position: center;
      border-radius: 16px; margin-bottom: 24px;
    }
    .dish-body { padding: 0 16px 40px; }
    .dish-title { font-size: 28px; font-weight: 700; color: var(--sn-ink-2); margin: 0 0 8px; }
    .dish-region {
      display: flex; align-items: center; gap: 6px;
      font-size: 14px; color: var(--sn-muted); margin-bottom: 12px;
    }
    .dish-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .dish-lede {
      font-size: 16px; line-height: 1.7; color: var(--sn-ink-3);
      font-family: Georgia, serif; margin-bottom: 32px;
    }
    .dish-recipe {
      background: var(--sn-surface-3); border-radius: 14px;
      padding: 24px; margin-bottom: 24px;
    }
    .dish-section-title {
      font-size: 22px; font-weight: 600; color: var(--sn-ink-2);
      margin: 0 0 4px;
    }
    .dish-servings { font-size: 13px; color: var(--sn-muted); margin-bottom: 24px; }
    .dish-subtitle {
      font-size: 16px; font-weight: 600; color: var(--sn-ink-2);
      margin: 0 0 12px;
    }
    .dish-ingredient-list {
      list-style: none; padding: 0; margin: 0 0 24px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;
    }
    .dish-ingredient-item {
      display: flex; gap: 8px; padding: 6px 0;
      font-size: 14px; color: var(--sn-ink-2);
      border-bottom: 1px solid var(--sn-line);
    }
    .dish-ingredient-amount {
      font-weight: 600; white-space: nowrap; color: var(--sn-accent);
      min-width: 50px;
    }
    .dish-ingredient-name { flex: 1; }
    .dish-step-list {
      list-style: none; padding: 0; margin: 0 0 24px;
    }
    .dish-step-item {
      display: flex; gap: 14px; padding: 12px 0;
      border-bottom: 1px solid var(--sn-line);
    }
    .dish-step-item:last-child { border: none; }
    .dish-step-number {
      flex-shrink: 0; width: 28px; height: 28px;
      background: var(--sn-accent); color: var(--sn-surface);
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 13px; font-weight: 600;
    }
    .dish-step-content { flex: 1; }
    .dish-step-title { font-size: 15px; font-weight: 600; color: var(--sn-ink-2); margin: 0 0 6px; }
    .dish-step-text { font-size: 14px; line-height: 1.7; color: var(--sn-ink-3); margin: 0; }
    .dish-step-timer {
      display: inline-flex; align-items: center; gap: 4px;
      margin-top: 8px; font-size: 12px; color: var(--sn-accent);
      background: color-mix(in srgb, var(--sn-accent) 10%, transparent);
      padding: 3px 10px; border-radius: 6px;
    }
    .dish-notes {
      background: var(--sn-surface); border: 1px solid var(--sn-line);
      border-radius: 10px; padding: 16px;
      font-size: 14px; line-height: 1.6; color: var(--sn-ink-3);
      margin-bottom: 24px;
    }
    .dish-notes p { margin: 0; }
    .dish-related-text { font-size: 14px; color: var(--sn-ink-3); }
    .dish-city-link {
      color: var(--sn-accent); text-decoration: none; font-weight: 500;
    }
    .dish-city-link:hover { text-decoration: underline; }
  `],
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
