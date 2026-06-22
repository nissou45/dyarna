import mongoose from 'mongoose';
import { Itinerary, IItinerary, ItineraryDay } from './itinerary.model';
import { getCityById } from '../culture/cities.data';
import { getAllCityIds, distanceBetweenCities, estimateTravelTime } from './utils/geo.utils';
import { generatePdf, invalidatePdfCache } from './pdf/pdf.service';
import { PdfData } from './pdf/itinerary-pdf.template';
import { AppError } from '../../utils/AppError';
import crypto from 'crypto';

export class ItineraryService {
  async create(userId: string, title: string, days: { cityId: string; nightsCount: number; notes?: string }[]): Promise<IItinerary> {
    for (const d of days) {
      if (!getCityById(d.cityId)) {
        throw new AppError(`Ville inconnue : ${d.cityId}`, 400);
      }
    }

    const itineraryDays: ItineraryDay[] = days.map((d, i) => ({
      dayNumber: i + 1,
      cityId: d.cityId,
      nightsCount: d.nightsCount,
      notes: d.notes?.trim() || undefined,
    }));

    return Itinerary.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: title.trim(),
      days: itineraryDays,
    });
  }

  async getById(itineraryId: string, userId: string): Promise<IItinerary> {
    const itinerary = await Itinerary.findById(itineraryId).populate('userId', 'displayName');
    if (!itinerary) throw new AppError('Itinéraire introuvable.', 404);
    if (itinerary.userId._id.toString() !== userId) throw new AppError('Accès refusé.', 403);
    return itinerary;
  }

  async getByUser(userId: string): Promise<IItinerary[]> {
    return Itinerary.find({ userId }).sort({ updatedAt: -1 });
  }

  async update(
    itineraryId: string,
    userId: string,
    data: { title?: string; days?: { cityId: string; nightsCount: number; notes?: string }[] },
  ): Promise<IItinerary> {
    const itinerary = await this.getById(itineraryId, userId);

    if (data.title) itinerary.title = data.title.trim();

    if (data.days) {
      for (const d of data.days) {
        if (!getCityById(d.cityId)) {
          throw new AppError(`Ville inconnue : ${d.cityId}`, 400);
        }
      }

      itinerary.days = data.days.map((d, i) => ({
        dayNumber: i + 1,
        cityId: d.cityId,
        nightsCount: d.nightsCount,
        notes: d.notes?.trim() || undefined,
      }));
    }

    await itinerary.save();
    invalidatePdfCache(itineraryId);
    return itinerary;
  }

  async reorder(itineraryId: string, userId: string, dayIds: string[]): Promise<IItinerary> {
    const itinerary = await this.getById(itineraryId, userId);

    const dayMap = new Map(itinerary.days.map((d) => [d.cityId, d]));
    const reordered: ItineraryDay[] = [];

    for (const cityId of dayIds) {
      const existing = dayMap.get(cityId);
      if (!existing) throw new AppError(`Ville inconnue dans l'itinéraire : ${cityId}`, 400);
      reordered.push(existing);
    }

    itinerary.days = reordered.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    await itinerary.save();
    invalidatePdfCache(itineraryId);
    return itinerary;
  }

  async delete(itineraryId: string, userId: string): Promise<void> {
    const itinerary = await this.getById(itineraryId, userId);
    await Itinerary.deleteOne({ _id: itinerary._id });
    invalidatePdfCache(itineraryId);
  }

  async getSuggestions(itineraryId: string, userId: string, limit: number = 3): Promise<{ cityId: string; name: string; distanceKm: number }[]> {
    const itinerary = await this.getById(itineraryId, userId);

    const includedIds = new Set(itinerary.days.map((d) => d.cityId));
    const lastCityId = itinerary.days[itinerary.days.length - 1].cityId;

    const allIds = getAllCityIds().filter((id) => !includedIds.has(id));

    const scored = allIds
      .map((id) => {
        const dist = distanceBetweenCities(lastCityId, id);
        const city = getCityById(id);
        return { cityId: id, name: city?.name || id, distanceKm: dist ?? 9999 };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return scored.slice(0, limit);
  }

  getComputedData(days: ItineraryDay[]): {
    segments: { from: string; to: string; distanceKm: number; travelTime: { hours: number; minutes: number } }[];
    totalDistance: number;
    totalNights: number;
  } {
    let totalDistance = 0;
    const segments: {
      from: string;
      to: string;
      distanceKm: number;
      travelTime: { hours: number; minutes: number };
    }[] = [];

    for (let i = 0; i < days.length; i++) {
      if (i > 0) {
        const from = days[i - 1].cityId;
        const to = days[i].cityId;
        const dist = distanceBetweenCities(from, to) || 0;
        totalDistance += dist;
        segments.push({
          from,
          to,
          distanceKm: dist,
          travelTime: estimateTravelTime(dist),
        });
      }
    }

    const totalNights = days.reduce((sum, d) => sum + d.nightsCount, 0);

    return { segments, totalDistance, totalNights };
  }

  async share(itineraryId: string, userId: string): Promise<{ shareToken: string }> {
    const itinerary = await this.getById(itineraryId, userId);

    itinerary.shareToken = crypto.randomBytes(24).toString('hex');
    itinerary.isPublic = true;
    await itinerary.save();

    return { shareToken: itinerary.shareToken };
  }

  async unshare(itineraryId: string, userId: string): Promise<void> {
    const itinerary = await this.getById(itineraryId, userId);

    itinerary.isPublic = false;
    itinerary.shareToken = undefined;
    await itinerary.save();
  }

  async getByShareToken(shareToken: string): Promise<IItinerary> {
    const itinerary = await Itinerary.findOne({ shareToken, isPublic: true });
    if (!itinerary) throw new AppError('Itinéraire introuvable.', 404);
    return itinerary;
  }

  async exportPdf(itineraryId: string, userId: string): Promise<Buffer> {
    const itinerary = await this.getById(itineraryId, userId);
    const computed = this.getComputedData(itinerary.days);

    const pdfData: PdfData = {
      title: itinerary.title,
      totalNights: computed.totalNights,
      totalDistance: computed.totalDistance,
      generatedAt: new Date().toISOString().split('T')[0],
      days: itinerary.days.map((d, i) => {
        const city = getCityById(d.cityId);
        const seg = i > 0 ? computed.segments[i - 1] : undefined;
        return {
          dayNumber: d.dayNumber,
          cityName: city?.name || d.cityId,
          nightsCount: d.nightsCount,
          notes: d.notes,
          distanceFromPrevKm: seg?.distanceKm,
          travelTime: seg?.travelTime,
        };
      }),
    };

    return generatePdf(pdfData, itineraryId);
  }
}

export const itineraryService = new ItineraryService();
