import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullWeatherInfo, CurrentWeatherResponse, BestSeasonResult } from '../core/types';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly BASE = '/api/weather';

  getCurrentWeather(cityId: string) {
    return this.http.get<CurrentWeatherResponse>(`${this.BASE}/${cityId}/current`);
  }

  getBestSeason(cityId: string) {
    return this.http.get<BestSeasonResult>(`${this.BASE}/${cityId}/best-season`);
  }

  getFullWeatherInfo(cityId: string) {
    return this.http.get<FullWeatherInfo>(`${this.BASE}/${cityId}/full`);
  }
}
