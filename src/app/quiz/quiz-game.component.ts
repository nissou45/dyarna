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
  templateUrl: './quiz-game.component.html',
  styleUrl: './quiz-game.component.scss',
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
