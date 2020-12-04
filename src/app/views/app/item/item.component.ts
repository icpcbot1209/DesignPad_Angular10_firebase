import { Item } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';

import {
  Input,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  ItemType = ItemType;
  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  strTransform(item: Item) {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }
}
