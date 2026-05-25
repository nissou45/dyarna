import { Directive, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() scrollEnabled: boolean = true;
  @Output() scrolled = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && this.scrollEnabled) {
          this.scrolled.emit();
        }
      },
      { threshold: 0.5 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
