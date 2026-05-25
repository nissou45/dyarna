import { Injectable, signal, inject } from '@angular/core';
import { FaceSnap, Comment } from '../models/snap.model';
import { SnapType } from '../models/snap-type-type';
import { UnsplashService } from './unsplash.service';

// ── Palette de couleurs pour les placeholders ──
const PALETTE = [
  { bg: '#c8613c', fg: '#fefcf8' },  // Terracotta
  { bg: '#d4a03c', fg: '#fefcf8' },  // Or
  { bg: '#236b8c', fg: '#fefcf8' },  // Zellige bleu
  { bg: '#4a7c59', fg: '#fefcf8' },  // Vert
  { bg: '#8a5a4a', fg: '#fefcf8' },  // Brun
  { bg: '#6a4a7a', fg: '#fefcf8' },  // Violet
  { bg: '#c85a3c', fg: '#fefcf8' },  // Rouge
  { bg: '#3a6a5a', fg: '#fefcf8' },  // Vert foncé
  { bg: '#7a6a3a', fg: '#fefcf8' },  // Olive
  { bg: '#4a5a7a', fg: '#fefcf8' },  // Bleu nuit
];

function placeholderUrl(title: string, index: number): string {
  const c = PALETTE[index % PALETTE.length];
  const text = encodeURIComponent(title);
  // Use a minimal SVG inline: colored rectangle with centered text
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="${c.bg}"/>
      <text x="400" y="300" font-family="Georgia,serif" font-size="42" fill="${c.fg}" text-anchor="middle" dominant-baseline="middle">${title}</text>
    </svg>`
  )}`;
}

// ── 25+ entrées marocaines ──
const INITIAL_FACE_SNAPS: FaceSnap[] = [
  // ── VILLES IMPÉRIALES ──
  new FaceSnap(
    'Marrakech',
    'La Ville Rouge, joyau du sud marocain. Sa médina classée à l\'UNESCO, la place Jemaa el-Fnaa qui s\'anime à la nuit tombée, ses palais cachés et ses jardins secrets. Entre traditions et modernité, Marrakech est le cœur battant du Maroc touristique.',
    placeholderUrl('Marrakech', 0),
    new Date('2024-01-15'), 2450,
  ),
  new FaceSnap(
    'Fès',
    'La capitale spirituelle du Maroc. Fès abrite la plus vieille université du monde (Al Quaraouiyine) et sa médina, la plus grande zone piétonne au monde. Perdez-vous dans les 9000 ruelles de Fès el-Bali, entre tanneries millénaires, souks et mosquées.',
    placeholderUrl('Fès', 1),
    new Date('2024-02-20'), 1890,
  ),
  new FaceSnap(
    'Meknès',
    'La ville aux 40 portes, surnommée le Versailles marocain. Fondée par Moulay Ismail, elle impressionne par ses remparts monumentaux, sa porte Bab Mansour et ses greniers royaux. Une ville impériale souvent méconnue mais fascinante.',
    placeholderUrl('Meknès', 2),
    new Date('2024-03-10'), 890,
  ),
  new FaceSnap(
    'Rabat',
    'La capitale moderne du Royaume. Rabat allie patrimoine historique (Tour Hassan, nécropole du Chellah) et vie moderne animée. Ses quartiers branchés de l\'Agdal et ses plages de l\'océan Atlantique en font une ville où il fait bon vivre.',
    placeholderUrl('Rabat', 3),
    new Date('2024-04-05'), 1200,
  ),

  // ── VILLES CÔTIÈRES ──
  new FaceSnap(
    'Essaouira',
    'L\'ancienne Mogador, cité des vents. Ses remparts portugais, sa médina bleue et blanche, son port de pêche animé et ses plages de surf en font la station balnéaire préférée des artistes et des amateurs de kitesurf.',
    placeholderUrl('Essaouira', 4),
    new Date('2024-05-12'), 1560,
  ),
  new FaceSnap(
    'Tanger',
    'La porte de l\'Afrique, où la Méditerranée rencontre l\'Atlantique. Tanger a inspiré des artistes du monde entier : Delacroix, Matisse, les Beatniks. Sa médina perchée, ses cafés aux terrasses légendaires et son coucher de soleil sur le détroit.',
    placeholderUrl('Tanger', 5),
    new Date('2024-06-18'), 1780,
  ),
  new FaceSnap(
    'Agadir',
    'La station balnéaire par excellence. Détruite par le séisme de 1960, Agadir renaît de ses cendres avec une magnifique baie en arc de cercle, des plages de sable fin et une promenade animée. Point de départ idéal pour explorer le sud marocain.',
    placeholderUrl('Agadir', 6),
    new Date('2024-07-22'), 1340,
  ),
  new FaceSnap(
    'Al Hoceïma',
    'La perle de la Méditerranée. Ses plages de sable blanc nichées entre falaises rouges, ses criques aux eaux cristallines et son parc national d\'Al Hoceïma en font un paradis pour les amoureux de nature et de plongée.',
    placeholderUrl('Al Hoceïma', 7),
    new Date('2024-08-14'), 670,
  ),

  // ── VILLES DU NORD ──
  new FaceSnap(
    'Chefchaouen',
    'La perle bleue du Rif. Chefchaouen est célèbre pour sa médina peinte en bleu, ses ruelles pittoresques et son atmosphère paisible. Nichée dans les montagnes du Rif, c\'est l\'un des endroits les plus photogéniques du Maroc.',
    placeholderUrl('Chefchaouen', 1),
    new Date('2024-09-01'), 2340,
  ),
  new FaceSnap(
    'Tétouan',
    'La colombe blanche. Sa médina blanche immaculée classée à l\'UNESCO, ses influences andalouses, son artisanat raffiné. Tétouan est un musée à ciel ouvert de l\'architecture hispano-mauresque.',
    placeholderUrl('Tétouan', 2),
    new Date('2024-09-15'), 780,
  ),
  new FaceSnap(
    'Oujda',
    'La porte de l\'orient. Ville à la frontière algérienne, Oujda est un carrefour culturel unique. Sa médina animée, son université et sa proximité avec les plages de Saïdia en font une étape authentique.',
    placeholderUrl('Oujda', 3),
    new Date('2024-10-01'), 560,
  ),

  // ── VILLES DU SUD ──
  new FaceSnap(
    'Ouarzazate',
    'La porte du désert. Ouarzazate est la capitale du cinéma marocain (Atlantis Studios). Ses kasbahs millénaires, dont la célèbre Kasbah Aït Ben Haddou classée à l\'UNESCO, ont servi de décor à Gladiator, Game of Thrones et Lawrence d\'Arabie.',
    placeholderUrl('Ouarzazate', 0),
    new Date('2024-10-20'), 1120,
  ),
  new FaceSnap(
    'Zagora',
    'La porte du grand sud. Au bout de la route, le désert du Sahara commence ici. Le célèbre panneau "Tombouctou 52 jours" marque le départ des caravanes. Ses couchers de soleil sur les dunes de Tinfou sont inoubliables.',
    placeholderUrl('Zagora', 1),
    new Date('2024-11-05'), 450,
  ),
  new FaceSnap(
    'Merzouga',
    'Les portes du Sahara. Merzouga est le point de départ pour explorer les majestueuses dunes de l\'Erg Chebbi. À dos de dromadaire ou en 4x4, vivez l\'expérience unique du désert marocain, ses nuits étoilées et ses levers de soleil féériques.',
    placeholderUrl('Merzouga', 2),
    new Date('2024-11-20'), 1890,
  ),

  // ── CUISINE MAROCAINE ──
  new FaceSnap(
    'Tajine Marrakchi',
    'Le plat emblématique du Maroc. Poulet au citron confit et olives vertes, tajine d\'agneau aux pruneaux et amandes, tajine de kefta aux œufs… Chaque région a sa recette. Cuit lentement dans un plat en terre cuite, il révèle des saveurs uniques.',
    placeholderUrl('Tajine', 3),
    new Date('2024-01-10'), 3200,
  ),
  new FaceSnap(
    'Couscous',
    'Le plat du vendredi, héritage berbère millénaire. Semoule fine cuite à la vapeur, accompagnée de légumes de saison, de viande (agneau, poulet) et de pois chiches. Le couscous royal, avec ses merguez et son poulet, est un festin à lui seul.',
    placeholderUrl('Couscous', 4),
    new Date('2024-02-15'), 2800,
  ),
  new FaceSnap(
    'Pastilla',
    'L\'art culinaire marocain dans toute sa splendeur. Tourte feuilletée sucrée-salée à base de pigeon (ou poulet), amandes grillées, cannelle et sucre glace. La pastilla aux fruits de mer est une variante tout aussi délicieuse des villes côtières.',
    placeholderUrl('Pastilla', 5),
    new Date('2024-03-20'), 2100,
  ),
  new FaceSnap(
    'Harira',
    'La soupe traditionnelle du ramadan. Tomates, lentilles, pois chiches, viande d\'agneau, coriandre et épices. Servie avec des dattes et du chebakia (pâtisserie au miel), c\'est le repas de rupture du jeûne par excellence.',
    placeholderUrl('Harira', 6),
    new Date('2024-04-25'), 1450,
  ),
  new FaceSnap(
    'Thé à la menthe',
    'Bien plus qu\'une boisson, un rituel d\'hospitalité. Thé vert Gunpowder, menthe fraîche et sucre, versé de haut pour créer une mousse légère. On dit qu\'au Maroc, le premier verre est doux comme la vie, le deuxième fort comme l\'amour, le troisième amer comme la mort.',
    placeholderUrl('Thé à la menthe', 7),
    new Date('2024-01-05'), 4500,
  ),

  // ── TRADITIONS ──
  new FaceSnap(
    'Moussem de Tan-Tan',
    'Le plus grand rassemblement nomade du Maroc. Chaque année, plus de 30 tribus du Sahara se réunissent pour célébrer leur culture : courses de dromadaires, musiques gnaoua, contes et artisanat. Classé patrimoine immatériel de l\'UNESCO.',
    placeholderUrl('Moussem de Tan-Tan', 8),
    new Date('2024-06-15'), 890,
  ),
  new FaceSnap(
    'Hammam Marocain',
    'Un rituel de purification ancestral. Le hammam, c\'est l\'art de prendre soin de son corps : vapeur chaude, gommage au savon noir et à l\'huile d\'argan, massage. Un moment de détente et de convivialité qui rythme la vie des Marocains.',
    placeholderUrl('Hammam', 9),
    new Date('2024-07-30'), 2340,
  ),
  new FaceSnap(
    'Artisanat du Zellige',
    'L\'art de la mosaïque marocaine. Les maâlems (maîtres artisans) découpent à la main des carreaux de terre cuite émaillée pour créer des motifs géométriques complexes. Une tradition vieille de 10 siècles qui orne les plus beaux palais et mosquées.',
    placeholderUrl('Zellige', 0),
    new Date('2024-08-20'), 1670,
  ),
  new FaceSnap(
    'Fantasia',
    'La charge des cavaliers berbères. Lors des fêtes traditionnelles (moussems), des cavaliers en tenue blanche chargent au galop en tirant au mousquet simultanément. Un spectacle impressionnant qui perpétue l\'art équestre ancestral du Maroc.',
    placeholderUrl('Fantasia', 1),
    new Date('2024-09-10'), 780,
  ),
];

const PHOTOS_CACHE_KEY = 'marocguide_photos_cache';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 semaine

interface PhotoCache {
  timestamp: number;
  urls: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  private faceSnaps = signal<FaceSnap[]>(INITIAL_FACE_SNAPS);
  private unsplash = inject(UnsplashService);
  private photosLoaded = false;

  private readonly LOCATIONS: Record<string, string> = {
    'Marrakech': 'Marrakech-Safi',
    'Fès': 'Fès-Meknès',
    'Meknès': 'Fès-Meknès',
    'Rabat': 'Rabat-Salé-Kénitra',
    'Essaouira': 'Marrakech-Safi',
    'Tanger': 'Tanger-Tétouan-Al Hoceïma',
    'Agadir': 'Souss-Massa',
    'Al Hoceïma': 'Tanger-Tétouan-Al Hoceïma',
    'Chefchaouen': 'Tanger-Tétouan-Al Hoceïma',
    'Tétouan': 'Tanger-Tétouan-Al Hoceïma',
    'Oujda': 'Oriental',
    'Ouarzazate': 'Drâa-Tafilalet',
    'Zagora': 'Drâa-Tafilalet',
    'Merzouga': 'Drâa-Tafilalet',
  };

  private readonly CATEGORIES: Record<string, string[]> = {
    villes: ['Marrakech', 'Fès', 'Meknès', 'Rabat', 'Essaouira', 'Tanger', 'Agadir', 'Al Hoceïma', 'Chefchaouen', 'Tétouan', 'Oujda', 'Ouarzazate', 'Zagora', 'Merzouga'],
    cuisine: ['Tajine Marrakchi', 'Couscous', 'Pastilla', 'Harira', 'Thé à la menthe'],
    traditions: ['Moussem de Tan-Tan', 'Hammam Marocain', 'Artisanat du Zellige', 'Fantasia'],
  };

  readonly searchQueries: Record<string, string> = {
    'Marrakech': 'Marrakech Maroc medina',
    'Fès': 'Fès Maroc medina tanneries',
    'Meknès': 'Meknès Maroc Bab Mansour',
    'Rabat': 'Rabat Maroc Tour Hassan',
    'Essaouira': 'Essaouira Maroc port',
    'Tanger': 'Tanger Maroc ville',
    'Agadir': 'Agadir Maroc plage',
    'Al Hoceïma': 'Al Hoceima Maroc plage',
    'Chefchaouen': 'Chefchaouen Maroc ville bleue',
    'Tétouan': 'Tétouan Maroc medina',
    'Oujda': 'Oujda Maroc ville',
    'Ouarzazate': 'Ouarzazate Maroc kasbah',
    'Zagora': 'Zagora Maroc desert',
    'Merzouga': 'Merzouga Maroc dunes Erg Chebbi',
    'Tajine Marrakchi': 'tajine marocain cuisine',
    'Couscous': 'couscous marocain plat',
    'Pastilla': 'pastilla marocaine cuisine',
    'Harira': 'harira marocaine soupe',
    'Thé à la menthe': 'the a la menthe marocain',
    'Moussem de Tan-Tan': 'moussem Tan-Tan Maroc',
    'Hammam Marocain': 'hammam marocain tradition',
    'Artisanat du Zellige': 'zellige marocain mosaique artisanat',
    'Fantasia': 'fantasia Maroc cavaliers',
  };

  constructor() {
    this.faceSnaps.update(snaps => {
      snaps.forEach(snap => {
        const location = this.LOCATIONS[snap.title];
        if (location) snap.setLocation(location);

        if (this.CATEGORIES['villes'].includes(snap.title)) {
          snap.tags = ['ville', ...this.getVilleTags(snap.title)];
        } else if (this.CATEGORIES['cuisine'].includes(snap.title)) {
          snap.tags = ['cuisine', 'gastronomie'];
        } else if (this.CATEGORIES['traditions'].includes(snap.title)) {
          snap.tags = ['tradition', 'culture'];
        }
      });
      return [...snaps];
    });

    // Lancer la récupération des vraies photos en arrière-plan
    this.loadRealPhotos();
  }

  // ── Photo initialization ──

  private async loadRealPhotos(): Promise<void> {
    if (this.photosLoaded) return;

    // 1. Try loading from cache
    const cached = this.loadPhotoCache();
    if (cached) {
      this.applyPhotos(cached);
      this.photosLoaded = true;
      return;
    }

    // 2. Fetch from Unsplash in batches
    const snapList = this.faceSnaps();
    const urls: Record<string, string> = {};
    const entries = snapList.filter(s => this.searchQueries[s.title]);

    // Process in batches of 3 with 600ms delay between batches
    const BATCH_SIZE = 3;
    const DELAY_MS = 600;

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map(snap => this.unsplash.getPhotoUrl(this.searchQueries[snap.title] ?? snap.title))
      );

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value) {
          urls[batch[idx].title] = result.value;
        }
      });

      // Apply partial results immediately so the UI updates gradually
      if (Object.keys(urls).length > 0) {
        this.applyPhotos({ ...urls });
      }

      // Delay between batches to respect rate limits
      if (i + BATCH_SIZE < entries.length) {
        await new Promise(r => setTimeout(r, DELAY_MS));
      }
    }

    // 3. Save to cache
    if (Object.keys(urls).length > 0) {
      this.savePhotoCache(urls);
    }

    this.photosLoaded = true;
  }

  private applyPhotos(urls: Record<string, string>): void {
    this.faceSnaps.update(snaps => {
      snaps.forEach(snap => {
        if (urls[snap.title]) {
          snap.imageUrl = urls[snap.title]!;
        }
      });
      return [...snaps];
    });
  }

  private loadPhotoCache(): Record<string, string> | null {
    try {
      const raw = localStorage.getItem(PHOTOS_CACHE_KEY);
      if (!raw) return null;
      const cache: PhotoCache = JSON.parse(raw);
      if (Date.now() - cache.timestamp > CACHE_TTL_MS) {
        localStorage.removeItem(PHOTOS_CACHE_KEY);
        return null;
      }
      return cache.urls;
    } catch {
      return null;
    }
  }

  private savePhotoCache(urls: Record<string, string>): void {
    try {
      const cache: PhotoCache = { timestamp: Date.now(), urls };
      localStorage.setItem(PHOTOS_CACHE_KEY, JSON.stringify(cache));
    } catch {
      // localStorage might be full
    }
  }

  // ── Getters & Mutators ──

  getFaceSnaps() {
    return this.faceSnaps.asReadonly();
  }

  getFaceSnapById(faceSnapId: string): FaceSnap {
    const foundFaceSnap = this.faceSnaps().find((faceSnap) => faceSnap.id === faceSnapId);
    if (!foundFaceSnap) {
      throw new Error('FaceSnap not found!');
    }
    return foundFaceSnap;
  }

  snapFaceSnapById(faceSnapId: string, snapType: SnapType): void {
    this.faceSnaps.update(snaps => {
      const faceSnap = snaps.find(s => s.id === faceSnapId);
      if (faceSnap) faceSnap.snap(snapType);
      return [...snaps];
    });
  }

  addFaceSnap(faceSnap: FaceSnap): void {
    this.faceSnaps.update(snaps => [faceSnap, ...snaps]);
  }

  likeFaceSnap(faceSnapId: string): void {
    this.faceSnaps.update(snaps => {
      const snap = snaps.find(s => s.id === faceSnapId);
      if (snap) snap.toggleLike();
      return [...snaps];
    });
  }

  addCommentToSnap(faceSnapId: string, comment: Comment): void {
    this.faceSnaps.update(snaps => {
      const snap = snaps.find(s => s.id === faceSnapId);
      if (snap) snap.addComment(comment);
      return [...snaps];
    });
  }

  private getVilleTags(title: string): string[] {
    const tags: Record<string, string[]> = {
      Marrakech: ['medina', 'souk', 'patrimoine'],
      Fès: ['medina', 'artisanat', 'patrimoine'],
      Meknès: ['histoire', 'architecture'],
      Rabat: ['moderne', 'histoire'],
      Essaouira: ['mer', 'plage', 'artisanat'],
      Tanger: ['mer', 'culture', 'moderne'],
      Agadir: ['mer', 'plage', 'nature'],
      'Al Hoceïma': ['mer', 'plage', 'nature'],
      Chefchaouen: ['montagne', 'nature'],
      Tétouan: ['medina', 'architecture'],
      Oujda: ['culture', 'histoire'],
      Ouarzazate: ['desert', 'patrimoine'],
      Zagora: ['desert', 'nature'],
      Merzouga: ['desert', 'nature'],
    };
    return tags[title] || ['patrimoine'];
  }
}
