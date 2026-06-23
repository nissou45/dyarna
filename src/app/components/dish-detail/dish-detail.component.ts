import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dish, DishIngredient } from '../../models/dish.model';
import { FaceSnapsService } from '../../services/face-snaps.service';

@Component({
  selector: 'app-dish-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (dish) {
      <!-- Hero -->
      @if (dish.imageUrl) {
        <section class="dd-hero" [style.background-image]="'url(' + dish.imageUrl + ')'">
          <div class="dd-hero__shade"></div>
          <div class="dd-hero__bottom">
            <div class="dd-hero__inner">
              <h1 class="dd-hero__title">{{ dish.name }}</h1>
              @if (dish.region) {
                <div class="dd-hero__loc">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                  {{ dish.region }}
                </div>
              }
              <div class="dd-hero__type">
                @for (tag of dish.tags; track tag) {
                  <span>{{ tag }}</span>
                }
              </div>
            </div>
          </div>
        </section>
      }

      <div class="dd-body">
        <main class="dd-main">
          <p class="dd-lede">{{ dish.description }}</p>

          <section class="dd-section">
            <h2 class="dd-section__title">
              <span class="dd-section__dot"></span>
              Recette
            </h2>
            <p class="dd-servings">Pour {{ dish.baseServings }} personnes</p>

            <h3 class="dd-subtitle">Ingrédients</h3>
            <div class="dd-ingredients">
              @for (ing of dish.ingredients; track ing.id) {
                <div class="dd-ingredient">
                  <span class="dd-ingredient__amt">{{ formatAmount(ing) }}</span>
                  <span class="dd-ingredient__name">{{ ing.name }}</span>
                </div>
              }
            </div>

            <h3 class="dd-subtitle">Préparation</h3>
            <div class="dd-steps">
              @for (step of dish.steps; track step.id; let i = $index) {
                <div class="dd-step">
                  <div class="dd-step__num">{{ i + 1 }}</div>
                  <div class="dd-step__content">
                    <h4 class="dd-step__title">{{ step.title }}</h4>
                    <p class="dd-step__text">{{ step.content }}</p>
                    @if (step.timerSeconds) {
                      <div class="dd-step__timer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {{ formatTimer(step.timerSeconds) }}
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            @if (dish.notes) {
              <div class="dd-notes">
                <h3 class="dd-subtitle">Notes & astuces</h3>
                <p>{{ dish.notes }}</p>
              </div>
            }
          </section>

          @if (dish.relatedCityNames.length > 0) {
            <section class="dd-section">
              <h2 class="dd-section__title">
                <span class="dd-section__dot"></span>
                Emblématique de
              </h2>
              <p class="dd-related-text">
                @for (cityName of dish.relatedCityNames; track cityName; let last = $last) {
                  <a [routerLink]="'/decouvertes/' + getCityId(cityName)" class="dd-city-link">
                    {{ cityName }}
                  </a>@if (!last) {, }
                }
              </p>
            </section>
          }
        </main>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .dd-hero {
      position: relative; height: clamp(300px, 40vw, 440px);
      overflow: hidden; background-size: cover; background-position: center;
    }
    .dd-hero__shade {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(20,16,12,.08) 28%, rgba(20,16,12,.36) 58%, rgba(20,16,12,.78));
    }
    .dd-hero__bottom { position: absolute; left: 0; right: 0; bottom: 0; }
    .dd-hero__inner { max-width: 1120px; margin: 0 auto; padding: 0 24px 44px; }
    .dd-hero__title {
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: clamp(48px, 8vw, 80px); line-height: .96; letter-spacing: -0.02em;
      margin: 0; color: #fdf6ea;
    }
    .dd-hero__loc {
      display: flex; align-items: center; gap: 7px; margin-top: 12px;
      font-size: 14px; color: rgba(253,246,234,.86);
    }
    .dd-hero__type {
      display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px;
    }
    .dd-hero__type span {
      font-size: 11.5px; font-weight: 500; padding: 5px 11px;
      border-radius: 999px; background: rgba(255,255,255,.16);
      backdrop-filter: blur(6px); color: #fdf6ea;
    }

    .dd-body {
      max-width: 800px; margin: 0 auto; padding: 48px 24px 64px;
    }
    .dd-lede {
      font-size: 19px; line-height: 1.7; color: var(--sn-ink-2); margin: 0;
    }

    .dd-section { margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--sn-line); }
    .dd-section__title {
      display: flex; align-items: center; gap: 11px;
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: 30px; line-height: 1; margin: 0 0 6px; color: var(--sn-ink);
    }
    .dd-section__dot {
      width: 8px; height: 8px; background: var(--sn-accent);
      transform: rotate(45deg); display: inline-block; flex-shrink: 0;
    }
    .dd-servings { font-size: 14px; color: var(--sn-muted); margin: 8px 0 24px; }

    .dd-subtitle {
      font-size: 16px; font-weight: 600; margin: 0 0 14px; color: var(--sn-ink);
    }

    .dd-ingredients {
      display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px;
      margin-bottom: 28px;
    }
    .dd-ingredient {
      display: flex; gap: 10px; padding: 6px 0;
      font-size: 14px; color: var(--sn-ink-2);
      border-bottom: 1px solid var(--sn-line);
    }
    .dd-ingredient__amt {
      font-weight: 600; white-space: nowrap; color: var(--sn-accent); min-width: 55px;
    }
    .dd-ingredient__name { flex: 1; }

    .dd-steps { margin-bottom: 28px; }
    .dd-step { display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--sn-line); }
    .dd-step:last-child { border: none; }
    .dd-step__num {
      flex-shrink: 0; width: 30px; height: 30px;
      background: var(--sn-accent); color: #fff;
      border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-size: 14px; font-weight: 600;
    }
    .dd-step__content { flex: 1; }
    .dd-step__title { font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--sn-ink); }
    .dd-step__text { font-size: 14px; line-height: 1.7; color: var(--sn-ink-2); margin: 0; }
    .dd-step__timer {
      display: inline-flex; align-items: center; gap: 4px;
      margin-top: 8px; font-size: 12px; color: var(--sn-accent);
      background: color-mix(in srgb, var(--sn-accent) 10%, transparent);
      padding: 3px 10px; border-radius: 6px;
    }

    .dd-notes {
      background: var(--sn-surface); border: 1px solid var(--sn-line);
      border-radius: 10px; padding: 16px;
      font-size: 14px; line-height: 1.6; color: var(--sn-ink-2); margin-bottom: 24px;
    }
    .dd-notes p { margin: 0; }

    .dd-related-text { font-size: 15px; color: var(--sn-ink-2); }
    .dd-city-link {
      color: var(--sn-accent); text-decoration: none; font-weight: 500;
    }
    .dd-city-link:hover { text-decoration: underline; }
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
