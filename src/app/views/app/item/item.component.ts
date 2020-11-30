import { Item } from 'src/app/services/models';
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  strTransform(item: Item) {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }
}
