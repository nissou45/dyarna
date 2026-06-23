import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';
import { CurrentQuestion, AnswerResult } from '../core/types';

@Component({
  selector: 'app-quiz-game',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (error()) {
      <div class="qg-error">
        <p>{{ error() }}</p>
        <button class="sn-btn ghost" (click)="startGame()">Réessayer</button>
        <a routerLink="/" class="sn-btn ghost">Accueil</a>
      </div>
    } @else if (!sessionId()) {
      <div class="qg-start">
        <h2 class="qg-start__title">Devine la ville !</h2>
        <p class="qg-start__desc">
          Un indice s'affiche (photo, fait culturel ou climatique).
          Trouve la ville du Maroc parmi 4 propositions.
        </p>
        @if (!auth.user()) {
          <p class="qg-start__guest">
            Tu peux jouer sans compte. Connecte-toi après la partie pour apparaître au classement.
          </p>
        }
        <button class="sn-btn accent" (click)="startGame()">
          @if (loading()) { Chargement… }
          @else { Commencer le quiz }
        </button>
      </div>
    } @else if (result(); as r) {
      <div class="qr">
        <h2 class="qr__title">Quiz terminé !</h2>

        <div class="qr__score-circle">
          <span class="qr__score-value">{{ r.score }}</span>
          <span class="qr__score-label">points</span>
        </div>

        <div class="qr__stats">
          <div class="qr__stat">
            <span class="qr__stat-value">{{ r.correctAnswers }}/{{ r.totalQuestions }}</span>
            <span class="qr__stat-label">bonnes réponses</span>
          </div>
          <div class="qr__stat">
            <span class="qr__stat-value">{{ r.averageTimeMs > 0 ? (r.averageTimeMs / 1000).toFixed(1) + 's' : '-' }}</span>
            <span class="qr__stat-label">temps moyen</span>
          </div>
        </div>

        @if (r.isNewBestScore) {
          <p class="qr__best">🏆 Nouveau record personnel !</p>
        }

        @if (!auth.user()) {
          <div class="qr__guest-cta">
            <p>Connecte-toi pour sauvegarder ton score et apparaître au classement.</p>
            <a routerLink="/connexion" class="sn-btn accent">Se connecter</a>
          </div>
        }

        <div class="qr__actions">
          <button class="sn-btn accent" (click)="reset()">Rejouer</button>
          <a routerLink="/classement" class="sn-btn ghost">Voir le classement</a>
        </div>
      </div>
    } @else {
      <div class="qg">
        <div class="qg__header">
          <div class="qg__progress">
            Question {{ (currentQuestion()?.questionIndex ?? 0) + 1 }} / {{ currentQuestion()?.totalQuestions ?? 10 }}
          </div>
          <div class="qg__score">{{ currentQuestion()?.score ?? 0 }} pts</div>
        </div>

        <div class="qg__progress-bar">
          <div
            class="qg__progress-fill"
            [style.width.%]="(((currentQuestion()?.questionIndex ?? 0)) / (currentQuestion()?.totalQuestions ?? 10)) * 100"
          ></div>
        </div>

        @if (currentQuestion(); as q) {
          <div class="qg__clue">
            @if (q.type === 'photo') {
              <img [src]="q.clue" alt="Photo de la ville" class="qg__photo" />
            } @else if (q.type === 'culture_fact') {
              <div class="qg__fact">
                <span class="qg__fact-icon">📜</span>
                <p>{{ q.clue }}</p>
              </div>
            } @else {
              <div class="qg__fact">
                <span class="qg__fact-icon">🌤️</span>
                <p>{{ q.clue }}</p>
              </div>
            }
          </div>

          <div class="qg__choices">
            @for (choice of q.choices; track choice.id) {
              <button
                class="qg__choice"
                [class.qg__choice--correct]="answered() && choice.id === lastAnswer()?.correctCityId"
                [class.qg__choice--wrong]="answered() && choice.id === selectedChoice() && !lastAnswer()?.isCorrect"
                [disabled]="answered()"
                (click)="answer(choice.id)"
              >
                {{ choice.name }}
              </button>
            }
          </div>

          @if (lastAnswer(); as ans) {
            <div class="qg__feedback" [class.qg__feedback--correct]="ans.isCorrect" [class.qg__feedback--wrong]="!ans.isCorrect">
              @if (ans.isCorrect) {
                ✓ Bonne réponse ! {{ ans.pointsGained > 10 ? '(+' + ans.pointsGained + ' pts, rapidité bonus !)' : '(+' + ans.pointsGained + ' pts)' }}
              } @else {
                ✗ Raté ! C'était <strong>{{ ans.correctCityName }}</strong>
              }

              @if (!ans.isLastQuestion) {
                <button class="sn-btn ghost" (click)="nextQuestion()">Question suivante →</button>
              } @else {
                <button class="sn-btn accent" (click)="showResults()">Voir les résultats</button>
              }
            </div>
          }
        }
      </div>
    }
  `,
  styles: [`
    .qg, .qg-start { max-width: 560px; margin: 24px auto; padding: 0 16px; }
    .qg-start { text-align: center; padding-top: 48px; }
    .qg-start__title { font-size: 28px; color: var(--sn-ink-2); margin: 0 0 8px; }
    .qg-start__desc { color: var(--sn-ink-3); font-size: 15px; line-height: 1.5; margin: 0 0 16px; }
    .qg-start__guest { font-size: 13px; color: var(--sn-muted); margin: 0 0 20px; }
    .qg-error { text-align: center; margin-top: 48px; color: var(--sn-muted); }
    .qg-error p { margin: 0 0 16px; }
    .qg__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .qg__progress { font-size: 14px; font-weight: 600; color: var(--sn-accent); }
    .qg__score { font-size: 14px; color: var(--sn-ink-3); }
    .qg__progress-bar { height: 4px; background: var(--sn-line); border-radius: 2px; margin-bottom: 20px; overflow: hidden; }
    .qg__progress-fill { height: 100%; background: var(--sn-accent); border-radius: 2px; transition: width 0.3s; }
    .qg__clue { margin-bottom: 20px; }
    .qg__photo { width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; }
    .qg__fact { background: var(--sn-surface); border: 1px solid var(--sn-line); border-radius: 10px; padding: 20px; text-align: center; }
    .qg__fact-icon { font-size: 32px; display: block; margin-bottom: 8px; }
    .qg__fact p { font-size: 16px; line-height: 1.5; color: var(--sn-ink-2); margin: 0; }
    .qg__choices { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
    .qg__choice {
      padding: 14px;
      border: 2px solid var(--sn-line);
      border-radius: 10px;
      background: var(--sn-surface);
      font-size: 15px;
      font-weight: 600;
      color: var(--sn-ink-2);
      cursor: pointer;
      transition: all 0.15s;
    }
    .qg__choice:hover:not(:disabled) { border-color: var(--sn-accent); }
    .qg__choice--correct { border-color: var(--sn-success-bright); background: var(--sn-success-bg); }
    .qg__choice--wrong { border-color: var(--sn-error-bright); background: var(--sn-error-bg); }
    .qg__choice:disabled { cursor: default; opacity: 0.8; }
    .qg__feedback {
      padding: 14px;
      border-radius: 10px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .qg__feedback--correct { background: var(--sn-success-bg); border: 1px solid var(--sn-success-bright); color: var(--sn-success-ink); }
    .qg__feedback--wrong { background: var(--sn-error-bg); border: 1px solid var(--sn-error-bright); color: var(--sn-error-ink); }
    .sn-btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s; text-decoration: none; }
    .sn-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .sn-btn.ghost { background: transparent; color: var(--sn-accent); border: 1px solid var(--sn-accent); }
    .sn-btn.accent { background: var(--sn-accent); color: var(--sn-white); }
    .qr { text-align: center; padding-top: 32px; }
    .qr__title { font-size: 24px; color: var(--sn-ink-2); margin: 0 0 20px; }
    .qr__score-circle {
      width: 120px; height: 120px; border-radius: 50%;
      background: var(--sn-surface); border: 3px solid var(--sn-accent);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .qr__score-value { font-size: 36px; font-weight: 700; color: var(--sn-accent); line-height: 1; }
    .qr__score-label { font-size: 12px; color: var(--sn-muted); }
    .qr__stats { display: flex; gap: 24px; justify-content: center; margin-bottom: 16px; }
    .qr__stat { text-align: center; }
    .qr__stat-value { display: block; font-size: 20px; font-weight: 600; color: var(--sn-ink-2); }
    .qr__stat-label { font-size: 12px; color: var(--sn-muted); }
    .qr__best { font-size: 15px; color: var(--sn-accent); margin: 0 0 16px; }
    .qr__guest-cta { background: var(--sn-surface-3); border: 1px solid var(--sn-line); border-radius: 10px; padding: 16px; margin-bottom: 20px; }
    .qr__guest-cta p { margin: 0 0 12px; font-size: 14px; color: var(--sn-ink-3); }
    .qr__actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
  `],
})
export class QuizGameComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);
  protected readonly auth = inject(AuthService);

  protected readonly sessionId = signal<string | null>(null);
  protected readonly currentQuestion = signal<CurrentQuestion | null>(null);
  protected readonly lastAnswer = signal<AnswerResult | null>(null);
  protected readonly selectedChoice = signal<string | null>(null);
  protected readonly answered = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    averageTimeMs: number;
    isNewBestScore: boolean;
  } | null>(null);

  ngOnInit(): void {
    this.startGame();
  }

  protected startGame(): void {
    this.loading.set(true);
    this.error.set(null);

    this.quizService.startQuiz().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.sessionId.set(res.sessionId);
        this.currentQuestion.set(res.currentQuestion);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de démarrer une partie. Réessaie dans quelques secondes.');
        this.loading.set(false);
      },
    });
  }

  protected answer(cityId: string): void {
    if (this.answered()) return;
    this.selectedChoice.set(cityId);
    this.answered.set(true);

    this.quizService.submitAnswer(this.sessionId()!, cityId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.lastAnswer.set(res);
      },
      error: () => {
        this.answered.set(false);
        this.selectedChoice.set(null);
        this.error.set('Erreur lors de l\'envoi de la réponse.');
      },
    });
  }

  protected nextQuestion(): void {
    this.answered.set(false);
    this.selectedChoice.set(null);
    this.lastAnswer.set(null);

    this.quizService.getCurrentQuestion(this.sessionId()!).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        if ('status' in res && res.status === 'completed') {
          this.loadResult();
        } else {
          this.currentQuestion.set(res as CurrentQuestion);
        }
      },
      error: () => {
        this.error.set('Erreur de chargement de la question suivante.');
      },
    });
  }

  protected showResults(): void {
    this.loadResult();
  }

  private loadResult(): void {
    this.quizService.getResult(this.sessionId()!).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.result.set(res);
      },
      error: () => {
        this.error.set('Erreur de chargement des résultats.');
      },
    });
  }

  protected reset(): void {
    this.sessionId.set(null);
    this.currentQuestion.set(null);
    this.lastAnswer.set(null);
    this.selectedChoice.set(null);
    this.answered.set(false);
    this.loading.set(false);
    this.error.set(null);
    this.result.set(null);
  }
}
