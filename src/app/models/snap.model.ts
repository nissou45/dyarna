import { SnapType } from './snap-type-type';

export interface Comment {
  author: string;
  text: string;
  date: Date;
}

export class FaceSnap {
  location?: string;
  id: string;
  likes: number = 0;
  tags: string[] = [];
  comments: Comment[] = [];

  constructor(
    public title: string,
    public description: string,
    public imageUrl: string,
    public createAt: Date,
    public snaps: number,
  ) {
    this.id = crypto.randomUUID().substring(0, 8);
  }

  addSnap(): void {
    this.snaps++;
  }

  snap(snapType: SnapType) {
    if (snapType === 'snap') {
      this.addSnap();
    } else {
      this.removeSnap();
    }
  }

  removeSnap(): void {
    this.snaps--;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  toggleLike(): void {
    this.likes++;
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }
}
