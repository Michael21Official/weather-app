import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private snackBar: MatSnackBar) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Wystąpił nieznany błąd';

                if (error.error instanceof ErrorEvent) {
                    // Błąd po stronie klienta
                    errorMessage = `Błąd: ${error.error.message}`;
                } else {
                    // Błąd z backendu
                    errorMessage = error.error?.message || `Błąd serwera: ${error.status}`;
                }

                this.snackBar.open(errorMessage, 'Zamknij', {
                    duration: 5000,
                    panelClass: ['error-snackbar']
                });

                return throwError(() => error);
            })
        );
    }
}