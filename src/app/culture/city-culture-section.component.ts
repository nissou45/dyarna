import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CultureService } from '../services/culture.service';
import { CityCultureResponse } from '../core/types';

@Component({
  selector: 'app-city-culture-section',
  standalone: true,
  imports: [],
  template: `
    <section class="culture-section">
      @switch (state()) {
        @case ('loading') {
          <div class="culture-skeleton">
            <div class="skeleton-block w-full h-32 rounded-lg mb-6"></div>
            <div class="skeleton-block w-three-quarters h-6 rounded mb-4"></div>
            <div class="skeleton-block w-full h-4 rounded mb-2"></div>
            <div class="skeleton-block w-full h-4 rounded mb-2"></div>
            <div class="skeleton-block w-two-thirds h-4 rounded mb-8"></div>
            <div class="flex gap-4">
              <div class="skeleton-block flex-1 h-20 rounded-lg"></div>
              <div class="skeleton-block flex-1 h-20 rounded-lg"></div>
              <div class="skeleton-block flex-1 h-20 rounded-lg"></div>
            </div>
          </div>
        }
        @case ('unavailable') {
          <div class="culture-unavailable">
            <p>Contenu culturel en cours de préparation pour cette ville.</p>
          </div>
        }
        @case ('ready') {
          @if (data(); as d) {
            <!-- Histoire -->
            @if (d.history) {
              <div class="culture-block culture-history">
                <h2 class="culture-block__title">Histoire</h2>
                <div class="culture-history__text">{{ d.history }}</div>
              </div>
            }

            <!-- Légende -->
            @if (d.legend) {
              <div class="culture-block culture-legend">
                <blockquote class="culture-legend__quote">
                  <p>{{ d.legend.content }}</p>
                  <footer>{{ d.legend.title }}</footer>
                </blockquote>
              </div>
            }

            <!-- Traditions -->
            @if (d.traditions && d.traditions.length > 0) {
              <div class="culture-block">
                <h2 class="culture-block__title">Traditions</h2>
                <div class="culture-traditions">
                  @for (tradition of d.traditions; track tradition) {
                    <div class="culture-tradition-card">
                      <div class="culture-tradition-card__icon">✦</div>
                      <span>{{ tradition }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Cuisine -->
            @if (d.cuisine && d.cuisine.length > 0) {
              <div class="culture-block">
                <h2 class="culture-block__title">Gastronomie</h2>
                <div class="culture-cuisine">
                  @for (item of d.cuisine; track item.name) {
                    <details class="culture-cuisine__item">
                      <summary class="culture-cuisine__name">{{ item.name }}</summary>
                      <p class="culture-cuisine__desc">{{ item.description }}</p>
                    </details>
                  }
                </div>
              </div>
            }

            <!-- Source -->
            @if (d.sourceUrl) {
              <div class="culture-source">
                <a [href]="d.sourceUrl" target="_blank" rel="noopener noreferrer">
                  Source : Wikipedia
                </a>
              </div>
            }
          }
        }
      }
    </section>
  `,
  styles: [`
    .culture-section { margin-top: 32px; }

    .culture-block {
      margin-bottom: 28px;
    }

    .culture-block__title {
      font-size: 20px;
      font-weight: 600;
      color: #3d352c;
      margin: 0 0 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e4dbcc;
    }

    /* Histoire */
    .culture-history__text {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 16px;
      line-height: 1.8;
      color: #3d352c;
    }

    /* Légende */
    .culture-legend {
      background: #fef9f0;
      border: 1px solid #e4dbcc;
      border-left: 4px solid #c8613c;
      border-radius: 10px;
      padding: 24px;
      margin-bottom: 28px;
    }

    .culture-legend__quote {
      margin: 0;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 16px;
      font-style: italic;
      line-height: 1.7;
      color: #5a4a3a;
    }

    .culture-legend__quote footer {
      margin-top: 12px;
      font-size: 13px;
      font-style: normal;
      font-weight: 600;
      color: #c8613c;
    }

    /* Traditions */
    .culture-traditions {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .culture-tradition-card {
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
      line-height: 1.5;
      color: #3d352c;
    }

    .culture-tradition-card__icon {
      color: #c8613c;
      font-size: 16px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* Cuisine */
    .culture-cuisine {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .culture-cuisine__item {
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 8px;
      padding: 12px 16px;
      cursor: pointer;
    }

    .culture-cuisine__name {
      font-weight: 600;
      font-size: 15px;
      color: #3d352c;
      cursor: pointer;
    }

    .culture-cuisine__desc {
      margin: 10px 0 4px;
      font-size: 14px;
      line-height: 1.6;
      color: #5a4a3a;
    }

    /* Source */
    .culture-source {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e4dbcc;
      text-align: right;
    }

    .culture-source a {
      font-size: 12px;
      color: #8a7f6e;
      text-decoration: none;
    }

    .culture-source a:hover {
      text-decoration: underline;
    }

    /* Skeleton */
    .culture-skeleton {
      padding: 16px 0;
    }

    .skeleton-block {
      background: linear-gradient(90deg, #f0ece4 25%, #e4dbcc 50%, #f0ece4 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .w-full { width: 100%; }
    .w-three-quarters { width: 75%; }
    .w-two-thirds { width: 66.67%; }
    .h-32 { height: 128px; }
    .h-20 { height: 80px; }
    .h-6 { height: 24px; }
    .h-4 { height: 16px; }
    .rounded { border-radius: 6px; }
    .rounded-lg { border-radius: 10px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mb-6 { margin-bottom: 24px; }
    .mb-8 { margin-bottom: 32px; }
    .flex { display: flex; }
    .gap-4 { gap: 16px; }
    .flex-1 { flex: 1; }

    .culture-unavailable {
      padding: 32px;
      text-align: center;
      color: #8a7f6e;
      background: #fefcf8;
      border: 1px dashed #e4dbcc;
      border-radius: 10px;
      font-size: 14px;
    }
  `],
})
export class CityCultureSectionComponent implements OnInit {
  private readonly cultureService = inject(CultureService);

  @Input({ required: true }) cityId!: string;

  protected readonly state = signal<'loading' | 'ready' | 'unavailable'>('loading');
  protected readonly data = signal<CityCultureResponse | null>(null);

  ngOnInit(): void {
    this.loadCulture();
  }

  private loadCulture(): void {
    this.state.set('loading');
    this.cultureService.getCultureContent(this.cityId).subscribe({
      next: (result) => {
        this.state.set(result.state);
        this.data.set(result.data);
      },
      error: () => {
        this.state.set('unavailable');
      },
    });
  }
}
