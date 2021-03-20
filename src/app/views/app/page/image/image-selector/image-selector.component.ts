import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../../../../models/models';
import { MoveableService } from '../../../../../services/moveable.service';
import { DesignService } from '../../../../../services/design.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})
export class ImageSelectorComponent implements OnInit {
  @Input('item') item;
  @ViewChild('imgSelector') imgSelector: ElementRef;

  constructor(public ds: DesignService, public moveableService: MoveableService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.ds.isTemplate) {
      this.ds.copedTargets.push(this.imgSelector.nativeElement);
      this.moveableService.onSelectTargets(this.ds.copedTargets);
      // this.moveableService.setSelectable(this.item.itemId, this.item.pageId, '#ImgSelector-')
    }
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

  onMouseMoveItem(event: MouseEvent, item: Item) {
    let pageEl: HTMLElement = document.querySelector(`#page-${item.pageId}`);
    let rect: DOMRect = pageEl.getBoundingClientRect();
    let isOverflow = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;

    if (!isOverflow) {
      item.hovered = true;
    } else {
      item.hovered = false;
    }
  }
}
