import { Component, OnInit } from "@angular/core";
import { BookService } from "../book.service";
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.css"],
})
export class BookComponent implements OnInit {
  textURL!: string;
  bookData: any;
  bookText: any;
  bookContinuousText: any;
  showPre: boolean = false;
  box: any;
  searchTextInput = '';
  count = 0;
  index = 0; // to store the current instance of matched search result
  searchResults = document.getElementsByTagName("mark");
  isLoading:boolean = false;
  
  constructor(
    private bookService: BookService,
    private route: ActivatedRoute
  )

  {}

  ngOnInit(): void {
    this.getBook()

  }

  getBook(): void {
    this.isLoading = true;
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.bookService.getBookByID(id)
      .subscribe((data) => {
        this.bookData = data;
        if ("text/plain; charset=us-ascii" in this.bookData["formats"]) {
          this.textURL = this.bookData["formats"]["text/plain; charset=us-ascii"].split('org')[1]
        }
        else if ("text/plain; charset=utf-8" in this.bookData["formats"]) {
          this.textURL = this.bookData["formats"]["text/plain; charset=utf-8"].split('org')[1]
        }
        else if ("text/plain; charset=iso-8859-1" in this.bookData["formats"]) {
          this.textURL = this.bookData["formats"]["text/plain; charset=iso-8859-1"].split('org')[1]
        }
        this.bookService.getBookText(this.textURL)
          .subscribe((textdata) => {
            this.bookText = textdata;
            this.bookContinuousText = this.bookText.replaceAll("\r\n\r\n","<br><br>");
          }, error => {
            this.isLoading = false;
          })
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      })
  }
  toggleDisplay() {
    this.showPre = !this.showPre
  }

  changeFontSize(newFontSize: string): void {
    this.box = this.showPre
      ? document.getElementById("text-pre")
      : document.getElementById("text");
  
    if (this.box != null) {
      this.box.classList.remove(
        ...["normal-font-size", "large-font-size", "larger-font-size"].filter(
          (f) => f != newFontSize
        )
      );
      this.box.classList.add(newFontSize);
    }
  }

  changeLineSpacing(newLineSpacing: string): void {
    this.box = this.showPre
      ? document.getElementById("text-pre")
      : document.getElementById("text");
    if (this.box != null) {
      this.box.classList.remove(
        ...["normal-space-size", "big-space-size", "bigger-space-size"].filter(
          (s) => s !== newLineSpacing
        )
      );
      this.box.classList.add(newLineSpacing);
    }
  }

  countMatches(searchText: string) {
    if(searchText == '') {
      this.count = 0;
      return;
    }
   
    this.index = 0;
   
    const re = new RegExp(searchText, "gi");
   
    var results = this.showPre
      ? this.bookText.match(re)
      : this.bookContinuousText.match(re);
    this.count = results ? results.length : 0;
   
    if (this.count === 0) {
      this.index = -1;
    }
   }

  scrollToNext() {
    var prevIndex = this.index;
    this.index = (this.index + 1) % this.searchResults.length;
    this.searchResults[this.index].style.backgroundColor = "saddlebrown";
    this.searchResults[prevIndex].style.backgroundColor = "yellow";
    this.searchResults[this.index].scrollIntoView();
  }
  
  scrollToPrevious() {
    var prevIndex = this.index;
    // compute modulo subtraction to get a positive remainder, for circular search
    this.index =
      (((this.index - 1) % this.searchResults.length) +
        this.searchResults.length) %
      this.searchResults.length;
    this.searchResults[this.index].scrollIntoView();
    this.searchResults[this.index].style.backgroundColor = "saddlebrown";
    this.searchResults[prevIndex].style.backgroundColor = "yellow";
  }

}
