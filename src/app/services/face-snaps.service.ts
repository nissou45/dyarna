import { Injectable, signal } from '@angular/core';
import { FaceSnap, Comment } from '../models/snap.model';
import { SnapType } from '../models/snap-type-type';

const INITIAL_FACE_SNAPS: FaceSnap[] = [
  // === VILLES IMPÉRIALES ===
  new FaceSnap(
    'Marrakech',
    'La Ville Rouge, joyau du sud marocain. Sa médina classée à l\'UNESCO, la place Jemaa el-Fnaa qui s\'anime à la nuit tombée, ses palais cachés et ses jardins secrets. Entre traditions et modernité, Marrakech est le cœur battant du Maroc touristique.',
    'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
    new Date('2024-01-15'),
    2450,
  ),
  new FaceSnap(
    'Fès',
    'La capitale spirituelle du Maroc. Fès abrite la plus vieille université du monde (Al Quaraouiyine) et sa médina, la plus grande zone piétonne au monde. Perdez-vous dans les 9000 ruelles de Fès el-Bali, entre tanneries, souks et mosquées millénaires.',
    'https://images.unsplash.com/photo-1607116195736-432b46c7a0cd?w=800',
    new Date('2024-02-20'),
    1890,
  ),
  new FaceSnap(
    'Meknès',
    'La ville aux 40 portes, surnommée le Versailles marocain. Fondée par Moulay Ismail, elle impressionne par ses remparts monumentaux, sa porte Bab Mansour et ses greniers royaux. Une ville impériale souvent méconnue mais fascinante.',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    new Date('2024-03-10'),
    890,
  ),
  new FaceSnap(
    'Rabat',
    'La capitale moderne du Royaume. Rabat allie patrimoine historique (Tour Hassan, nécropole du Chellah) et vie moderne animée. Ses quartiers branchés de l\'Agdal et ses plages de l\'océan Atlantique en font une ville où il fait bon vivre.',
    'https://images.unsplash.com/photo-1559235039-2a0e9e7681e0?w=800',
    new Date('2024-04-05'),
    1200,
  ),

  // === VILLES CÔTIÈRES ===
  new FaceSnap(
    'Essaouira',
    'L\'ancienne Mogador, cité des vents. Ses remparts portugais, sa médina bleue et blanche, son port de pêche animé et ses plages de surf en font la station balnéaire préférée des artistes et des amateurs de kitesurf.',
    'https://images.unsplash.com/photo-1590114538152-0b9f2b0f3b8a?w=800',
    new Date('2024-05-12'),
    1560,
  ),
  new FaceSnap(
    'Tanger',
    'La porte de l\'Afrique, où la Méditerranée rencontre l\'Atlantique. Tanger a inspiré des artistes du monde entier : Delacroix, Matisse, les Beatniks. Sa médina perchée, ses cafés aux terrasses légendaires et son coucher de soleil sur le détroit.',
    'https://images.unsplash.com/photo-1590075894682-0b8b7f33a81c?w=800',
    new Date('2024-06-18'),
    1780,
  ),
  new FaceSnap(
    'Agadir',
    'La station balnéaire par excellence. Détruite par le séisme de 1960, Agadir renaît de ses cendres avec une magnifique baie en arc de cercle, des plages de sable fin et une promenade animée. Point de départ idéal pour explorer le sud marocain.',
    'https://images.unsplash.com/photo-1590075894682-0b8b7f33a81c?w=800',
    new Date('2024-07-22'),
    1340,
  ),
  new FaceSnap(
    'Al Hoceïma',
    'La perle de la Méditerranée. Ses plages de sable blanc nichées entre falaises rouges, ses criques aux eaux cristallines et son parc national d\'Al Hoceïma en font un paradis pour les amoureux de nature et de plongée.',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    new Date('2024-08-14'),
    670,
  ),

  // === VILLES DU NORD ===
  new FaceSnap(
    'Chefchaouen',
    'La perle bleue du Rif. Chefchaouen est célèbre pour sa médina peinte en bleu, ses ruelles pittoresques et son atmosphère paisible. Nichée dans les montagnes du Rif, c\'est l\'un des endroits les plus photogéniques du Maroc.',
    'https://images.unsplash.com/photo-1583425098039-1800e2e7f3ac?w=800',
    new Date('2024-09-01'),
    2340,
  ),
  new FaceSnap(
    'Tétouan',
    'La colombe blanche. Sa médina blanche immaculée classée à l\'UNESCO, ses influences andalouses, son artisanat raffiné. Tétouan est un musée à ciel ouvert de l\'architecture hispano-mauresque.',
    'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800',
    new Date('2024-09-15'),
    780,
  ),
  new FaceSnap(
    'Oujda',
    'La porte de l\'orient. Ville à la frontière algérienne, Oujda est un carrefour culturel unique. Sa médina animée, son université et sa proximité avec les plages de Saïdia en font une étape authentique.',
    'https://images.unsplash.com/photo-1559235039-2a0e9e7681e0?w=800',
    new Date('2024-10-01'),
    560,
  ),

  // === VILLES DU SUD ===
  new FaceSnap(
    'Ouarzazate',
    'La porte du désert. Ouarzazate est la capitale du cinéma marocain (Atlantis Studios). Ses kasbahs millénaires, dont la célèbre Kasbah Aït Ben Haddou classée à l\'UNESCO, ont servi de décor à Gladiator, Game of Thrones et Lawrence d\'Arabie.',
    'https://images.unsplash.com/photo-1590114538152-0b9f2b0f3b8a?w=800',
    new Date('2024-10-20'),
    1120,
  ),
  new FaceSnap(
    'Zagora',
    'La porte du grand sud. Au bout de la route, le désert du Sahara commence ici. La célèbre panneau "Tombouctou 52 jours" marque le départ des caravanes. Ses couchers de soleil sur les dunes de Tinfou sont inoubliables.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    new Date('2024-11-05'),
    450,
  ),
  new FaceSnap(
    'Merzouga',
    'Les portes du Sahara. Merzouga est le point de départ pour explorer les majestueuses dunes de l\'Erg Chebbi. À dos de dromadaire ou en 4x4, vivez l\'expérience unique du désert marocain, ses nuits étoilées et ses levers de soleil féériques.',
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800',
    new Date('2024-11-20'),
    1890,
  ),

  // === CUISINE MAROCAINE ===
  new FaceSnap(
    'Tajine Marrakchi',
    'Le plat emblématique du Maroc. Poulet au citron confit et olives vertes, tajine d\'agneau aux pruneaux et amandes, tajine de kefta aux œufs… Chaque région a sa recette. Cuit lentement dans un plat en terre cuite, il révèle des saveurs uniques.',
    'https://images.unsplash.com/photo-1569699000751-0db8129f9c34?w=800',
    new Date('2024-01-10'),
    3200,
  ),
  new FaceSnap(
    'Couscous',
    'Le plat du vendredi, héritage berbère millénaire. Semoule fine cuite à la vapeur, accompagnée de légumes de saison, de viande (agneau, poulet) et de pois chiches. Le couscous royal, avec ses merguez et son poulet, est un festin à lui seul.',
    'https://images.unsplash.com/photo-1586704237403-82ce1121b6c5?w=800',
    new Date('2024-02-15'),
    2800,
  ),
  new FaceSnap(
    'Pastilla',
    'L\'art culinaire marocain dans toute sa splendeur. Tourte feuilletée sucrée-salée à base de pigeon (ou poulet), amandes grillées, cannelle et sucre glace. La pastilla aux fruits de mer est une variante tout aussi délicieuse des villes côtières.',
    'https://images.unsplash.com/photo-1569699000751-0db8129f9c34?w=800',
    new Date('2024-03-20'),
    2100,
  ),
  new FaceSnap(
    'Harira',
    'La soupe traditionnelle du ramadan. Tomates, lentilles, pois chiches, viande d\'agneau, coriandre et épices. Servie avec des dattes et du chebakia (pâtisserie au miel), c\'est le repas de rupture du jeûne par excellence.',
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
    new Date('2024-04-25'),
    1450,
  ),
  new FaceSnap(
    'Thé à la menthe',
    'Bien plus qu\'une boisson, un rituel d\'hospitalité. Thé vert Gunpowder, menthe fraîche et sucre, versé de haut pour créer une mousse légère. On dit qu\'au Maroc, le premier verre est doux comme la vie, le deuxième fort comme l\'amour, le troisième amer comme la mort.',
    'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800',
    new Date('2024-01-05'),
    4500,
  ),

  // === TRADITIONS ===
  new FaceSnap(
    'Moussem de Tan-Tan',
    'Le plus grand rassemblement nomade du Maroc. Chaque année, plus de 30 tribus du Sahara se réunissent pour célébrer leur culture : courses de dromadaires, musiques gnaoua, contes et artisanat. Classé patrimoine immatériel de l\'UNESCO.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    new Date('2024-06-15'),
    890,
  ),
  new FaceSnap(
    'Hammam Marocain',
    'Un rituel de purification ancestral. Le hammam, c\'est l\'art de prendre soin de son corps : vapeur chaude, gommage au savon noir et à l\'huile d\'argan, massage. Un moment de détente et de convivialité qui rythme la vie des Marocains.',
    'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800',
    new Date('2024-07-30'),
    2340,
  ),
  new FaceSnap(
    'Artisanat du Zellige',
    'L\'art de la mosaïque marocaine. Les maâlems (maîtres artisans) découpent à la main des carreaux de terre cuite émaillée pour créer des motifs géométriques complexes. Une tradition vieille de 10 siècles qui orne les plus beaux palais et mosquées.',
    'https://images.unsplash.com/photo-1559235039-2a0e9e7681e0?w=800',
    new Date('2024-08-20'),
    1670,
  ),
  new FaceSnap(
    'Fantasia',
    'La charge des cavaliers berbères. Lors des fêtes traditionnelles (moussems), des cavaliers en tenue blanche chargent au galop en tirant au mousquet simultanément. Un spectacle impressionnant qui perpétue l\'art équestre ancestral du Maroc.',
    'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    new Date('2024-09-10'),
    780,
  ),
];

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  private faceSnaps = signal<FaceSnap[]>(INITIAL_FACE_SNAPS);

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

  constructor() {
    this.faceSnaps.update(snaps => {
      snaps.forEach(snap => {
        const location = this.LOCATIONS[snap.title];
        if (location) snap.setLocation(location);

        // Assigner les tags selon la catégorie
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
      if (faceSnap) {
        faceSnap.snap(snapType);
      }
      return [...snaps];
    });
  }

  addFaceSnap(faceSnap: FaceSnap): void {
    this.faceSnaps.update(snaps => [faceSnap, ...snaps]);
  }

  likeFaceSnap(faceSnapId: string): void {
    this.faceSnaps.update(snaps => {
      const snap = snaps.find(s => s.id === faceSnapId);
      if (snap) {
        snap.toggleLike();
      }
      return [...snaps];
    });
  }

  addCommentToSnap(faceSnapId: string, comment: Comment): void {
    this.faceSnaps.update(snaps => {
      const snap = snaps.find(s => s.id === faceSnapId);
      if (snap) {
        snap.addComment(comment);
      }
      return [...snaps];
    });
  }
}
