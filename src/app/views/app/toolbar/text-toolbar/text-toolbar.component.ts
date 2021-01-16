import { Component, OnInit } from '@angular/core';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { MoveableService } from 'src/app/services/moveable.service';

declare var Quill;

@Component({
  selector: 'app-text-toolbar',
  templateUrl: './text-toolbar.component.html',
  styleUrls: ['./text-toolbar.component.scss'],
})
export class TextToolbarComponent implements OnInit {
  config = {
    customComparator: () => {},
    height: '450px',
    placeholder: '6',
  };

  options = [];

  constructor(public moveableService: MoveableService, public toolbarService: ToolbarService) {}

  ngOnInit(): void {
    let offset = 2;
    for (let i = 6; i <= 144; i += offset) {
      this.options.push(i.toString());
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
    this.toolbarService.createTextEditor();
  }

  onBoldClick() {
    let ele = document.querySelector<HTMLElement>('textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId);
  }
}
