import { Component, Input, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item } from 'src/app/models/models';
import { ItemStatus } from 'src/app/models/enums';

import * as CSS from 'csstype';

@Component({
  selector: 'app-video-selector',
  templateUrl: './video-selector.component.html',
  styleUrls: ['./video-selector.component.scss'],
})
export class VideoSelectorComponent implements OnInit {
  @Input('item') item;

  ItemStatus = ItemStatus;

  constructor(public ds: DesignService, public moveableService: MoveableService) {}

  ngOnInit(): void {
    this.ds.setStatus(ItemStatus.video_selected);
  }

  ngAfterViewInit(): void {
    this.moveableService.setSelectable(this.item.itemId, this.item.pageId, '#VideoSelector-');
  }

  styleItemPosition(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      WebkitTransform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      zIndex: item.zIndex,
    };
  }

  playButtonSelector(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '48px',
      height: '48px',
      transform: `translate(${
        (item.w * item.clipPathToNumber[3]) / 100 + (item.w * (1 - (item.clipPathToNumber[1] + item.clipPathToNumber[3]) / 100) - 48) / 2
      }px, ${(item.h * item.clipPathToNumber[0]) / 100 + (item.h * (1 - (item.clipPathToNumber[0] + item.clipPathToNumber[2]) / 100) - 48) / 2}px)`,
      WebkitTransform: `translate(${
        (item.w * item.clipPathToNumber[3]) / 100 + (item.w * (1 - (item.clipPathToNumber[1] + item.clipPathToNumber[3]) / 100) - 48) / 2
      }px, ${(item.h * item.clipPathToNumber[0]) / 100 + (item.h * (1 - (item.clipPathToNumber[0] + item.clipPathToNumber[2]) / 100) - 48) / 2}px)`,
      zIndex: item.zIndex,
      cursor: 'pointer',
      background: 'red',
      borderRadius: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  playVideo() {
    this.ds.playVideo(this.item);
  }

  startVideoCrop() {
    if (this.ds.onPlayVideo) {
      this.ds.playVideo(this.item);
    }
    this.ds.setStatus(ItemStatus.video_crop);
  }
}
