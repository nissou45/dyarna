import { Injectable, signal } from '@angular/core';
import { FaceSnap, Comment } from '../models/snap.model';
import { SnapType } from '../models/snap-type-type';
import {
  INITIAL_FACE_SNAPS,
  SNAP_LOCATIONS,
  SNAP_CATEGORIES,
  SNAP_RELATED,
  VILLE_TAGS,
} from '../data/face-snaps.data';

@Injectable({
  providedIn: 'root',
})
export class FaceSnapsService {
  private faceSnaps = signal<FaceSnap[]>(INITIAL_FACE_SNAPS);

  constructor() {
    this.faceSnaps.update(snaps => {
      snaps.forEach(snap => {
        const location = SNAP_LOCATIONS[snap.title];
        if (location) snap.setLocation(location);

        if (SNAP_CATEGORIES['villes'].includes(snap.title)) {
          snap.tags = ['ville', ...(VILLE_TAGS[snap.title] ?? ['patrimoine'])];
        } else if (SNAP_CATEGORIES['cuisine'].includes(snap.title)) {
          snap.tags = ['cuisine', 'gastronomie'];
        } else if (SNAP_CATEGORIES['traditions'].includes(snap.title)) {
          snap.tags = ['tradition', 'culture'];
        }
      });
      return [...snaps];
    });
  }

  // ── Lecture ───────────────────────────────────────────────────────────────

  getFaceSnaps() {
    return this.faceSnaps.asReadonly();
  }

  getFaceSnapById(id: string): FaceSnap {
    const snap = this.faceSnaps().find(s => s.id === id);
    if (!snap) throw new Error('FaceSnap not found!');
    return snap;
  }

  getSnapByTitle(title: string): FaceSnap | undefined {
    return this.faceSnaps().find(s => s.title === title);
  }

  getRelatedSnaps(id: string): { cuisine: FaceSnap[]; traditions: FaceSnap[]; activities: FaceSnap[] } {
    const snap = this.getFaceSnapById(id);
    const relations = SNAP_RELATED[snap.title];
    if (!relations) return { cuisine: [], traditions: [], activities: [] };

    const all = this.faceSnaps();
    const find = (titles: string[]) =>
      titles.map(t => all.find(s => s.title === t)).filter(Boolean) as FaceSnap[];

    return {
      cuisine:    find(relations.cuisine),
      traditions: find(relations.traditions),
      activities: find(relations.activities),
    };
  }

  // ── Mutations ─────────────────────────────────────────────────────────────

  snapFaceSnapById(id: string, snapType: SnapType): void {
    this.faceSnaps.update(snaps => {
      snaps.find(s => s.id === id)?.snap(snapType);
      return [...snaps];
    });
  }

  likeFaceSnap(id: string): void {
    this.faceSnaps.update(snaps => {
      snaps.find(s => s.id === id)?.toggleLike();
      return [...snaps];
    });
  }

  addFaceSnap(snap: FaceSnap): void {
    this.faceSnaps.update(snaps => [snap, ...snaps]);
  }

  addCommentToSnap(id: string, comment: Comment): void {
    this.faceSnaps.update(snaps => {
      snaps.find(s => s.id === id)?.addComment(comment);
      return [...snaps];
    });
  }
}
