import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CultureService } from '../services/culture.service';
import { CityCultureResponse } from '../core/types';

@Component({
  selector: 'app-city-culture-section',
  standalone: true,
  imports: [],
  templateUrl: './city-culture-section.component.html',
  styleUrl: './city-culture-section.component.scss',
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
