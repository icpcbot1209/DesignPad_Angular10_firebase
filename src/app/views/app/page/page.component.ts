import { Component, Input, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Page } from 'src/app/services/models';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  @Input() responsive_w: number;
  @Input() responsive_h: number;
  @Input() W: number;
  @Input() H: number;
  @Input() page: Page;
  @Input() pageId: number;

  constructor() {}

  ngOnInit(): void {}
}
