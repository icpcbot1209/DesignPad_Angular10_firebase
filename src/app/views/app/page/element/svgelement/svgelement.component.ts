import { Component, Input, OnInit } from '@angular/core';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item, Page } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';

import * as CSS from 'csstype';

@Component({
  selector: 'app-svgelement',
  templateUrl: './svgelement.component.html',
  styleUrls: ['./svgelement.component.scss'],
})
export class SVGElementComponent implements OnInit {
  @Input('item') item;

  constructor(public moveableService: MoveableService) {}

  ngOnInit(): void {}

  styleItem(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
    };
  }
}
