import { Component, Input } from '@angular/core';
import { MonthScore } from '../core/types';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const LABEL_COLORS: Record<string, string> = {
  ideal: 'var(--sn-chart-success)',
  good: 'var(--sn-chart-good)',
  average: 'var(--sn-chart-warn)',
  avoid: 'var(--sn-accent)',
};

const LABEL_TEXT: Record<string, string> = {
  ideal: 'Idéal',
  good: 'Favorable',
  average: 'Moyen',
  avoid: 'À éviter',
};

@Component({
  selector: 'app-best-season-chart',
  standalone: true,
  template: `
    <div class="season-chart">
      <div class="season-chart__months">
        @for (month of months; track month.month) {
          <div class="season-chart__bar-group">
            <div class="season-chart__label">{{ MONTH_LABELS[month.month - 1] }}</div>
            <div class="season-chart__bar-track">
              <div
                class="season-chart__bar"
                [style.height.px]="barHeight(month.score)"
                [style.background-color]="LABEL_COLORS[month.label]"
                [class.season-chart__bar--ideal]="month.label === 'ideal'"
              ></div>
            </div>
            <div class="season-chart__tag" [style.color]="LABEL_COLORS[month.label]">
              {{ LABEL_TEXT[month.label] }}
            </div>
          </div>
        }
      </div>
      @if (bestMonths.length > 0) {
        <div class="season-chart__recommendation">
          Meilleure période :
          <strong>{{ formatMonths(bestMonths) }}</strong>
        </div>
      }
    </div>
  `,
  styles: [`
    .season-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .season-chart__months {
      display: flex;
      gap: 6px;
      justify-content: space-between;
    }
    .season-chart__bar-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }
    .season-chart__label {
      font-size: 10px;
      color: var(--sn-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .season-chart__bar-track {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: var(--sn-surface-4);
      border-radius: 4px;
      overflow: hidden;
    }
    .season-chart__bar {
      width: 70%;
      border-radius: 3px 3px 0 0;
      transition: height 0.3s ease;
      min-height: 4px;
    }
    .season-chart__bar--ideal {
      box-shadow: 0 0 6px rgba(45, 138, 78, 0.3);
    }
    .season-chart__tag {
      font-size: 9px;
      font-weight: 600;
      white-space: nowrap;
    }
    .season-chart__recommendation {
      font-size: 13px;
      color: var(--sn-ink-2);
      text-align: center;
      padding: 8px 0 0;
      border-top: 1px solid var(--sn-line);
    }
  `],
})
export class BestSeasonChartComponent {
  @Input({ required: true }) months: MonthScore[] = [];
  @Input({ required: true }) bestMonths: number[] = [];

  readonly MONTH_LABELS = MONTH_LABELS;
  readonly LABEL_COLORS = LABEL_COLORS;
  readonly LABEL_TEXT = LABEL_TEXT;

  barHeight(score: number): number {
    return Math.max(4, (score / 100) * 55);
  }

  formatMonths(months: number[]): string {
    return months.map((m) => MONTH_LABELS[m - 1]).join(', ');
  }
}
