import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from '../models/book.model';
import * as firebase from 'firebase';

@Injectable()
export class BooksService {

  books: Book[] = [];
  booksSubject = new Subject<Book[]>(); // Qui emmetra l'array books

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books') // Méthode on va réagir à chaque fois qu'il trouve un livre dans la liste (temps réel en cas multi-utilisateurs)
      .on('value', (data) => { // Sur l'évènement "value" qui retourne un objet DataSnapshot
          this.books = data.val() ? data.val() : []; // On reçoit quelque chose ? ou pas []
          this.emitBooks();
        }
      );
  }

  getSingleBook(id: number) { // Asynchrone car pas besoin de voir en temps réel
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks(); // sur le serveur
    this.emitBooks(); // emettre le subject
  }

  // Pour Uploader une photo
  uploadFile(file: File) {
    return new Promise( // Asynchrone car chargement de fichier prend du temps
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString(); // On génére un nom de fichier
        const upload = firebase.storage().ref() // ref() sans paramètre se place à la racine du storage
          .child('images/' + almostUniqueFileName + file.name) // On crée un enfant
          .put(file); // On y joint le fichier

        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement…'); // Début chargement
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error); // Erreur
            reject();
          },
          () => {
            resolve(upload.snapshot.downloadURL); // Fin chargement
          }
        );
      }
    );
  }

  removeBook(book: Book) {
    if(book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo removed!');
        },
        (error) => {
          console.log('Could not remove photo! : ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }
}
