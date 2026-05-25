import { Injectable, signal } from '@angular/core';
import { FaceSnap, Comment } from '../models/snap.model';
import { SnapType } from '../models/snap-type-type';

const INITIAL_FACE_SNAPS: FaceSnap[] = [
  new FaceSnap(
    'Salon Bohème',
    'Un coin lecture chaleureux avec des plantes, des coussins en velours et une lumière tamisée.',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    new Date(),
    10,
  ),
  new FaceSnap(
    'Coin Plantes',
    "Une jungle urbaine apaisante pour purifier l'air et égayer votre intérieur.",
    'https://images.unsplash.com/photo-1545239351-cefa43af60f3?w=800',
    new Date(),
    45,
  ),
  new FaceSnap(
    'Chambre Cocooning',
    'Une chambre douce et apaisante avec des tons neutres et une literie moelleuse.',
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    new Date(),
    78,
  ),
  new FaceSnap(
    'Bureau Minimaliste',
    'Un espace de travail épuré avec une belle lumière naturelle.',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800',
    new Date(),
    156,
  ),
  new FaceSnap(
    'Cuisine Scandinave',
    'Une cuisine claire et fonctionnelle avec des touches de bois naturel.',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    new Date(),
    92,
  ),
  new FaceSnap(
    'Salle de Bain Zen',
    'Un espace de détente épuré avec des matériaux naturels et une ambiance spa.',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
    new Date(),
    34,
  ),
];

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  private faceSnaps = signal<FaceSnap[]>(INITIAL_FACE_SNAPS);

  constructor() {
    this.faceSnaps.update(snaps => {
      snaps[0].setLocation('Paris');
      snaps[1].setLocation('Lyon');
      snaps[2].setLocation('Bordeaux');
      snaps[4].setLocation('Copenhagen');
      return [...snaps];
    });
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
