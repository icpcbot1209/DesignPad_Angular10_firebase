import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'app-touch-panel',
  templateUrl: './touch-panel.component.html',
  styleUrls: ['./touch-panel.component.scss'],
})
export class TouchPanelComponent implements OnInit {
  constructor(public designService: DesignService) {}

  ngOnInit(): void {}
}
