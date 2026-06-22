import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private isRefreshing = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token && !req.url.includes('/auth/')) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
          return this.handle401(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.auth.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;
          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${res.accessToken}` },
          });
          return next.handle(cloned);
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.auth.logout();
          return throwError(() => err);
        }),
      );
    }

    return next.handle(req);
  }
}
