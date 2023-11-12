import { SafeHtml } from '@angular/platform-browser';

export class ExperienceItem {
  role: string = '';
  company: string = '';
  location: string = '';
  startDate: string = '';
  endDate: string = '';
  filterableItems: number = 0;
  notes: Array<string> = new Array<string>();
  priority?: number;
}
