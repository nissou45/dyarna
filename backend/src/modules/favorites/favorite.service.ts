import { Favorite, IFavorite } from './favorite.model';
import { AppError } from '../../utils/AppError';

export class FavoriteService {
  async getFavorites(userId: string): Promise<IFavorite[]> {
    return Favorite.find({ userId }).sort({ createdAt: -1 });
  }

  async addFavorite(userId: string, cityId: string): Promise<IFavorite> {
    const existing = await Favorite.findOne({ userId, cityId });
    if (existing) {
      return existing;
    }
    return Favorite.create({ userId, cityId });
  }

  async removeFavorite(userId: string, cityId: string): Promise<void> {
    const result = await Favorite.findOneAndDelete({ userId, cityId });
    if (!result) {
      throw new AppError('Favori introuvable.', 404);
    }
  }
}

export const favoriteService = new FavoriteService();
