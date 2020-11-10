import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-template',
  templateUrl: './browse-template.component.html',
  styleUrls: ['./browse-template.component.scss'],
})
export class BrowseTemplateComponent implements OnInit {
  categoryTypes = [
    { title: 'Social Media', isSelected: true },
    { title: 'Events', isSelected: true },
    { title: 'Marketing', isSelected: true },
    { title: 'Documents', isSelected: true },
    { title: 'Prints', isSelected: true },
    { title: 'Video', isSelected: true },
    { title: 'School', isSelected: true },
    { title: 'Personal', isSelected: true },
  ];

  constructor() {}

  ngOnInit(): void {}
}
