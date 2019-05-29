import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  transform(text: string, length: number): any {
    // console.log(text, length);
    if (text.length > length) {
      return text.slice(0, length) + '...';
    }
    return text;
  }

}
