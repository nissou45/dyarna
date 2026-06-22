import { Component, Input } from '@angular/core';
import { CurrentWeather } from '../core/types';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  template: `
    @if (weather) {
      <div class="weather-widget" [class.weather-widget--stale]="stale">
        <div class="weather-widget__icon">
          <img
            [src]="'https://openweathermap.org/img/wn/' + weather.icon + '@2x.png'"
            [alt]="weather.conditionLabel"
            width="50"
            height="50"
          />
        </div>
        <div class="weather-widget__info">
          <span class="weather-widget__temp">{{ weather.temp }}°C</span>
          <span class="weather-widget__desc">{{ weather.conditionLabel }}</span>
          <div class="weather-widget__details">
            <span>Humidité {{ weather.humidity }}%</span>
            <span>Vent {{ weather.windSpeed }} km/h</span>
          </div>
          @if (stale) {
            <span class="weather-widget__stale">Données actualisées périodiquement</span>
          }
        </div>
      </div>
    } @else {
      <div class="weather-widget weather-widget--empty">
        <span>Météo temporairement indisponible</span>
      </div>
    }
  `,
  styles: [`
    .weather-widget {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fefcf8;
      border: 1px solid #e4dbcc;
      border-radius: 10px;
      padding: 12px 16px;
    }
    .weather-widget--stale {
      opacity: 0.85;
    }
    .weather-widget--empty {
      justify-content: center;
      padding: 20px;
      color: #8a7f6e;
      font-size: 13px;
    }
    .weather-widget__icon {
      flex-shrink: 0;
    }
    .weather-widget__icon img {
      display: block;
    }
    .weather-widget__info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .weather-widget__temp {
      font-size: 22px;
      font-weight: 700;
      color: #3d352c;
      line-height: 1;
    }
    .weather-widget__desc {
      font-size: 13px;
      color: #5a4a3a;
    }
    .weather-widget__details {
      display: flex;
      gap: 12px;
      font-size: 11px;
      color: #8a7f6e;
    }
    .weather-widget__stale {
      font-size: 10px;
      color: #b8a99a;
      font-style: italic;
    }
  `],
})
export class WeatherWidgetComponent {
  @Input({ required: true }) weather!: CurrentWeather | null;
  @Input() stale = false;
}
