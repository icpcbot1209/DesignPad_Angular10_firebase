import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'sidebar-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class TemplatesComponent implements OnInit {
  tabBar;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
