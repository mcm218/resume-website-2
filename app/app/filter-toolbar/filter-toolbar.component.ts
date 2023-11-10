import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faAngular,
  faCss3,
  faHtml5,
  faJs,
  faNode,
  faReact,
  faSalesforce,
  faUnity,
} from '@fortawesome/free-brands-svg-icons';
import {
  faChevronRight,
  faChevronLeft,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FilterIconPair, FilterService } from '../filter.service';
import { FilterItem } from '../models/filter-item';

@Component({
  selector: 'app-filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.scss'],
})
export class FilterToolbarComponent implements OnInit {
  noIcon: IconProp = FilterService.NoIcon;

  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;

  @Output() expandedEvent = new EventEmitter<boolean>(true);
  isExpanded = true;

  filterObjects: Array<FilterIconPair> = new Array<FilterIconPair>();

  constructor() {}

  ngOnInit(): void {
    if (window.innerWidth < 600) {
      this.isExpanded = false;
    }

    this.filterObjects.push(
      new FilterIconPair(FilterItem.CSharp, 'C#', this.noIcon, false, 'csharp')
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.Unity, 'Unity', faUnity)
    );

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.Xamarin,
        'Xamarin',
        this.noIcon,
        false,
        'xamarin'
      )
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.Salesforce, 'Salesforce', faSalesforce)
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.Angular, 'Angular', faAngular)
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.HTML, 'HTML', faHtml5)
    );

    this.filterObjects.push(new FilterIconPair(FilterItem.CSS, 'CSS', faCss3));

    this.filterObjects.push(
      new FilterIconPair(FilterItem.JavaScript, 'JavaScript', faJs)
    );

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.TypeScript,
        'TypeScript',
        this.noIcon,
        false,
        'typescript'
      )
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.NodeJS, 'NodeJS', faNode)
    );

    this.filterObjects.push(
      new FilterIconPair(FilterItem.React, 'React', faReact)
    );

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.Flutter,
        'Flutter',
        this.noIcon,
        false,
        'flutter'
      )
    );

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.CPlusPlus,
        'C/C++',
        this.noIcon,
        false,
        'cplusplus'
      )
    );

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.ElasticSearch,
        'ElasticSearch',
        this.noIcon,
        false,
        'elasticsearch'
      )
    )

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.RabbitMQ,
        'ReactNative',
        this.noIcon,
        false,
        'reactnative'
      )
    )

    this.filterObjects.push(
      new FilterIconPair(
        FilterItem.RabbitMQ,
        'RabbitMQ',
        this.noIcon,
        false,
        'rabbitmq'
      )
    )
  }

  ToggleFilterItem(filtereableItem: FilterIconPair) {
    FilterService.ToggleFilterItem(filtereableItem);
  }

  CheckFlag(item: FilterIconPair): boolean {
    return (FilterService.CurrentFilters & item.value) != 0;
  }

  ToggleExpanded() {
    this.isExpanded = !this.isExpanded;

    // Are we on a desktop? If so, emit an expand event
    if (window.innerWidth >= 600) {
      this.expandedEvent.emit(this.isExpanded);
    }
  }
}
