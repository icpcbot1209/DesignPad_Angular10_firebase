import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MoveableService } from '../../../../../services/moveable.service';
import { DesignService } from '../../../../../services/design.service';
import { Item } from '../../../../../models/models';

import * as CSS from 'csstype';

@Component({
  selector: 'app-video-element',
  templateUrl: './video-element.component.html',
  styleUrls: ['./video-element.component.scss'],
})
export class VideoElementComponent implements OnInit {
  @Input('item') item;
  @ViewChild('videoElement') videoElement: ElementRef;

  constructor(public moveableService: MoveableService, public ds: DesignService) {}

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
      border: 'none',
      filter: item.filter,
      WebkitFilter: item.filter,
      clipPath: item.clipStyle,
      zIndex: item.zIndex,
    };
  }

  playButtonStyle(item: Item): CSS.Properties {
    let x = (item.w - 48) / 2 + item.x;
    let y = (item.h - 48) / 2 + item.y;
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      transform: `translate(${x}px, ${y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`,
      WebkitTransform: this.moveableService.strTransform(item),
      border: 'none',
      background: 'rgba(17,23,29,.6)',
      borderRadius: '100%',
      width: '48px',
      height: '48px',
    };
  }
}
