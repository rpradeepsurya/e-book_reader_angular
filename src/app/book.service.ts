import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiurl:string = "https://gutendex.com/books";
  private bookurl:string = "https://www.gutenberg.org"

  constructor(
    private http: HttpClient
    ) { }

  searchBook(name:string) {
    return this.http.get(`${this.apiurl}?search=${name}`)
  }

  getBookByID(id:number) {
    return this.http.get(`${this.apiurl}/${id}`)
  }

  getBookText(url:string) {
    return this.http.get(url, {
      responseType: 'text'
    });
  }
  
}