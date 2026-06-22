import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating" [class.readonly]="readonly">
      @for (star of [1,2,3,4,5]; track star) {
        <button
          type="button"
          class="star"
          [class.filled]="star <= (hovered || value)"
          [class.half]="!readonly && star === Math.ceil(hovered || value) && (hovered || value) % 1 > 0"
          [disabled]="readonly"
          (mouseenter)="hovered = star"
          (mouseleave)="hovered = 0"
          (click)="setValue(star)"
          attr.aria-label="{{ star }} étoile{{ star > 1 ? 's' : '' }}"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .star-rating { display: inline-flex; gap: 2px; }
    .star { background: none; border: none; cursor: pointer; padding: 0; line-height: 0; }
    .star:disabled { cursor: default; }
    .star svg { transition: fill .15s, stroke .15s; }
    .star.filled svg { fill: #d4a03c; stroke: #d4a03c; }
    .star:not(.filled) svg { fill: none; stroke: #cec0ab; }
    .star:hover:not(:disabled) svg { stroke: #d4a03c; }
  `],
})
export class StarRatingComponent {
  @Input() value = 0;
  @Input() readonly = false;
  @Output() valueChange = new EventEmitter<number>();

  hovered = 0;
  readonly Math = Math;

  setValue(v: number): void {
    if (!this.readonly) {
      this.value = v;
      this.valueChange.emit(v);
    }
  }
}
