import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';
import { BooksService } from '../../services/books.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string; // Download URL string créé à partir de la date au moment du téléchargement
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder, private booksService: BooksService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      synopsis: ''
    });
  }

  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const synopsis = this.bookForm.get('synopsis').value;
    const newBook = new Book(title, author);
    newBook.synopsis = synopsis;
    if(this.fileUrl && this.fileUrl !== '') { // Si l'URL existe et n'est pas vide
      newBook.photo = this.fileUrl;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  detectFiles(event) { // Détecte un évènement du DOM
    this.onUploadFile(event.target.files[0]); // files[0] car un seul fichier
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then( // .then car méthode asynchrone car téléchargement ça prend du temps
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

}
