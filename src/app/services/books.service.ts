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
      .on('value', (data: DataSnapshot) => { // Sur l'évènement "value" qui retourne un objet DataSnapshot
          this.books = data.val() ? data.val() : []; // On reçoit quelque chose ? ou pas []
          this.emitBooks();
        }
      );
  }

  getSingleBook(id: number) { // Asynchrone car pas besoin de voir en temps réel
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data: DataSnapshot) => {
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

  removeBook(book: Book) {
    const bookIndexToRemove = this.books.findIndex( // Trouve l'index de ce livre dans l'array
      (bookEl) => {
        if(bookEl === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1); // Splice modifie l'array
    this.saveBooks();
    this.emitBooks();
  }
}
