import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phonePipe'
})
export class PhonePipePipe implements PipeTransform {
  transform(value: string): string {
    // Pull out each segment of the phone number
    let areaCode = value.substring (0, 3);
    let centralOffice = value.substring (3, 6);
    let subscriberNumber = value.substring (6, 10);

    // Format each segment
    return `(${areaCode}) ${centralOffice}-${subscriberNumber}`;
  }
}
