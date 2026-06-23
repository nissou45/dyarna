import { Injectable } from '@angular/core';
import { type Dish } from '../models/dish.model';
import { DISHES, DISH_IDS } from '../data/dishes.data';

@Injectable({ providedIn: 'root' })
export class DishService {
  getAll(): Dish[] {
    return DISH_IDS.map(id => DISHES[id]);
  }

  getById(id: string): Dish | undefined {
    return DISHES[id];
  }

  getByTitle(title: string): Dish | undefined {
    return Object.values(DISHES).find(
      d => d.name.toLowerCase() === title.toLowerCase(),
    );
  }

  getByCityName(cityName: string): Dish[] {
    return DISH_IDS
      .map(id => DISHES[id])
      .filter(d => d.relatedCityNames.includes(cityName));
  }
}
