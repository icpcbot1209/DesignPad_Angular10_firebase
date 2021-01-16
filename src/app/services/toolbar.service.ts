import { Injectable } from '@angular/core';
import { MoveableService } from './moveable.service';

declare var Quill;

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  constructor(public MoveableService: MoveableService) {}

  createTextEditor() {
    var quill = new Quill('#textEditor-' + this.MoveableService.selectedPageId + '-' + this.MoveableService.selectedItemId, {
      modules: {
        toolbar: '#toolbar',
      },
      theme: 'snow',
    });
  }
}
