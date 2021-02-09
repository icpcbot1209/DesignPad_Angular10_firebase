import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';

@Component({
  selector: 'app-element-toolbar',
  templateUrl: './element-toolbar.component.html',
  styleUrls: ['./element-toolbar.component.scss'],
})
export class ElementToolbarComponent implements OnInit {
  constructor(public moveableService: MoveableService, public ds: DesignService) {}

  ngOnInit(): void {}

  changeElementColor(event) {
    console.log(event.value);
  }
}
