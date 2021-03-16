import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';
import { MoveableService } from 'src/app/services/moveable.service';

import * as CSS from 'csstype';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { ToolbarService } from 'src/app/services/toolbar.service';

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

  constructor(public moveableService: MoveableService, private zone: NgZone, public ur: UndoRedoService, public toolbarService: ToolbarService) {}

  ngOnInit() {
    this.toolbarService.isCreateQuill = true;
    this.moveableService.isCreateTextItem = true;
    this.moveableService.isResizeObserver = true;
    this.moveableService.isOnResize = false;
    this.moveableService.selectedPageId = this.pageId.toString();
    this.moveableService.selectedItemId = this.itemId.toString();
  }

  ngAfterViewInit(): void {
    this.quillEditor.nativeElement.innerHTML = this.item.quillData;
    if (this.item.isCurve) this.curveText.nativeElement.innerHTML = this.item.curveText;
    // this.moveableService
    //   .resizeObserver(this.moveableService.selectedPageId, this.moveableService.selectedItemId)
    //   .observe(document.querySelector<HTMLElement>('#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId));
  }

  ngOnDestroy() {
    this.moveableService.isResizeObserver = true;
  }

  styleItemPosition(item: Item): CSS.Properties {
    let width = document.querySelector('#textEditor-' + item.pageId + '-' + item.itemId).clientWidth;

    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: width + 'px',
      height: item.h + 'px',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      zIndex: item.zIndex,
    };
  }
  styleItem(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 'auto',
      height: 'auto',
      transform: this.moveableService.strTransform(item),
      WebkitTransform: this.moveableService.strTransform(item),
      fontSize: item.fontSize,
      fontFamily: item.fontFamily,
      textShadow: item.textShadow,
      WebkitTextStroke: item.textShadow,
      opacity: item.textOpacity,
      zIndex: item.zIndex,
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
