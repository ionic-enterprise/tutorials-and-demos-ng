import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NavController } from '@ionic/angular/standalone';
import { SessionService } from '../session.service';

@Injectable()
export class UnauthInterceptor implements HttpInterceptor {
  constructor(
    private navigation: NavController,
    private session: SessionService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: async (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            await this.session.clear();
            this.navigation.navigateRoot(['/', 'tabs', 'tab1']);
          }
        },
      }),
    );
  }
}
