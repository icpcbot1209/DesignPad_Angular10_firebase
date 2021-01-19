import { Injectable } from '@angular/core';

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
}
