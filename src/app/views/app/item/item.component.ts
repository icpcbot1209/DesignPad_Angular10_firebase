import { Item } from 'src/app/services/models';
import {
  Input,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { OnPinch, OnScale, OnDrag, OnRotate, OnResize, OnWarp } from 'moveable';
import { Frame } from 'scenejs';
import { NgxMoveableComponent } from 'ngx-moveable';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() item: Item;

  @ViewChild('target', { static: false }) target: ElementRef;
  @ViewChild('label', { static: false }) label: ElementRef;
  @ViewChild('moveable', { static: false }) moveable: NgxMoveableComponent;

  elRef: ElementRef;
  constructor(private elementRef: ElementRef) {
    this.elRef = elementRef;
  }

  ngOnInit(): void {}

  onDrag({ target, clientX, clientY, top, left, isPinch }: OnDrag): void {
    this.item.x = left;
    this.item.y = top;
    // this.frame.set('left', `${left}px`);
    // this.frame.set('top', `${top}px`);
    // this.setTransform(target);
    if (!isPinch) {
      this.setLabel(clientX, clientY, `X: ${left}px<br/>Y: ${top}px`);
    }
  }

  setLabel(clientX, clientY, text): void {
    this.label.nativeElement.style.cssText = `display: block; transform: translate(${clientX}px, ${
      clientY - 10
    }px) translate(-100%, -100%) translateZ(-100px);`;
    this.label.nativeElement.innerHTML = text;
  }
}
