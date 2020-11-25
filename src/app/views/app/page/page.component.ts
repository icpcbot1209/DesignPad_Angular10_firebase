import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Page } from 'src/app/services/models';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit {
  @Input() page: Page;
  @Input() pageId: number;

  constructor(public ds: DesignService) {}

  ngOnInit(): void {}
}
