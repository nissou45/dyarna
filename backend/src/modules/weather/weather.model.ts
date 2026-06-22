import mongoose, { Document, Schema } from 'mongoose';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  condition: string;
  conditionLabel: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface IWeatherCache extends Document {
  cityId: string;
  current: CurrentWeather;
  fetchedAt: Date;
}

const weatherSchema = new Schema<IWeatherCache>(
  {
    cityId: {
      type: String,
      required: true,
      unique: true,
    },
    current: {
      temp: { type: Number, required: true },
      feelsLike: { type: Number, required: true },
      condition: { type: String, required: true },
      conditionLabel: { type: String, required: true },
      humidity: { type: Number, required: true },
      windSpeed: { type: Number, required: true },
      icon: { type: String, required: true },
    },
    fetchedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const WeatherCache = mongoose.model<IWeatherCache>('WeatherCache', weatherSchema);
