import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {} // Injeta o Storage para pegar o token

  // Função que intercepta todas as requisições HTTP
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Não intercepta requisições de login ou registro
    if (req.url.includes('login') || req.url.includes('registrar')) {
      return next.handle(req); // Passa a requisição sem alteração
    }

    // Pega o token do storage (async) e transforma em observable
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        if (token) {
          // Clona a requisição original e adiciona o header Authorization
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}` // Adiciona token JWT no header
            }
          });
          return next.handle(authReq); // Continua com a requisição modificada
        }
        return next.handle(req); // Se não tiver token, envia requisição original
      })
    );
  }
}
