import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  StartQuizResponse,
  CurrentQuestion,
  AnswerResult,
  QuizResult,
  LeaderboardEntry,
  UserRank,
} from '../core/types';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/quiz`;

  private guestId: string | null = null;

  getGuestId(): string {
    if (!this.guestId) {
      let stored = localStorage.getItem('quiz_guest_id');
      if (!stored) {
        stored = crypto.randomUUID();
        localStorage.setItem('quiz_guest_id', stored);
      }
      this.guestId = stored;
    }
    return this.guestId;
  }

  startQuiz(): Observable<StartQuizResponse> {
    return this.http.post<StartQuizResponse>(`${this.API}/start`, {
      guestId: this.getGuestId(),
    });
  }

  getCurrentQuestion(sessionId: string): Observable<CurrentQuestion | { status: 'completed' }> {
    return this.http.get<CurrentQuestion | { status: 'completed' }>(
      `${this.API}/${sessionId}/current-question`,
    );
  }

  submitAnswer(sessionId: string, cityId: string): Observable<AnswerResult> {
    return this.http.post<AnswerResult>(`${this.API}/${sessionId}/answer`, { cityId });
  }

  getResult(sessionId: string): Observable<QuizResult> {
    return this.http.get<QuizResult>(`${this.API}/${sessionId}/result`);
  }

  getLeaderboard(limit: number = 10): Observable<{ leaderboard: LeaderboardEntry[] }> {
    return this.http.get<{ leaderboard: LeaderboardEntry[] }>(
      `${this.API}/leaderboard/all?limit=${limit}`,
    );
  }

  getUserRank(): Observable<UserRank> {
    return this.http.get<UserRank>(`${this.API}/leaderboard/me`);
  }
}
