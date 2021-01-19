import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Item, Page } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { DesignService } from 'src/app/services/design.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-text-item',
  templateUrl: './text-item.component.html',
  styleUrls: ['./text-item.component.scss'],
})
export class TextItemComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;

  constructor(public moveableService: MoveableService, public toolbarService: ToolbarService, public ds: DesignService) {}

  ngOnInit(): void {
    this.ds.onSelectNothing();
  }

  ngAfterViewInit(): void {
    this.moveableService.isEditable = true;
  }

  styleItemPosition(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };

    if (item.type === ItemType.text)
      return {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };
  }
  styleItem(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
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
      };

    if (item.type === ItemType.text)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        // height: "auto",
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        // transform: `translate(${item.x}px, ${item.y}px)`,
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

  enableTextEdit(event: MouseEvent) {
    this.moveableService.enableTextEdit(event);
  }

  onMouseDown() {
    this.moveableService.isMouseDown = true;
  }
}
