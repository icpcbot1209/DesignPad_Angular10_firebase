import { MoveableService } from 'src/app/services/moveable.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Item, Page } from 'src/app/models/models';
import { Colors } from 'src/app/constants/colors.service';
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
  @Input() page: Page;
  @Input() pageId: number;

  constructor(
    public ds: DesignService,
    public moveableService: MoveableService
  ) {}

  colors = Colors;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setActivePage();
    });
  }

  setActivePage() {
    if (this.ds.thePageId == this.pageId) return;
    console.log('active page:' + this.pageId);
    this.ds.thePageId = this.pageId;
  }

  onClickPage() {
    this.setActivePage();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData('jsonAssetImage'));
    this.setActivePage();
    this.ds.addImageItem(data);
  }

  test() {
    alert('aa');
  }

  strTransform(item: Item) {
    return `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`;
  }
}
