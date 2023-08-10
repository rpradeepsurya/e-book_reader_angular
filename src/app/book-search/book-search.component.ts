import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '../book.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {

  bookArray: Array<IBook> = [];
  bookSearchInput:string = "";
  nothing:boolean = true;
  isLoading:boolean = false;

  constructor(private bookService:BookService) {
  }

  ngOnInit(): void {
    this.searchBA();
    }

  searchBA(): void {
    this.isLoading = true;
    this.bookService.searchBook(this.bookSearchInput).subscribe( data => {
      let response:any = data;
      this.nothing = false;
      this.bookArray = []
      for (let result of response["results"]) {
        this.bookArray.push({
          "id": result["id"], 
          "download": result["formats"]["text/html"],
          "image": result["formats"]["image/jpeg"],
          "author": result["authors"][0].name,
          "title": result["title"]
        });
      };
      if (this.bookArray.length === 0) {
        this.nothing = true
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  downloadBook(id: number) {
    window.open("https://www.gutenberg.org/files/" + id + "/" + id + "-0.zip", '_blank');
  }

}