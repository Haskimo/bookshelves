import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()

export class AuthService {

  constructor() { }

  // Création nouvel utilisateur
  createNewUser(email: string, password: string) {
    return new Promise( // Méthode asynchrone
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then( //.then parce qu'il y a une Promise
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  // Connexion utilisateur déjà existant
  signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }

  // Déconnexion utilisateur
  signOutUser() {
    firebase.auth().signOut();
  }

}
