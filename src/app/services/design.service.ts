import { Injectable, Injector } from '@angular/core';
import { ItemStatus, ItemType } from '../models/enums';
import { ImageFilterObj } from '../models/image-filter';
import { AssetImage, Design, Item } from '../models/models';
import { MoveableService } from './moveable.service';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  constructor(private injector: Injector, public ur: UndoRedoService) {}
  theDesign: Design;

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

    this.ur.initTheData(this.theDesign);

    // window.location.hash = 'no-back-button';
    // window.location.hash = 'Again-No-back-button'; //again because google chrome don't insert first hash into history
    // window.onhashchange = function () {
    //   window.location.hash = 'no-back-button';
    // };
    window.addEventListener('keydown', this.onKeyEvent.bind(this));

    return this.theDesign;
  }

  /*********************************************
   * Zoom & Size
   **********************************************/

  zoomValue = 100;
  zoomMethod = 'fit';

  page_vw;
  page_vh;

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

  addItemToCurrentPage(item: Item) {
    item.pageId = this.thePageId;
    item.itemId = this.theDesign.pages[this.thePageId].items.length;
    item.zIndex = 100 + item.itemId;

    this.theDesign.pages[this.thePageId].items.push(item);
    this.ur.saveTheData(this.theDesign);
  }

  /*********************************************
   * Uploads & Photos sidebar
   **********************************************/

  addImageItem(assetImage: AssetImage) {
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

    this.addItemToCurrentPage({
      type: ItemType.image,
      pageId: this.thePageId,
      itemId: 0,
      url: assetImage.downloadURL,
      thumbnail: assetImage.thumbnail,
      x,
      y,
      w,
      h,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: 0,
    });
  }

  /*********************************************
   * Text sidebar
   **********************************************/
  sidebar_text_add() {
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    let w, h, x, y;
    w = 156.562;
    h = 34;

    x = (W - w) / 2;
    y = (H - h) / 2;

    const ms = this.injector.get(MoveableService);
    ms.isCreateTextItem = true;
    ms.isResizeObserver = true;
    ms.isOnResize = false;
    this.ur.isUndoRedo = false;

    this.addItemToCurrentPage({
      type: ItemType.text,
      pageId: this.thePageId,
      itemId: 0,
      x,
      y,
      w,
      h,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      fontSize: '24px',
      fontFamily: 'Alata',
      lineHeight: '1.35',
      letterSpacing: '-21',
      quillData: '<div class="ql-editor" style="line-height: 1.35em; letter-spacing: -0.021em;"><p>Add a heading</p></div>',
      textShadow: 'rgba(0, 0, 0, 0) 0px 0px 0px',
      textStroke: '0px rgb(0, 0, 0)',
      curveText: '',
      textOpacity: '1',
      curveOpacity: '0',
      zIndex: 0,
    });
  }

  /*********************************************
   * Element sidebar
   **********************************************/
  sidebar_element_add(item) {
    let { x: W, y: H } = this.theDesign?.category.size;
    if (!H) return;

    let w, h, x, y;
    if (item.width > 100 || item.height > 100) {
      if (item.width > item.height) {
        w = 150;
        h = (item.height / item.width) * 150;
      } else {
        w = (item.width / item.height) * 150;
        h = 150;
      }
    }

    x = (W - w) / 2;
    y = (H - h) / 2;

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;

      var fr = new FileReader();
      fr.onload = (result) => {
        let str = result.target['result'].toString();

        this.addItemToCurrentPage({
          type: ItemType.element,
          pageId: this.thePageId,
          itemId: 0,
          x,
          y,
          w,
          h,
          rotate: 0,
          scaleX: 1,
          scaleY: 1,
          url: item.downloadURL,
          SVGElement: str,
          color: [],
          colorAndIndex: {},
          zIndex: 0,
        });
      };
      fr.readAsText(blob);
    };
    xhr.open('GET', item.downloadURL);
    xhr.send();
  }
  /***********************************************
   * Key events
   **********************************************/
  isOnInput: boolean = false;
  isResizeObserver: boolean = false;

  onKeyEvent(e: KeyboardEvent) {
    if (!this.isOnInput && (e.key === 'Delete' || e.key === 'Backspace')) {
      this.deleteSelectedItems();
      e.stopImmediatePropagation();
      return false;
    }

    if (!this.isOnInput && e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      if (!this.isStatus(ItemStatus.text_effect)) {
        this.ur.isUndoRedo = true;
        this.theDesign = this.ur.undoTheData();
        this.isResizeObserver = true;
        this.status = ItemStatus.none;
      }
    }

    if (!this.isOnInput && e.key === 'y' && (e.ctrlKey || e.metaKey)) {
      if (!this.isStatus(ItemStatus.text_effect)) {
        this.ur.isUndoRedo = true;
        this.theDesign = this.ur.redoTheData();
        this.isResizeObserver = true;
        this.status = ItemStatus.none;
      }
    }
  }

  deleteSelectedItems = () => {
    let items = this.theDesign.pages[this.thePageId].items;

    items = items.filter((item) => !item.selected);
    items.forEach((item, i) => {
      item.itemId = i;
    });
    this.theDesign.pages[this.thePageId].items = items;

    const ms = this.injector.get(MoveableService);
    ms.clearMoveable();

    this.theItem = null;
    this.setStatus(ItemStatus.none);
  };

  /*********************************************
   * theItem
   **********************************************/

  theItem: Item;
  public status: ItemStatus = ItemStatus.none;

  onSelectNothing() {
    this.theItem = null;
    this.setStatus(ItemStatus.none);
  }

  onSelectGroup(pageId: number) {
    this.thePageId = pageId;

    this.theItem = null;
    this.setStatus(ItemStatus.none);
  }

  onSelectImageItem(pageId: number, item: Item) {
    this.thePageId = pageId;

    this.theItem = item;
    this.setStatus(ItemStatus.image_selected);

    this.updateFilterObj(this.theItem);
  }

  onSelectTextItem() {
    // this.thePageId = pageId;

    // this.theItem = item;
    if (this.status != ItemStatus.text_font_list && this.status != ItemStatus.text_effect) {
      this.status = ItemStatus.text_selected;
      document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = '#293039';
    }
  }

  onSelectElementItem(pageId: number, item: Item) {
    if (!this.ur.isUndoRedo) {
      this.thePageId = pageId;
      this.theItem = item;
      this.setStatus(ItemStatus.element_selected);
    }
  }

  isStatus(status: ItemStatus): boolean {
    return this.status === status;
  }

  isToolpanel() {
    return (
      this.isStatus(ItemStatus.image_filter) ||
      this.isStatus(ItemStatus.image_preset) ||
      this.isStatus(ItemStatus.text_font_list) ||
      this.isStatus(ItemStatus.text_effect)
    );
  }

  setStatus(status: ItemStatus): void {
    if (status === ItemStatus.image_crop) this.startImageCrop();
    else if (this.status === ItemStatus.image_crop) this.endImageCrop(true);
    else this.status = status;
  }

  /*********************************************
   * Image Crop
   **********************************************/
  startImageCrop() {
    if (!this.theItem || !(this.theItem.type == ItemType.image)) return;
    this.status = ItemStatus.image_crop;

    const ms = this.injector.get(MoveableService);
    ms.startImageCrop();
  }

  startElementCrop() {
    if (!this.theItem || !(this.theItem.type == ItemType.element)) return;
    this.status = ItemStatus.element_crop;

    const ms = this.injector.get(MoveableService);
    ms.startImageCrop();
  }

  endImageCrop(isSave: boolean) {
    this.status = ItemStatus.image_selected;

    const ms = this.injector.get(MoveableService);
    ms.endImageCrop(isSave);
  }

  /*********************************************
   * Image Flip
   **********************************************/

  flipX() {
    if (this.theItem && (this.theItem.type === ItemType.image || this.theItem.type === ItemType.element)) {
      this.theItem.scaleX *= -1;
      this.ur.saveTheData(this.theDesign);
    }
  }

  flipY() {
    if (this.theItem && (this.theItem.type === ItemType.image || this.theItem.type === ItemType.element)) {
      this.theItem.scaleY *= -1;
      this.ur.saveTheData(this.theDesign);
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
