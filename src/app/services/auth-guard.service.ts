import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().onAuthStateChanged(
          (user) => {
            if(user) { // Si l'user a le droit de passer sur cette route => resolve : true
              resolve(true);
            } else { // Sinon redirection
              this.router.navigate(['/auth', 'signin']); // ATTENTION : on n'écrit pas directement /auth/signin
              resolve(false);
            }
          }
        );
      }
    );
  }
}
