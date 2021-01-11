import { Injectable } from "@angular/core";

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
} from "moveable";
import Selecto, { OnKeyEvent, OnScroll, OnSelect, OnSelectEnd } from "selecto";
import { DesignService } from "./design.service";
import { Item } from "../models/models";
import { ItemType } from "../models/enums";

@Injectable({
  providedIn: "root",
})
export class MoveableService {
  selecto: Selecto;
  moveable: Moveable;
  disabledPointId: string = "#page-0";
  isSelectedTarget: boolean;
  isEditable: boolean = true;
  pageId: number;
  previousTarget: HTMLElement;
  selectedPageId: string;
  selectedItemId: string;

  isMouseDown: boolean = false;
  isMouseMove: boolean = false;
  isDrag: boolean = false;

  constructor(private ds: DesignService) {}

  init() {
    let container: HTMLElement = document.querySelector("#selecto-container");
    let scroller: HTMLElement = document.querySelector("#selecto-area");

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
      selectableTargets: [".target"],
      // Whether to select by click (default: true)
      selectByClick: true,
      // Whether to select from the target inside (default: true)
      selectFromInside: false,
      // After the select, whether to select the next target with the selected target (deselected if the target is selected again).
      continueSelect: false,
      // Determines which key to continue selecting the next target via keydown and keyup.
      toggleContinueSelect: "shift",
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

    selecto.on("scroll", (e: OnScroll) => {
      scroller.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
    });

    selecto.on("select", (e: OnSelect) => {
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
    });

    selecto.on("selectEnd", (e: OnSelectEnd) => {
      targets = e.selected;

      this.onSelectTargets(targets);

      if (e.isDragStart) {
        e.inputEvent.preventDefault();
        setTimeout(() => {
          this.moveable?.dragStart(e.inputEvent);
        }, 10);
      }
    });

    selecto.on("dragStart", (e) => {
      const target = e.inputEvent.target;
      if (
        (this.moveable && this.moveable.isMoveableElement(target)) ||
        targets.some((t) => t === target || t.contains(target))
      ) {
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
      if (item.type === ItemType.image) {
        this.moveable = this.makeMoveableImage(thePageId, targets[0]);
        this.ds.onSelectImageItem(thePageId, item);
      } else if (item.type === ItemType.text) {
        this.moveable = this.makeMoveableText(thePageId, targets[0]);
        this.isSelectedTarget = true;
        this.selectedItemId = targets[0].getAttribute("itemId");
        this.selectedPageId = targets[0].getAttribute("pageId");
        this.onChangeSelectedItem(targets[0]);
        // console.log(targets[0]);
      }
    } else {
      this.ds.onSelectNothing();

      this.isEditable = false;
    }
  }

  makeMoveableGroup(pageId: number, targets: (HTMLElement | SVGElement)[]) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector("#page-" + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: targets,
      draggable: true,
      resizable: true,
      rotatable: true,
      defaultGroupRotate: 0,
      defaultGroupOrigin: "50% 50%",
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
      rotationPosition: "bottom",
    });

    /* draggable */
    moveable
      .on("dragStart", (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on("drag", (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      })
      .on("dragGroupStart", (ev: OnDragGroupStart) => {
        ev.events.forEach((e) => {
          moveable.emit("dragStart", e);
        });
      })
      .on("dragGroup", (ev: OnDragGroup) => {
        ev.events.forEach((e) => {
          moveable.emit("drag", e);
        });
      });

    /* resizable */
    moveable
      .on("resizeStart", (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(["%", "%"]);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on("resize", (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      })
      .on("resizeGroupStart", (ev: OnResizeGroupStart) => {
        ev.events.forEach((e: OnResizeStart) => {
          moveable.emit("resizeStart", e);
        });
      })
      .on("resizeGroup", (ev: OnResizeGroup) => {
        ev.events.forEach((e: OnResize) => {
          moveable.emit("resize", e);
        });
      });

    /* rotatable */
    moveable
      .on("rotateStart", (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on("rotate", (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      })
      .on("rotateGroupStart", (ev: OnRotateGroupStart) => {
        ev.events.forEach((e: OnRotateStart) => {
          moveable.emit("rotateStart", e);
        });
      })
      .on("rotateGroup", (ev: OnRotateGroup) => {
        ev.events.forEach((e: OnRotate) => {
          moveable.emit("rotate", e);
        });
      });

    return moveable;
  }

  makeMoveableImage(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector("#page-" + pageId);

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
      rotationPosition: "bottom",
    });

    /* draggable */
    moveable
      .on("dragStart", (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on("drag", (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      });

    /* resizable */
    moveable
      .on("resizeStart", (e: OnResizeStart) => {
        let item = this.getItem(e.target);
        e.setOrigin(["%", "%"]);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on("resize", (e: OnResize) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.w = e.width;
        item.h = e.height;

        e.target.style.transform = this.strTransform(item);
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
      });

    /* rotatable */
    moveable
      .on("rotateStart", (e: OnRotateStart) => {
        let item = this.getItem(e.target);
        e.set(item.rotate);
        e.dragStart && e.dragStart.set([item.x, item.y]);
      })
      .on("rotate", (e: OnRotate) => {
        let item = this.getItem(e.target);
        item.x = e.drag.beforeTranslate[0];
        item.y = e.drag.beforeTranslate[1];
        item.rotate = e.rotate;

        e.target.style.transform = this.strTransform(item);
      });

    return moveable;
  }

  tempClipStyle;
  startImageCrop() {
    if (!this.moveable) return;

    let target = <HTMLElement | SVGElement>this.moveable.target;
    let item = this.getItem(target);
    if (item.clipStyle) this.tempClipStyle = JSON.parse(JSON.stringify(item.clipStyle));
    else this.tempClipStyle = "";

    this.clearMoveable();

    this.moveable = this.makeClipableImage(item.pageId, target);
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
    let pageContainer: HTMLElement | SVGElement = document.querySelector("#page-" + pageId);

    const moveable = new Moveable(pageContainer, {
      // If you want to use a group, set multiple targets(type: Array<HTMLElement | SVGElement>).
      target: target,
      container: pageContainer,
      clippable: true,
      clipRelative: true,
      clipArea: false,
      dragArea: true,
      dragWithClip: true,
      defaultClipPath: "inset",
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

    moveable.on("clip", (e: OnClip) => {
      if (e.clipType === "rect") {
        e.target.style.clip = e.clipStyle;
      } else {
        e.target.style.clipPath = e.clipStyle;
      }
      let item = this.getItem(e.target);
      item.clipStyle = e.clipStyle;
    });

    /* draggable */
    moveable
      .on("dragStart", (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on("drag", (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;

        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      });

    return moveable;
  }
  makeMoveableText(pageId: number, target: HTMLElement | SVGElement) {
    let pageContainer: HTMLElement | SVGElement = document.querySelector("#page-" + pageId);

    const moveable = new Moveable(pageContainer, {
      // target: elements[0],
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: pageContainer,
      target: target,
      draggable: true,
      throttleDrag: 0,
    });

    /* draggable */
    moveable
      .on("dragStart", (e: OnDragStart) => {
        let item = this.getItem(e.target);
        e.set([item.x, item.y]);
      })
      .on("drag", (e: OnDrag) => {
        if (e.inputEvent.buttons === 0) return;
        let item = this.getItem(e.target);
        item.x = e.beforeTranslate[0];
        item.y = e.beforeTranslate[1];

        e.target.style.transform = this.strTransform(item);
      });

    return moveable;
  }

  getItem(target: HTMLElement | SVGElement): Item {
    const pageId = Number(target.getAttribute("pageId"));
    const itemId = Number(target.getAttribute("itemId"));
    if (pageId < this.ds.theDesign.pages.length && itemId < this.ds.theDesign.pages[pageId].items.length) {
      let item = this.ds.theDesign.pages[pageId].items[itemId];
      return item;
    }
    return null;
  }

  strTransform(item: Item): string {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }

  onChangeSelectedItem(target) {
    if (this.previousTarget != undefined) {
      if (this.previousTarget != target) {
        this.isEditable = false;
      }
    }
    this.previousTarget = target;
  }
  enableTextEdit(event: MouseEvent) {
    if (!this.isDrag) {
      if (this.isEditable) {
        document.querySelectorAll(".ql-editor").forEach((ele) => {
          if (
            ele.parentElement.parentElement.getAttribute("itemId") == this.selectedItemId &&
            ele.parentElement.parentElement.getAttribute("pageId") == this.selectedPageId
          ) {
            let s = window.getSelection();
            let r = document.createRange();
            r.setStart(ele, ele.childElementCount);
            r.setEnd(ele, ele.childElementCount);
            s.removeAllRanges();
            s.addRange(r);
            this.isSelectedTarget = false;
          }
        });
      }
    } else this.isDrag = false;
    if (this.isSelectedTarget) {
      this.isEditable = true;
    }
    this.isMouseDown = false;
  }
}
