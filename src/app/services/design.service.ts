import { Injectable } from '@angular/core';
import { AssetImage } from './asset.service';
import { Design, Item } from './models';
import { MyFile } from './myfiles.service';
import interact from 'interactjs';

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
  thePageId = 0;

  addPage() {
    let newPage = {
      title: '',
      items: [],
    };
    this.theDesign.pages.push(newPage);
    this.thePageId = this.theDesign.pages.length - 1;
  }

  addItem(item: Item) {
    this.theDesign.pages[this.thePageId].items.push(item);
    let itemId = this.theDesign.pages[this.thePageId].items.length - 1;

    let zoomValue = this.zoomValue;
    const setResizable = () => {
      let elem = window.document.getElementById(
        `item-${this.thePageId}-${itemId}`
      );
      interact(elem)
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
              let target = event.target;

              item.w = (event.rect.width * 100) / zoomValue;
              item.h = (event.rect.height * 100) / zoomValue;

              item.x = item.x + (event.deltaRect.left * 100) / zoomValue;
              item.y = item.y + (event.deltaRect.top * 100) / zoomValue;
            },
          },
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: 12, height: 12 },
            }),
            interact.modifiers.aspectRatio({ ratio: item.w / item.h }),
          ],
          inertia: true,
        })
        .draggable({
          listeners: {
            move(event) {
              let target = event.target;

              item.x = item.x + (event.dx * 100) / zoomValue;
              item.y = item.y + (event.dy * 100) / zoomValue;
            },
          },
          modifiers: [],
          inertia: true,
        });
    };

    setTimeout(setResizable, 1000);
  }

  /*********************************************
   * Select
   **********************************************/
  zone: SelectionZone;
  drawZone(zone: SelectionZone) {
    this.zone = zone;
  }

  /*********************************************
   * Uploads sidebar
   **********************************************/

  uploads_click_image(myfile: MyFile) {
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
      x,
      y,
      w,
      h,
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
      x,
      y,
      w,
      h,
    });
  }
}

export interface SelectionZone {
  x: number;
  y: number;
  w: number;
  h: number;
  status: number; // 0: none, 1: selecting, 2: selected
}
