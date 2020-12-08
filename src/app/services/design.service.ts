import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ItemType } from '../models/enums';
import { ImageFilterObj } from '../models/image-filter';
import { AssetImage, Design, Item } from '../models/models';
import { ToolbarService } from './toolbar.service';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  theDesign: Design;
  constructor(private ts: ToolbarService) {}

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
      type: ItemType.image,
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
      type: ItemType.image,
      url: assetImage.downloadURL,
      thumbnail: assetImage.thumbnail,
      x,
      y,
      w,
      h,
      rotate: 0,
    });
  }

  /*********************************************
   * Text sidebar
   **********************************************/
  sidebar_text_add() {
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    let w, h, x, y;
    w = W * 0.8;
    h = 100;

    x = (W - w) / 2;
    y = (H - h) / 2;

    this.addItem({
      type: ItemType.text,
      x,
      y,
      w,
      h,
      rotate: 0,
    });
  }

  /*********************************************
   * Key events
   **********************************************/
  deleteSelectedItems = () => {
    let items = this.theDesign.pages[this.thePageId].items;

    this.theDesign.pages[this.thePageId].items = items.filter(
      (item) => !item.selected
    );
    this.ts.status = this.ts.STATUS().none;
  };

  /*********************************************
   * Action Broadcasting
   **********************************************/

  theItem: Item;
  onSelectItems() {
    let items = this.theDesign.pages[this.thePageId].items.filter(
      (item) => item.selected
    );

    if (items.length === 1) {
      this.theItem = items[0];
      this.updateFilterObj(this.theItem);
      if (this.theItem.type === ItemType.image) {
        this.ts.status = this.ts.STATUS().image;
        this.ts.image_status = this.ts.IMAGE_STATUS().none;
      }
    } else {
      this.theItem = null;
      this.ts.status = this.ts.STATUS().none;
    }
  }

  /*********************************************
   * Image Flip
   **********************************************/

  flipX() {
    if (this.theItem) {
      if (this.theItem.flipX) this.theItem.flipX = false;
      else this.theItem.flipX = true;
    }
  }

  flipY() {
    if (this.theItem) {
      if (this.theItem.flipY) this.theItem.flipY = false;
      else this.theItem.flipY = true;
    }
  }

  filterObj: ImageFilterObj;
  updateFilterObj(item: Item) {
    this.filterObj = new ImageFilterObj(item.filter);
  }
  setFilterCss(css) {
    if (this.theItem) {
      this.theItem.filter = css;
      this.updateFilterObj(this.theItem);
    }
  }

  presets: Preset[] = [
    {
      label: '1977',
      css: 'brightness(110%) contrast(110%) saturate(130%)',
    },
    {
      label: 'Aden',
      css: 'brightness(120%) contrast(90%) hue-rotate(20deg) saturate(85%)',
    },
    {
      label: 'Brooklyn',
      css: 'brightness(110%) contrast(90%)',
    },
    {
      label: 'Earlybird',
      css: 'contrast(90%) sepia(20%)',
    },
    {
      label: 'Gingham',
      css: 'brightness(105%) hue-rotate(350deg)',
    },
    {
      label: 'Hudson',
      css: 'brightness(120%) contrast(90%) saturate(110%)',
    },
    {
      label: 'Inkwell',
      css: 'brightness(110%) contrast(110%) grayscale(100%) sepia(30%)',
    },
    {
      label: 'Lofi',
      css: 'contrast(150%) saturate(110%)',
    },
    {
      label: 'Reyes',
      css: 'brightness(110%) contrast(85%) saturate(75%) sepia(22%)',
    },
    {
      label: 'Toaster',
      css: 'brightness(90%) contrast(150%)',
    },
    {
      label: 'Moon',
      css: 'brightness(110%) contrast(110%) grayscale(100%)',
    },
    {
      label: 'Willow',
      css: 'brightness(90%) contrast(95%) grayscale(50%)',
    },
  ];
}

interface Preset {
  label: string;
  css: string;
}
