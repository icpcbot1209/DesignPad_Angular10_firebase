import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Item } from 'src/app/services/models';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() pageId: number;
  @Input() itemId: number;

  @ViewChild('target', { static: false }) target: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    let element: HTMLElement | SVGElement = this.target.nativeElement;
    element.style.transform = this.strTransform(this.item);
    element.style.width = this.item.w + 'px';
    element.style.height = this.item.h + 'px';
  }

  strTransform(item: Item) {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }
}
