import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // very simple centralized handling
        let msg = 'An unexpected error occurred';
        if (!navigator.onLine) {
          msg = 'No internet connection';
        } else if (err.status === 0) {
          msg = 'Server unreachable';
        } else if (err.status >= 500) {
          msg = 'Server error';
        } else if (err.status === 404) {
          msg = 'Resource not found';
        } else if (err.status === 401) {
          msg = 'Unauthorized';
        }
        // keep it simple: use alert for now
        try { alert(msg); } catch (e) { console.error(msg); }
        return throwError(() => err);
      })
    );
  }
}
