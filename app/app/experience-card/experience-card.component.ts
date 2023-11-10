import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngular,
  faCss3,
  faHtml5,
  faJs,
  faJsSquare,
  faNode,
  faNodeJs,
  faReact,
  faSalesforce,
  faUnity,
} from '@fortawesome/free-brands-svg-icons';
import {
  faDeafness,
  faFill,
  faFillDrip,
} from '@fortawesome/free-solid-svg-icons';
import { FilterIconPair, FilterService } from '../filter.service';
import { ExperienceItem } from '../models/experience-item';
import { FilterItem } from '../models/filter-item';

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss'],
})
export class ExperienceCardComponent implements OnInit {
  noIcon: IconProp = FilterService.NoIcon;

  @Input() item: ExperienceItem = new ExperienceItem();

  filterObjects: Array<FilterIconPair> = new Array<FilterIconPair>();

  constructor(public filterService: FilterService) {}

  ngOnInit() {
    if ((this.item.filterableItems & FilterItem.CSharp) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.CSharp,
          'C#',
          this.noIcon,
          false,
          'csharp'
        )
      );
    }
    if ((this.item.filterableItems & FilterItem.Unity) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.Unity, 'Unity', faUnity)
      );
    }
    if ((this.item.filterableItems & FilterItem.Xamarin) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.Xamarin,
          'Xamarin',
          this.noIcon,
          false,
          'xamarin'
        )
      );
    }
    if ((this.item.filterableItems & FilterItem.Salesforce) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.Salesforce, 'Salesforce', faSalesforce)
      );
    }
    if ((this.item.filterableItems & FilterItem.Angular) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.Angular, 'Angular', faAngular)
      );
    }
    if ((this.item.filterableItems & FilterItem.HTML) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.HTML, 'HTML', faHtml5)
      );
    }
    if ((this.item.filterableItems & FilterItem.CSS) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.CSS, 'CSS', faCss3)
      );
    }
    if ((this.item.filterableItems & FilterItem.JavaScript) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.JavaScript, 'JavaScript', faJs)
      );
    }
    if ((this.item.filterableItems & FilterItem.TypeScript) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.TypeScript,
          'TypeScript',
          this.noIcon,
          false,
          'typescript'
        )
      );
    }
    if ((this.item.filterableItems & FilterItem.NodeJS) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.NodeJS, 'NodeJS', faNode)
      );
    }
    if ((this.item.filterableItems & FilterItem.React) != 0) {
      this.filterObjects.push(
        new FilterIconPair(FilterItem.React, 'React', faReact)
      );
    }
    if ((this.item.filterableItems & FilterItem.Flutter) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.Flutter,
          'Flutter',
          this.noIcon,
          false,
          'flutter'
        )
      );
    }
    if ((this.item.filterableItems & FilterItem.CPlusPlus) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.CPlusPlus,
          'C/C++',
          this.noIcon,
          false,
          'cplusplus'
        )
      );
    }

    // ElasticSearch
    if ((this.item.filterableItems & FilterItem.ElasticSearch) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.ElasticSearch,
          'ElasticSearch',
          this.noIcon,
          false,
          'elasticsearch'
        )
      );
    }

    // RabbitMQ
    if ((this.item.filterableItems & FilterItem.RabbitMQ) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.RabbitMQ,
          'RabbitMQ',
          this.noIcon,
          false,
          'rabbitmq'
        )
      );
    }

    // ReactNative
    if ((this.item.filterableItems & FilterItem.ReactNative) != 0) {
      this.filterObjects.push(
        new FilterIconPair(
          FilterItem.ReactNative,
          'ReactNative',
          this.noIcon,
          false,
          'reactnative'
        )
      );
    }
  }

  ToggleFilterItem(filtereableItem: FilterIconPair) {
    FilterService.ToggleFilterItem(filtereableItem);
  }

  CurrentFilters() {
    return FilterService.CurrentFilters;
  }

  CheckFlag(item: FilterIconPair): boolean {
    return (FilterService.CurrentFilters & item.value) != 0;
  }

  IsInFilter(): boolean {
    // is the filter empty? If so, return true
    if (FilterService.CurrentFilters == 0) {
      return true;
    }
    // Otherwise, check if the filter bits for this card are contained in the filter
    return (FilterService.CurrentFilters & this.item.filterableItems) > 0;
  }
}
