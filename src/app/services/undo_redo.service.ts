import { Injectable } from '@angular/core';
import { initTheData, saveTheData, undoTheData, redoTheData, theData } from '../models/history';

@Injectable({
  providedIn: 'root',
})
export class Undo_redoService {
  constructor() {}

  isUndoRedo: boolean = false;

  init(data) {
    initTheData(data);
  }

  undo() {
    undoTheData();
    return theData;
  }

  redo() {
    redoTheData();
    return theData;
  }

  save(data) {
    saveTheData(data);
  }
}
