import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  ViewChildren,
  QueryList,
  AfterViewChecked,
} from '@angular/core';
import { ContactMe } from '../models/contact-me';
import { Education } from '../models/education';
import { OnScrollValuePair } from '../models/on-scroll-value-pair';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewChecked {
  headerValues: OnScrollValuePair<number> = new OnScrollValuePair(
    0,
    100,
    0,
    50
  );

  titleValues: OnScrollValuePair<number> = new OnScrollValuePair(4, 4, 4, 2);

  colorValues: OnScrollValuePair<[number, number, number]> =
    new OnScrollValuePair(
      [0, 0, 0],
      [255, 255, 255],
      [255, 255, 255],
      [255, 255, 255]
    );

  opacityValues: OnScrollValuePair<number> = new OnScrollValuePair(1, 0, 1, 0);

  backgroundColorValues: OnScrollValuePair<[number, number, number, number]> =
    new OnScrollValuePair(
      [0, 0, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 1]
    );

  finalScrollDistance = 350;

  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Input() education: Education = new Education();

  @Input() contact: ContactMe = new ContactMe();

  @ViewChild('titleElement') titleElement!: ElementRef;
  @ViewChild('header') headerElement!: ElementRef;
  @ViewChild('header_offset') offsetElement!: ElementRef;
  @ViewChildren('hideOnScroll') hideOnScrollElements!: QueryList<ElementRef>;
  @ViewChildren('hideOnScrollPhone')
  hideOnScrollPhoneElements!: QueryList<ElementRef>;

  isInitialized: boolean = false;

  counter: number = 0;

  constructor() {}

  ngAfterViewChecked() {
    // TODO: Probably due to something caused by app.component's styling, the header's initial values on mobile for PROD builds
    // ONLY get messed up. Waited until after a few view checks to grab the initial heights
    this.counter++;

    // Were the header and offset elements found?
    if (this.counter > 2 && !this.isInitialized && this.headerElement && this.offsetElement) {
      // Get the native element
      let headerNativeElement = this.headerElement.nativeElement;

      this.headerValues.initialMobileValue =
      document.querySelector<HTMLElement>('header')!.offsetHeight;

      this.headerValues.initialDesktopValue =
        document.querySelector<HTMLElement>('header')!.offsetHeight;

      // Update the height of the offset element
      this.offsetElement.nativeElement.style.height =
        headerNativeElement.offsetHeight.toString() + 'px';

      // Update font colors
      this.headerElement.nativeElement.style.color =
        this.UpdatePropertyOnScroll(PropertyType.color, this.colorValues);

      // Set the final scroll distance
      this.finalScrollDistance = screen.availHeight * 0.75;

      this.isInitialized = true;

      console.log(this.headerValues.initialMobileValue);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): boolean {
    if (!this.isInitialized) return false;

    this.UpdateScrollValues();

    return true;
  }

  UpdateScrollValues() {
    // Update height
    this.headerElement.nativeElement.style.height = this.UpdatePropertyOnScroll(
      PropertyType.height,
      this.headerValues
    );

    // Update font colors
    this.headerElement.nativeElement.style.color = this.UpdatePropertyOnScroll(
      PropertyType.color,
      this.colorValues
    );

    // Update transparency of any hideOnScroll elements
    this.hideOnScrollElements.forEach((element) => {
      element.nativeElement.style.opacity = this.UpdatePropertyOnScroll(
        PropertyType.opacity,
        this.opacityValues,
        2
      );
    });

    // Update font size
    this.titleElement.nativeElement.style.fontSize =
      this.UpdatePropertyOnScroll(PropertyType.fontSize, this.titleValues);

    // Update background
    this.headerElement.nativeElement.style.background =
      this.UpdatePropertyOnScroll(
        PropertyType.background,
        this.backgroundColorValues,
        2
      );

    // Update mobile only hide on scroll
    if (window.innerWidth < 600) {
      this.hideOnScrollPhoneElements.forEach((element) => {
        element.nativeElement.style.opacity = this.UpdatePropertyOnScroll(
          PropertyType.opacity,
          this.opacityValues,
          2
        );
      });
    }
  }

  // TODO: Update to be more functional, return CSS string
  // example: this.headerElement.nativeElement.style.height = this.UpdatePropertyOnScroll (height, valuePair);
  UpdatePropertyOnScroll(
    propertyType: PropertyType,
    valuePair: OnScrollValuePair<any>,
    speed: number = 1
  ): string {
    // Get the distance the user has scrolled so far
    // Cap scroll distance off at 0
    let scrollDistance = Math.max(0, window.pageYOffset);

    // Calculate the percent towards the final scroll distance and cap at 1
    let scrollPercent =
      speed * Math.min(scrollDistance / this.finalScrollDistance, 1);

    // Is this a mobile device?
    let isMobile = window.innerWidth < 600;

    let newValue: any;

    // Calculate the new value

    // Is the property color or background?
    if (
      propertyType == PropertyType.color ||
      propertyType == PropertyType.background
    ) {
      newValue = Array<number>();
      // If so, iterate through the value arrays and calculate the value for the current index
      for (
        let index = 0;
        index < valuePair.initialMobileValue.length;
        index++
      ) {
        if (isMobile) {
          newValue[index] =
            (1 - scrollPercent) * valuePair.initialMobileValue[index] +
            scrollPercent * valuePair.finalMobileValue[index];
        } else {
          newValue[index] =
            (1 - scrollPercent) * valuePair.initialDesktopValue[index] +
            scrollPercent * valuePair.finalDesktopValue[index];
        }
      }
    } else {
      // Otherwise, just calculate the new value
      if (isMobile) {
        newValue =
          (1 - scrollPercent) * valuePair.initialMobileValue +
          scrollPercent * valuePair.finalMobileValue;
      } else {
        newValue =
          (1 - scrollPercent) * valuePair.initialDesktopValue +
          scrollPercent * valuePair.finalDesktopValue;
      }
    }

    // Update the property
    switch (propertyType) {
      case PropertyType.height:
        return newValue.toString() + 'px';
      case PropertyType.fontSize:
        return newValue.toString() + 'rem';
      case PropertyType.color:
        return `rgb(${newValue[0]},${newValue[1]},${newValue[2]})`;
      case PropertyType.opacity:
        return newValue.toString();
      case PropertyType.background:
        return `rgba(${newValue[0]},${newValue[1]},${newValue[2]}, ${newValue[3]})`;
    }
  }
}

export enum PropertyType {
  height,
  fontSize,
  color,
  opacity,
  background,
}
