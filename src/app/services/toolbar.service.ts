import { Injectable } from '@angular/core';
import { Item } from '../models/models';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  constructor() {}

  createTextEditor(selectedPageId, selectedItemId) {
    new Quill('#textEditor-' + selectedPageId + '-' + selectedItemId, {
      modules: {
        toolbar: '#toolbar',
      },
      theme: 'snow',
    });
  }

  resetting(item: Item) {
    let ele = document.querySelector<HTMLInputElement>('#fontSizeInput');
    if (ele) {
      ele.value = item.fontSize.substr(0, item.fontSize.length - 2);
    }
  }
}
