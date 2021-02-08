import { Component, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';

@Component({
  selector: 'app-element-toolbar',
  templateUrl: './element-toolbar.component.html',
  styleUrls: ['./element-toolbar.component.scss'],
})
export class ElementToolbarComponent implements OnInit {
  constructor(public moveableService: MoveableService) {}

  ngOnInit(): void {
    // console.log(this.moveableService.selectedItemId, this.moveableService.selectedPageId);
    // let ele = document.querySelector(
    //   '#SVGElement-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    // ) as HTMLObjectElement;
    // for (let i = 0; i < ele.ownerDocument.querySelectorAll('svg').length; i++) {
    //   console.log(ele.ownerDocument.querySelectorAll('svg')[i]);
    // }
    // console.log(ele.contentDocument);
  }
}
