import { Injectable, NgZone, Injector } from '@angular/core';

import Moveable, {
  OnDragStart,
  OnDrag,
  OnDragGroupStart,
  OnDragGroup,
  OnRotate,
  OnResizeStart,
  OnResize,
  OnResizeGroupStart,
  OnResizeGroup,
  OnRotateStart,
  OnRotateGroupStart,
  OnRotateGroup,
  OnClip,
  OnScaleStart,
  OnScale,
  OnScaleEnd,
  OnResizeEnd,
  OnRotateEnd,
} from 'moveable';
import Selecto, { OnDragEnd, OnKeyEvent, OnScroll, OnSelect, OnSelectEnd } from 'selecto';
import { ToolbarService } from './toolbar.service';
import { DesignService } from './design.service';
import { Item } from '../models/models';
import { ItemStatus, ItemType } from '../models/enums';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { MediaService } from './media.service';

declare var ResizeObserver;

@Injectable({
  providedIn: 'root',
})
export class MoveableService {
  selecto: Selecto;
  moveable: Moveable;
  disabledPointId: string = '#page-0';
  isSelectedTarget: boolean;
  isEditable: boolean = true;
  pageId: number;
  previousTarget;
  selectedPageId: string = '0';
  selectedItemId: string = '0';
  itemScale: number;

  isMouseDown: boolean = false;
  isMouseMove: boolean = false;
  isDrag: boolean = false;
  isScale: boolean = false;

  isOnResize: boolean = false;

  isShowDownload: boolean = false;
  isDimension: boolean = false;
  isPosition: boolean = false;

  selectFisShowDownload: boolean;

  isDragItem: boolean = false;

  constructor(
    private ds: DesignService,
    private toolbarService: ToolbarService,
    private ur: UndoRedoService,
    private zone: NgZone,
    private injector: Injector
  ) {}

  init() {
    let container: HTMLElement = document.querySelector('#selecto-container');
    let scroller: HTMLElement = document.querySelector('#selecto-area');

    this.selecto = this.initSelecto(container, scroller);
  }

  initSelecto(container: HTMLElement, scroller: HTMLElement) {
    let targets: (HTMLElement | SVGElement)[] = [];

    const selecto = new Selecto({
      // The container to add a selection element
      container: container,
      dragContainer: scroller,
      // Container to bound the selection area. If false, do not bound. If true, it is the container of selecto. (default: false)
      boundContainer: true,
      // Targets to select. You can register a queryselector or an Element.
      selectableTargets: ['.target'],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: false,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      // Determines which key to continue selecting the next target via keydown and keyup.
      toggleContinueSelect: 'shift',
      // The container for keydown and keyup events
      keyContainer: container,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 0,
      scrollOptions: {
        container: scroller,
        throttleTime: 30,
        threshold: 0,
      },
    });

    selecto.on('scroll', (e: OnScroll) => {
      scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    });

    selecto
      .on('selectStart', () => {
        if (this.selectedPageId) {
          let items = this.ds.theDesign.pages[this.selectedPageId].items;
          // for (let i = 0; i < items.length; i++) {
          //   items[i].selected = false;
          // }
          this.isCreateTextItem = false;
        }
      })
      .on('select', (e: OnSelect) => {
        if (this.ur.isUndoRedo) {
          this.ur.isUndoRedo = false;
        }
        e.added.forEach((el) => {
          let item = this.getItem(el);

          if (item) {
            item.selected = true;
          }
        });
        e.removed.forEach((el) => {
          let item = this.getItem(el);
          if (item) {
            item.selected = false;
          }
        });
      })
      .on('selectEnd', (e: OnSelectEnd) => {
        targets = e.selected;

        this.onSelectTargets(targets);

        if (e.isDragStart) {
          e.inputEvent.preventDefault();
          setTimeout(() => {
            this.moveable?.dragStart(e.inputEvent);
          }, 10);
        }
      });

    selecto.on('dragStart', (e) => {
      const target = e.inputEvent.target;
      if ((this.moveable && this.moveable.isMoveableElement(target)) || targets.some((t) => t === target || t.contains(target))) {
        e.stop();
      }
    });

    return selecto;
  }

  clearMoveable() {
    if (this.moveable) {
      this.moveable.setState({ target: [] });
      this.selecto.setSelectedTargets([]);

      this.moveable = null;
      this.isSelectedTarget = false;
    }
  }

  isResizeObserver: boolean = true;
  onSelectTargets(targets: (HTMLElement | SVGElement)[]) {
    this.clearMoveable();

    let thePageId = -1;
    targets.forEach((target) => {
      let item = this.getItem(target);
      if (thePageId === -1) thePageId = item.pageId;
      else if (thePageId > item.pageId) thePageId = item.pageId;
    });

    targets = targets.filter((target) => {
      let item = this.getItem(target);
      return item.pageId === thePageId;
    });

    if (targets.length > 1) {
      this.moveable = this.makeMoveableGroup(thePageId, targets);
      this.ds.onSelectGroup(thePageId);
    } else if (targets.length === 1) {
      let item = this.getItem(targets[0]);

      this.ds.deleteSelectedItem();
      this.selectedItemId = targets[0].getAttribute('itemId');
      this.selectedPageId = targets[0].getAttribute('pageId');
      this.selectableTextEditor();
      this.onChangeSelectedItem(targets[0]);
      item.selected = true;

      if (item.type === ItemType.image) {
        this.moveable = this.makeMoveableImage(thePageId, targets[0]);
        this.ds.onSelectImageItem(thePageId, item);
      } else if (item.type === ItemType.text) {
        if (!this.ur.isUndoRedo) {
          this.moveable = this.makeMoveableText(thePageId, targets[0]);
          this.ds.onSelectTextItem();
          this.isSelectedTarget = true;
          this.resetTextToolbar();
        }

        if (this.isResizeObserver) {
          this.resizeObserver(this.selectedPageId, this.selectedItemId).observe(
            document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId)
          );
        }
      } else if (item.type === ItemType.element) {
        this.moveable = this.makeMoveableElement(thePageId, targets[0]);
        this.ds.onSelectElementItem(thePageId, item);
      } else if (item.type === ItemType.video) {
        const media = this.injector.get(MediaService);

        media.selectedVideo = document.querySelector('#VideoElement' + item.pageId + '-' + item.itemId) as HTMLVideoElement;
        this.moveable = this.makeMoveableVideo(thePageId, targets[0]);
        this.ds.onSelectVideoItem(thePageId, item);
      }

      this.previousTarget = targets[0];
    } else {
      this.ds.deleteSelectedItem();

      let item = this.getItem(this.previousTarget);
      if (item.type == ItemType.text) {
        document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = '#293039';
      }

      if (this.ds.status == ItemStatus.image_crop || this.ds.status == ItemStatus.element_crop || this.ds.status == ItemStatus.video_crop) {
        this.ur.saveTheData(this.ds.theDesign);
      }
      this.ds.onSelectNothing();
      if (
        this.ds.theDesign.pages[this.selectedPageId].items.length &&
        this.ds.theDesign.pages[this.selectedPageId].items[this.selectedItemId].type &&
        this.ds.theDesign.pages[this.selectedPageId].items[this.selectedItemId].type == ItemType.text
      ) {
        this.resizeObserver(this.selectedPageId, this.selectedItemId).unobserve(
          document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId)
        );
      }

      this.isResizeObserver = false;
      this.isEditable = false;
      this.ds.isOnInput = false;
      this.isShowDownload = false;
      this.isDimension = false;
      this.isPosition = false;

      this.selectableTextEditor();

      if (
        document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId) &&
        document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).getAttribute('curve') == 'true'
      ) {
        document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).style.opacity = '0';
        document.querySelector<HTMLElement>('#curveText-' + this.selectedPageId + '-' + this.selectedItemId).style.opacity = '1';

        document
          .querySelector<HTMLElement>('#curveText-' + this.selectedPageId + '-' + this.selectedItemId)
          .setAttribute('style', '-webkit-opacity: 0');

        this.toolbarService.setCurveEffect(this.selectedPageId, this.selectedItemId);
      }
    }
  }

  makeMoveableGroup(pageId: number, targets: (HTMLElement | SVGElement)[]) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: targets,
      draggable: true,
      resizable: true,
      rotatable: true,
      defaultGroupRotate: 0,
      defaultGroupOrigin: '50% 50%',
      originDraggable: true,
      originRelative: true,

      snapThreshold: 5,
      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDrag = false;
      })
      .on('dragGroupStart', (ev: OnDragGroupStart) => {
        ev.events.forEach((e) => {
          moveable.emit('dragStart', e);
        });
      })
      .on('dragGroup', (ev: OnDragGroup) => {
        ev.events.forEach((e) => {
          moveable.emit('drag', e);
        });
        this.isDragItem = true;
      })
      .on('dragGroupEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      })
      .on('resizeEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      })
      .on('resizeGroupStart', (ev: OnResizeGroupStart) => {
        ev.events.forEach((e: OnResizeStart) => {
          moveable.emit('resizeStart', e);
        });
      })
      .on('resizeGroup', (ev: OnResizeGroup) => {
        ev.events.forEach((e: OnResize) => {
          moveable.emit('resize', e);
        });
      })
      .on('resizeGroupEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      })
      .on('rotateGroupStart', (ev: OnRotateGroupStart) => {
        ev.events.forEach((e: OnRotateStart) => {
          moveable.emit('rotateStart', e);
        });
      })
      .on('rotateGroup', (ev: OnRotateGroup) => {
        ev.events.forEach((e: OnRotate) => {
          moveable.emit('rotate', e);
        });
      })
      .on('rotateGroupEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  makeMoveableImage(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snapThreshold: 5,
      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) this.ur.saveTheData(this.ds.theDesign);
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      })
      .on('resizeEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  tempClipStyle;
  startImageCrop() {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);
    if (item.clipStyle) this.tempClipStyle = JSON.parse(JSON.stringify(item.clipStyle));
    else this.tempClipStyle = '';

    this.clearMoveable();

    if (item.type == ItemType.element) {
      this.moveable = this.makeClipableElement(item.pageId, target);
    } else if (item.type == ItemType.video) {
      this.moveable = this.makeClipableVideo(item.pageId, target);
    } else this.moveable = this.makeClipableImage(item.pageId, target);
  }

  endImageCrop(isSave: boolean) {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);

    if (!isSave) {
      target.style.clip = this.tempClipStyle;
      target.style.clipPath = this.tempClipStyle;
      item.clipStyle = this.tempClipStyle;
    } else {
    }

    this.clearMoveable();
    this.moveable = this.makeMoveableImage(item.pageId, target);
  }

  makeClipableImage(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
      snapThreshold: 5,
    });

    moveable.on('clip', (e: OnClip) => {
      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      let item = this.getItem(e.target);
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        // this.isDragItem = true;
      })
      .on('dragEnd', (e: OnDragEnd) => {});

    return moveable;
  }

  makeClipableElement(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
      snapThreshold: 5,
    });

    moveable.on('clip', (e: OnClip) => {
      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      let item = this.getItem(e.target);
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      });

    return moveable;
  }

  makeClipableVideo(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: 'inset',
      clipTargetBounds: true,
      clipVerticalGuidelines: [],
      clipHorizontalGuidelines: [],

      draggable: true,
      throttleDrag: 0,
      startDragRotate: 0,
      throttleDragRotate: 0,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
      snapThreshold: 5,
    });

    moveable.on('clip', (e: OnClip) => {
      let item = this.getItem(e.target);

      if (e.clipType === 'rect') {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        // this.isDragItem = true;
      })
      .on('dragEnd', (e: OnDragEnd) => {});

    return moveable;
  }

  makeMoveableText(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      origin: false,
      target: target,
      throttleDrag: 0,
      draggable: true,

      resizable: true,
      scalable: false,
      renderDirections: ['nw', 'ne', 'se', 'sw', 'e', 'w'],

      rotatable: true,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        if (this.isMouseDown) {
          this.isDrag = true;
        }

        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
        this.isDragItem = false;
      });

    /* resize */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
        if (e.direction[0] !== 0 && e.direction[1] !== 0) {
          this.isScale = true;
        } else this.isScale = false;
      })
      .on('resize', (e: OnResize) => {
        if (this.isScale) {
          let item = this.getItem(e.target);

          let scale = Math.round((e.width / item.w) * 100000) / 100000;
          item.w = e.width;
          item.h = item.h * scale;
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          item.fontSize = (parseFloat(item.fontSize) * scale).toString() + 'px';

          e.target.style.width = item.w + 'px';
          e.target.style.height = item.h + 'px';
          e.target.style.transform = this.strTransform(item);
          let editorEle = document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId);
          editorEle.style.width = item.w + 1 + 'px';
          editorEle.style.fontSize = item.fontSize;
        } else {
          let item = this.getItem(e.target);
          item.w = e.width;
          item.h = e.height;
          item.x = e.drag.beforeTranslate[0];
          item.y = e.drag.beforeTranslate[1];
          e.target.style.transform = this.strTransform(item);
          e.target.style.width = `${e.width}px`;
          let editorEle = document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId);
          item = this.getItem(editorEle);
          editorEle.style.width = item.w + 'px';
        }

        this.isOnResize = true;
      })
      .on('resizeEnd', ({ target, isDrag }) => {
        this.setSelectable(target.getAttribute('itemId'), target.getAttribute('pageId'), '#textSelector-');
        this.selectableTextEditor();
        this.isOnResize = false;
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotate */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.selectableTextEditor();
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  startVideoCrop() {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);
    if (item.clipStyle) this.tempClipStyle = JSON.parse(JSON.stringify(item.clipStyle));
    else this.tempClipStyle = '';

    this.clearMoveable();

    if (item.type == ItemType.element) {
      this.moveable = this.makeClipableElement(item.pageId, target);
    } else this.moveable = this.makeClipableImage(item.pageId, target);
  }

  endVideoCrop(isSave: boolean) {
    this.ds.setClipPathToNumber();
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);

    if (!isSave) {
      target.style.clip = this.tempClipStyle;
      target.style.clipPath = this.tempClipStyle;
      item.clipStyle = this.tempClipStyle;
    } else {
    }

    this.clearMoveable();
    this.moveable = this.makeMoveableImage(item.pageId, target);
  }

  getItem(target: HTMLElement | SVGElement): Item {
    if (target) {
      const pageId = Number(target.getAttribute('pageId'));
      const itemId = Number(target.getAttribute('itemId'));
      if (pageId < this.ds.theDesign.pages.length && itemId < this.ds.theDesign.pages[pageId].items.length) {
        let item = this.ds.theDesign.pages[pageId].items[itemId];
        return item;
      }
      return null;
    }
  }

  strTransform(item: Item): string {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
  }

  isCreateTextItem: boolean = false;
  onChangeSelectedItem(target) {
    if (this.previousTarget != undefined) {
      if (this.previousTarget != target) {
        if (!this.isCreateTextItem) {
          this.isEditable = false;
        }
        this.ds.isOnInput = false;
        this.isPosition = false;
      }
    }
  }
  enableTextEdit(event: MouseEvent) {
    if (!this.isDrag) {
      if (this.isEditable) {
        document.querySelectorAll<HTMLElement>('.ql-editor').forEach((ele) => {
          if (ele.parentElement.getAttribute('itemId') == this.selectedItemId && ele.parentElement.getAttribute('pageId') == this.selectedPageId) {
            this.setFocus(ele);
            ele.parentElement.style.zIndex = '1000';

            if (
              document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).getAttribute('curve') != null &&
              document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).getAttribute('curve') == 'true'
            ) {
              document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId).style.opacity = '1';
              document.querySelector<HTMLElement>('#curveText-' + this.selectedPageId + '-' + this.selectedItemId).style.opacity = '0.4';
            }
          }
        });
      }
    } else this.isDrag = false;
    if (this.isSelectedTarget) {
      this.isEditable = true;
    }
    this.isMouseDown = false;
  }

  setFocus(ele) {
    let s = window.getSelection();
    let r = document.createRange();
    r.setStart(ele, ele.childElementCount);
    r.setEnd(ele, ele.childElementCount);
    s.removeAllRanges();
    s.addRange(r);
    this.isSelectedTarget = false;
  }

  setSelectable(item, page, selector) {
    let ele = document.querySelector(selector + page + '-' + item) as HTMLElement;
    this.getItem(ele as HTMLElement).selected = true;
    let arrEles = [];
    arrEles.push(ele);
    let func: OnSelectEnd = {
      selected: arrEles,
      afterAdded: null,
      afterRemoved: null,
      isDragStart: false,
      isDouble: false,
      added: arrEles,
      removed: [],
      rect: null,
      inputEvent: null,
      currentTarget: arrEles[0],
    };
    this.selecto.emit('selectEnd', func);
    this.selectedItemId = item;
    this.selectedPageId = page;
    this.isResizeObserver = true;
  }

  selectableTextEditor() {
    /* reset textEditor layer on textEditor selector */
    document.querySelectorAll<HTMLElement>('.ql-editor').forEach((ele) => {
      let parentElement = ele.parentElement;
      let item = this.getItem(parentElement);

      if (parentElement.style.zIndex !== item.zIndex) {
        parentElement.style.zIndex = item.zIndex;
      }
    });
  }

  resetTextToolbar() {
    let ele = document.querySelector<HTMLElement>('#textEditor-' + this.selectedPageId + '-' + this.selectedItemId);
    let item = this.getItem(ele);
    this.toolbarService.resetting(item);
  }

  // moveable Element
  makeMoveableElement(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snapThreshold: 5,
      // scalable: true,
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;

        let svgEle = document.querySelector('#SVGElement-' + item.pageId + '-' + item.itemId).querySelector('svg');
        svgEle.setAttribute('width', item.w.toString());
        svgEle.setAttribute('height', item.h.toString());
      })
      .on('resizeEnd', (e: OnResizeEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  makeMoveableVideo(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector('#page-' + pageId);

    const moveable = new Moveable(pageContainer, {
      container: pageContainer,
      target: target,
      draggable: true,
      resizable: true,
      rotatable: true,
      originDraggable: true,
      originRelative: true,

      snapThreshold: 5,
      origin: false,
      keepRatio: true,
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
      rotationPosition: 'bottom',
    });

    /* draggable */
    moveable
      .on('dragStart', (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on('drag', (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
        this.isDragItem = true;
      })
      .on('dragEnd', (e) => {
        if (this.isDragItem) {
          this.ur.saveTheData(this.ds.theDesign);
        }
        this.isDragItem = false;
      });

    /* resizable */
    moveable
      .on('resizeStart', (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(['%', '%']);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('resize', (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;

        let videoEle = document.querySelector('#VideoElement' + item.pageId + '-' + item.itemId) as HTMLElement;
        videoEle.style.width = `${e.width}px`;
        videoEle.style.height = `${e.height}px`;
      })
      .on('resizeEnd', (e: OnResizeEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    /* rotatable */
    moveable
      .on('rotateStart', (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on('rotate', (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on('rotateEnd', (e: OnRotateEnd) => {
        this.ur.saveTheData(this.ds.theDesign);
      });

    return moveable;
  }

  resizeObserver(pageId, itemId) {
    return new ResizeObserver((entries) => {
      this.zone.run(() => {
        if (!this.ur.isUndoRedo) {
          let width = JSON.stringify(entries[0].contentRect.width) + 'px';
          let height = JSON.stringify(entries[0].contentRect.height) + 'px';
          let selectorEle = document.querySelector<HTMLElement>('#textSelector-' + pageId + '-' + itemId);
          let item = this.getItem(selectorEle);
          if (item) {
            item.x = item.x - (entries[0].contentRect.width - parseFloat(selectorEle.style.width)) / 2;
            selectorEle.style.width = width;
            selectorEle.style.height = height;
            item.w = parseFloat(width);
            item.h = parseFloat(height);
            selectorEle.style.transform = `translate(${item.x}px, ${item.y}px)`;
            if (!this.isOnResize) {
              this.setSelectable(itemId, pageId, '#textSelector-');
              this.isResizeObserver = false;
            }
          }
        }
      });
    });
  }
}
