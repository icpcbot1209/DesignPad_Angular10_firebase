import { Injectable } from '@angular/core';

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
} from 'moveable';
import Selecto, { OnSelect, OnSelectEnd } from 'selecto';
import { DesignService } from './design.service';
import { Item } from './models';

@Injectable({
  providedIn: 'root',
})
export class MoveableService {
  moveable: Moveable;
  selecto: Selecto;
  targets: (HTMLElement | SVGElement)[] = [];
  // frameMap = new Map();

  constructor(private ds: DesignService) {}

  // initFrameMap(target) {
  //   if (!this.frameMap.has(target)) {
  //     this.frameMap.set(target, {
  //       translate: [0, 0],
  //       rotate: 0,
  //     });
  //   }
  // }

  getItem(target: HTMLElement | SVGElement): Item {
    const pageId = target.getAttribute('pageId');
    const itemId = target.getAttribute('itemId');

    return this.ds.theDesign.pages[pageId].items[itemId];
  }

  strTransform(item: Item): string {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }

  // matrix: number[];
  initMoveable(container: HTMLElement) {
    const moveable = new Moveable(container, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: container,
      draggable: true,
      resizable: true,
      rotatable: true,
      defaultGroupRotate: 0,
      defaultGroupOrigin: '50% 50%',
      originDraggable: true,
      originRelative: true,
      // scalable: true,
      // warpable: true,
      // Enabling pinchable lets you use events that
      // can be used in draggable, resizable, scalable, and rotateable.
      // pinchable: true, // ["resizable", "scalable", "rotatable"]
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
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
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
      .on('resizeGroupStart', (ev: OnResizeGroupStart) => {
        ev.events.forEach((e: OnResizeStart) => {
          moveable.emit('resizeStart', e);
        });
      })
      .on('resizeGroup', (ev: OnResizeGroup) => {
        ev.events.forEach((e: OnResize) => {
          moveable.emit('resize', e);
        });
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
      .on('rotateGroupStart', (ev: OnRotateGroupStart) => {
        ev.events.forEach((e: OnRotateStart) => {
          moveable.emit('rotateStart', e);
        });
      })
      .on('rotateGroup', (ev: OnRotateGroup) => {
        ev.events.forEach((e: OnRotate) => {
          moveable.emit('rotate', e);
        });
      });

    this.moveable = moveable;
  }

  initSelecto(container?: HTMLElement) {
    // #select-container exists on the design-panel.component
    if (!container) container = document.querySelector('#selecto-container');

    const selecto = new Selecto({
      // The container to add a selection element
      container: container,
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
      keyContainer: window,
      // The rate at which the target overlaps the drag area to be selected. (default: 100)
      hitRate: 100,
    });

    selecto.on('select', (e: OnSelect) => {
      e.added.forEach((el) => {
        el.classList.add('selected');
      });
      e.removed.forEach((el) => {
        el.classList.remove('selected');
      });
    });

    selecto.on('selectEnd', (e: OnSelectEnd) => {
      this.targets = e.selected;
      this.moveable.setState({ target: this.targets });
      if (e.isDragStart) {
        e.inputEvent.preventDefault();
        setTimeout(() => {
          this.moveable.dragStart(e.inputEvent);
        });
      }
    });

    selecto.on('dragStart', (e) => {
      const target = e.inputEvent.target;
      if (
        this.moveable?.isMoveableElement(target) ||
        this.targets.some((t) => t === target || t.contains(target))
      ) {
        e.stop();
      }
    });

    this.selecto = selecto;
  }
}
