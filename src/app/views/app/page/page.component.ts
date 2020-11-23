import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Page } from 'src/app/services/models';
import * as geometry from 'src/app/services/geometry';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
  @Input() page: Page;
  @Input() pageId: number;
  @ViewChild('touchPanel', { static: false }) touchPanel: ElementRef;

  constructor(public ds: DesignService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  str_view_box_touchpanel() {
    let W = this.ds.pageW();
    let H = this.ds.pageH();
    let str = `${-W * 0.5} ${-H * 0.5} ${W * 2} ${H * 2}`;
    return str;
  }

  strTransform(left, top) {
    return `translate(${left}, ${top})`;
  }

  Point_Radius = () => (6 * this.ds.pageW()) / this.ds.page_vw;

  eightPos = geometry.eightPos;

  svgMouseMove(evt) {
    let target = this.touchPanel.nativeElement;
    let dim = target.getBoundingClientRect();
    let x = evt.clientX - dim.left;
    let y = evt.clientY - dim.top;
    console.log(x, y);
  }

  svgMouseDown($event) {
    this.ds.thePageId = this.pageId;
  }

  svgMouseUp($event) {
    // this.ds.thePageId = this.pageId;
  }
}
