import { Injectable } from '@angular/core';
import { Design } from './models';
import { MyFile } from './myfiles.service';

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
          items: [],
        },
      ],
    };
  }

  // Uploads sidebar
  uploads_click_image(myfile: MyFile) {
    let W = this.theDesign.category.size.x;
    let H = this.theDesign.category.size.y;

    if (myfile.height <= 0 || myfile.width <= 0) return;
    let ratio = myfile.width / myfile.height;

    let w, h, x, y;
    w = W * 0.8;
    h = Math.min(w / ratio, H * 0.8);
    w = h * ratio;

    x = (W - w) / 2;
    y = (H - h) / 2;

    this.theDesign.pages[0].items.push({
      type: 'image',
      url: myfile.downloadURL,
      x,
      y,
      w,
      h,
    });
  }
}
