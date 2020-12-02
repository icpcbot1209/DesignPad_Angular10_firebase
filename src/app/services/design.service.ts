import { Injectable } from '@angular/core';
import { AssetImage, Design, Item } from '../models/models';

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
        size: { x: 600, y: 500 },
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
    return this.theDesign;
  }

  /*********************************************
   * Zoom & Size
   **********************************************/

  zoomValue = 100;
  zoomMethod = 'fit';

  page_vw = 500;
  page_vh = 500;

  pageW() {
    return this.theDesign?.category.size.x;
  }
  pageH() {
    return this.theDesign?.category.size.y;
  }

  zoomFitInside(width: number, height: number) {
    this.zoomMethod = 'fit';
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;
    let r = W / H;
    this.page_vw = Math.min((height - 150) * r, width - 200);

    if (this.page_vw < 300) this.page_vw = 300;
    this.page_vh = this.page_vw / r;

    this.zoomValue = Math.round((this.page_vh * 100) / H);
  }

  zoomFillInside(width: number, height: number) {
    this.zoomMethod = 'fill';
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;
    let r = W / H;
    this.page_vw = width - 200;
    if (this.page_vw < 300) this.page_vw = 300;
    this.page_vh = this.page_vw / r;

    this.zoomValue = Math.round((this.page_vh * 100) / H);
  }

  zoomCustomValue(value) {
    this.zoomMethod = 'custom';
    this.zoomValue = value;
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    this.page_vw = Math.round((W * value) / 100);
    this.page_vh = Math.round((H * value) / 100);
  }

  /*********************************************
   * Page
   **********************************************/
  thePageId = -1;

  addPage() {
    let newPage = {
      title: '',
      items: [],
    };
    this.theDesign.pages.push(newPage);
  }

  addItem(item: Item) {
    this.theDesign.pages[this.thePageId].items.push(item);
  }

  /*********************************************
   * Uploads sidebar
   **********************************************/

  uploads_click_image(myfile: AssetImage) {
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    if (myfile.height <= 0 || myfile.width <= 0) return;
    let ratio = myfile.width / myfile.height;

    let w, h, x, y;
    w = W * 0.8;
    h = Math.min(w / ratio, H * 0.8);
    w = h * ratio;

    x = (W - w) / 2;
    y = (H - h) / 2;

    this.addItem({
      type: 'image',
      url: myfile.downloadURL,
      thumbnail: myfile.thumbnail,
      x,
      y,
      w,
      h,
      rotate: 0,
    });
  }

  /*********************************************
   * Photos sidebar
   **********************************************/

  photos_click_image(assetImage: AssetImage) {
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    if (assetImage.height <= 0 || assetImage.width <= 0) return;
    let ratio = assetImage.width / assetImage.height;

    let w, h, x, y;
    w = W * 0.8;
    h = Math.min(w / ratio, H * 0.8);
    w = h * ratio;

    x = (W - w) / 2;
    y = (H - h) / 2;

    this.addItem({
      type: 'image',
      url: assetImage.downloadURL,
      thumbnail: assetImage.thumbnail,
      x,
      y,
      w,
      h,
      rotate: 0,
    });
  }
}
