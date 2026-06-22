import { Component, output, signal, HostListener, inject, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { City, CITIES } from '../../data/cities';
import { searchCities } from '../../services/city-search.service';

const CATEGORY_ICONS: Record<City['category'], string> = {
  imperiale: '🏛️',
  cotiere: '🌊',
  montagne: '⛰️',
  desert: '🏜️',
  moderne: '🏙️',
};

@Component({
  selector: 'app-city-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="cs" (click)="$event.stopPropagation()">
      <div class="cs__input-wrap" [class.cs__input-wrap--open]="open()">
        <input
          #input
          [(ngModel)]="query"
          (input)="onInput()"
          (keydown)="onKeydown($event)"
          (focus)="onFocus()"
          role="combobox"
          aria-expanded="false"
          [attr.aria-expanded]="open()"
          [attr.aria-activedescendant]="activeDescendantId()"
          aria-autocomplete="list"
          aria-label="Rechercher une ville ou un village"
          placeholder="Rechercher une ville ou un village..."
          class="cs__input"
          autocomplete="off"
        />
        @if (query()) {
          <button class="cs__clear" (click)="clear()" aria-label="Effacer la recherche">✕</button>
        }
      </div>

      @if (open() && suggestions().length > 0) {
        <ul class="cs__list" role="listbox" [id]="listId">
          @for (city of suggestions(); track city.id; let i = $index) {
            <li
              [id]="listId + '-opt-' + i"
              role="option"
              [attr.aria-selected]="activeIndex() === i"
              [class.cs__option--active]="activeIndex() === i"
              class="cs__option"
              (mousedown)="select(city)"
              (mouseenter)="activeIndex.set(i)"
            >
              <span class="cs__option-icon">{{ CATEGORY_ICONS[city.category] }}</span>
              <div class="cs__option-body">
                <span class="cs__option-name">{{ city.name }}</span>
                <span class="cs__option-region">{{ city.region }}</span>
              </div>
            </li>
          }
        </ul>
      }

      @if (open() && suggestions().length === 0 && query().trim().length >= 2) {
        <div class="cs__empty">
          Aucune ville trouvée pour <strong>{{ query() }}</strong>
        </div>
      }
    </div>
  `,
  styles: [`
    .cs { position: relative; width: 100%; max-width: 400px; z-index: 1000; }
    .cs__input-wrap { display: flex; align-items: center; background: #fff; border: 1px solid #d4cbb8; border-radius: 10px; transition: border-color 0.15s; }
    .cs__input-wrap--open { border-color: #c8613c; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    .cs__input { flex: 1; padding: 10px 14px; border: none; background: transparent; font-size: 14px; color: #3d352c; outline: none; font-family: inherit; }
    .cs__input::placeholder { color: #b8a99a; }
    .cs__clear { background: none; border: none; color: #b8a99a; cursor: pointer; font-size: 14px; padding: 0 12px; line-height: 1; }
    .cs__clear:hover { color: #c8613c; }
    .cs__list { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #c8613c; border-top: none; border-radius: 0 0 10px 10px; max-height: 320px; overflow-y: auto; margin: 0; padding: 0; list-style: none; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .cs__option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: background 0.1s; }
    .cs__option--active { background: #fef9f0; }
    .cs__option:hover { background: #fef9f0; }
    .cs__option-icon { font-size: 18px; flex-shrink: 0; }
    .cs__option-body { display: flex; flex-direction: column; }
    .cs__option-name { font-size: 14px; font-weight: 500; color: #3d352c; }
    .cs__option-region { font-size: 11px; color: #8a7f6e; text-transform: uppercase; letter-spacing: 0.3px; }
    .cs__empty { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border: 1px solid #d4cbb8; border-top: none; border-radius: 0 0 10px 10px; padding: 14px; font-size: 13px; color: #8a7f6e; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  `],
})
export class CitySearchComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly input$ = new Subject<string>();

  readonly citySelected = output<City>();

  protected readonly query = signal('');
  protected readonly suggestions = signal<City[]>([]);
  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly listId = 'cs-list';
  protected readonly CATEGORY_ICONS = CATEGORY_ICONS;

  constructor() {
    this.input$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((q) => {
        if (q.trim().length < 2) {
          this.suggestions.set([]);
          this.open.set(false);
        } else {
          const results = searchCities(q, CITIES);
          this.suggestions.set(results);
          this.open.set(true);
          this.activeIndex.set(-1);
        }
      });
  }

  protected onInput(): void {
    this.input$.next(this.query());
  }

  protected onFocus(): void {
    if (this.suggestions().length > 0) {
      this.open.set(true);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const s = this.suggestions();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(this.activeIndex() + 1, s.length - 1);
      this.activeIndex.set(next);
      this.scrollToActive();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = Math.max(this.activeIndex() - 1, 0);
      this.activeIndex.set(prev);
      this.scrollToActive();
    } else if (event.key === 'Enter' && this.activeIndex() >= 0 && s[this.activeIndex()]) {
      event.preventDefault();
      this.select(s[this.activeIndex()]);
    } else if (event.key === 'Escape') {
      this.close();
    }
  }

  protected select(city: City): void {
    this.citySelected.emit(city);
    this.query.set('');
    this.suggestions.set([]);
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  protected clear(): void {
    this.query.set('');
    this.suggestions.set([]);
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  protected close(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.close();
  }

  protected activeDescendantId(): string {
    if (this.activeIndex() < 0) return '';
    return `${this.listId}-opt-${this.activeIndex()}`;
  }

  private scrollToActive(): void {
    requestAnimationFrame(() => {
      const el = document.getElementById(this.activeDescendantId());
      el?.scrollIntoView({ block: 'nearest' });
    });
  }
}
