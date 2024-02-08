import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from '../utils';

@Pipe({
  name: 'msToHour',
  standalone: true,
})
export class MsToHourPipe implements PipeTransform {
  transform(value: number): string {
    return DateUtils.convertMsToTime(value);
  }
}
