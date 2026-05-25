import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models/snap.model';
import { FACE_SNAPS_UI } from '@core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './comments-section.html',
  styleUrl: './comments-section.scss',
})
export class CommentsSectionComponent implements OnInit {
  @Input() comments: Comment[] = [];
  @Input() snapId!: string;
  @Output() commentAdded = new EventEmitter<Comment>();

  readonly ui = FACE_SNAPS_UI;
  private auth = inject(AuthService);

  newCommentText: string = '';

  ngOnInit(): void {
    this.loadCommentsFromStorage();
  }

  private loadCommentsFromStorage(): void {
    const key = `dyarna-comments-${this.snapId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed: Comment[] = JSON.parse(stored, (k, v) =>
          k === 'date' ? new Date(v) : v
        );
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.comments = [...parsed, ...this.comments];
        }
      } catch { /* ignore */ }
    }
  }

  private saveCommentsToStorage(): void {
    const key = `dyarna-comments-${this.snapId}`;
    localStorage.setItem(key, JSON.stringify(this.comments));
  }

  addComment(): void {
    const text = this.newCommentText.trim();
    if (!text) return;

    const comment: Comment = {
      author: this.auth.currentPseudo(), // ← dynamique : utilisateur connecté
      text,
      date: new Date(),
    };
    this.comments.push(comment);
    this.saveCommentsToStorage();
    this.commentAdded.emit(comment);
    this.newCommentText = '';
  }
}
