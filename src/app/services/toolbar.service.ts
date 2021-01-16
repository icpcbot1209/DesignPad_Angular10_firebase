import { Injectable } from '@angular/core';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  constructor() {}

  createTextEditor() {
    var quill = new Quill('#textEditor-0-0', {
      modules: {
        toolbar: '#toolbar',
      },
      theme: 'snow',
    });
  }
}
