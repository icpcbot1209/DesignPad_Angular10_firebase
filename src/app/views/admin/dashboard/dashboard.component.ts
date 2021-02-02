import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  tabs: TabData[] = [{ title: 'Photo' }, { title: 'Music' }, { title: 'Text', disabled: true }, { title: 'Template', disabled: false }];
  theTabId: number = 0;
}

interface TabData {
  title: string;
  disabled?: boolean;
}
