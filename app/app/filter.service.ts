import { Injectable } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faDeafness, faFill } from '@fortawesome/free-solid-svg-icons';
import { FilterItem } from './models/filter-item';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public static NoIcon: IconProp = faFill;

  public static CurrentFilters: FilterItem = 0;

  constructor() {}

  static ToggleFilterItem(filterItem: FilterIconPair) {
    // Is the filter already selected?
    FilterService.CurrentFilters ^= filterItem.value;
  }
}

export class FilterIconPair {
  filterName: string = '';
  value: number = 0;
  faIcon: IconProp = faFill;
  iconURI: string = '';
  isFA: boolean = true;

  constructor(
    a: number,
    b: string,
    c: IconProp,
    isFA: boolean = true,
    iconString = ''
  ) {
    this.value = a;
    this.filterName = b;
    this.faIcon = c;
    this.isFA = isFA;
    this.iconURI = iconString;
  }
}
