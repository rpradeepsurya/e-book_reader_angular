import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  
  transform(text: string, searchQuery: string): string {
    if (!searchQuery) {
      return text;
    }
    const re = new RegExp(searchQuery, 'gi');
    return text.replace(re, '<mark id="1">$&</mark>');
  }
}
