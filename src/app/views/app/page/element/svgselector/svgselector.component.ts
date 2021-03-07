import { Component, Input, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item } from 'src/app/models/models';

import * as CSS from 'csstype';

@Component({
  selector: 'app-svgselector',
  templateUrl: './svgselector.component.html',
  styleUrls: ['./svgselector.component.scss'],
})
export class SVGSelectorComponent implements OnInit {
  @Input('item') item;

  constructor(public ds: DesignService, public moveableService: MoveableService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.moveableService.setSelectable(this.item.itemId, this.item.pageId, '#SVGSelector-');
  }

  styleItemPosition(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      zIndex: item.zIndex,
    };
  }
}
