import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  book: Book;

  constructor(private route: ActivatedRoute, private booksService: BooksService, private router: Router) {

  }

  ngOnInit() {
    this.book = new Book('', ''); // D'abord un book vide car la méthode pour récupérer un livre est asynchrone et peut prendre du temps, sinon la page plante
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then(
      (book: Book) => {
        this.book = book;
      }
    );
  }

  onBack() { // Pour le retour en arrière
    this.router.navigate(['/books']);
  }
  
}
