export interface DishIngredient {
  id: string;
  name: string;
  amount: number;
  unit?: 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | 'pinch';
}

export interface DishStep {
  id: string;
  title: string;
  content: string;
  timerSeconds?: number;
}

export interface Dish {
  id: string;
  name: string;
  region?: string;
  relatedCityNames: string[];
  description: string;
  baseServings: number;
  ingredients: DishIngredient[];
  steps: DishStep[];
  notes?: string;
  imageUrl: string;
  tags: string[];
}
