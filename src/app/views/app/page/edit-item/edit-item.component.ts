import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';
import { MoveableService } from 'src/app/services/moveable.service';

import * as CSS from 'csstype';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;
  @ViewChild('quillEditor') quillEditor: ElementRef;
  @ViewChild('curveText') curveText: ElementRef;

  editorEle: HTMLElement;
  resizeObserver;

  constructor(public moveableService: MoveableService, private zone: NgZone) {}

  ngOnInit() {
    this.moveableService.selectedPageId = this.pageId.toString();
    this.moveableService.selectedItemId = this.itemId.toString();
  }

  ngAfterViewInit(): void {
    this.quillEditor.nativeElement.innerHTML = this.item.quillData;
    if (this.item.curveText != '') this.curveText.nativeElement.innerHTML = this.item.curveText;
  }

  ngOnDestroy() {
    this.moveableService.isResizeObserver = true;
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

    if (item.type === ItemType.text) {
      let width = document.querySelector('#textEditor-' + item.pageId + '-' + item.itemId).clientWidth;

      return {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        width: width + 'px',
        height: item.h + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
      };
    }
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
        zIndex: 100,
        top: 0,
        left: 0,
        width: 'auto',
        height: 'auto',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        fontSize: '24px',
        fontFamily: item.fontFamily,
        textShadow: item.textShadow,
        WebkitTextStroke: item.textShadow,
        opacity: item.textOpacity,
      };
  }
  styleCurveItem(item: Item): CSS.Properties {
    return {
      fontFamily: item.fontFamily,
      fontSize: item.fontSize,
      opacity: item.curveOpacity,
    };
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
}
