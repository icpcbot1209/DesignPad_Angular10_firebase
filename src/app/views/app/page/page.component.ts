import { Component, Input, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Page } from 'src/app/services/models';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  @Input() responsive_w: number = 1;
  @Input() responsive_h: number = 1;
  @Input() W: number = 1;
  @Input() H: number = 1;
  @Input() page: Page;
  @Input() pageId: number;

  constructor() {}

  ngOnInit(): void {}

  strTransform(left, top) {
    return `translate(${left}, ${top})`;
  }

  Point_Radius = () => (6 * this.W) / this.responsive_w;

  eightPos = (left, top, w, h) => [
    { x: left, y: top },
    { x: left + w, y: top },
    { x: left + w, y: top + h },
    { x: left, y: top + h },
    { x: left + w / 2, y: top },
    { x: left + w, y: top + h / 2 },
    { x: left + w / 2, y: top + h },
    { x: left, y: top + h / 2 },
  ];
}
