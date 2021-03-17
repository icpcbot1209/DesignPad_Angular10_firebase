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

  letter;
  lineHeight;
  isShowLineHeight: boolean = false;

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
    let selectorEle = document.querySelector<HTMLElement>(
      '#textSelector-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    let item = this.moveableService.getItem(selectorEle);
    this.toolbarService.createTextEditor(this.moveableService.selectedPageId, this.moveableService.selectedItemId, item);
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
      this.sizeEle.value = (Math.floor(Number.parseFloat(item.fontSize.substr(0, item.fontSize.length - 2)) * 10) / 10).toString();
      this.fontControl.disable();
    });

    let qlEditor = document
      .querySelector('#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId)
      .querySelector('.ql-editor') as HTMLElement;
    qlEditor.style.lineHeight = item.lineHeight + 'em';
    qlEditor.style.letterSpacing = Number.parseFloat(item.letterSpacing) / 1000 + 'em';

    let fontFormEle = document.querySelector('#fontForm').firstChild.firstChild.firstChild as HTMLElement;
    let fontSelector = document.querySelector('#fontSelector') as HTMLElement;

    fontSelector.style.width = fontFormEle.clientWidth + 'px';
    fontSelector.style.height = fontFormEle.clientHeight + 'px';

    //add event to bolb button
    document.querySelector('#bold').addEventListener('click', () => {
      let quill = this.toolbarService.quill;
      let length: number = this.toolbarService.quill.getLength();

      if (quill.getSelection().length == 0) {
        this.moveableService.enableTextEdit();
        if (quill.getFormat(0, length - 1).bold) quill.formatText(0, length - 1, 'bold', false);
        else quill.formatText(0, length - 1, 'bold', true);
      }
    });

    document.querySelector('#italic').addEventListener('click', () => {
      let quill = this.toolbarService.quill;
      let length: number = this.toolbarService.quill.getLength();

      if (quill.getSelection().length == 0) {
        this.moveableService.enableTextEdit();
        if (quill.getFormat(0, length - 1).italic) quill.formatText(0, length - 1, 'italic', false);
        else quill.formatText(0, length - 1, 'italic', true);
      }
    });

    document.querySelector('#underline').addEventListener('click', () => {
      let quill = this.toolbarService.quill;
      let length: number = this.toolbarService.quill.getLength();

      if (quill.getSelection().length == 0) {
        this.moveableService.enableTextEdit();
        if (quill.getFormat(0, length - 1).underline) quill.formatText(0, length - 1, 'underline', false);
        else quill.formatText(0, length - 1, 'underline', true);
      }
    });

    document.querySelector('#strike').addEventListener('click', () => {
      let quill = this.toolbarService.quill;
      let length: number = this.toolbarService.quill.getLength();

      if (quill.getSelection().length == 0) {
        this.moveableService.enableTextEdit();
        if (quill.getFormat(0, length - 1).strike) quill.formatText(0, length - 1, 'strike', false);
        else quill.formatText(0, length - 1, 'strike', true);
      }
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
    console.log('showFontList');
    this.ds.setStatus(this.ItemStatus.text_font_list);
    // document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = 'white';
  }

  showTextEffects() {
    this.ds.setStatus(this.ItemStatus.text_effect);
    // document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = 'white';
  }

  // set Line Height and Letter space
  setLineHeight() {
    let item = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId];

    this.lineHeight = Number.parseFloat(item.lineHeight);
    this.letter = Number.parseFloat(item.letterSpacing);

    this.isShowLineHeight = this.isShowLineHeight ? false : true;
  }

  onLetterChange(event) {
    this.letter = event.value;

    this.enableLineHeight();
  }
  onLineHeightChange(event) {
    this.lineHeight = event.value;

    this.enableLineHeight();
  }

  enableLineHeight() {
    let editorEle = document.querySelector<HTMLElement>(
      '#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId
    );
    let qlEditor = <HTMLElement>editorEle.firstChild;

    qlEditor.style.lineHeight = this.lineHeight + 'em';
    qlEditor.style.letterSpacing = this.letter / 1000 + 'em';

    let item = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId];

    item.lineHeight = this.lineHeight.toString();
    item.letterSpacing = this.letter.toString();
  }
}
