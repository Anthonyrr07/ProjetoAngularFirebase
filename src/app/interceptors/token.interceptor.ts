import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private storage: Storage) {}

  // Método responsável por interceptar todas as requisições HTTP
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recupera o token salvo no Storage (de forma assíncrona)
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        if (token) {
          // Se existir token, clona a requisição e adiciona o cabeçalho Authorization
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          // Repassa a requisição clonada com o token
          return next.handle(cloned);
        }

        // Se não houver token, segue a requisição original sem modificar
        return next.handle(req);
      })
    );
  }
}
