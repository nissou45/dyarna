import { describe, it, expect } from 'vitest';
import { DishService } from './dish.service';
import { DISHES } from '../data/dishes.data';

const service = new DishService();

describe('DishService', () => {

  // ── getAll ────────────────────────────────────────────────────────────────
  describe('getAll', () => {
    it('retourne au moins 10 plats', () => {
      expect(service.getAll().length).toBeGreaterThanOrEqual(10);
    });

    it('chaque plat a un id, un name, des ingredients et des steps', () => {
      for (const dish of service.getAll()) {
        expect(dish.id).toBeTruthy();
        expect(dish.name).toBeTruthy();
        expect(dish.ingredients.length).toBeGreaterThan(0);
        expect(dish.steps.length).toBeGreaterThan(0);
      }
    });
  });

  // ── getById ───────────────────────────────────────────────────────────────
  describe('getById', () => {
    it('trouve le Tajine par id', () => {
      const dish = service.getById('tajine-marrakchi');
      expect(dish?.name).toBe('Tajine Marrakchi');
    });

    it('retourne undefined pour un id inconnu', () => {
      expect(service.getById('pizza')).toBeUndefined();
    });
  });

  // ── getByTitle ────────────────────────────────────────────────────────────
  describe('getByTitle', () => {
    it('trouve un plat par titre exact', () => {
      expect(service.getByTitle('Couscous')?.id).toBe('couscous');
    });

    it('est insensible à la casse', () => {
      expect(service.getByTitle('couscous')?.id).toBe('couscous');
      expect(service.getByTitle('COUSCOUS')?.id).toBe('couscous');
    });

    it('trouve les 5 nouveaux plats par titre', () => {
      expect(service.getByTitle('Rfissa')?.id).toBe('rfissa');
      expect(service.getByTitle('Méchoui')?.id).toBe('mechoui');
      expect(service.getByTitle('Sardines grillées d\'Essaouira')?.id).toBe('sardines-essaouira');
      expect(service.getByTitle('Amlou')?.id).toBe('amlou');
      expect(service.getByTitle('Briouates')?.id).toBe('briouates');
    });

    it('retourne undefined pour un titre inconnu', () => {
      expect(service.getByTitle('Sushi')).toBeUndefined();
    });
  });

  // ── getByCityName ─────────────────────────────────────────────────────────
  describe('getByCityName', () => {
    it('Marrakech a au moins le Tajine', () => {
      const dishes = service.getByCityName('Marrakech');
      const ids = dishes.map(d => d.id);
      expect(ids).toContain('tajine-marrakchi');
    });

    it('Agadir a l\'Amlou', () => {
      const dishes = service.getByCityName('Agadir');
      expect(dishes.map(d => d.id)).toContain('amlou');
    });

    it('retourne un tableau vide pour une ville inconnue', () => {
      expect(service.getByCityName('Tokyo')).toEqual([]);
    });
  });

  // ── Intégrité des données ─────────────────────────────────────────────────
  describe('Intégrité des données DISHES', () => {
    it('chaque ingrédient a un id unique dans son plat', () => {
      for (const dish of service.getAll()) {
        const ids = dish.ingredients.map(i => i.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
      }
    });

    it('chaque étape a un id unique dans son plat', () => {
      for (const dish of service.getAll()) {
        const ids = dish.steps.map(s => s.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(ids.length);
      }
    });

    it('baseServings est un entier positif', () => {
      for (const dish of service.getAll()) {
        expect(dish.baseServings).toBeGreaterThan(0);
        expect(Number.isInteger(dish.baseServings)).toBe(true);
      }
    });
  });
});
