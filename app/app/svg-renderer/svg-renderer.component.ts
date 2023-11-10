import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-renderer',
  templateUrl: './svg-renderer.component.html',
  styleUrls: ['./svg-renderer.component.scss'],
})
export class SvgRendererComponent {
  @Input() title: string = '';

  constructor() {}
}
