import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { DesignService } from 'src/app/services/design.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ItemStatus, ItemType } from 'src/app/models/enums';

@Component({
  selector: 'app-text-toolbar',
  templateUrl: './text-toolbar.component.html',
  styleUrls: ['./text-toolbar.component.scss'],
})
export class TextToolbarComponent implements OnInit {
  @ViewChild('fontSizeInput', { read: MatAutocompleteTrigger })
  fontSizeInput: MatAutocompleteTrigger;

  ItemStatus = ItemStatus;

  fontControl = new FormControl();
  myControl = new FormControl();

  fontSizes = [];
  currentFontSize: string;
  sizeEle: HTMLInputElement;
  fontEle: HTMLInputElement;

  constructor(public moveableService: MoveableService, public toolbarService: ToolbarService, public ds: DesignService) {}

  ngOnInit(): void {
    let offset = 2;
    for (let i = 6; i <= 144; i += offset) {
      this.fontSizes.push(i);
      switch (i) {
        case 18:
          offset = 3;
          break;
        case 24:
          offset = 4;
          break;
        case 36:
          offset = 6;
          break;
        case 48:
          offset = 8;
          break;
        case 104:
          offset = 16;
          break;
        case 120:
          offset = 24;
          break;
      }
    }
  }

  ngAfterViewInit(): void {
    this.toolbarService.createTextEditor(this.moveableService.selectedPageId, this.moveableService.selectedItemId);

    let selectorEle = document.querySelector<HTMLElement>(
      '#textSelector-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    let item = this.moveableService.getItem(selectorEle);
    if (item.x == undefined || item.y == undefined) {
      let editorEle = document.querySelector<HTMLElement>(
        '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
      );

      item.w = editorEle.offsetWidth;
      item.h = editorEle.offsetHeight;
      item.x = (600 - item.w) / 2;
      item.y = (500 - item.h) / 2;

      editorEle.style.transform = `translate(${item.x}px, ${item.y}px)`;
      selectorEle.style.width = item.w + 'px';
      selectorEle.style.height = item.h + 'px';
      selectorEle.style.transform = `translate(${item.x}px, ${item.y}px)`;
    }

    this.sizeEle = document.querySelector<HTMLInputElement>('#fontSizeInput');
    this.fontEle = document.querySelector<HTMLInputElement>('#fontInput');

    let ele = document.querySelector<HTMLElement>('#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId);
    item = this.moveableService.getItem(ele);

    setTimeout(() => {
      this.fontEle.value = 'Alata';
      this.sizeEle.value = item.fontSize.substr(0, item.fontSize.length - 2);
      this.fontControl.disable();
    });
  }

  catchEnterKey(event) {
    if (event.charCode == 13) {
      this.fontSizeInput.closePanel();
      this.setFontSize(this.sizeEle.value);
    }
  }

  showPanel() {
    this.sizeEle.select();
    this.fontSizeInput.openPanel();
  }

  optionSelected() {
    this.setFontSize(this.sizeEle.value);
  }

  setFontSize(fontSize: string) {
    let ele = document.querySelector<HTMLElement>('#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId);
    let item = this.moveableService.getItem(ele);
    item.fontSize = fontSize + 'px';
    ele.style.fontSize = item.fontSize;
  }

  showFontList() {
    this.ds.setStatus(this.ItemStatus.text_font_list);
  }
}
