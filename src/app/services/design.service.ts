import { Injectable } from '@angular/core';
import { Design } from './models';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  theDesign: Design;
  constructor() {}

  init() {
    this.theDesign = {
      uid: '',
      title: 'Hello World',
      category: {
        uid: '',
        title: 'Hellos',
        size: { x: 1000, y: 500 },
        categoryType: {
          uid: '',
          title: 'Test',
        },
        thumbnail: '',
      },
      thumbnail: '',
      pages: [
        {
          title: '',
          imageOnes: [],
          textOnes: [],
        },
        {
          title: '',
          imageOnes: [],
          textOnes: [],
        },
      ],
    };
  }
}
