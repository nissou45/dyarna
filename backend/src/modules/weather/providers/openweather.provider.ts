export interface RawWeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  conditionLabel: string;
  icon: string;
}

const CONDITION_LABELS: Record<string, string> = {
  'clear': 'Ciel dégagé',
  'clouds': 'Nuageux',
  'few clouds': 'Peu nuageux',
  'scattered clouds': 'Nuages épars',
  'broken clouds': 'Ciel voilé',
  'overcast': 'Couvert',
  'rain': 'Pluie',
  'light rain': 'Pluie légère',
  'moderate rain': 'Pluie modérée',
  'heavy rain': 'Forte pluie',
  'drizzle': 'Bruine',
  'thunderstorm': 'Orage',
  'snow': 'Neige',
  'mist': 'Brume',
  'fog': 'Brouillard',
  'haze': 'Brume sèche',
};

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWithTimeout(url: string, timeoutMs: number = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Dyarna/1.0' },
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function mapCondition(description: string, main: string): { condition: string; conditionLabel: string } {
  const key = description.toLowerCase();
  for (const [pattern, label] of Object.entries(CONDITION_LABELS)) {
    if (key.includes(pattern)) {
      return { condition: main.toLowerCase(), conditionLabel: label };
    }
  }
  return { condition: main.toLowerCase(), conditionLabel: description };
}

export async function fetchCurrentWeather(lat: number, lng: number, apiKey: string): Promise<RawWeatherData> {
  const url = `${BASE_URL}?lat=${lat}&lon=${lng}&units=metric&lang=fr&appid=${apiKey}`;

  const response = await fetchWithTimeout(url);

  if (response.status === 401) {
    throw new Error('Clé API OpenWeather invalide.');
  }
  if (response.status === 429) {
    throw new Error('Quota API OpenWeather dépassé. Réessayez plus tard.');
  }
  if (!response.ok) {
    throw new Error(`API OpenWeather a répondu ${response.status}.`);
  }

  const data = await response.json() as {
    main: { temp: number; feels_like: number; humidity: number };
    wind: { speed: number };
    weather: { main: string; description: string; icon: string }[];
  };

  const weather = data.weather?.[0] || { main: 'Unknown', description: '', icon: '01d' };
  const { condition, conditionLabel } = mapCondition(weather.description, weather.main);

  return {
    temp: Math.round(data.main.temp * 10) / 10,
    feelsLike: Math.round(data.main.feels_like * 10) / 10,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6 * 10) / 10,
    condition,
    conditionLabel,
    icon: weather.icon,
  };
}
