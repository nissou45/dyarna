import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FACE_SNAPS_UI } from '@core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  readonly placeholder = FACE_SNAPS_UI.SEARCH_PLACEHOLDER;

  private searchSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(query => this.searchChange.emit(query));
  }

  onInput(value: string): void {
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
