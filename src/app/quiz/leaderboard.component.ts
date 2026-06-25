import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { AuthService } from '../services/auth.service';
import { LeaderboardEntry, UserRank } from '../core/types';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="lb">
      <h2 class="lb__title">Classement</h2>

      @if (loading()) {
        <p class="lb__loading">Chargement…</p>
      } @else {
        <div class="lb__list">
          @for (entry of leaderboard(); track entry.userId) {
            <div class="lb__entry" [class.lb__entry--me]="entry.userId === auth.user()?._id">
              <span class="lb__rank">#{{ entry.rank }}</span>
              <span class="lb__name">{{ entry.displayName }}</span>
              <span class="lb__score">{{ entry.bestScore }} pts</span>
              <span class="lb__games">{{ entry.gamesPlayed }} partie{{ entry.gamesPlayed > 1 ? 's' : '' }}</span>
            </div>
          }
        </div>

        @if (leaderboard().length === 0) {
          <p class="lb__empty">Aucun score pour le moment. Sois le premier à jouer !</p>
        }

        @if (auth.user() && userRank(); as ur) {
          @if (ur.rank > leaderboard().length) {
            <div class="lb__my-rank">
              <span class="lb__rank">#{{ ur.rank }}</span>
              <span class="lb__name">{{ auth.user()?.displayName || 'Moi' }}</span>
              <span class="lb__score">{{ ur.score }} pts</span>
              <span class="lb__total">sur {{ ur.totalPlayers }} joueur{{ ur.totalPlayers > 1 ? 's' : '' }}</span>
            </div>
          }
        }

        <div class="lb__actions">
          <a routerLink="/quiz" class="sn-btn accent">Jouer</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .lb { max-width: 560px; margin: 24px auto; padding: 0 16px; }
    .lb__title { font-size: 24px; color: var(--sn-ink-2); margin: 0 0 16px; }
    .lb__loading { color: var(--sn-muted); text-align: center; margin-top: 32px; }
    .lb__list { display: flex; flex-direction: column; gap: 6px; }
    .lb__entry, .lb__my-rank {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 14px; background: var(--sn-surface); border: 1px solid var(--sn-line); border-radius: 10px;
    }
    .lb__entry--me { border-color: var(--sn-accent); background: var(--sn-surface-3); }
    .lb__rank { font-weight: 700; font-size: 14px; color: var(--sn-accent); min-width: 32px; }
    .lb__name { flex: 1; font-size: 14px; color: var(--sn-ink-2); font-weight: 500; }
    .lb__score { font-size: 14px; font-weight: 600; color: var(--sn-ink-2); }
    .lb__games, .lb__total { font-size: 12px; color: var(--sn-muted); }
    .lb__empty { text-align: center; color: var(--sn-muted); margin-top: 32px; }
    .lb__my-rank { margin-top: 8px; }
    .lb__actions { text-align: center; margin-top: 20px; }
    .sn-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; text-decoration: none; }
    .sn-btn.accent { background: var(--sn-accent); color: var(--sn-white); }
  `],
})
export class LeaderboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly quizService = inject(QuizService);
  protected readonly auth = inject(AuthService);

  protected readonly leaderboard = signal<LeaderboardEntry[]>([]);
  protected readonly userRank = signal<UserRank | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.quizService.getLeaderboard().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.leaderboard.set(res.leaderboard);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    if (this.auth.user()) {
      this.quizService.getUserRank().pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (res) => this.userRank.set(res),
        error: () => {},  // silencieux : classement optionnel
      });
    }
  }
}
